<template>
<span id="app">
  <NavigationBar></NavigationBar>
  <router-view></router-view>
</span>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue'
import EventView from './components/EventView.vue'
import SocketIO from 'socket.io-client'
export default {
  name: 'e-mobie-homepage',
  components: {
    NavigationBar,
    EventView
  },
  data() {
    return {
      publicSocket: null
    }
  },
  created() {
    this.$store.dispatch('init')
  },
  mounted: function() {
    let socket = SocketIO(process.env.VUE_APP_API_URL)
    this.publicSocket = socket
    this.publicSocket.on('CUSTOMER_NOTIFICATION', (eventObject) => {
      switch (eventObject.message) {
        case 'EVENT_PUBLISHED':
          console.log(eventObject);
          this.$store.dispatch('events/addToPublishedEvents', eventObject)
          break;
        case 'EVENT_CANCELED':
          console.log(eventObject);
          this.$store.dispatch('events/removePublishedEvent', eventObject.redis.data._id)
        default:

      }
    })
  },
}
</script>
<style lang="scss">
@import './assets/index';
</style>
