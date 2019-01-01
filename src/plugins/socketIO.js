import socketio from 'socket.io-client'

export default {
  install (Vue, options) {
    Vue.prototype.$socketio = socketio
  }
}
