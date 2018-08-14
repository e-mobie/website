<template>
<b-container>
  <b-row v-if="!hasResetToken">
    <b-col md="6" offset-md="3">
      <p>
        Enter the email address you signed up with. If it matches our records you will recieve a link in that email box to reset your password.
      </p>
      <b-form @submit.prevent="SubmitResetRequest">
        <b-form-group label="Email Address" label-for="email">
          <b-form-input id="email" type="email" required v-model="email" :disabled="linkSent"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary" :disabled="linkSent">Request Link</b-button>
        <b-button type="reset" variant="secondary" v-if="linkSent" @click="ResetData">I didn't get it.</b-button>
        <p v-if="linkSent">
          If you didn't get the email, then perhaps you used a different email address to sign up.
        </p>
      </b-form>
    </b-col>
  </b-row>
  <b-row v-else>
    <b-col md="6" offset-md="3">
      <p>
        Set a new password
      </p>
      <b-alert variant="warning" :show="hasError" v-for="e in error">{{e}}</b-alert>
      <b-form @submit.prevent="ValidateAndSubmit" ref="setNewPassword">
        <b-form-group label="New Password" label-for="new_password">
          <b-form-input id="new_password" type="password" required v-model="new_password"></b-form-input>
        </b-form-group>
        <b-form-group label="Confirm Password" label-for="confirm_password">
          <b-form-input id="confirm_password" type="password" required v-model="confirm_password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Set New Password</b-button>
      </b-form>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import axios from 'axios'
import swal from 'sweetalert2'
export default {
  data: function() {
    return {
      new_password: '',
      confirm_password: '',
      email: '',
      linkSent: false,
      error: []
    }
  },
  methods: {
    ResetData() {
      this.linkSent = false
      this.email = ''
    },
    SubmitResetRequest() {
      let url = process.env.VUE_APP_API_URL + '/Customer/requestPasswordReset'
      axios.create({
        withCredentials: true
      }).post(url, {
        email: this.email
      }).then((response) => {
        if (response.data == "OK") {
          this.linkSent = true
        }
      })
    },
    ValidateAndSubmit(e) {
      if (this.new_password.length < 6) {
        this.error.push('Password too Short, a minimum of 6 characters is required')
      }
      if (this.new_password != this.confirm_password) {
        this.error.push('Passwords do not match')
      }
      if (!this.hasError) {
        let url = process.env.VUE_APP_API_URL + '/Customer/resetpassword'
        let payload = {
          token: this.$route.query.token,
          new_password: this.confirm_password,
        }
        axios.create({
          withCredentials: true
        }).post(url, payload).then((response) => {
          if (response.data.success) {
            swal({
              title: 'Pasword Updated',
              text: response.data.message,
              type: 'success'
            }).then((response) => {
              if (response) {
                this.$router.push({
                  name: 'CustomerLogin'
                })
              }
            })
          }
        })
      }
    }
  },
  computed: {
    hasError() {
      if (this.error.length > 0) {
        return true
      } else {
        return false
      }
    },
    hasResetToken() {
      if (this.$route.query.token != null) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
