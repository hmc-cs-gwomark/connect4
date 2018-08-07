from server import connect4, db
from flask import render_template, session, request
from flask import make_response
from flask.json import jsonify

from .forms import EnterGameForm
from .models.models import User

@connect4.route('/', methods=['GET', 'POST'])
@connect4.route('/index', methods=['GET', 'POST'])
@connect4.route('/wait')
def index():
    # form = EnterGameForm(request.remote_addr)
    # if form.validate_on_submit():
    #     session['ip'] = request.remote_addr
    #     user = User(form.data.username, session['ip'])
    #     db.session.add(user)
    #     db.session.commit()
    #     redirect(url_for('play_game'))
    return render_template('index.html')


@connect4.route('/wait', methods=['GET'])
def wait():
    return render_template('index.html')


@connect4.route('/play', methods=['GET'])
def play():
    return render_template('index.html')


# Route specifically for ajax stuff to verify users
@connect4.route('/connect4/api/users', defaults={'user_id': None}, methods=['GET', 'POST', 'DELETE'])
@connect4.route('/connect4/api/users/', defaults={'user_id': None}, methods=['GET', 'POST'])
@connect4.route('/connect4/api/users/<user_id>', methods=['GET'])
def get_user_by_ip(user_id):
    
    # If we get a post request create a new user
    if request.method == 'POST':
        username = request.args.get("username")
        ipv4_address = request.remote_addr 
        # try to create a new user and add it to the database
        try:
            user = User(username, ipv4_address)
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return make_user_json(user)
        except:
            return make_response(jsonify({'error': 'Failed to create user name'}), 404)



    # Check argument to see if we should get user by ip or not
    # First route checks if the Current IP is held by a user
    if user_id is not None:
        user = User.query.filter_by(pk_user_id=id).first()
    else:
        user = User.query.filter_by(ipv4_address=request.remote_addr).first()



    if user:
        if request.method == 'DELETE':
            db.session.delete(user)
            db.session.commit()
            return jsonify({'success':'true'})
        return make_user_json(user)
    else:
        return make_response(jsonify({'error': 'No such resource'}), 404)







####################
# HELPER FUNCTIONS #
####################

def make_user_json(user):
    return jsonify({'username':user.username, 'myTurn': user.my_turn})


