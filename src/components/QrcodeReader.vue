<template>
<span>
  <div class="container">
    <div class="row p-3">
      <div class="col">
        <router-link class="btn btn-outline-default" :to="{ name: 'CustomerEventList'}">Back to Event Menu</router-link>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="alert alert-primary">Please allow E-Mobie to Access your devices' camera</div>
        <div class="alert alert-danger" v-if="has_error">
          {{error.toString()}}
        </div>
      </div>
    </div>
    <qrcode-stream :paused="pauseCamera" @init="onInit" @decode="onDecode" @locate="onLocate" :track="repaintLocation"></qrcode-stream>

  </div>

  <div class="modal" tabindex="-1" role="dialog" id="LoadingScreen" v-model="showLoading">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">One Moment Please....</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>
            Loading...
          </p>
        </div>
      </div>
    </div>
  </div>

  <b-modal ref="invoice_Screen_modal" id="invoice_Screen" title="Invoice Guest List" @ok="submitConfirmed">
    <p>
      Verify and confirm guest list.
    </p>
    <div class="list-group">
      <rsvp-item v-for="(item, item_index) in invoice.contents" :key="item_index" :item="item" :array_index="item_index" v-on:guest_verified="addToConfirmed"></rsvp-item>
    </div>
  </b-modal>
</span>
</template>

<script>
import rsvpItem from './Utilities/invoice_item_rsvp.vue'
import {
  QrcodeStream
} from 'vue-qrcode-reader'
import axios from 'axios'
import swal from 'sweetalert2'

export default {
  props: ['eventId'],
  components: {
    QrcodeStream,
    rsvpItem
  },

  data: function() {
    return {
      pauseCamera: false,
      has_error: false,
      error: '',
      showLoading: false,
      show_invoice: false,
      invoice: {},
      confirmed: []
    }
  },
  methods: {
    submitConfirmed() {
      let url = process.env.VUE_APP_API_URL + '/invoice/' + this.invoice._id + '/redeemqr'
      axios.create({
        withCredentials: true
      }).post(url, {
        scanner_event_id: this.eventId,
        GuestList: this.confirmed
      }).then((results) => {
        this.confirmed = []
        if (results.data.success) {
          swal.fire({
            type: 'success',
            title: 'Checked In',
            text: 'Invoice Updated'
          })
          this.pauseCamera = false
        }
      })
    },
    addToConfirmed(item) {
      console.log(item);
      // if (item.outstanding) {
      let currentConfirmedGuests = this.confirmed
      if (this.invoice.contents[item.index].outstanding != null) {
        this.invoice.contents[item.index].outstanding = false
        this.invoice.contents[item.index].scanned_in = true
      } else {
        this.invoice.contents[item.index].scanned_in = true
      }
      currentConfirmedGuests.push(item)
      // }
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
      this.cameraLoading = true
      try {
        await promise
        this.cameraLoading = false
        this.cameraOn = true

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
        this.cameraLoading = false
        this.cameraOn = true
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
      let qrData = JSON.parse('{"' + decodeURI(content.replace('?', '').replace(/&/g, "\",\"").replace(/=/g, "\":\"")) + '"}')
      console.log(qrData);
      qrData.scanner_event_id = this.eventId

      axios.create({
        withCredentials: true
      }).post(process.env.VUE_APP_API_URL + '/invoice/' + qrData.invoiceId + '/verifyQr', qrData).then((response) => {
        console.log(response);
        this.$store.dispatch('LogToSlack', {
          headline: 'Testing Api Response',
          log: response
        })
        if (response.data.success) {
          this.invoice = response.data.invoice
          // show invoice
          console.log(this.invoice)
          this.$refs.invoice_Screen_modal.show()
        } else if (response.data.success == false) {
          this.showLoading = false
          if (response.data.message != null) {
            swal({
              title: response.data.message,
              text: response.data.message,
              type: 'error'
            }).then((result) => {
              this.pauseCamera = false
            })
          } else {
            swal({
              title: response.data.message,
              text: response.data.message,
              type: 'error'
            }).then((result) => {
              this.pauseCamera = false
            })
          }
        }
      }).catch((error) => {
        console.log(error);
        this.showLoading = false
        this.pauseCamera = false
        swal.showValidationMessage(error.message)
      })
    }
  }
}
</script>
<style lang="css">
.qrcode-stream {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
}
.qrcode-stream__inner-wrapper {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  z-index: 0;
}
.qrcode-stream__overlay,
.qrcode-stream__tracking-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.qrcode-stream__camera,
.qrcode-stream__pause-frame {
  display: block;
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
}
</style>
