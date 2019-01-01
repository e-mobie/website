<template>
<b-container class="pt-5">
  <b-card title="E-Mobie Registration">
    <b-form @submit="onSubmit">
      <b-form-group label="Name">
        <b-form-input type="text" v-model="user.username" required></b-form-input>
      </b-form-group>

      <b-form-group label="Email">
        <b-form-input type="email" v-model="user.email" required></b-form-input>
      </b-form-group>

      <b-form-group label="Password">
        <b-form-input type="password" v-model="user.password" required></b-form-input>
      </b-form-group>

      <b-form-group label="Password Confirmation">
        <b-form-input type="password" v-model="user.password_confirm" required></b-form-input>
      </b-form-group>

      <b-form-group label="Birthday">
        <b-form-input type="date" v-model="user.dob" required></b-form-input>
      </b-form-group>

      <b-form-group label="Phone (optional)">
        <b-form-input type="tel" v-model="user.phone"></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="success" :disabled="loading">Sign Up</b-button>
    </b-form>
  </b-card>
</b-container>
</template>

<style>

</style>

<script>
import axios from 'axios'
import swal from 'sweetalert2'
export default {
  data: function() {
    return {
      loading: false,
      user: {
        username: "",
        email: "",
        password: "",
        password_confirm: "",
        dob: "",
        phone: ""
      }
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.loading = true
      axios.post(process.env.VUE_APP_API_URL + '/Customer/Register', this.user).then((response) => {
        this.loading = false
        if (!response.data.error) {
          if (response.data.success) {
            swal({
              title: 'Registration Complete',
              text: 'We\'ve saved your credentials',
              type: 'success'
            }).then((result) => {
              if (result.value) {
                this.$store.dispatch('user/LoginUser', this.user).then((response) => {
                  if (response.success) {
                    this.$store.dispatch('loadTickets')
                    this.$router.push({
                      name: 'HomePage'
                    })
                  }
                })
              }
            })
          } else {
            swal({
              title: 'Registraiont Failed',
              text: 'Looks like those credentials are in use',
              type: 'error'
            })
          }
        }
      }).catch((e) => {
        this.loading = false
        swal({
          title: 'There seems to be a problem',
          text: e,
          type: 'error'
        })
      })
    }
  }
}
</script>
