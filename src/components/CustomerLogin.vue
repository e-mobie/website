<template>
<b-container class="mt-5">
  <b-row align-h="center">
    <b-col sm="6" align-self="center">
      <b-card title="Sign In">
        <b-form @submit="onSubmit">
          <b-form-group label="Email Address">
            <b-form-input type="email" v-model="user.email" required :disabled="loading">
            </b-form-input>
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input type="password" v-model="user.password" required :disabled="loading"></b-form-input>
          </b-form-group>
          <b-button-group class="d-flex justify-content-center">
            <b-button type="submit" variant="info" :disabled="loading">Sign In</b-button>
            <b-button variant="secondary" :disabled="loading" :to="{name: 'CustomerRegister'}">Sign Up</b-button>
          </b-button-group>
          <b-button-group class="d-flex justify-content-center m-2">
            <button class="btn btn-outline-primary btn-sm" @click.prevent="facebookLogin">
              <FontAwesomeIcon :icon="facebookIcon" size="2x"></FontAwesomeIcon>
              Login with facebook
            </button>
          </b-button-group>
          <router-link :to="{ name: 'PasswordReset', params: {} }">Forgot Password</router-link>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
  <div class="background-image">
    <img src="@/assets/css/images/emobielogocomplete.png" />
  </div>
</b-container>
</template>

<style type="scss">
body {
  background-color: white;
}

.background-image img {
  height: 50%;
  width: 50%;
  position: relative;
  left: 52%;
}

.background-image {
  z-index: -1;
  display: flex;
  bottom: -15%;
  position: absolute;
}
</style>

<script>
import fblogin from '../mixins/Facebook/mix.js'
import swal from 'sweetalert2'
import facebookLogin from 'facebook-login-vuejs';
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
import {
  faFacebook
} from '@fortawesome/free-brands-svg-icons';

export default {
  mixins: [fblogin],
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      facebookIcon: faFacebook,
      loading: false,
      user: {
        email: "",
        password: ""
      }
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.loading = true,
        this.$store.dispatch('user/LoginUser', this.$data.user).then((response) => {
          if (response.success) {
            console.log(response);
            this.loading = false
            swal({
              title: "Welcome!",
              text: response.data.user.username,
              type: 'success'
            }).then((result) => {
              if (this.$route.query.redirect != null) {
                this.$router.push(this.$route.query.redirect)
              } else {
                this.$router.push({
                  name: 'HomePage'
                })
              }
            })
          }
        }).catch((error) => {
          this.loading = false
          if (error.status == 401) {
            swal({
              title: error.message,
              text: 'Something is wrong with the info',
              type: 'error'
            })
          }
        })
    }
  }
}
</script>
