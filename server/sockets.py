from . import db, socketio
from server.models.models import Lobby
from server.hwscripts.test import Board
from .resources import clear_moves, to_ox, clear_lobbys
from flask import session, request, g
from flask_socketio import emit, send, join_room, leave_room
import json

CONNECT4_WIDTH = 7
CONNECT4_HEIGHT = 6

#
# EVENT HANDLERS
#

@socketio.on('connect')
def connected():
    emit('connected', {'data':'connected'})


@socketio.on('disconnect')
def disconnect():
    if 'lobby' not in session:
        pass
    else:
        lobby = Lobby.query.get(session['lobby'])
        lobby.player1 = None
        lobby.player2 = None
        lobbu.full = False
        clear_moves(lobby.pk_lobby)
        emit('left', "player" + str(session['player']) + " just left. game closed", broadcast=True)


@socketio.on('look_for_game')
def find_game(name):

    # Sent by user from form
    username = data['username']

    # Look for available lobbys, let the user know if none can be found
    avail_lobbys = Lobby.query.filter(Lobby.num_players < 2).all()
    if not avail_lobbys:
        #TODO: Let the user know that the game is full
        pass

    # Otherwise find the first available lobby, and join the room with the lobby's name
    lobby = avail_lobbys[0]
    room = "connect-4-gwomark" + str(lobby.pk_lobby)
    join_room(room)

    # store lobbby information in the users session
    session['lobby'] = lobby.pk_lobby
    session['room'] = room
    session['color'] = None

    # Put incoming player into appropriate slot
    message = ""
    if not lobby.player1:
        lobby.player1 = request.sid
        db.session.commit()
        session['ox'] = 'X'
        session['player'] = True
        emit('player1', {'turn':True}, room=request.sid)
    elif not lobby.player1 == request.sid:
        lobby.player2 = request.sid
        lobby.is_full = True
        db.session.commit()
        session['ox'] = 'O'
        emit('player2', {'turn':False}, room=request.sid)
        emit('game started', room=room)

    return str(Lobby.query.all())



@socketio.on('move:sent')
def move_made(data):
    current_move = json.loads(data)
    column = move['column']
    moves = get_moves(session['lobby'])

    try:
        last_move = moves[-1]
        last_board = last_move.board

        new_turn = session['player'] if last_move.turn != session['player'] else False

        cs5_board = Board(7, 6)
        cs5_board.data = last_board.copy()
        if cs5_board.allowsMove(column):
            cs5_board.addMove(column, session['ox'])
            result = {'winner': session['player'], 'full':False, 'error': False}
            if cs5_board.winsFor(session['ox']):
                emit('win|full', result)
                return
            if cs5_board.isFull():
                result['full'] = True
                result['winner'] = False
                emit('win|full', result)

            newmove = Moves(cs5_board.data, new_turn, session['lobby'])
            db.session.add(newmove)
            db.session.commit()
        else:
            return "error"

        new_turn = not not new_turn
        emit('move:received', {'board':cs5_board, 'turn':new_turn})

    except:
        return "error"
