<template>
  <div>
    <Game/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Game from '@components/Chess/Game.vue'

@Component({
  components: {
    Game
  }
})
export default class Chess extends Vue { }
</script>

<style lang="scss"></style>
