class ChessRules {
  isKing (to?: ChessPiece): boolean {
    if (to) {
      return to.name === 'k'
    }
    return false
  }

  isOwn (from?: ChessPiece, to?: ChessPiece): boolean {
    if (from && to) {
      return from.color === to.color
    }
    return false
  }

  isSame (data: ChessMove): boolean {
    return data.from === data.to
  }

  validateMove (state: ChessStore, data: ChessMove): boolean {
    const from = state.pieces.find((piece: ChessPiece) => piece.pos === data.from)
    const to = state.pieces.find((piece: ChessPiece) => piece.pos === data.to)

    if (this.isKing(to)) return false

    if (this.isOwn(from, to)) return false

    return true
  }
}

export default new ChessRules()
