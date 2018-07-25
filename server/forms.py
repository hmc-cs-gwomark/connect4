from flask import request
from flask_wtf import FlaskForm
from wtforms.fields import StringField
from wtforms.validators import Required

from .models.models import User

import re

class EnterGameForm(FlaskForm):
    username = StringField('username', validators=[Required()])

    def __init__(self, ip, *args, **kwargs):
        FlaskForm.__init__(self, *args, **kwargs)
        self.ip = ip

    def validate(self):
        rv = FlaskForm.validate(self)
        if not rv:
            return False

        ip = User.query.filter_by(ipv4_address=self.ip).first()
        if ip:
            self.errors.append('Game already started from this IP')
            return False

        user = User.query.filter_by(username=self.username.data).first()
        if user:
            self.username.errors.append('Username taken')
            return False

        matches = re.match('[a-zA-z][a-zA-z_-]', self.username.data)
        if matches:
            self.username.errors.append('No Punctuation in name')
            return False

        return True
