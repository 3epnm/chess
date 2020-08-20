# Chess

In this project there is a front and backend to display a chessboard with VueJs, on which two users can play against each other.
Real-time data is transmitted via a native WebSocket server (ws) and scores are saved in a MongoDB. Only a single session is offered
at a time. If a third user opens the app, he can watch the game or quit it.
stallation and start of the backend and frontend have not changed and are carried out as described below.

## The Frontend

The user is offered with a Chessboard and a button `Start Session`. If pressed, he gets informed that he has to wait for an opponent to play against.
If a second user opens the app, the is offered buttin `Join Session`. If pressed, the game is started and the first user can make the first move with the white pieces. Here, the Drag and Drop approach was chosen. The user can select one of the white pieces and move it to another field on the board. He can't put his piece on another white piece or a king. If a move is possible, the field is highlighted with green color, if not with red color. If he has finished his move, the opponent can make his move and so on. The users get informed about the state of the game and when it is their turn. If a player makes a move, the piece is animated on the opponents and a visitors app. Anyone of the users can close the session with a click on a button. A short video `chess.mp4` in the root folder of this project illustrates the main features

## The Backend

The Backend offers a single REST endpoint, where an open session can be loaded from. If no open session is found, the endpoint returns HTTP 204 no content. All further communication takes place via the websocket server. Every Session is stored in a single document in the sessions collection of the chess_db Database in MongoDB. The players and moves are stored as sub documents.
