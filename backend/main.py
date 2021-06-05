import mysql.connector

from typing import Optional

from fastapi import FastAPI, HTTPException
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

check_user = ("SELECT userid,password FROM users "
                 " WHERE username = %s "
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


@app.post("/signup")
def userSignup(user: Login):
    print(user)
    cursor = cnx.cursor()
    data_user = (user.username,user.password)
    cursor.execute(add_user,data_user)
    cnx.commit()
    cursor.close()
    return {'msg': 'Login-successful'}


@app.post("/login")
def userlogin(user: Login):
    cursor = cnx.cursor()
    user_data = (user.username)
    cursor.execute(check_user,(user.username,))
    rtn_data = cursor.fetchall()

    if(rtn_data != None and len(rtn_data)>0):
        password = rtn_data[0][1];
        if(password == user.password):
            return None
        else:
            raise HTTPException(status_code=418, detail="Nope! I don't like 3.")


    cursor.close()
    


