<template>
  <div class="home">
    <chess/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Chess from '@components/Chess.vue'

@Component({
  components: {
    Chess
  }
})
export default class Home extends Vue { }
</script>
