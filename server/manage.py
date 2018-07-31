import sys; import pprint
pprint.pprint("/".join(sys.path[0].split('/')[:-1]))
sys.path.append("/".join(sys.path[0].split('/')[:-1]))

from server import connect4, db
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

migrate = Migrate(connect4, db)
manager = Manager(connect4)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
