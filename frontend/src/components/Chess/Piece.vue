<template>
  <div
    v-if="canRender"
    class="chessboard-piece"
    :class="classObjectPiece"
    :data-col="col"
    :data-row="row"
    :draggable="draggable"
    @mouseover="onOver"
    @mouseout="onOut"
    @drop="onDrop"
    @dragover="onDragOver"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @dragstart="onDragStart"
    @dragend="onDragEnd">
    <div>
      <img :class="classObjectImage" :src="image" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import type { ActionMethod } from 'vuex'
import { Action, Getter } from 'vuex-class'

@Component
export default class Piece extends Vue {
  @Prop() private piece!: ChessPiece
  @Action('movePiece') movePiece!: ActionMethod
  @Action('startMoving') startMoving!: ActionMethod
  @Action('endMoving') endMoving!: ActionMethod
  @Action('validateMove') validateMove!: ActionMethod

  @Getter Images!: ChessPieceImage[]
  @Getter ImagesLoaded!: boolean
  @Getter SessionLoaded!: boolean
  @Getter isTurn!: boolean
  @Getter Player!: ChessPlayer
  @Getter isDisabled!: boolean

  hover = false
  hidden = false
  occupied = false
  animated = false

  get classObjectPiece (): VueElementClassObj {
    return {
      hover: this.hover,
      occupied: this.occupied,
      black: this.piece.color === 'b',
      white: this.piece.color === 'w'
    }
  }

  get classObjectImage (): VueElementClassObj {
    return {
      hidden: this.hidden,
      /* eslint-disable @typescript-eslint/camelcase */
      animate__animated: this.animated,
      animate__pulse2: this.animated,
      animate__infinite: this.animated,
      animate__faster: this.animated
      /* eslint-enable */
    }
  }

  created (): void {
    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'Connected':
          this.$data.isDisabled = !mutation.payload
          break
      }
    })
  }

  onDragStart (ev: DragEvent): void {
    this.hidden = true
    this.animated = false

    const dt = ev.dataTransfer as DataTransfer
    dt.setData('text/plain', this.piece.pos as string)

    if (this.image) {
      const img = new Image(45, 45)
      img.src = this.image
      dt.setDragImage(img, 22, 22)
    }

    this.startMoving(this.piece.pos)
  }

  onDragEnd (ev: DragEvent): void {
    (ev.dataTransfer as DataTransfer).clearData()

    this.hover = false
    this.hidden = false
    this.occupied = false
    this.animated = false

    this.endMoving()
  }

  async onDrop (ev: DragEvent): Promise<void> {
    ev.preventDefault()

    const from = (ev.dataTransfer as DataTransfer).getData('text') as ChessBoardPositions
    const to = this.piece.pos

    this.hover = false
    this.occupied = false
    this.animated = false

    this.movePiece({ from, to })
  }

  async onDragEnter (ev: DragEvent): Promise<void> {
    ev.preventDefault()

    const isValid = await this.validateMove(this.piece.pos)
    if (!isValid) {
      this.occupied = true
    }
    this.hover = true
  }

  onDragOver (ev: DragEvent): void {
    ev.preventDefault()
  }

  onDragLeave (ev: DragEvent): void {
    ev.preventDefault()
    this.hover = false
    this.occupied = false
  }

  onOver (): void {
    if (!this.hidden && this.draggable) {
      this.animated = true
    }
  }

  onOut (): void {
    this.animated = false
  }

  get draggable (): boolean {
    return this.isTurn &&
      !this.isDisabled &&
      this.Player.color === this.piece.color
  }

  get image (): string | undefined {
    return this.Images.find(image => image.name === this.piece.name && image.color === this.piece.color)?.svg
  }

  get col (): string | undefined {
    return this.piece.pos?.substr(0, 1)
  }

  get row (): string | undefined {
    return this.piece.pos?.substr(1, 1)
  }

  get canRender (): boolean {
    return this.ImagesLoaded && this.SessionLoaded
  }
}
</script>

<style lang="scss">
.chessboard-piece {
  box-sizing: border-box;

  position: absolute;
  width: calc(100% / 8);
  height: calc(100% / 8);

  &.hover { background-color: rgb(70, 168, 80); }
  &.occupied.hover { background-color: rgb(189, 82, 82); }

  &[draggable=true] { cursor: pointer; }
  &[draggable=false] { user-select: none; }

  &[data-col="a"] { left: 0; }
  &[data-col="b"] { left: calc(100% / 8 * 1); }
  &[data-col="c"] { left: calc(100% / 8 * 2); }
  &[data-col="d"] { left: calc(100% / 8 * 3); }
  &[data-col="e"] { left: calc(100% / 8 * 4); }
  &[data-col="f"] { left: calc(100% / 8 * 5); }
  &[data-col="g"] { left: calc(100% / 8 * 6); }
  &[data-col="h"] { left: calc(100% / 8 * 7); }
  &[data-row="1"] { top: calc(100% / 8 * 7); }
  &[data-row="2"] { top: calc(100% / 8 * 6); }
  &[data-row="3"] { top: calc(100% / 8 * 5); }
  &[data-row="4"] { top: calc(100% / 8 * 4); }
  &[data-row="5"] { top: calc(100% / 8 * 3); }
  &[data-row="6"] { top: calc(100% / 8 * 2); }
  &[data-row="7"] { top: calc(100% / 8 * 1); }
  &[data-row="8"] { top: 0; }

  div {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 45px;
    height: 45px;

    transform: translate(-50%, -50%);
    pointer-events: none;

    img {
      pointer-events: none;

      &.hidden {
        visibility: hidden;
      }
    }
  }
}

.black .black,
.white .white,
.animated .chessboard-piece {
  transition: left 0.5s, top 0.5s;
}
</style>
