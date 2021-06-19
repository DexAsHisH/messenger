import mysql.connector

from typing import Optional,List

from fastapi import FastAPI, HTTPException,WebSocket
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


cnx = mysql.connector.connect(user='root', password='Dex.hax25',
                              host='127.0.0.1',
                              database='messengerdb')


add_user = ("INSERT INTO users "
               " (username,email,password) " 
               "VALUES (%s,%s,%s) "
               )

check_user = ("SELECT userid,password,username FROM users "
                 " WHERE username = %s "
               )


class Login(BaseModel):
    username: str
    password: str

class Register(BaseModel):
    username: str
    email: str
    password: str


class ConnectionManager:
    def __init__(self):
        self.connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    async def broadcast(self, data: str):
        for connection in self.connections:
            await connection.send_text(data)


manager = ConnectionManager()



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
def usersignup(user: Register):
    print(user)
    cursor = cnx.cursor()
    data_user = (user.username,user.email,user.password)
    cursor.execute(add_user,data_user)
    cnx.commit()
    cursor.close()
    return {'msg': 'stored successfully'}


@app.post("/login")
def userlogin(user: Login):
    cursor = cnx.cursor()
    user_data = (user.username)
    cursor.execute(check_user,(user.username,))
    rtn_data = cursor.fetchall()

    if(rtn_data != None and len(rtn_data)>0):
        password = rtn_data[0][1];
        if(password == user.password):
            return {'username': rtn_data[0][2],'userid': rtn_data[0][0]}
        else:
            raise HTTPException(status_code=418, detail="Nope! I don't like 3.")


    cursor.close()
    

@app.websocket("/ws/{userid}")
async def websocket_endpoint(websocket: WebSocket, userid: int):
    ##await websocket.accept()
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            #await websocket.send_text(f": {data}")
            await manager.broadcast(f"NEW MESSAGE: {data}")
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"user #{user_id} left the chat")