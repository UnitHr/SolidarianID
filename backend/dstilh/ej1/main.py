import pymongo
import psycopg2
import fasttext
import argparse
import sys
from transformers import BertTokenizer, BertModel
import torch
import numpy as np
from rich.console import Console
from rich.progress import track
from flask import Flask, jsonify, request
from sklearn.metrics.pairwise import cosine_similarity
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
console = Console()

mongo_client = None
postgres_client = None
causes_se = None
se_model = None
args = None
tokenizer = None

def update_we_causes():
    global causes_se

    causes_collection = mongo_client["causes"]
    communities_collection = mongo_client["communities"]

    causes = list(causes_collection.find())
    console.log(f"[update_we_causes] Found {len(causes)} causes in MongoDB")
    if not causes:
        console.log("[update_we_causes] [bold red]No causes found in MongoDB[/bold red]")
        return
    
    for cause in causes:
        community = communities_collection.find_one({"id": cause["communityId"]})
        if community:
            cause_string = cause["description"] + "*" + community["description"]
            causes_se[cause["id"]] = get_sentence_embedding(cause_string)
        else:
            console.log(f"[update_we_causes] [bold red]Community not found for cause {cause['id']}[/bold red]")
    
    console.log("[update_we_causes] Causes and communities loaded successfully")

def print_all_users_id():

    cursor = postgres_client.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM public.user")
    users = cursor.fetchall()

    if users:
        console.log(f"[print_all_users_id] Found {len(users)} users in PostgreSQL")
    else:
        console.log("[print_all_users_id] [bold red]No users found in PostgreSQL[/bold red]")
    
    cursor.close()

def get_user_string(user_id):
    global postgres_client

    user_string = ""

    cursor = postgres_client.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM public.user WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()

    if user:
        console.log(f"[get_user_string] User found: {user['firstName']} {user['lastName']}")
        user_string = user['bio']
        console.log(f"[get_user_string] User bio: {user_string}")

        causes_collection = mongo_client["causes"]
        console.log("[get_user_string] Fetching causes...")
        causes = list(causes_collection.find({"supportersIds": {"$in": [user_id]}}))
        if causes:
            console.log(f"[get_user_string] Found {len(causes)} causes")
            cause_descriptions = [cause["description"] for cause in causes]
            user_string += " ".join(cause_descriptions)
        else:
            console.log("[get_user_string] No causes found")

        community_collection = mongo_client["communities"]
        console.log("[get_user_string] Fetching communities...")
        communities = list(community_collection.find({"members": {"$in": [user_id]}}))
        if communities:
            console.log(f"[get_user_string] Found {len(communities)} communities")
            community_descriptions = [community["description"] for community in communities]
            user_string += " ".join(community_descriptions)
        else:
            console.log("[get_user_string] No communities found")

        actions_collection = mongo_client["actions"]
        console.log("[get_user_string] Fetching actions...")
        actions = list(actions_collection.find({"contributions": {"$elemMatch": {"userId": user_id}}}))
        if actions:
            console.log(f"[get_user_string] Found {len(actions)} actions")
            action_descriptions = [action["description"] for action in actions]
            user_string += " ".join(action_descriptions)
        else:
            console.log("[get_user_string] No actions found")
        
        console.log("[get_user_string] Returning user string")
        return user_string

    console.log(f"[get_user_string] [bold red]User with ID {user_id} not found[/bold red]")
    console.log("[get_user_string] Returning None")
    return None


@app.route('/causes', methods=['GET'])
def get_similar_causes():
    data = request.get_json()
    user_id = data.get('userId')

    if not user_id:
        return jsonify({"error": "userId is required"}), 400
    
    # validar que el user_id sea un uuid

    user_string = get_user_string(user_id)

    if user_string:
        user_se = get_sentence_embedding(user_string)

        similarities = []
        for cause_id, cause_se in causes_se.items():
            similarity = get_similarity(user_se, cause_se)
            console.log(f"[endpoint /causes] Similarity for cause {cause_id}: {similarity}")
            similarities.append((cause_id, similarity))

        similarities.sort(key=lambda x: x[1], reverse=True)
        top_causes = similarities[:3]

        cause_ids = [cause_id for cause_id, _ in top_causes]
        console.log(f"[endpoint /causes] Top 3 causes for user {user_id}: {cause_ids}")

        return jsonify({"causeIds": cause_ids})
    else:
        return jsonify({"error": "User not found"}), 400


def setup():
    global mongo_client
    global postgres_client
    global se_model
    global causes_se
    global tokenizer
    global args

    # Extract command line arguments
    parser = argparse.ArgumentParser(description="Select FastText or BERT model")
    parser.add_argument('--model', type=str, choices=['fasttext', 'bert'], default='bert', help='Model to use for embeddings')
    args = parser.parse_args()

    if len(sys.argv) == 1:
        console.log("[bold red]No model selected. Please select either FastText or BERT[/bold red]")
        return False

    if(args.model == 'fasttext'):
        try:
            se_model = fasttext.load_model ("embeddings-s-model.bin")
            console.log("Loaded FastText model")
        except Exception as e:
            console.log(f"[bold red]Error loading FastText model: {e}")
            return False
    
    elif(args.model == 'bert'):
        try:
            tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
            se_model = BertModel.from_pretrained('bert-base-uncased')
            console.log("Loaded BERT model")
        except Exception as e:
            console.log(f"[bold red]Error loading BERT model: {e}")
            return False


    # Connect to MongoDB
    try:
        mongo_client = pymongo.MongoClient(host="mongo", port=27017)["solidarianid"] 
        console.log("Connected to MongoDB")
    except Exception as e:
        console.log(f"[bold red]Error connecting to MongoDB[\bold red]: {e}")
        return False

    # Connect to PostgreSQL
    try:
        postgres_client = psycopg2.connect(
            dbname="solidarianid",
            user="admin",
            password="admin",
            host="postgres",
            port="5432"
        )
        console.log("Connected to PostgreSQL")
    except Exception as e:
        console.log(f"[bold red]Error connecting to PostgreSQL: {e}")
        return False
    
    
    # Initialize we_causes
    try:
        causes_se = {}
        update_we_causes()
        print(type(causes_se))
    except Exception as e:
        console.log(f"[bold red]Error initializing causes_we: {e}")
        return False
    
    print_all_users_id()
    
    return True

def get_sentence_embedding(text):

    global se_model
    global tokenizer

    if args.model == 'fasttext':
        return se_model.get_sentence_vector(text)
    
    elif args.model == 'bert':
        inputs = tokenizer(text, return_tensors='pt')
        with torch.no_grad():
            outputs = se_model(**inputs)
        last_hidden_states = outputs.last_hidden_state
        sentence_embedding = torch.mean(last_hidden_states, dim=1).numpy()
        return sentence_embedding
    
def get_similarity(user_se, cause_se):
    global args

    if args.model == 'fasttext':
        return cosine_similarity([user_se], [cause_se])[0][0]
    
    elif args.model == 'bert':
        return cosine_similarity(user_se, cause_se)[0][0]

if __name__ == '__main__':  
    if setup():
        console.log("Setup completed successfully. Starting server...")
        app.run(debug=True, port=6000)
    else:
        console.log("[bold red]Setup failed. Exiting...[/bold red]")