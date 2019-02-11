<template>
<button class="btn btn-default" @click="toggleLogin">
  <span v-if="!loggedIn">Login with Facebook</span>
  <span v-else>Logout</span>
</button>
</template>

<script>
export default {
  name: 'fbLogin',
  mounted() {
    let LoadingFBSDK = new Promise(function(resolve, reject) {
      window.fbAsyncInit = function() {
        FB.init({
          appId: '367143787434033',
          cookie: true,
          xfbml: true,
          version: 'v3.2'
        });
        FB.AppEvents.logPageView();
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
          return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
      if (window.FB != null) {
        resolve(window.FB)
      } else {
        reject
      }
    });

    LoadingFBSDK.then((response) => {
      this.fbsdk = response
      response.getLoginStatus((response) => {
        console.log('Facebook login status');
        console.log(response);
        // updateLoginStatus(response)
        this.updateLoginStatus(response);
      })
    })
  },

  data() {
    return {
      status: 'unknown',
      authResponse: {},
      fbsdk: {}
    }
  },

  computed: {
    loggedIn() {
      switch (this.status) {
        case 'connected':
          return true
          break;

        case 'not_authorized':
          return false
          break;

        case 'unknown':
          return false
        default:
          return false;

      }
    }
  },
  methods: {
    updateLoginStatus(fbResponse) {
      console.log(fbResponse);
      this.status = fbResponse.status
      this.authResponse = fbResponse.authResponse
    },

    toggleLogin() {
      if (this.loggedIn) {
        this.fbsdk.logout(function(response) {
          console.log(response);
        })
      } else {
        this.fbsdk.login(this.updateLoginStatus(response))
      }
    }
  }
}
</script>

<style>


</style>
