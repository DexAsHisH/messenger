import mysql.connector
from fastapi_socketio import SocketManager
# from threading import Thread

from typing import Optional,List

from fastapi import FastAPI, HTTPException,WebSocket
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
socket_manager = SocketManager(app=app, cors_allowed_origins=[])

cnx = mysql.connector.connect(user='root', password='asdf12#$',
                              host='127.0.0.1',
                              database='messengerdb',auth_plugin='mysql_native_password')


add_user = ("INSERT INTO users "
               " (username,email,password) " 
               "VALUES (%s,%s,%s) "
               )

check_user = ("SELECT userid,password,username FROM users "
                 " WHERE username = %s "
               )


CONNECTED_CLIENTS = {}

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
            raise HTTPException(status_code=400, detail="invalid username or password")
    else:
        raise HTTPException(status_code=400, detail="invalid username or password")        


    cursor.close()
  
  
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
    CONNECTED_CLIENTS[userId] = { 'sid' : sid, 'name' : name , 'userId': userId}
    #app.sio.save_session(sid, {'userId': userId})
    await app.sio.emit('user-joined', { 'name' : name , 'userId': userId})        


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


# @app.websocket("/wsd/{userid}")
# async def websocket_endpoint(websocket: WebSocket, userid: int):
#     ##await websocket.accept()
#     await manager.connect(websocket)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             #await websocket.send_text(f": {data}")
#             await manager.broadcast(f"NEW MESSAGE: {data}")
            
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
#         await manager.broadcast(f"user #{user_id} left the chat")



