from flask import FlaskForm
from wtforms.fields import StringField
from wtforms.validators import Required

class EnterGameForm(FlaskForm):
    username = StringField('username', validators=[Required()])
