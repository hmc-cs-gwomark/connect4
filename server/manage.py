import sys; import pprint
pprint.pprint("/".join(sys.path[0].split('/')[:-1]))
sys.path.append("/".join(sys.path[0].split('/')[:-1]))

from server import app, db
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
