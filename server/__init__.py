from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SECRET_KEY'] = 'SECRET!'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/markov'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
socketio = SocketIO(app)

from . import sockets, views
from .models import models
