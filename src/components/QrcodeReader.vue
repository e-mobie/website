<template>
<b-container>
  <b-alert variant="warning">Please allow E-Mobie to Access your devices' camera</b-alert>
  <b-alert variant="danger" :show="has_error">
    {{error.toString()}}
  </b-alert>
  <b-row>
    <b-col>
      <b-button variant="outline-info" :to="{ name: 'CustomerEventList'}">Back to Event Menu</b-button>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <qrcode-reader :paused="pauseCamera" @init="onInit" @decode="onDecode" @locate="onLocate" :track="repaintLocation"></qrcode-reader>
    </b-col>
  </b-row>
  <b-modal id="LoadingScreen" v-model="showLoading" title="One Moment Please..." hide-footer>
  </b-modal>

  <b-modal id="invoiceScreen" v-model="show_invoice" title="The Guest List.." @hidden="resumeCamera" @ok="submitConfirmed">
    Verify and confirm guest list
    <hr />
    <b-list-group>
      <b-list-group-item v-for="(item, item_index) in invoice.contents" :key="item_index" href="#" @click="addToConfirmed(item, item_index)" :disabled="!item.outstanding">
        <span v-if="item.outstanding" class="float-right">Click to Confirm</span>
        <font-awesome-icon :icon="checkIcon" v-if="!item.outstanding" class="float-right" size="lg" /> First Name: {{item.f_name}} <br /> Last Name: {{item.l_name}} <br /> Email Address: {{item.email}} <br /> Gender: {{item.gender}}
      </b-list-group-item>
    </b-list-group>
  </b-modal>
</b-container>
</template>

<script>
import {
  QrcodeReader
} from 'vue-qrcode-reader'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
import {
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import swal from 'sweetalert2'

export default {
  props: ['eventId'],
  components: {
    QrcodeReader,
    FontAwesomeIcon
  },

  data: function() {
    return {
      checkIcon: faCheckCircle,
      pauseCamera: false,
      has_error: false,
      error: {},
      showLoading: false,
      show_invoice: false,
      invoice: {},
      confirmed: []
    }
  },
  methods: {
    submitConfirmed() {
      let url = process.env.VUE_APP_API_URL + '/invoice/' + this.eventId + '/' + this.invoice._id + '/redeem'
      axios.create({
        withCredentials: true
      }).post(url, {
        purchaseOrderId: this.eventId,
        GuestList: this.confirmed
      }).then((results) => {
        this.confirmed = []
        console.log(results);
      })
    },
    addToConfirmed(item, item_index) {
      if (item.outstanding) {
        let currentConfirmedGuests = this.confirmed
        this.invoice.contents[item_index].outstanding = false
        currentConfirmedGuests.push(this.invoice.contents[item_index])
      }
    },
    resumeCamera() {
      this.pauseCamera = false
    },
    repaintLocation(location, ctx) {
      if (location !== null) {
        const {
          topLeftCorner,
          topRightCorner,
          bottomLeftCorner,
          bottomRightCorner,
        } = location

        ctx.strokeStyle = 'blue' // instead of red

        ctx.beginPath()
        ctx.moveTo(topLeftCorner.x, topLeftCorner.y)
        ctx.lineTo(bottomLeftCorner.x, bottomLeftCorner.y)
        ctx.lineTo(bottomRightCorner.x, bottomRightCorner.y)
        ctx.lineTo(topRightCorner.x, topRightCorner.y)
        ctx.lineTo(topLeftCorner.x, topLeftCorner.y)
        ctx.closePath()

        ctx.stroke()
      }
    },
    async onInit(promise) {
      // show loading indicator
      // this.cameraLoading = true
      try {
        await promise
        // this.cameraLoading = false
        // this.cameraOn = true

        // successfully initialized
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          // user denied camera access permisson
          this.has_error = true
          this.error = error
        } else if (error.name === 'NotFoundError') {
          // no suitable camera device installed
          this.has_error = true
          this.error = error
        } else if (error.name === 'NotSupportedError') {
          // page is not served over HTTPS (or localhost)
          this.has_error = true
          this.error = error
        } else if (error.name === 'NotReadableError') {
          // maybe camera is already in use
          this.has_error = true
          this.error = error
        } else if (error.name === 'OverconstrainedError') {
          this.has_error = true
          this.error = error
          // passed constraints don't match any camera. Did you requested the front camera although there is none?
        } else {
          // browser is probably lacking features (WebRTC, Canvas)
          this.has_error = true
          this.error = error
        }
      } finally {
        // hide loading indicator
        // this.cameraLoading = false
        // this.cameraOn = true
      }
    },
    onLocate: function(points) {
      if (points.length > 0) {
        this.found = true
      } else {
        this.found = false
      }
    },
    onDecode: function(content) {
      console.log(content);
      this.pauseCamera = true
      this.showLoading = true
      let queryString = content.slice(1).split('&')
      let queryObject = {}
      queryString.forEach(function(pair) {
        pair = pair.split('=');
        queryObject[pair[0]] = decodeURIComponent(pair[1] || '');
      })
      let result = JSON.parse(JSON.stringify(queryObject))
      this.$store.dispatch('LogToSlack', {
        headline: 'QueryString',
        log: result
      })
      this.qrCodeData = result
      axios.create({
        withCredentials: true
      }).post(process.env.VUE_APP_API_URL + '/purchaseOrder/' + this.eventId + '/' +
        this.qrCodeData.invoiceId + '/validate', this.qrCodeData).then((response) => {
        if (response.data.success) {
          this.invoice = response.data.invoice
          this.show_invoice = true
        } else if (response.data.success == false) {
          this.showLoading = false
          swal({
            title: response.data.message,
            text: response.data.error.message,
            type: 'error'
          }).then((result) => {
            this.pauseCamera = false
          })
        }
      }).catch((error) => {

        this.showLoading = false
        this.pauseCamera = false
        swal.showValidationError(error.message)
      })
    }
  }
}
</script>
