from server import connect4
from flask import render_template, session, request

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


