import requests
import json
from pathlib import Path

###
### Configuration variables
###
BASE_URL = "http://localhost:3000/api/v1"

DATA_DIR = Path(__file__).parent / "data"
USERS_FILE = DATA_DIR / "users.json"
COMMUNITIES_FILE = DATA_DIR / "communities.json"
CAUSES_FILE = DATA_DIR / "causes.json"
ACTIONS_FILE = DATA_DIR / "actions.json"
CONTRIBUTIONS_FILE = DATA_DIR / "contributions.json"

ADMIN_EMAIL = "admin@admin.com"
ADMIN_PASSWORD = "123456Test*"

###
### Helper functions
###
def load_json_from_data(filename):
    filepath = DATA_DIR / filename
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

###
### Phase 1: Register and Login Users
###
def create_user(data):
    url = f"{BASE_URL}/users"
    response = requests.post(url, json=data)
    if response.status_code == 201:
        user_id = response.json().get("id")
        print(f"[✔] User created: {data['email']} → ID: {user_id}")
        return user_id
    elif response.status_code == 409:
        print(f"[⚠] User already exists: {data['email']}")
        return None
    else:
        print(f"[✘] Failed to create user {data['email']}: {response.status_code} - {response.text}")
        return None

def login_user(email, password):
    url = f"{BASE_URL}/users/auth/login"
    response = requests.post(url, json={"email": email, "password": password})
    if response.ok:
        print(f"[✔] Login successful: {email}")
        return response.json()
    else:
        print(f"[✘] Login failed: {email} - {response.status_code} - {response.text}")
        return None

def login_admin():
    print("\n=== Logging in as admin ===")
    auth = login_user(ADMIN_EMAIL, ADMIN_PASSWORD)
    if auth:
        return {
            "email": ADMIN_EMAIL,
            "name": "Admin",
            "userId": "N/A",  # system-generated on boot
            "token": auth.get("access_token")
        }
    else:
        print("[✘] Could not authenticate admin")
        return None

def phase_1_register_and_login_users():
    users = load_json_from_data(USERS_FILE)
    authenticated = []

    # Add admin
    admin = login_admin()
    if admin:
        authenticated.append(admin)

    for user in users:
        user_id = create_user(user)
        auth = login_user(user["email"], user["password"])
        if auth:
            authenticated.append({
                "email": user["email"],
                "name": f"{user['firstName']} {user['lastName']}",
                "userId": user_id,
                "token": auth.get("access_token")
            })

    print("\n=== AUTHENTICATED USERS SUMMARY ===")
    for user in authenticated:
        token_preview = user['token'][:10] + "..." if user.get("token") else "N/A"
        print(f"- {user['name']} ({user['email']}) → userId: {user['userId']}, token: {token_preview}")
    
    return authenticated

###
### Phase 2: Follow Users
###
def follow_user(follow_user_id, token):
    url = f"{BASE_URL}/users/{follow_user_id}/followers"
    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.post(url, headers=headers)

    if response.status_code == 204:
        print(f"[✔] Followed user {follow_user_id}")
        return True
    else:
        print(f"[✘] Failed to follow user {follow_user_id}: {response.status_code} - {response.text}")
        return False

def phase_2_follow_users(authenticated_users):
    if len(authenticated_users) < 2:
        print("[!] Not enough users to perform follow actions.")
        return []

    followed = []

    for follower in authenticated_users:
        for follow_target in authenticated_users:
            if follower["userId"] != follow_target["userId"]:
                if follow_user(follow_target["userId"], follower["token"]):
                    followed.append((follower["email"], follow_target["email"]))

    return followed

###
### Phase 3: Create and Approve Communities
###
def create_community_request(community_data, user_token):
    url = f"{BASE_URL}/communities"
    headers = {
        "Authorization": f"Bearer {user_token}",
        "Content-Type": "application/json"
    }
    response = requests.post(url, json=community_data, headers=headers)
    if response.status_code == 201:
        location = response.headers.get("location")
        request_id = location.split("/")[-1] if location else None
        print(f"[✔] Community request created → ID: {request_id}")
        return request_id
    else:
        print(f"[✘] Failed to create community request: {response.status_code} - {response.text}")
        return None

def approve_community_request(request_id, admin_token):
    url = f"{BASE_URL}/communities/creation-requests/{request_id}"
    headers = {
        "Authorization": f"Bearer {admin_token}",
        "Content-Type": "application/json"
    }
    data = {"status": "approved"}
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 201:
        print(f"[✔] Approved community request {request_id}")
    else:
        print(f"[✘] Failed to approve request {request_id}: {response.status_code} - {response.text}")

