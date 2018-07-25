#Derek Pickell

class Board:

    def __init__( self, width, height ):
        """ the constructor for objects of type Board """
        self.width = width
        self.height = height
        W = self.width
        H = self.height
        self.data = [ ['']*W for row in range(H) ]

    def __repr__(self):
        """ this method returns a string representation
            for an object of type Board
        """
        H = self.height
        W = self.width
        s = ''   # the string to return
        for row in range(0,H):
            s += '|'
            for col in range(0,W):
                s += self.data[row][col] + '|'
            s += '\n'

        s += (2*W+1) * '-'    # bottom of the board
        s+= ('\n')
        # and the numbers underneath here
        for col in range(0, W) :
            s += " " + str(col%10)
        return s       # the board is complete, return it

    def allowsMove(self, col):
        """true if col is inside and open
        otherwise false
        """
        if col>=self.width or col<0:
            return False
        if self.data[0][col] != ' ':
            return False
        return True

    def addMove(self, col, ox):
        """places OX within appropriate place"""
        H = self.height
        for row in range(0, H):
            if self.data[row][col] != ' ':
                self.data[row-1][col] = ox
                return None
        self.data[H-1][col] = ox

    def clear(self):
        """clears board"""
        self.data = [[' ']*self.width for row in range(self.height)]

    def setBoard( self, moveString ):
        """ takes in a string of columns and places
            alternating checkers in those columns,
            starting with 'X'

            For example, call b.setBoard('012345')
            to see 'X's and 'O's alternate on the
            bottom row, or b.setBoard('000000') to
            see them alternate in the left column.

            moveString must be a string of integers
        """
        nextCh = 'X'   # start by playing 'X'
        for colString in moveString:
            col = int(colString)
            if 0 <= col <= self.width:
                self.addMove(col, nextCh)
            if nextCh == 'X': nextCh = 'O'
            else: nextCh = 'X'

    def isFull(self):
        """returns True if full
        """
        for i in self.data :
            for j in i :
                if j == ' ' :
                    return False
        return True

    def delMove(self, c):
        """deletes specified move
        """
        for i in range (self.height) :
            if self.data[i][c] != ' ':
                self.data[i][c] = ' '
                return

    def winsFor(self, ox):
        """
        checks if won
        """
        for i in range(self.height) :
            for j in range(self.width) :
                if self.inarow_Nnortheast(ox, i, j, self.data, 4) or self.inarow_Nsoutheast(ox, i, j, self.data, 4) or self.inarow_Neast(ox, i, j, self.data, 4) \
                    or self.inarow_Nsouth(ox, i, j, self.data, 4) :
                    return True
        return False
    def inarow_Neast( self, ch, r_start, c_start, A, N ):
        """checks eastward element N in a row given starting conditions
        """
        NR = len(A)
        NC = len(A[0])
        if r_start >= NR:
            return False
        if c_start >= NC:
            return False
        if c_start > NC-N:
            return False
        for i in range(N):                  # loop i as needed
            if A[r_start][c_start+i] != ch:   # check for mismatches
                return False
        return True

    def inarow_Nsouth( self, ch, r_start, c_start, A, N ):
        """checks southward element N in a row given starting conditions
        """
        NR = len(A)
        NC = len(A[0])
        if r_start >= NR:
                return False
        if c_start >= NC:
                return False
        if r_start > NR-N:
            return False
        for i in range(N):                  # loop i as needed
            if A[r_start+i][c_start] != ch:   # check for mismatches
                return False
        return True

    def inarow_Nsoutheast( self, ch, r_start, c_start, A, N ):
        """checks southeastward element given starting conditions, N in a row
        """
        NR = len(A)
        NC = len(A[0])
        if r_start >= NR:
            return False
        if c_start >= NC:
            return False
        if r_start > NR-N:
            return False
        if c_start > NC-N:
            return False
        for i in range(N):                  # loop i as needed
            if A[r_start+i][c_start+i] != ch:   # check for mismatches
                return False
        return True

    def inarow_Nnortheast( self, ch, r_start, c_start, A, N ):
        """checks northeastward element given starting conditions
        """
        NR = len(A)
        NC = len(A[0])
        if r_start >= NR:
            return False
        if c_start >= NC:
            return False
        if r_start < NR-N:
            return False
        if c_start > NC-N:
            return False
        for i in range(N):                  # loop i as needed
            if A[r_start-i][c_start+i] != ch:   # check for mismatches
                return False
        return True

    def hostGame(self):
        """hosts game, main"""
        print ("Welcome!")
        print(self)
        while True :
            users_col = -1
            while self.allowsMove( users_col ) == False:
                users_col = int(input("X's choice: "))
            self.addMove(users_col, "X")
            print(self)
            if self.winsFor("X") :
                print("X wins")
                break
            users_col = -1
            while self.allowsMove( users_col ) == False:
                users_col = int(input("O's choice: "))
            self.addMove(users_col, "O")
            print(self)
            if self.winsFor("O") :
                print("O wins")
                break
            elif self.isFull() :
                print("Tie")
                break
