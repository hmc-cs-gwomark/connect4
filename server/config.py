from os import getenv

class BaseConfig(object):
    DEBUG = False
    TESTING = False

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    TESTING = True

    SECRET_KEY = "SECRET STUF YEAH"
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost/markov'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class TestingConfig(BaseConfig):
    TESTING = True

    SECRET_KEY = "TEST SECRET YEAH"
    # LOAD IN FROM TESTING_DB env var
    SQLALCHEMY_DATABASE_URI = getenv("TESTING_DB_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False





config = {
    "development": DevelopmentConfig,
    "default": BaseConfig,
    "testing": TestingConfig
}

def configure_app(app, config_name=""):
    if not config_name:
        config_name = ogetenv("FLASK_CONFIG", "default")
    app.config.from_object(config[config_name])
