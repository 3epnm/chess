declare type ChessPieceColors = 'w' | 'b'
declare type ChessPieceNames = 'r' | 'n' | 'b' | 'q' | 'k' | 'p'
declare type ChessFieldColumns = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
declare type ChessFieldRows = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
declare type ChessBoardPositions = undefined | 'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' | 'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' | 'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' | 'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' | 'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' | 'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' | 'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' | 'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1'
declare type ChessSocketRequestNames = 'startGame' | 'joinGame' | 'quitGame' | 'movePiece'

declare interface VueElementClassObj {
  [x: string]: string|number|boolean|Date|Json|JsonArray;
}

declare interface ChessGame {
  sessionId?: string;
  started: boolean;
  pending: boolean;
}

declare interface ChessPlayer {
  playerId?: string;
  color?: ChessPieceColors;
  isPlayer: boolean;
  isVisitor: boolean;
}

declare interface ChessStore {
  pieces: ChessPiece[];
  fields: ChessField[];
  lastColor: ChessPieceColors;
  movingPosition?: ChessBoardPositions;
  game: ChessGame;
  player: ChessPlayer;
}

declare interface WebSocketStore {
  socket: ChessSocketState;
}

declare interface ChessImagesStore {
  images: ChessPieceImage[];
  imagesLoaded: boolean;
}

declare interface ErrorStore {
  error: ChessError;
}

declare interface ChessPiece {
  key: string;
  pos: ChessBoardPositions;
  name: ChessPieceNames;
  color: ChessPieceColors;
}

declare interface ChessField {
  key: string;
  pos: ChessBoardPositions;
}

declare interface ChessMove {
  from: ChessBoardPositions;
  to: ChessBoardPositions;
}

declare interface GameInit {
  action: string;
  sessionId: string;
  playerId: string;
  isPlayer: boolean;
}

declare interface GameExit {
  action: string;
  sessionId?: string;
}

declare interface GameMove {
  action: string;
  sessionId: string;
  playerId: string;
  data: ChessMove;
}

declare interface ChessPieceImage {
  color: ChessPieceColors;
  name: string;
  svg: string;
}

declare interface ChessError {
  code: number;
  sender?: string;
  message?: string;
  detail?: string;
  raw?: Error;
}

declare interface ChessWarning {
  sender?: string;
  message?: string;
}

declare interface ChessSocketState {
  isConnected: boolean;
  isShutdown: boolean;
  reconnectError: boolean;
}

declare interface ChessSocketRequest {
  request: ChessSocketRequestNames;
  sessionId?: string;
  playerId?: string;
  data?: ChessMove;
}