def get_approved_community_ids():
    url = f"{BASE_URL}/communities"
    response = requests.get(url)
    if not response.ok:
        print(f"[✘] Failed to fetch communities: {response.status_code} - {response.text}")
        return []

    data = response.json().get("data", [])
    ids = [community["id"] for community in data]
    
    print(f"[✔] Retrieved {len(ids)} community IDs.")
    return ids

def phase_3_create_and_approve_communities(user, admin):
    communities = load_json_from_data(COMMUNITIES_FILE)
    
    for community in communities:
        request_id = create_community_request(community, user["token"])
        if request_id:
            approve_community_request(request_id, admin["token"])

    return get_approved_community_ids()

###
### Phase 4: Join and Approve Communities access
###
def request_join_community(community_id, user_token):
    url = f"{BASE_URL}/communities/{community_id}/join-requests"
    headers = {
        "Authorization": f"Bearer {user_token}"
    }

    response = requests.post(url, headers=headers)

    if response.status_code == 201:
        location = response.headers.get("location")
        join_request_id = location.split("/")[-1] if location else None
        print(f"[✔] Join request sent for community {community_id} → Request ID: {join_request_id}")
        return join_request_id
    else:
        print(f"[✘] Failed to send join request to community {community_id}: {response.status_code}")
        return None

def approve_join_request(community_id, join_request_id, admin_token):
    url = f"{BASE_URL}/communities/{community_id}/join-requests/{join_request_id}"
    headers = {
        "Authorization": f"Bearer {admin_token}",
        "Content-Type": "application/json"
    }

    data = {"status": "approved"}
    response = requests.post(url, json=data, headers=headers)

    if response.status_code == 201:
        print(f"[✔] Approved join request {join_request_id} for community {community_id}")
        return True
    else:
        print(f"[✘] Failed to approve join request {join_request_id}: {response.status_code} - {response.text}")
        return False
    
def phase_4_join_and_approve(users, admin_user, community_ids):
    if not users or not community_ids or not admin_user:
        print("[!] Missing users, admin or communities.")
        return []

    approved_joins = []

    for i, user in enumerate(users):
        community_id = community_ids[i % len(community_ids)]
        join_request_id = request_join_community(community_id, user["token"])
        if join_request_id:
            success = approve_join_request(community_id, join_request_id, admin_user["token"])
            if success:
                approved_joins.append((community_id, join_request_id))

    return approved_joins

###
### Phase 5: Create Causes in Community
###
def create_cause_for_community(community_id, cause_data, token):
    url = f"{BASE_URL}/communities/{community_id}/causes"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    response = requests.post(url, json=cause_data, headers=headers)
    if response.status_code == 201:
        print(f"[✔] Cause '{cause_data['title']}' created in community {community_id}")
    else:
        print(f"[✘] Failed to create cause '{cause_data['title']}' in community {community_id}: {response.status_code} - {response.text}")

def get_all_cause_ids():
    url = f"{BASE_URL}/causes?page=1&limit=100"
    headers = {
        "Content-Type": "application/json"
    }

    response = requests.get(url, headers=headers)
    if not response.ok:
        print(f"[✘] Failed to fetch causes: {response.status_code} - {response.text}")
        return []

    causes = response.json().get("data", [])
    ids = [cause["id"] for cause in causes]

    print(f"[✔] Retrieved {len(ids)} cause IDs.")
    return ids

def phase_5_create_causes(user, community_id):
    causes = load_json_from_data(CAUSES_FILE)

    if not community_id:
        print("[!] No community ID provided.")
        return

    for cause in causes:
        create_cause_for_community(community_id, cause, user["token"])

    return get_all_cause_ids()

###
### Phase 6: Create Actions for Causes
###
def create_action_for_cause(cause_id, action_data, token):
    url = f"{BASE_URL}/causes/{cause_id}/actions"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=action_data, headers=headers)

    if response.status_code == 201:
        try:
            action_id = response.json().get("id")
        except Exception:
            action_id = None

        print(f"[✔] Action '{action_data['title']}' created in cause {cause_id} → ID: {action_id}")
        return action_id
    else:
        print(f"[✘] Failed to create action '{action_data['title']}' in cause {cause_id}: {response.status_code} - {response.text}")
        return None

