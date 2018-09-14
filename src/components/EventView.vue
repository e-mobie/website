<template>
<span>
  <div class="container-fluid booklet-container">
    <div class="container booklet-content">
      <div class="row no-gutters">
        <div class="col-md-6 flyer-image-container rounded-left d-flex align-items-center">
          <div id="carouselExampleSlidesOnly" class="carousel slide carousel-fade" data-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item active">
                <img class="d-block w-100" :src="flyerImg" alt="First slide">
              </div>
                <div class="carousel-item">
                  <img class="d-block w-100" src="https://via.placeholder.com/350x150" alt="Second slide">
              </div>
                  <div class="carousel-item">
                    <img class="d-block w-100" src="https://via.placeholder.com/350x150" alt="Third slide">
              </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card" style="min-height:100%">
                  <div class="card-header tags-container">
                    <a href="#" class="btn btn-primary">#Public</a>
                  </div>
                  <div class="card-body">
                    <h3>{{flyer.title}}</h3>
                    <div>
                      <p>
                        {{flyer.description}}
                      </p>
                    </div>

                    <h4>General Information</h4>
                    <div>
                      <table>
                        <tr>
                          <td>
                            <font-awesome-icon :icon="mapIcon" /> LOCATION
                          </td>
                          <td>
                            <a :href="locationData.url" target="_blank">
                        {{locationData.formatted_address}}
                      </a>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <font-awesome-icon :icon="ticketIcon" /> FEES
                          </td>
                          <td>
                            <span v-if="tickets.length >= 0"v-for="ticket in tickets" :key="ticket._id" >${{(ticket.price * 100).toFixed(2)}}</span>
<span v-if="tickets.length <= 0">No tickets Available</span>
</td>
</tr>

<tr>
  <td>
    <font-awesome-icon :icon="calendarIcon" /> DATES
  </td>
  <td>
    {{StartDay}} - {{FinishDay}}
  </td>
</tr>
<tr>
  <td>
    <font-awesome-icon :icon="clockIcon" /> TIMES
  </td>
  <td>
    {{StartTime}} - {{FinishTime}}
  </td>
</tr>
</table>
</div>
<!-- <h4>Tickets</h4>
              <div class="media">
                <img class="mr-3" src="https://via.placeholder.com/100x100" alt="E-Mobie Ticket" />
                <div class="media-body">
                  <h5>General</h5>
                </div>
              </div> -->
</div>
<div class="card-footer actions-container">
  <b-button variant="success" @click="openPurchaseDiag">Tickets</b-button>
  <!-- <a href="#" class="btn btn-success">View Tickets</a> -->
</div>
</div>
</div>
</div>
</div>
</div>

<ticket-cart :eventObj="flyer" :toggle="openTicketCart"></ticket-cart>
</span>
</template>

<style lang="scss">
@import "../assets/variables";
.booklet-container {
    background: linear-gradient(0deg, rgba(#3B44FF, 0.45), rgba(#3B44FF, 0.45)), url("/img/background.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    padding-top: 5rem;
    padding-bottom: 5rem;
    margin-bottom: 2.5rem;
    min-height: 40em;
}

.background-img-container {
    max-height: 25rem;
    overflow: hidden;
    z-index: -1;
    position: absolute;
}

.flyer-image-container {
    background-color: $lightgrey;
    height: 800px;

    img {
        max-height: 800px;
    }
}

.tags-container {
    background-color: white;
    border-bottom: none;
    text-align: right;
}

.actions-container {
    background-color: white;
    border-top: none;
    text-align: right;
}

.flyer-details-container {
    margin-bottom: 50px;
}

.booklet-content {
    position: absolute;
    right: 0;
    left: 0;
    margin-bottom: 2em;
}
</style>

<script>
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
import {
  faMapMarkerAlt,
  faTicketAlt,
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
      openTicketCart: false,
      clockIcon: faClock,
      calendarIcon: faCalendarAlt,
      ticketIcon: faTicketAlt,
      mapIcon: faMapMarkerAlt
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
    }
  },
  methods: {
    openPurchaseDiag: function() {
      if (this.$store.getters.userLoggedIn) {
        if (this.openTicketCart == false) {
          this.openTicketCart = true
        } else {
          this.openTicketCart = false
        }
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
