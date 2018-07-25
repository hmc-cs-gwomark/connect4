from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from .config import configure_app


connect4 = Flask(__name__)
configure_app(connect4, "testing")

db = SQLAlchemy(connect4)
socketio = SocketIO(connect4)

from . import sockets, views, forms
from .models import models
