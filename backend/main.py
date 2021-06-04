import mysql.connector

from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


cnx = mysql.connector.connect(user='root', password='Dex.hax25',
                              host='127.0.0.1',
                              database='messengerdb')


add_user = ("INSERT INTO users "
               " (username,password) " 
               "VALUES (%s, %s) "
               )

class Login(BaseModel):
    username: str
    password: str



origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/login")
def userLogin(user: Login):
    print(user)
    cursor = cnx.cursor()
    data_user = (user.username,user.password)
    cursor.execute(add_user,data_user)
    cnx.commit()
    cursor.close()
    return {'msg': 'Login-successful'}




