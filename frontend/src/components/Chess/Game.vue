<template>
  <div>
    <div v-if="Error.code < 1" class="info">
      <div :class="classObjectCenter">
        <span v-if="TurnMessage" :class="classObjectTurnMessage">{{ TurnMessage }}</span>
        <span v-if="GameMessage">{{ GameMessage }}</span>
      </div>
    </div>
    <div v-else class="error">
      <div>
        <span class="animate__animated animate__heartBeat animate__infinite">{{ Error.message }}</span>
      </div>
    </div>
    <Board/>
    <div class="ctrls">
      <button
        v-if="!isStarted"
        @click="startGame"
        :disabled="isDisabled">Start new game</button>
      <button
        v-if="isStarted && isPending && !isPlayer"
        @click="joinGame"
        :disabled="isDisabled">Join a game</button>
      <button
        v-if="isPlayer || isVisitor"
        @click="quitGame"
        :disabled="isDisabled">Quit game</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import type { ActionMethod } from 'vuex'
import Board from '@components/Chess/Board.vue'

@Component({
  components: {
    Board
  }
})
export default class Game extends Vue {
  @Action init!: ActionMethod
  @Action startGame!: ActionMethod
  @Action joinGame!: ActionMethod
  @Action quitGame!: ActionMethod

  @Getter Error!: ChessError
  @Getter Player!: ChessPlayer
  @Getter isStarted!: boolean
  @Getter isPlayer!: boolean
  @Getter isVisitor!: boolean
  @Getter isPending!: boolean
  @Getter isTurn!: boolean
  @Getter isDisabled!: boolean

  get classObjectCenter (): VueElementClassObj {
    return {
      center: this.isPending || this.isVisitor
    }
  }

  get classObjectTurnMessage () {
    return {
      /* eslint-disable @typescript-eslint/camelcase */
      animate__animated: this.isTurn,
      animate__pulse: this.isTurn,
      animate__infinite: this.isTurn
      /* eslint-enable */
    }
  }

  async created () {
    await this.init()

    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'Connected':
          this.$data.isDisabled = !mutation.payload
          break
      }
    })
  }

  get GameMessage () {
    if (this.isPending && this.isPlayer) {
      return 'Wait for opponent to join.'
    }

    if (!this.isPending && this.isPlayer) {
      return `You play the ${this.Player.color === 'w' ? 'white' : 'black'} pieces.`
    }

    if (!this.isPending && this.Player.isVisitor) {
      return 'The game has already started.'
    }

    return ''
  }

  get TurnMessage () {
    if (!this.isPending && this.isPlayer) {
      if (this.isTurn) {
        return 'It\'s is your turn.'
      } else {
        return 'It is your opponent\'s turn.'
      }
    }

    return ''
  }
}
</script>

<style lang="scss" scoped>
.info {
  height: 1em;
  margin-bottom: 1em;
  div {
    width: 380px;
    margin: 0 auto;

    &:not(.center) {
      span:first-child {
        float: left;
        &.animate__animated {
          font-weight: bold;
          display: block;
        }
      }
      span:last-child {
        float: right;
      }
    }
  }
}
.error {
  height: 1em;
  margin-bottom: 1em;
  div {
    width: 380px;
    margin: 0 auto;
    span {
      color: red;
      display: block;
      font-weight: bold;
    }
  }
}
.ctrls {
  margin-top:1em;
}
</style>
