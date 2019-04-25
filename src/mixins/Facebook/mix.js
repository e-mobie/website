import {
  loadFbSdk,
  getFbLoginStatus,
  fbLogin,
  fbLogout
} from './helpers.js'

export default {
  mounted () {
    loadFbSdk('367143787434033', 'v3.2')
      .then(getFbLoginStatus)
      .then(response => {
        if (response.status === 'connected') {
          this.$emit('fb-logged')
        }
      })
  }
}
