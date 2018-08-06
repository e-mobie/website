<template>
<b-modal ref="ticketCart" title="Purchase Tickets" v-model="showCart" @hidden="$emit('ticket-cart-closed')">
  <b-container v-if="!ticketSelected">
    <p>
      Which ticket do you want?
    </p>
    <b-list-group>
      <b-list-group-item v-for="ticket in eventObj.tickets" :key="ticket._id" @click="setTicket(ticket)">
        <h5>{{ticket.title}}</h5>
        <p>
          Fees ${{ticket.price.toFixed(2)}}
        </p>
        <p>
          {{ticket.description}}
        </p>
      </b-list-group-item>
    </b-list-group>
  </b-container>
  <b-container style="max-height: 600px; overflow-y: scroll;" id="ticketRell" v-if="ticketSelected">
    <h5>
      ${{ticketCart.ticket.price.toFixed(2)}} - {{ticketCart.ticket.title}}
    </h5>
    <b-form ref="ticketCartForm">
      <b-list-group style="min-height: 450px;" ref="ticketRell">
        <b-list-group-item v-for="(slot, slot_key) in ticketCart.guestList" :key="slot_key">
          <div class="d-flex w-100 justify-content-between">
            <h5>Ticket # {{slot_key + 1}}</h5>

            <b-button variant="danger" size="sm" @click="remove(slot_key)" :disabled="loading">Remove</b-button>
          </div>
          <span v-if="!slot.guest_spot">
                <b-form-group label="First Name">
                  <b-form-input type="text" required :id="slot_key + 'f_name'" v-model="slot.f_name" :disabled="loading"></b-form-input>
                </b-form-group>

                <b-form-group label="Last Name">
                  <b-form-input type="text" required :id="slot_key + 'l_name'" v-model="slot.l_name" :disabled="loading"></b-form-input>
                </b-form-group>

                <b-form-group label="Email">
                  <b-form-input type="email" required :id="slot_key + 'email'" v-model="slot.email" :disabled="loading"></b-form-input>
                </b-form-group>

                <b-form-group label="Birthday">
                  <b-form-input type="date" required :id="slot_key + 'bday'" v-model="slot.dob" :disabled="loading"></b-form-input>
                </b-form-group>

                <b-form-group label="Phone Contact (optional)">
                  <b-form-input type="tel" :id="slot_key + 'phone'" v-model="slot.phone" :disabled="loading"></b-form-input>
                </b-form-group>

                <b-form-group label="Gender" required>
                  <b-form-radio-group :id="slot_key + 'gender'" v-model="slot.gender" :disabled="loading">
                    <b-form-radio value="F">Female</b-form-radio>
                    <b-form-radio value="M">Male</b-form-radio>
                    <b-form-radio value="NS">Rather Not Say</b-form-radio>
                  </b-form-radio-group>
                </b-form-group>
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
  <div slot="modal-footer" class="w-100">
    <b-button-group class="float-left" v-if="ticketSelected">
      <b-button variant="outline-info" @click="addRsvpSlot" :disabled="loading">Add RSVP Pass</b-button>
      <b-button variant="outline-info" @click="addGuestSlot" :disabled="loading">Add Guest Pass</b-button>
    </b-button-group>

    <b-button-group class="float-right" v-if="ticketSelected">
      <b-button variant="secondary" @click="closeTicketCart" :disabled="loading">Cancel</b-button>
      <b-button variant="success" @click="onTicketCartSubmit" :disabled="loading">Purchase</b-button>
    </b-button-group>
    <b-button variant="secondary" @click="closeTicketCart" :disabled="loading" v-if="!ticketSelected">Cancel</b-button>
  </div>
</b-modal>
</template>

<script>
import axios from 'axios'
import swal from 'sweetalert2'
export default {
  props: ['eventObj', 'toggle'],
  data: function() {
    return {
      loading: false,
      ticketSelected: false,
      ticketCart: {
        eventId: "",
        ticket: {},
        purchaser: "",
        guestList: [{
          f_name: "",
          l_name: "",
          email: "",
          dob: "",
          phone: "",
          gender: "NS",
          guest_spot: false
        }]
      },
    }
  },
  computed: {
    showCart: {
      get: function() {
        if (this.toggle) {
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
    setTicket(ticket) {
      if (ticket.quantity_available > 0) {
        this.ticketCart.ticket = ticket
        this.ticketSelected = true
      } else {
        swal({
          title: "Sold Out",
          text: "These tickets are sold out",
          type: "warning"
        })
      }
    },
    closeTicketCart() {
      this.ticketSelected = false
      this.$refs.ticketCart.hide()
    },
    remove(slot_key) {
      this.ticketCart.guestList.splice(slot_key, 1)
    },
    addRsvpSlot() {
      this.ticketCart.guestList.push({
        f_name: "",
        l_name: "",
        gender: "F",
        email: "",
        phone: "",
        dob: "",
        guest_spot: false
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
      this.ticketCart.eventId = this.eventObj._id
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
            text: 'Your tickets are in your hub',
            type: 'success'
          }).then((response) => {
            if (response.value) {
              this.$refs.ticketCart.hide()
              this.ticketCart = {
                ticket: {},
                purchaser: "",
                guestList: [{
                  f_name: "",
                  l_name: "",
                  email: "",
                  dob: "",
                  phone: "",
                  gender: "NS",
                  guest_spot: false
                }]
              }
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
