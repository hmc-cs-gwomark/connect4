from server import db
from server.models.mutables import JsonEncodedDict, NestedMutableDict
from sqlalchemy.dialects.postgresql import JSON


class User(db.Model):
    pk_user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120))
    my_turn = db.Column(db.Boolean)
    fk_lobby = db.Column(db.Integer, db.ForeignKey('lobby.pk_lobby'))

    def __init__(self, username, fk_lobby, my_turn=False):
        self.username = username
        self.fk_lobby = fk_lobby
        self.my_turn = my_turn

    def __repr__(self):
        return str(dict(
        pk_user_id=self.pk_user_id,
        username=self.username,
        my_turn=self.my_turn,
        fk_lobby=self.fk_lobby))



class Lobby(db.Model):
    pk_lobby = db.Column(db.Integer, primary_key=True)
    num_players = db.Column(db.Integer)

    def __init__(self, num_players=0):
        self.num_players

    def __repr__(self):
        return str(dict(
        pk_lobby = self.pk_lobby,
        ))


NestedMutableDict.associate_with(JsonEncodedDict)

class Moves(db.Model):
    pk_move_id = db.Column(db.Integer, primary_key=True)
    board = db.Column(JsonEncodedDict)
    turn = db.Column(db.String)
    fk_lobby = db.Column(db.Integer, db.ForeignKey('lobby.pk_lobby'))

    def __init__(self, board, turn, fk_lobby):
        self.board = board
        self.turn = turn
        self.fk_lobby = fk_lobby

    def __repr__(self):
        return str(dict(
        pk_move_id=self.pk_move_id,
        board=self.board,
        turn=self.turn,
        fk_lobby=self.fk_lobby))
