<template>
  <div class="chess">
    <div v-if="Error.message" class="error">
      <div>
        <span class="animate__animated animate__heartBeat animate__infinite" v-html="$t(Error.message)"></span>
      </div>
    </div>
    <div v-else-if="Warning.message" class="warning">
      <div>
        <span class="animate__animated animate__heartBeat animate__infinite" v-html="$t(Warning.message)"></span>
      </div>
    </div>
    <div v-else class="info">
      <div :class="classObjectCenter">
        <span
          v-if="!isPending && isPlayer"
          :class="classObjectTurnMessage">{{ $t(isTurn && 'your-turn' || 'other-turn') }}</span>
        <span
          v-if="GameMessage">{{ $t(GameMessage) }}</span>
      </div>
    </div>

    <Board/>

    <div class="ctrls">
      <button
        v-if="!isStarted"
        @click="startGame"
        :disabled="isDisabled">{{ $t('start-game') }}</button>
      <button
        v-if="isStarted && isPending && !isPlayer"
        @click="joinGame"
        :disabled="isDisabled">{{ $t('join-game') }}</button>
      <button
        v-if="isPlayer || isVisitor"
        @click="quitGame"
        :disabled="isDisabled">{{ $t('quit-game') }}</button>
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
  @Getter Warning!: ChessError
  @Getter Socket!: ChessSocketState
  @Getter ImagesLoaded!: boolean
  @Getter SessionLoaded!: boolean
  @Getter Player!: ChessPlayer
  @Getter isStarted!: boolean
  @Getter isPlayer!: boolean
  @Getter isVisitor!: boolean
  @Getter isPending!: boolean
  @Getter isTurn!: boolean

  get classObjectCenter (): VueElementClassObj {
    return {
      center: this.isPending || this.isVisitor
    }
  }

  get classObjectTurnMessage (): VueElementClassObj {
    return {
      /* eslint-disable @typescript-eslint/camelcase */
      animate__animated: this.isTurn,
      animate__pulse: this.isTurn,
      animate__infinite: this.isTurn
      /* eslint-enable */
    }
  }

  async created (): Promise<void> {
    await this.init()
    this.$store.subscribe(async (mutation) => {
      if ((!this.ImagesLoaded || !this.SessionLoaded) && mutation.type === 'SOCKET_ONOPEN') {
        await this.init()
      }
    })
  }

  get GameMessage (): string | undefined {
    if (this.isPending && this.isPlayer) {
      return 'wait'
    }

    if (!this.isPending && this.isPlayer) {
      return `player-${this.Player.color}`
    }

    if (!this.isPending && this.Player.isVisitor) {
      return 'started'
    }
  }

  get isDisabled (): boolean {
    return !this.Socket.isConnected
  }
}
</script>

<style lang="scss" scoped>
.chess {
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
  .error, .warning {
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
  .warning {
    div span {
      color: orange;
    }
  }
  .ctrls {
    margin-top: 1em;
  }
}
</style>
