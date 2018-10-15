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
        By entering your email address you confirm your RSVP, You will also recieve an E-Pass in your inbox.
      </p>
    </div>
    <div class="col-md-6 ">
      <form class="form" @submit.prevent="submitRSVPconfirmation">
        <div class="form-group">
          <input type="email" class="form-control" placeholder="Enter your email" v-model="confirmed_email"/>
          </div>
          <button type="submit" class="btn btn-success">Submit Confirmation</button>
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
  data() {
    return {
      confirmed_email: ''
    }
  },
  methods: {
    submitRSVPconfirmation() {
      let url = process.env.VUE_APP_API_URL + '/invite/' + this.$route.params.invite_id + '/rsvp_confirm'
      axios.create({
        withCredentials: true,
      }).post(url, this.$data).then((response) => {
        if (response.data.body != null) {
          swal({
            title: 'See You There, :)',
            text: 'Your E-Pass was sent to your email, don\'t forget it ;)',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>
