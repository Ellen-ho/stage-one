from fastapi import FastAPI, Request, Form, HTTPException, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from urllib.parse import quote
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

SECRET_KEY = os.getenv('SESSION_SECRET_KEY', 'default_secret_key')

app.add_middleware(
    SessionMiddleware,
    secret_key=SECRET_KEY,
    max_age=3600 
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.post("/signin")
async def signin(request: Request, username: str = Form(None), password: str = Form(None)):
    if not username or not password or username.strip() == "" or password.strip() == "":
        message = quote("Please enter username and password")
        return RedirectResponse(url=f"/error?message={message}", status_code=303)
    elif username == "test" and password == "test":
        request.session['SIGNED-IN'] = True
        return RedirectResponse(url="/member", status_code=303)
    else:
        message = quote("Username or password is not correct")
        return RedirectResponse(url=f"/error?message={message}", status_code=303)

@app.get("/member")
async def member(request: Request):
    if request.session.get('SIGNED-IN') != True:
        return RedirectResponse(url="/", status_code=303)
    return templates.TemplateResponse("member.html", {"request": request})

@app.get("/error")
async def error_page(request: Request, message: str = ""):
    return templates.TemplateResponse("error.html", {"request": request, "message": message})

@app.get("/signout")
async def signout(request: Request):
    request.session['SIGNED-IN'] = False
    return RedirectResponse(url="/", status_code=303)

@app.get("/square/{number}")
async def calculate_square(request: Request, number: int):
    result = number * number
    return templates.TemplateResponse("square.html", {"request": request, "number": number, "result": result})