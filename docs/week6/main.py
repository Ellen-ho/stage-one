from fastapi import FastAPI, Request, Response, Form, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
import os
import db_operations
import urllib.parse
from urllib.parse import quote
from passlib.context import CryptContext

load_dotenv()

app = FastAPI()

SECRET_KEY = os.getenv('SESSION_SECRET_KEY')

app.add_middleware(
    SessionMiddleware,
    secret_key=SECRET_KEY,
    max_age=3600 
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.post("/signup")
async def signup(request: Request, name: str = Form(None), username: str = Form(None), password: str = Form(None)):
    user, error = db_operations.create_user(name, username, password)
    if error:
        return RedirectResponse(url=f"/error?message={quote(error)}", status_code=303)
    return RedirectResponse(url="/", status_code=303)

@app.post("/signin")
async def signin(request: Request, username: str = Form(None), password: str = Form(None)):
    user, error = db_operations.verify_user(username, password)
    if error:
        return RedirectResponse(url=f"/error?message={quote(error)}", status_code=303)
    
    request.session['member_id'] = user['id']
    return RedirectResponse(url="/member", status_code=303)

@app.get("/member")
async def member(request: Request):
    member_id = request.session.get('member_id')
    if not member_id:
        return templates.TemplateResponse("error.html", {"request": request, "message": "User authentication failed"})
    member_name = await db_operations.find_member_name_by_id(member_id)
    messages = await db_operations.get_messages()
    return templates.TemplateResponse("member.html", {"request": request, "name": member_name, "messages": messages})

@app.get("/error")
async def error_page(request: Request, message: str = ""):
    return templates.TemplateResponse("error.html", {"request": request, "message": message})

@app.post("/createMessage")
async def create_message(request: Request, content: str = Form(..., alias='message-content')):
    member_id = request.session.get('member_id')
    if not member_id:
        return templates.TemplateResponse("error.html", {"request": request, "message": "User authentication failed"})
    await db_operations.create_message_in_db(member_id, content)
    return RedirectResponse(url="/member", status_code=303)

@app.post("/deleteMessage")
async def delete_message(request: Request, message_id: str = Form(None)):
    member_id = request.session.get('member_id')
    if not member_id:
        return templates.TemplateResponse("error.html", {"request": request, "message": "User authentication failed"})
    await db_operations.delete_message(message_id, member_id)
    return RedirectResponse(url="/member", status_code=303)

@app.get("/signout")
async def signout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/", status_code=303)


