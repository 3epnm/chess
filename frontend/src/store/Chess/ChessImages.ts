import axios from 'axios'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import { CONFIG_IMAGES } from '../../config'

@Module
export default class ChessImages extends VuexModule {
  images: ChessPieceImage[] = []
  imagesLoaded = false

  @Mutation
  SET_IMAGES (images: ChessPieceImage[]) {
    this.images = images
    this.imagesLoaded = images.length === 12
  }

  @Action({ commit: 'SET_IMAGES' })
  async init () {
    const images: ChessPieceImage[] = []

    try {
      for (const c of 'bw'.split('')) {
        const color = c as ChessPieceColors
        for (const n of 'rnbqkp'.split('')) {
          const name = n as ChessPieceNames
          const { data: svg } = await axios.get(`${CONFIG_IMAGES}/${color}/${name}.svg`)

          images.push({
            color, name, svg: 'data:image/svg+xml;base64,' + btoa(svg)
          })
        }
      }

      return images
    } catch (err) {
      this.context.commit('ERROR', { code: 2, sender: 'Chess Images', message: 'Chess Images not found.', detail: 'Network Error', raw: err })
    }

    return []
  }

  get Images () { return this.images }
  get ImagesLoaded () { return this.imagesLoaded }
}
