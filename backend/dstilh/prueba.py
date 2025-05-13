import psycopg2

# Configura tus datos de conexión
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "solidarianid"
DB_USER = "admin"
DB_PASSWORD = "admin"

try:
    # Establece conexión
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

    # Crea un cursor
    cursor = conn.cursor()

    # Ejecuta la consulta
    cursor.execute("""
    SELECT * FROM user
""")
    for row in cursor.fetchall():
        print(row)

    # Cierra el cursor y la conexión
    cursor.close()
    conn.close()

except Exception as e:
    print(f"Ocurrió un error: {e}")