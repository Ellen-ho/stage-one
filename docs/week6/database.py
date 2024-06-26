import os
import mysql.connector
from mysql.connector import Error

def create_server_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            database=os.getenv('DB_NAME')
        )
        if connection.is_connected():
            print("Database connection successful")
            return connection
    except Error as e:
        print("Error while connecting to MySQL", e)
        return None
