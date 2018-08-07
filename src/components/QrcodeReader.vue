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
  <b-modal id="LoadingScreen" v-model="showLoading" title="One Moment Please...">
  </b-modal>

  <b-modal id="invoiceScreen" v-model="show_invoice" title="The Guest List.." @hidden="resumeCamera">
    <b-list-group>
      <b-list-group-item v-for="(item, item_index) in invoice.contents" :key="item_index">
        First Name: {{item.f_name}} <br /> Last Name: {{item.l_name}} <br /> Email Address: {{item.email}} <br /> Gender: {{item.gender}}
      </b-list-group-item>
    </b-list-group>
  </b-modal>
</b-container>
</template>

<script>
import {
  QrcodeReader
} from 'vue-qrcode-reader'
import axios from 'axios'
import swal from 'sweetalert2'

export default {

  components: {
    QrcodeReader
  },

  data: function() {
    return {
      pauseCamera: false,
      has_error: false,
      error: {},
      showLoading: false,
      show_invoice: false,
      invoice: {}
    }
  },
  methods: {
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
      this.pauseCamera = true
      this.showLoading = true
      let queryString = content.slice(1).split('&')
      let queryObject = {}
      queryString.forEach(function(pair) {
        pair = pair.split('=');
        queryObject[pair[0]] = decodeURIComponent(pair[1] || '');
      })
      let result = JSON.parse(JSON.stringify(queryObject))
      // this.$store.dispatch('LogToSlack', {
      //   headline: 'QueryString',
      //   log: result
      // })
      this.qrCodeData = result
      axios.create({
        withCredentials: true
      }).post(process.env.VUE_APP_API_URL + '/purchaseOrder/' + this.$route.params.eventId + '/' +
        this.qrCodeData.invoiceId + '/validate', this.qrCodeData).then((response) => {
        if (response.data.success) {
          this.invoice = response.data.invoice
          this.show_invoice = true
        } else if (response.data.success == false) {
          this.showLoading = false
          swal({
            title: response.data.message,
            text: response.data.message,
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
