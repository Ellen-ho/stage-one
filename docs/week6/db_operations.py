from mysql.connector import Error
from database import create_server_connection
from passlib.context import CryptContext
from urllib.parse import quote

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def check_username_exists(username):
    connection = create_server_connection()
    if connection is None:
        print("Failed to connect to the database")
        return False
    
    try:
        cursor = connection.cursor()
        query = "SELECT * FROM member WHERE username = %s"
        cursor.execute(query, (username,))  
        result = cursor.fetchall()
        return len(result) > 0
    except Error as e:
        print(f"Database error: {str(e)}")
        return False
    finally:
        cursor.close()
        connection.close()

def create_user(name, username, password):
    if not name or not username or not password or name.strip() == "" or username.strip() == "" or password.strip() == "":
        return None, "Username and password must not be empty"

    connection = create_server_connection()
    if connection is None:
        return None, "Failed to connect to the database"

    try:
        cursor = connection.cursor()
        if check_username_exists(username):
            return None, "Repeated username"

        hashed_password = pwd_context.hash(password)
        query = "INSERT INTO member (name, username, password) VALUES (%s, %s, %s);"
        cursor.execute(query, (name, username, hashed_password))
        connection.commit()
        return "User created successfully.", None
    except Error as e:
        connection.rollback() 
        return None, f"Database error: {str(e)}"
    finally:
        cursor.close()
        connection.close()

def verify_user(username, password):
    if not username or not password or username.strip() == "" or password.strip() == "":
        return None, "Username and password must not be empty."

    connection = create_server_connection()
    if connection is None:
        return None, "Failed to connect to the database"
    
    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM member WHERE username = %s"
        cursor.execute(query, (username,))

        user = cursor.fetchone()

        if user:
            stored_password = user['password']
            if pwd_context.identify(stored_password):
                if pwd_context.verify(password, stored_password):
                    return user, None
                else:
                    return None, "Username or password is not correct"
            else:
                if password == stored_password:
                    return user, None
                else:
                    return None, "Username or password is not correct"
        else:
            return None, "Username not found"
    except Error as e:
        return None, f"Database error: {str(e)}"
    finally:
        cursor.close()
        connection.close()

async def find_member_name_by_id(member_id: int):
    connection = create_server_connection()
    if connection is None:
        return None, "Failed to connect to the database"

    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT name FROM member WHERE id = %s"
        cursor.execute(query, (member_id,))
        result = cursor.fetchone()
        if result:
            return result['name']
        else:
            return None
    except Error as e:
        return None, f"Database error: {str(e)}"
    finally:
        cursor.close()
        connection.close()

async def create_message_in_db(member_id: int, content: str):
    if not content or content.strip() == "":
        return None, "Message Content can not be empty"
    connection = create_server_connection()
    if connection is None:
        return None, "Failed to connect to the database"

    try:
        cursor = connection.cursor(dictionary=True)
        query = "INSERT INTO message (member_id, content, time) VALUES (%s, %s, CURRENT_TIMESTAMP)"
        cursor.execute(query, (member_id, content))
        connection.commit()
        return "Message created successfully.", None
    except Error as e:
        connection.rollback() 
        return None, f"Database error: {str(e)}"
    finally:
        cursor.close()
        connection.close()

async def get_messages():
    connection = create_server_connection()
    if connection is None:
        return None, "Failed to connect to the database"

    try:
        cursor = connection.cursor(dictionary=True)
        query = """
        SELECT member.name AS member_name, message.id, message.member_id, message.content, message.time 
        FROM message
        JOIN member ON message.member_id = member.id
        ORDER BY message.time DESC
        """
        cursor.execute(query)
        messages = cursor.fetchall()
        return messages
    except Error as e:
        return None, f"Database error: {str(e)}"
    finally:
        cursor.close()
        connection.close()

async def delete_message(message_id, member_id):
    connection = create_server_connection()
    if connection is None:
        return None, "Failed to connect to the database"
    try:
        cursor = connection.cursor(dictionary=True)
        select_query = "SELECT * FROM message WHERE id = %s AND member_id = %s"
        cursor.execute(select_query, (message_id, member_id))
        message = cursor.fetchone()
        if message is None:
            return None, "Message not found or access denied"

        delete_query = "DELETE FROM message WHERE id = %s"
        cursor.execute(delete_query, (message_id,))
        connection.commit()  
        return "Message deleted successfully.", None
    except Error as e:
        connection.rollback() 
        return None, f"Database error: {str(e)}"
    finally:
            cursor.close()
            connection.close()

