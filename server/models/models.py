from server import db
from server.models.mutables import JsonEncodedDict, NestedMutableDict
from sqlalchemy.dialects.postgresql import JSON


class User(db.Model):
    pk_user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120))
    ipv4_address = db.Column(db.String(), unique=True)
    my_turn = db.Column(db.Boolean)
    fk_lobby = db.Column(db.Integer, db.ForeignKey('lobby.pk_lobby'))


    def __init__(self, username, ipv4_address, my_turn=False, fk_lobby=None):
        self.username = username
        self.fk_lobby = fk_lobby
        self.ipv4_address = ipv4_address
        self.my_turn = my_turn

    def __repr__(self):
        return "<User " + str(dict(
        pk_id=self.pk_id,
        username=self.username,
        my_turn=self.my_turn,
        fk_lobby=self.fk_lobby)) + " >"



class Lobby(db.Model):
    pk_lobby = db.Column(db.Integer, primary_key=True)
    players = db.relationship('User', backref="lobby", lazy="dynamic")
    moves = db.relationship('Moves', backref="lobby", lazy="dynamic")


    def __repr__(self):
        return "<Lobby " + str(dict(
        pk_lobby = self.pk_lobby,
        )) + " >"

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


def clear_lobby(lobby_id):
    lobby = Lobby.query.get(lobby_id)
    if not lobby:
        return None
    for move in lobby.moves:
        db.session.delete(move)

    for player in lobby.players:
        db.session.delete(player)

    db.session.commit()

def clear_all_lobbies():
    lobbies = Lobby.query.all()
    for lobby in lobbies:
        db.session.delete(lobby)
    db.session.commit()
