<template>
<b-container fluid>
  <b-row>
    <b-col>
      <b-card :title="flyer.title" :img-src="flyerImg" img-top>
        <p class="card-text">
          <dl>
            <dt>
            Start
          </dt>
            <dd>
              {{StartTime}}
            </dd>
            <dt>
            Finish
          </dt>
            <dd>
              {{finishTime}}
            </dd>
            <dt>
            Description
          </dt>
            <dd>
              {{flyer.description}}
            </dd>
          </dl>
        </p>
      </b-card>
    </b-col>

    <b-col sm="4">
      <googleMap v-if="locationData != null" :showAutoComplete="false" :mapStyle="mapStyle" :MapMarker="locationData" :zoom="10"></googleMap>

      <b-card title="Tickets">
        <div v-if="tickets.length == 0">
          <p class="card-text">
            None Avaiable
          </p>
        </div>
        <b-list-group v-else>
          <b-list-group-item v-for="ticket in tickets" :key="ticket._id" @click="openPurchaseDiag(ticket)" flush>
            <b-media>
              <h5 class="mt-0">{{ticket.title}} | <small>{{ticket.paid_or_free}}</small></h5>
              <p>
                Avaiable: {{ticket.quantity_available}}
              </p>
              <p>
                {{ticket.description}}
              </p>
            </b-media>
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </b-col>
  </b-row>
  <b-modal ref="ticketCart" title="Purchase Tickets">
    <b-container style="max-height: 600px; overflow-y: scroll;" id="ticketRell">
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
      <b-button-group class="float-left">
        <b-button variant="outline-info" @click="addRsvpSlot" :disabled="loading">Add RSVP Pass</b-button>
        <b-button variant="outline-info" @click="addGuestSlot" :disabled="loading">Add Guest Pass</b-button>
      </b-button-group>

      <b-button-group class="float-right">
        <b-button variant="secondary" @click="closeTicketCart" :disabled="loading">Cancel</b-button>
        <b-button variant="success" @click="onTicketCartSubmit" :disabled="loading">Purchase</b-button>
      </b-button-group>
    </div>
  </b-modal>
</b-container>
</template>

<style>

</style>

<script>
import Loader from 'vue-spinner/src/PulseLoader.vue'
import googleMap from './Utilities/GoogleMapComponent.vue'
import swal from 'sweetalert2'
import moment from 'moment'
import axios from 'axios'
import $ from 'jquery'
export default {
  components: {
    Loader,
    googleMap,
  },
  data() {
    return {
      mapStyle: {
        width: '100%',
        height: '400px'
      },
      loading: false,
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
      }
    }
  },
  created: function() {
    this.$store.dispatch('events/findPublicEvent', this.$route.params)
  },
  computed: {
    flyer() {
      return this.$store.state.events.flyer
    },
    tickets() {
      return this.$store.getters['events/tickets']
    },
    flyerImg() {
      if (this.$store.getters['events/flyerImg'] != null) {
        return this.$store.getters['events/flyerImg'].src
      }
      return "#"
    },
    StartTime() {
      return moment.utc(this.flyer.startTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
    finishTime() {
      return moment.utc(this.flyer.finishTime).local().format("dddd, MMMM Do YYYY, h:mm a")
    },
    locationData() {
      if (this.flyer.location != null) {
        return JSON.parse(this.flyer.location)
      } else {
        return {
          geometry: {
            lat: 25.06,
            lng: -77.345
          }
        }
      }
    },
  },
  methods: {
    closeTicketCart() {
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
    openPurchaseDiag: function(ticketDetails) {
      if (ticketDetails.quantity_available > 0) {
        let info = {}
        if (this.$store.state.user.user.email) {
          this.ticketCart.ticket = ticketDetails
          this.ticketCart.eventId = ticketDetails.eventId,
            this.ticketCart.purchaser = this.$store.state.user.user.email

          this.$refs.ticketCart.show()
        } else {
          swal({
            title: 'Not Logged In',
            text: "Only E-mobie User's can purchase tickets, please Sign-In or Sign-Up :)",
            type: "info"
          }).then((response) => {
            if (response.value) {
              this.$router.push({
                name: 'CustomerLogin'
              })
            }
          })
        }
      } else {
        swal({
          title: "Sold Out :O",
          text: "Sorry that ticket is sold out",
          type: "warning"
        })
      }
    },

    updateTickets: function(notificationData) {
      let tempArray = this.Tickets
      for (var i = 0; i < tempArray.length; i++) {
        if (tempArray[i]._id == notificationData._id) {
          tempArray.splice(i, 1, notificationData)
        }
      }
      this.Tickets = tempArray
    }
  },

  sockets: {
    customerNotifications(data) {
      switch (data.to) {
        case "all":
          switch (data.message) {
            case "Ticket Sale":
              this.$store.dispatch('events/SaleNotice', data.sale)
              break;
            default:

          }
          break;
        default:

      }
    },
    ticketUpdate(data) {
      switch (data.message) {
        case "Ticket Deleted":
          let current_tickets = this.flyer.tickets
          let current_position = current_tickets.findIndex((element) => {
            if (element._id == data.ticket._id) {
              return true
            } else {
              return false
            }
          })
          if (current_position != -1) {
            current_tickets.splice(current_position, 1)
            this.flyer.tickets = current_tickets
          }
          break;
          // case "Ticket Sold":
          //   let sold_position = this.tickets.findIndex((element) => {
          //     if (element._id == data.ticket._id) {
          //       return true
          //     } else {
          //       return false
          //     }
          //   })
          //
          //   if (sold_position != -1) {
          //     this.tickets[sold_position].quantity_available = this.tickets[sold_position].quantity_available - data.resolved_qty
          //   }
          //   break;
        default:

      }
    },
  }
}
</script>
