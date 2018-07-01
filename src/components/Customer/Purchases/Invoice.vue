<template>
<b-container>
  <b-button variant="danger" @click="confirmDelete">Delete</b-button>
  <b-button variant="success" @click="showPurchaserCode">E-Code</b-button>
  <h5>Event Title</h5>
  <p>
    From: {{ start }} <br/> To: {{ finish }} <br/> Ticket: {{ event_title }}
  </p>
  <b-card title="Guest List">
    <p>
      {{rsvp.length}} RSVP's, {{guests.length}} Guest spot(s)
    </p>
    <b-list-group>
      <b-list-group-item v-if="guests.length > 0" button v-for="(guest_pass, guest_index) in guests" @click="showQr(guest_index, 'guest')">
        Guest Pass # {{ guest_index + 1}}
      </b-list-group-item>
      <b-list-group-item button v-for="(spot, spot_index) in rsvp" :key="spot_index" @click="showQr(spot_index, 'rsvp')">
        {{spot.f_name}} {{spot.l_name}}
        <br /> {{spot.email}}
      </b-list-group-item>
    </b-list-group>
  </b-card>

  <b-modal id="list_eCode" ref="list_eCode">
    <vqr :text="eCode"></vqr>
  </b-modal>
</b-container>
</template>

<style>

</style>

<script>
import moment from 'moment'
import swal from 'sweetalert2'
import axios from 'axios'
import vqr from 'vue-qr'
export default {
  components: {
    vqr
  },
  data: function() {
    return {
      invoice_data: {},
      eCode: ''
    }
  },
  mounted: function() {
    let url = process.env.VUE_APP_API_URL + '/invoice/' + this.$route.params.invoiceId
    axios.create({
      withCredentials: true
    }).get(url).then((response) => {
      this.invoice_data = response.data
    })
  },
  computed: {
    qrcode() {
      if (this.invoice_data != null) {
        return "?eventId=" + this.invoice_data.eventId._id + "&invoiceId=" + this.invoice_data._id + "&isPurchaer=1"
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
    showPurchaserCode() {
      this.eCode = this.qrcode
      this.$refs.list_eCode.show()
    },
    showQr(index, list) {
      if (list = 'rsvp') {
        this.eCode = "?eventId=" + this.invoice_data.eventId._id + "&invoiceId=" + this.invoice_data._id + "&list=rsvp" + "&index=" + index
      } else if (list = 'guest') {
        this.eCode = "?eventId=" + this.invoice_data.eventId._id + "&invoiceId=" + this.invoice_data._id + "&list=guest" + "&index=" + index
      }
      this.$refs.list_eCode.show()
    }
  }
}
</script>
