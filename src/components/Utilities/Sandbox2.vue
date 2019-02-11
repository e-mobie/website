<template>
<button class="btn btn-default" @click="activateLogin">Login With Facebook-passportjs</button>
</template>

<script>
import axios from 'axios'
export default {
  methods: {
    activateLogin() {
      axios.get(process.env.VUE_APP_API_URL + '/Customer/auth/facebook').then(console.log(response))
    }
  }
}
</script>

<style>

</style>
