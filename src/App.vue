<template>
<span id="app">
    <NavigationBar></NavigationBar>
    <router-view></router-view>
  </span>
</template>

<script>
import NavigationBar from './components/NavigationBar.vue'
import EventView from './components/EventView.vue'
export default {

  name: 'app',
  components: {
    NavigationBar,
    EventView
  },
  created: function() {
    this.$store.dispatch('init')
  },
  /* eslint-disable no-console */
  sockets: {
    customerNotifications(data) {
      // console.log(data);
      switch (data.to) {
        case "all":
          switch (data.message) {
            case "Event Published":
              // this.$store.dispatch('UpdateEvents', data.redis.data)
              break;
            case "Event Canceled":
              // this.$store.dispatch('UpdateEvents', data.redis.data)
              break;
            case "Event Updated":
              // this.$store.dispatch('UpdateEvents', data.redis.data)
              break;
              // case "Event Deleted":
              //   this.$store.dispatch('RemoveEvent', data.redis.key)
              //   break;
            default:
              // console.log(data);
          }
          break;
        default:
      }
    }
  }
  /* eslint-enable no-console */
}
</script>
<style lang="scss">
@import './assets/index';
</style>
