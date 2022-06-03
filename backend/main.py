
# from threading import Thread

from typing import Optional,List

import os
from fastapi import FastAPI, HTTPException,WebSocket
from fastapi_socketio import SocketManager
from fastapi_sqlalchemy import DBSessionMiddleware, db
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv


#Schemas
from schema import Login
from schema import LoginResponse
from schema import Signup
from schema import SignupResponse

#Models
from models import Users as UsersModel


load_dotenv('.env')

app = FastAPI()
socket_manager = SocketManager(app=app, cors_allowed_origins=[])

app.add_middleware(DBSessionMiddleware, db_url=os.environ['DATABASE_URL'])

CONNECTED_CLIENTS = {}

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


@app.post("/signup", response_model=SignupResponse)
def usersignup(user: Signup):
    db_user = UsersModel(username=user.username,email=user.email,password=user.password)
    db.session.add(db_user)
    db.session.commit()
    return db_user


@app.post("/login", response_model=LoginResponse)
def userlogin(user: Login):
    result = db.session.query(UsersModel).filter(UsersModel.username == user.username).first()

    if(result):
        if(result.password == user.password):
            return {'username': result.username,'userid': result.id}
        else:
            raise HTTPException(status_code=400, detail="invalid username or password")
    else:
        raise HTTPException(status_code=400, detail="invalid username or password")        
  
  
@app.sio.event
def connect(sid, environ, auth):
    print('connect ', sid)  


@app.sio.event
async def disconnect(sid):
    keyToDelete = None;
    for key in CONNECTED_CLIENTS:
        if CONNECTED_CLIENTS[key]['sid'] == sid:
            keyToDelete = key
            break
    print("Id to delete : ", keyToDelete)        
    if keyToDelete:
        aa =CONNECTED_CLIENTS.pop(key)
        print(aa)
        await app.sio.emit('user-disconnect', aa)   
           

    print('disconnect ', sid)  


@app.sio.on('join')
async def handle_join(sid, *args, **kwargs):
    print("FUnction Called ,", args[0]['data'])
    userId = args[0]['data']['userId']
    name = args[0]['data']['name'] 
    image = args[0]['data']['image']
    CONNECTED_CLIENTS[userId] = { 'sid' : sid, 'name' : name , 'userId': userId, 'image' : image }
    #app.sio.save_session(sid, {'userId': userId})
    await app.sio.emit('user-joined', { 'name' : name , 'userId': userId , 'image' : image })        


@app.sio.on('send-message')
async def handle_join(sid, *args, **kwargs):
    print("Message Called ,", args[0]['message'])
    #session = app.sio.get_session(sid)
    data = args[0]
    to = data['to']
    fromUser = data['from']
    message = data['message']
    toSid = CONNECTED_CLIENTS[to]['sid']
    
    await app.sio.emit('message-recieve', {'to' : to, 'from': fromUser, 'message' : message}, room=toSid)        



@app.get("/getOnlineUsers")
def getOnlineUsers():
    connectedUsersList = []
    for item in CONNECTED_CLIENTS:
        connectedUsersList.append(CONNECTED_CLIENTS[item])

    return connectedUsersList;





