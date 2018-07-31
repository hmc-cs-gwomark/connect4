from . import db, socketio
from server.models.models import User, Lobby
from server.hwscripts.test import Board
from .resources import clear_moves, to_ox
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
    try:
        ip = session['ip']
        user = User.query.filter_by(ipv4_address=ip).first()
        if not user:
            #TODO: THROW ERROR
            pass
        clear_lobbies(user.fk_lobby)

        # let other players know room is disconnected
        # We could accomplish this by sending a message to the user saying they're disconnected
        # then add an event which handles the player left in the lobby
        db.session.delete(user)
        db.session.commit()
        emit('')
    except:
        pass


@socketio.on('find_game')
def find_game(name):
    # TODO verify that the user isn't already playing a game
    # TODO decide whether or not to use ajax on form
    # Make rest API to use with ajax

    # Sent by user from form
    username = data['username']
    ipv4_address = request.remote_addr
    new_user = User(username, ipv4_address)

    # Look for available lobbys, let the user know if none can be found
    avail_lobbys = Lobby.query.filter(Lobby.num_players < 2).order_by(Lobby.num_players.desc()).all()
    if not avail_lobbys:
        # Create new lobby and set player 1
        lobby = Lobby()
        db.session.add(new_lobby)
        lobby.players[0] = request.sid
        db.session.commit()


        #store user info in session
        session['ox'] = 'X'
        session['player'] = True

    else:
        # Otherwise find the first available lobby, and join the room with the lobby's name as player 2
        lobby = avail_lobbys[0]
        lobby.player2 = request.sid
        lobby.is_full = True
        db.session.commit()
        session['ox'] = 'O'
        emit('player2', {'turn':False}, room=request.sid)
        emit('game started', room=room)
    room = "connect-4-gwomark" + str(lobby.pk_lobby)
    join_room(room)

    # store lobbby information in the users session
    session['lobby'] = lobby.pk_lobby
    session['room'] = room



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
