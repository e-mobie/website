<template>
<b-modal ref="ticketCart" v-model="showCart" @hidden="$emit('ticket-cart-closed')">
  <div slot="modal-header" class="d-flex w-100 justify-content-between" v-if="ticketObj != null">
    <h4>Purchase: {{ticketObj.title}} </h4>
    <h5>
      <span v-if="ticketObj.price != null" class="badge badge-info">
        {{ticketCart.guestList.length}} &times; ${{ticketObj.price.toFixed(2)}}
      </span>
    </h5>
  </div>
  <b-container style="max-height: 600px; overflow-y: scroll;" id="ticketRell">
    <b-form ref="ticketCartForm">
      <b-list-group style="min-height: 450px;" ref="ticketRell" class="list-group-flush">
        <b-list-group-item v-for="(slot, slot_key) in ticketCart.guestList" :key="slot_key">
          <div class="d-flex w-100 justify-content-between">
            <h5>Ticket # {{slot_key + 1}}</h5>

            <b-button variant="danger" size="sm" @click="remove(slot_key)" :disabled="loading">Remove</b-button>
          </div>
          <span v-if="!slot.guest_spot">
            <b-form-group label="Full Name">
              <b-form-input type="text" required :id="slot_key + 'name'" v-model="slot.name" :disabled="loading || slot.signed_in"></b-form-input>
            </b-form-group>

            <b-form-group label="Email">
              <b-form-input type="email" required :id="slot_key + 'email'" v-model="slot.email" :disabled="loading || slot.signed_in"></b-form-input>
            </b-form-group>

            <b-form-group label="Birthday">
              <b-form-input type="date" required :id="slot_key + 'bday'" v-model="slot.dob" :disabled="loading || slot.signed_in"></b-form-input>
            </b-form-group>

            <b-form-group label="Phone Contact (optional)">
              <b-form-input type="tel" :id="slot_key + 'phone'" v-model="slot.phone" :disabled="loading"></b-form-input>
            </b-form-group>

            <!-- <b-form-group label="Gender" required>
                  <b-form-radio-group :id="slot_key + 'gender'" v-model="slot.gender" :disabled="loading || slot.signed_in">
                    <b-form-radio value="F">Female</b-form-radio>
                    <b-form-radio value="M">Male</b-form-radio>
                    <b-form-radio value="NS">Rather Not Say</b-form-radio>
                  </b-form-radio-group>
                </b-form-group> -->
          </span>

          <span v-else>
            Guest Pass
            <small>
              <i>
                For those that are not so sure if they'll make it... ;)
              </i>
            </small>
          </span>
        </b-list-group-item>
      </b-list-group>
    </b-form>
  </b-container>
  <div slot="modal-footer" class="d-flex w-100 justify-content-between">
    <b-button-group>
      <b-button variant="outline-info" @click="addRsvpSlot" :disabled="loading">Add RSVP Pass</b-button>
      <b-button variant="outline-info" @click="addGuestSlot" :disabled="loading">Add Guest Pass</b-button>
    </b-button-group>

    <b-button-group>
      <b-button variant="secondary" @click="closeTicketCart" :disabled="loading">Cancel</b-button>
      <b-button variant="success" @click="onTicketCartSubmit" :disabled="loading">Purchase</b-button>
    </b-button-group>
  </div>
</b-modal>
</template>

<style>
.modal-header {
  color: black;
}

.modal-footer {
  min-height: 0;
  background-color: white;
}
</style>

<script>
import axios from 'axios'
import swal from 'sweetalert2'
import $ from 'jquery'
export default {
  props: ['ticketObj', 'toggle'],
  data: function() {
    return {
      loading: false,
      ticketSelected: false,
      ticketCart: {
        eventId: "",
        ticket: {},
        purchaser: this.$store.state.user.user.email,
        guestList: [{
          name: this.$store.state.user.user.username,
          email: this.$store.state.user.user.email,
          dob: this.$store.state.user.user.dob,
          phone: "",
          guest_spot: false,
          scanned_in: false
        }]
      },
    }
  },
  computed: {
    showCart: {
      get: function() {
        if (this.ticketObj != null) {
          // this.$refs.ticketCart.show()
          return true
        } else {
          // this.$refs.ticketCart.hide()
          return false
        }
      },
      set: function(newValue) {
        return newValue
      }

    }
  },
  methods: {
    closeTicketCart() {
      this.ticketSelected = false
      this.$refs.ticketCart.hide()
    },
    remove(slot_key) {
      this.ticketCart.guestList.splice(slot_key, 1)
    },
    addRsvpSlot() {
      this.ticketCart.guestList.push({
        name: "",
        email: "",
        phone: "",
        dob: "",
        guest_spot: false,
        scanned_in: false,
      })
      let height = this.$refs.ticketRell.clientHeight
      $('#ticketRell').animate({
        scrollTop: height
      }, 500);

    },
    addGuestSlot() {
      this.ticketCart.guestList.push({
        guest_spot: true,
      })
      let height = this.$refs.ticketRell.clientHeight
      $('#ticketRell').animate({
        scrollTop: height
      }, 500);
    },

    onTicketCartSubmit: function() {
      this.ticketCart.eventId = this.ticketObj.eventId
      this.ticketCart.ticket = this.ticketObj
      this.ticketCart.purchaser = this.$store.state.user.user.email
      if (!this.$refs.ticketCartForm.checkValidity()) {
        this.$refs.ticketCartForm.reportValidity()
        return
      }
      this.loading = true
      axios.create({
        withCredentials: true
      }).post(process.env.VUE_APP_API_URL + '/tickets/' + this.ticketCart.eventId + '/purchase', this.ticketCart).then((response) => {
        this.loading = false
        if (response.data.success) {
          this.$store.dispatch('user/AddInvoice', response.data.data)
          swal({
            title: 'Purchase Complete',
            text: 'Your tickets are in your hub and we sent them to the email(s) provided',
            type: 'success'
          }).then((response) => {
            if (response.value) {
              this.$refs.ticketCart.hide()
              this.ticketCart = {
                ticket: {},
                purchaser: "",
                guestList: [{
                  name: "",
                  email: "",
                  dob: "",
                  phone: "",
                  guest_spot: false,
                  signed_in: false
                }]
              }
              this.ticketSelected = false
            }
          })
        } else {
          if (response.data.status == 401) {
            swal({
              title: response.data.message,
              text: response.data.message,
              type: 'error'
            }).then((response) => {
              if (response.value) {
                this.$router.push({
                  name: 'CustomerLogin'
                })
              }
            })
          } else {
            swal({
              title: response.data.message,
              text: response.data.message,
              type: 'error'
            })
          }
        }
      }).catch((e) => {
        this.loading = false
        swal({
          title: 'Fatal Error',
          text: e,
          type: 'error'
        })
      })
    },
  }
}
</script>
