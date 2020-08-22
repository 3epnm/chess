<template>
    <div class="chessboard" :class="classObject">
      <Field
        v-for="field in Fields"
        :key="field.key"
        :field="field"/>
      <Piece
        v-for="piece in Pieces"
        :key="piece.key"
        :piece="piece"/>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

import Field from '@components/Chess/Field.vue'
import Piece from '@components/Chess/Piece.vue'

@Component({
  components: {
    Field,
    Piece
  }
})
export default class Board extends Vue {
  @Getter Fields!: ChessField[]
  @Getter Pieces!: ChessPiece[]
  @Getter Player!: ChessPlayer
  @Getter isStarted!: boolean

  get classObject (): VueElementClassObj {
    return {
      animated: this.isStarted && this.Player.isVisitor,
      white: this.Player.color === 'b',
      black: this.Player.color === 'w'
    }
  }
}
</script>

<style lang="scss">
.chessboard {
  width: 400px;
  height: 400px;
  margin: 0 auto;
  position: relative;
}
</style>
