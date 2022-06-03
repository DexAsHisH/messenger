# build a schema using pydantic
from pydantic import BaseModel

class Login(BaseModel):
    username: str
    password: str

    class Config:
       orm_mode = True


class LoginResponse(BaseModel):
    userid: str
    username: str

    class Config:
       orm_mode = True       

class Signup(BaseModel):
    username: str
    email: str
    password: str

    class Config:
       orm_mode = True     

class SignupResponse(BaseModel):
    id: int

    class Config:
       orm_mode = True           