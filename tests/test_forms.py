from coverage import coverage
cov = coverage(branch=True, omit=['flask/*', 'test_forms.py'])
cov.start()

from server import connect4, forms, socketio, db
import unittest

class TestSockets(unittest.TestCase):
    client = socketio.test_client

    def setUp(self):
        self.app = connect4.test_client()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.session.dropall()


    def setup_lobby_with_two_players(self):
        pass

    def setup_lobby_with_one_player(self):
        pass

    def setup_lobby_full(self):
        pass

    def test_quit_first(self):
        # Should do the same thing as disconnect
        # but should also make sure that both players have left
        # the socketio room, cleared their user records,
        # and then redirect them to quit/play again page
        pass

    def test_disconnect(self):
        # Same thing as quit except we only redirect the other player
        # who hasn't disconnected
        # Test that lobby is removed
        pass


    def test_join_game_empty_full(self):
        # a new lobby is created when all are full(or there are no lobbys yet)
        # Should let the player know that they're waiting for another player
        pass


    def test_join_game_slot_available(self):
        # When a second player connects the socket should to the following:
        #   Send to the room: the empty game board
        #   Send to the sid: whose turn it is (this should be randomly selected)
        #   Update the db with whose turn it is
        pass

    def test_move_received(self):
        # Should update the db with the appropriate info from the user
        # Then send a move received update with the new info
        # Or if game over, send a game over event
        pass



if __name__ == '__main__':
    try:
        unittest.main()
    except:
        pass
    cov.stop()
    cov.save()
    print("\n\nCoverage Report:\n")
    cov.report()
    print("HTML version: " + os.path.join(basedir, "tmp/coverage/index.html"))
    cov.html_report(directory='tmp/coverage')
    cov.erase()
