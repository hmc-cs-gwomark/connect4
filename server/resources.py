from server.models.models import Moves, Lobby
from . import db
import json
def get_moves(lobby):
    return Moves.query.filter_by(fk_lobby=lobby.pk_lobby).all()

def clear_moves(lobby):
    moves = get_moves(lobby)
    for move in moves:
        db.session.delete(move)
    db.session.commit()

def pop_last_move(lobby):
    moves = get_moves(lobby)
    db.session.delete(moves[-1])
    db.commit()

def create_history(moves):
    result = []
    for move in moves:
        result.append(dict(move.board))
    return result

def to_ox(color):
    return 'X' if color == "red" else 'O'

def clear_lobbys():
    lobbys = Lobby.query.all()
    for lobby in lobbys:
        lobby.is_full = False
        lobby.player1 = None
        lobby.player2 = None
    db.session.commit()
    
