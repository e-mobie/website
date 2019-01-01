<template>
<div class="container mt-2 p-2">
  <div class="row">
    <div class="col">
      <h1>RSVP Confirmation</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6">
      <p>
        By entering your email address and verifing your information you are confirming your RSVP, You will also recieve an E-Pass in your inbox.
      </p>
    </div>
    <div class="col-md-6 ">
      <form class="form" @submit.prevent="submitRSVPconfirmation">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Your Name" v-model="username" />
        </div>
        <div class="form-group">
          <input type="date" class="form-control" v-model="dob" />
        </div>
        <div class="form-check">
          <input type="radio" class="form-check-input" name="male_person" id="male_person" />
          <label class="form-check-label" for="male_person">
            Male
          </label>
        </div>
        <div class="form-check">
          <input type="radio" class="form-check-input" male="female_person" id="female_person" />
          <label class="form-check-label" for="female_person">
            Female
          </label>
        </div>
        <div class="form-group">
          <input type="email" class="form-control" placeholder="Enter your email" v-model="confirmed_email" />
        </div>
        <div class="form-group">
          <input type="tel" class="form-control" placeholder="1-242-555-5555 (optional)" v-model="phone" />
        </div>
        <button type="submit" class="btn btn-success" :disabled="loading">Submit Confirmation</button>
      </form>
    </div>
  </div>
</div>
</template>

<style>

</style>

<script>
import swal from 'sweetalert2'
import axios from 'axios'
export default {
  //validate invite
  mounted() {
    let url = process.env.VUE_APP_API_URL + '/invite/' + this.$route.params.invite_id + '/validate'
    axios.get(url).then((response) => {
      // console.log(response.data);
      if (!response.data.valid) {
        swal({
          type: 'error',
          title: 'Invite Expired',
          text: 'Your invite is invalid'
        }).then((response) => {
          if (response.value) {
            this.$router.push({
              name: 'HomePage'
            })
          }
        })
      }
    })
  },
  data() {
    return {
      loading: false,
      confirmed_email: '',
      phone: '',
      dob: '',
      username: ''
    }
  },
  methods: {
    submitRSVPconfirmation() {
      this.loading = true
      let url = process.env.VUE_APP_API_URL + '/invite/' + this.$route.params.invite_id + '/rsvp_confirm'
      axios.create({
        withCredentials: true,
      }).post(url, this.$data).then((response) => {
        if (response.data.body != null) {
          swal({
            title: 'See You There, :)',
            text: 'Your E-Pass was sent to your email, don\'t forget it',
            type: 'success'
          }).then((result) => {
            if (result.value) {
              this.$router.push({
                name: 'HomePage'
              })
            }
          })
          this.loading = false
        } else {
          swal({
            title: 'Something is wrong',
            text: 'Are you sure everything is correct?',
            type: 'error'
          })
          this.loading = false
        }
      })
    }
  }
}
</script>
