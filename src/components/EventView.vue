<template>
<span>
  <section id="showcase" class="showcase grid">

    <div class="overlay"></div>


    <div class="details-card-container detail-grid">
      <div class="row">
        <div class="col">
          <!-- Image Showcase -->
          <div class="p-2" style="text-align: center;">
            <!-- Position div  -->
            <div class="details-img-container detail-grid-box1" style="display: inline-block;">
              <!-- Size div -->
              <img :src="flyerImg" class="img-thumbnail">
            </div>
          </div>
          <div class=" m-3" style="max-width: 450px; text-align: center;">
            <img src="https://via.placeholder.com/100" alt="..." class="img-thumbnail m-1">
            <img src="https://via.placeholder.com/100" alt="..." class="img-thumbnail m-1">
            <img src="https://via.placeholder.com/100" alt="..." class="img-thumbnail m-1">
            <img src="https://via.placeholder.com/100" alt="..." class="img-thumbnail m-1">
            <img src="https://via.placeholder.com/100" alt="..." class="img-thumbnail m-1">
          </div>

        </div>
        <div class="col-md-6">
          <div class="details-info-container detail-grid-box2 p-3">
            <button class="detail-price">Public</button>

            <h1>{{flyer.title}}</h1>

            <p>{{flyer.description}}</p>

            <h3>General Information</h3>


            <div class="general-info">

              <div class="info">
                <span class="icon"><i class="fas fa-map-marker-alt"></i></span>
                <p>Location: {{locationData.formatted_address}}</p>
              </div>


              <div class="info">
                <span class="icon"><i class="fas fa-dollar-sign"></i></span>
                <p>Fees: <span v-if="event_has_tickets">${{min_price}} <span v-if="min_price != max_price">- ${{max_price}}</span></span>
                  <span v-else>No Fees</span></p>
              </div>


              <div class="info">
                <span class="icon"><i class="fas fa-calendar-week"></i></span>
                <p>{{StartDay}} <span v-if="!is_oneDay">- {{FinishDay}}</span></p>
              </div>


              <div class="info">
                <span class="icon"><i class="far fa-clock"></i></span>
                <p>{{StartTime}} - {{FinishTime}}</p>
              </div>

            </div>


            <h1>Tickets</h1>

            <div class="tickets">
              <ul class="list-group list-group-flush">
                <li class="list-group-item ticket-stub" v-for="ticket in tickets" :key="ticket._id" @click="purchaseTicket(ticket)">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{ticket.title}}</h5>
                    <p>
                      <span class="badge badge-primary ">
                        <font-awesome-icon :icon="moneyIcon"></font-awesome-icon>
                        {{ticket.paid_or_free}}
                      </span> &nbsp;
                      <span class="badge badge-primary">
                        <font-awesome-icon :icon="ticketIcon"></font-awesome-icon>
                        {{ticket.quantity_available}}
                      </span>
                    </p>
                  </div>
                  <p>
                    {{ticket.description}}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>


  </section>

  <footer>
    <div class="bottom-nav-container">
      <ul class="bottom-nav">
        <li><a href="#">Entertainment</a></li>
        <li><a href="#">Outdoor Adventures</a></li>
        <li><a href="#">Networking</a></li>
        <li><a href="#">About Us</a></li>
        <li><a href="#">Contact Us</a></li>
      </ul>
    </div>
    <div id="social_media">
      <ul>
        <li>
          <a href="#"><i class="fab fa-twitter"></i></a>
        </li>
        <li>
          <a href="#"><i class="fab fa-facebook-f"></i></a>

        </li>

        <li>
          <a href="#"><i class="fab fa-instagram"></i></a>
        </li>
        <li>
          <a href="#"><i class="fab fa-youtube"></i></a>
        </li>
      </ul>
    </div>
    <p> &copy;2019 | E-MOBiE. All Rights Reserved.</p>
    <div id="signature">
      <h4>Designed By:</h4>
      <a href="http://www.khariwoods.com/">
        <img src="@/assets/css/images/khariwoods.png">
      </a>
    </div>
  </footer>

  <ticket-cart :ticketObj="selectedTicket" v-on:ticket-cart-closed="refreshTicketCart"></ticket-cart>
</span>
</template>

<style lang="scss">
.ticket-stub:hover {
    z-index: 2;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}

.ticket-card {
    padding: 0 !important;
    width: 100% !important;
    min-height: 0 !important;
    margin: 1rem !important;
    display: inline-block;
}
</style>

<script>
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
import {
  faMapMarkerAlt,
  faTicketAlt,
  faQrcode,
  faDollarSign,
  faCalendarAlt,
  faClock
} from '@fortawesome/free-solid-svg-icons';

import Loader from 'vue-spinner/src/PulseLoader.vue'
import googleMap from './Utilities/GoogleMapComponent.vue'
import swal from 'sweetalert2'
import moment from 'moment'
import axios from 'axios'
import TicketCart from './Utilities/TicketCart.vue'
import $ from 'jquery'
export default {
  components: {
    Loader,
    googleMap,
    TicketCart,
    FontAwesomeIcon
  },
  data() {
    return {
      mapStyle: {
        width: '100%',
        height: '400px'
      },
      ticketCartObj: {},
      selectedTicket: null,
      clockIcon: faClock,
      calendarIcon: faCalendarAlt,
      ticketIcon: faQrcode,
      mapIcon: faMapMarkerAlt,
      moneyIcon: faDollarSign
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
    StartDay() {
      // return this.flyer.startTime
      return moment(this.flyer.startTime).format("dddd, MMMM Do YYYY")
    },
    is_oneDay() {
      return moment(this.flyer.startTime).isSame(this.flyer.finishTime, 'day')
    },
    FinishDay() {
      return moment(this.flyer.finishTime).local().format("dddd, MMMM Do YYYY")
    },
    StartTime() {
      return moment(this.flyer.startTime).format("h:mm a")
    },
    FinishTime() {
      return moment(this.flyer.finishTime).format("h:mm a")
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
    event_has_tickets() {
      if (this.tickets.length > 0) {
        return true
      } else {
        return false
      }
    },
    min_price() {
      let minPrice = 0
      for (var i = 0; i < this.tickets.length; i++) {
        if (this.tickets[i].price <= minPrice) {
          minPrice = this.tickets[i].price
        }
      }
      return (minPrice * 100).toFixed(2)
    },

    max_price() {
      let maxPrice = 0
      for (var i = 0; i < this.tickets.length; i++) {
        if (this.tickets[i].price >= maxPrice) {
          maxPrice = this.tickets[i].price
        }
      }
      return (maxPrice * 100).toFixed(2)
    }
  },
  methods: {
    refreshTicketCart() {
      this.selectedTicket = null
    },

    updateTickets: function(notificationData) {
      let tempArray = this.Tickets
      for (var i = 0; i < tempArray.length; i++) {
        if (tempArray[i]._id == notificationData._id) {
          tempArray.splice(i, 1, notificationData)
        }
      }
      this.Tickets = tempArray
    },

    purchaseTicket(ticket) {
      if (this.$store.getters.userLoggedIn) {
        this.selectedTicket = ticket

      } else {
        swal({
          title: 'Please Login',
          text: 'Sign up or Sign In, Only E-Mobie members can purchase tickets',
          type: 'warning'
        }).then((response) => {
          if (response.value) {
            this.$router.push({
              name: 'CustomerLogin'
            })
          }
        })
      }
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
