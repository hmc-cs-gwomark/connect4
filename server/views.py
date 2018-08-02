from server import connect4
from flask import render_template, session, request
from flask.json import jsonify

from .forms import EnterGameForm
from .models.models import User

@connect4.route('/', methods=['GET', 'POST'])
@connect4.route('/index', methods=['GET', 'POST'])
def index():
    form = EnterGameForm(request.remote_addr)
    if form.validate_on_submit():
        session['ip'] = request.remote_addr
        user = User(form.data.username, session['ip'])
        db.session.add(user)
        db.session.commit()
        redirect(url_for('play_game'))

    return render_template('index.html', form=form)


# Route specifically for ajax stuff to verify users
@connect4.route('/connect4/api/users/', defaults={'id': None}, methods=['GET', 'POST'])
@connect4.route('/connect4/api/users/<id>', methods=['GET'])
def get_user_by_ip(id):
    
    # If we get a post request create a new user
    if request.method == 'POST':
        username = request.form.get("username")
        ipv4_address = request.remote_addr 
        try:
            # try to create a new user and add it to the database
            user = User(username, ipv4_address)
            db.session.add(user)
            db.session.commit(user)
            session['ip'] = ipv4_address
            return make_user_json(user)
        except:
            return make_response_response(jsonify({'error': 'Failed to create user name'}), 402)

    # Check argument to see if we should get user by ip or not
    # First route checks if the Current IP is held by a user
    if user_id:
        user = User.query.filter_by(pk_user_id=id).first()
    else:
        user = User.query.filter_by(ipv4_address=request.remote_addr).first()

    if user:
        return make_user_json(user)
    else:
        return make_response(jsonify({'error': 'No such resource'}), 404)







####################
# HELPER FUNCTIONS #
####################

def make_user_json(user):
    return jsonify({'username':user.username, 'myTurn': user.my_turn})