def phase_6_create_actions(user, cause_id):
    actions = load_json_from_data(ACTIONS_FILE)
    created_action_ids = []

    if not cause_id:
        print("[!] No cause ID provided.")
        return created_action_ids

    for action in actions:
        action_id = create_action_for_cause(cause_id, action, user["token"])
        if action_id:
            created_action_ids.append(action_id)

    return created_action_ids

###
### Phase 7: Contribute to Actions
###
def create_contribution_for_action(action_id, contribution_data, token):
    url = f"{BASE_URL}/actions/{action_id}/contributions"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=contribution_data, headers=headers)
    if response.status_code == 201:
        location = response.headers.get("location")
        contribution_id = location.split("/")[-1] if location else "unknown"
        print(f"[✔] Contribution {contribution_data['amount']} {contribution_data['unit']} → Action {action_id} → ID: {contribution_id}")
        return contribution_id
    else:
        print(f"[✘] Failed to contribute to action {action_id}: {response.status_code} - {response.text}")
        return None

def phase_7_contribute_to_actions(user, action_ids):
    contributions = load_json_from_data(CONTRIBUTIONS_FILE)
    created_contribution_ids = []

    if not action_ids:
        print("[!] No actions available to contribute.")
        return created_contribution_ids

    for i, action_id in enumerate(action_ids):
        contribution = contributions[i % len(contributions)]  # rotar
        contrib_id = create_contribution_for_action(action_id, contribution, user["token"])
        if contrib_id:
            created_contribution_ids.append(contrib_id)

    return created_contribution_ids

###
### Phase 8: Support Causes
###
def support_cause(cause_id, token):
    url = f"{BASE_URL}/causes/{cause_id}/supporters"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers)
    if response.status_code == 201:
        try:
            body = response.json()
            print(f"[✔] Supported cause {cause_id} → Supporter ID: {body.get('supporterId')}")
            return body.get("supporterId")
        except Exception:
            print(f"[✔] Supported cause {cause_id} (no body)")
            return None
    else:
        print(f"[✘] Failed to support cause {cause_id}: {response.status_code} - {response.text}")
        return None

def phase_8_support_causes(users, cause_ids):
    if not cause_ids or not users:
        print("[!] No causes or users available for supporting.")
        return []

    supporter_ids = []

    for i, cause_id in enumerate(cause_ids):
        user = users[i % len(users)]  # rotate through users
        supporter_id = support_cause(cause_id, user["token"])
        if supporter_id:
            supporter_ids.append(supporter_id)

    return supporter_ids

###
### Main function to run the script
###
if __name__ == "__main__":

    admin_user = None
    default_user = None
    main_community_id = None
    main_cause_id = None
    main_action_id = None

    print("=== PHASE 1: Register and Login Users ===")
    authenticated_users = phase_1_register_and_login_users()
    admin_user = authenticated_users[0] if authenticated_users else None # Admin user
    authenticated_users = authenticated_users[1:] # Remove admin from the list
    default_user = authenticated_users[0] if len(authenticated_users) > 0 else None # Default user
    print("=== PHASE 1 COMPLETED ===\n")

    print("=== PHASE 2: Follow Users ===")
    phase_2_follow_users(authenticated_users)
    print("=== PHASE 2 COMPLETED ===\n")

    print("=== PHASE 3: Creating and Approving Communities ===")
    communities_ids = phase_3_create_and_approve_communities(admin_user, admin_user)
    main_community_id = communities_ids[0] if communities_ids else None # Main community ID
    print("=== PHASE 3 COMPLETED ===\n")

    print("=== PHASE 4: Join and Approve Communities access ===")
    phase_4_join_and_approve(authenticated_users, admin_user, communities_ids)
    print("=== PHASE 4 COMPLETED ===\n")

    print("=== PHASE 5: Creating Causes in Comunity ===")
    causes_ids = phase_5_create_causes(default_user, main_community_id)
    main_cause_id = causes_ids[0] if causes_ids else None # Main cause ID
    print("=== PHASE 5 COMPLETED ===\n")

    print("=== PHASE 6: Creating Actions for Causes ===")
    actions_ids = phase_6_create_actions(default_user, main_cause_id)
    main_action_id = actions_ids[0] if actions_ids else None # Main action ID
    print("=== PHASE 6 COMPLETED ===\n")

    print("=== PHASE 7: Contributing to Actions ===")
    phase_7_contribute_to_actions(default_user, actions_ids)
    print("=== PHASE 7 COMPLETED ===\n")

    print("=== PHASE 8: Supporting Causes ===")
    phase_8_support_causes(authenticated_users, causes_ids)
    print("=== PHASE 8 COMPLETED ===\n")
