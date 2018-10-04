<template>
<b-container>
  <b-button :to="{ name: 'CustomerTickets' }" variant="outline-info"> Back to Menu</b-button>
  <hr />
  <vue-qr :text="qrcode" :height="60" :width="60"></vue-qr>

  <h5>Ticket: {{ event_title }}</h5>
  <p>
    From: {{start}} <br /> To: {{ finish }}
  </p>
  <b-list-group>
    <b-list-group-item v-if="guests.lenght > 0" v-for="(guest_pass, guest_index) in guests" @click="showQr(guest_index, 'guest')">
      Guest Pass # {{ guest_index + 1}}
    </b-list-group-item>
    <b-list-group-item v-for="(spot, spot_index) in rsvp" :key="spot_index" @click="showQr(spot_index, 'rsvp')">
      {{spot.name}} <br /> {{spot.email}}
    </b-list-group-item>
  </b-list-group>
</b-container>
</template>

<script>
import VueQr from 'vue-qr'
import moment from 'moment'
import swal from 'sweetalert2'
import axios from 'axios'
export default {
  components: {
    VueQr
  },
  data() {
    return {
      invoice_data: this.$store.state.user.selected_invoice,
      carrier_eCode: null
    }
  },

  computed: {
    qrcode() {
      if (this.invoice_data != null) {
        return "?eventId=" + this.invoice_data.eventId._id + "&invoiceId=" + this.invoice_data._id + "&isPurchaser=true"
      }
    },
    start() {
      if (this.invoice_data.eventId != null) {
        return moment(this.invoice_data.eventId.startTime).format("dddd, MMMM Do, YYYY - hh:mm a")
      }
    },
    finish() {
      if (this.invoice_data.eventId != null) {
        return moment(this.invoice_data.eventId.finishTime).format("dddd, MMMM Do, YYYY - hh:mm a")
      }
    },
    rsvp() {
      if (this.invoice_data.rsvp_list != null) {
        return this.invoice_data.rsvp_list
      }
      return []
    },
    guests() {
      if (this.invoice_data.guest_passes != null) {
        return this.invoice_data.guest_passes
      }
      return []
    },
    event_title() {
      if (this.invoice_data.eventId != null) {
        return this.invoice_data.eventId.title
      }
      return " "
    }
  },

  methods: {
    confirmDelete() {
      swal({
        title: "Are you sure?",
        text: "Once it's gone...IT'S GONE FOREVER!!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.$store.dispatch('user/deleteCustomerInvoice', this.invoice_data._id).then((response) => {
            if (response.success) {
              swal({
                title: 'Deleted!',
                text: 'Your Invoice has been deleted',
                type: 'success'
              }).then((result) => {
                if (result.value) {
                  this.$router.go(-1)
                }
              })
            }
          })
        }
      })
    },

    showQr(index, list) {
      const awesomeqr = require('../../../assets/awesome-qr/awesome-qr.js');
      let listSpot = 'invoiceId=' + this.invoice_data._id + '&list=' + list + '&index=' + index + '&eventId=' + this.invoice_data.eventId._id
      awesomeqr.eventUtil.create({
        text: listSpot,
        size: 350,
        callback: (data) => {
          this.carrier_eCode = data
        }
      });

      $('#eCodeCarrier').modal('toggle')
    }
  }
}
</script>
