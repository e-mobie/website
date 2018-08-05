<template>
<div class="card event-card">
  <div class="event-card-img-container">
    <img class="card-img-top" :src="flyerImageSrc" />
    <b-button variant="default" size="sm">FREE</b-button>
  </div>
  <div class="card-body event-card-info-container">
    <h5 class="event-card-title">{{flyer.title}}</h5>
    <p class="event-card-description">
      {{ flyer.description}}
    </p>
    <div class="general-info">
      <h6 class="general-info-title">General Information</h6>
      <b-row class="general-info-details">
        <b-col>
          <p>
            <span class="label-location">
              <font-awesome-icon :icon="mapIcon" /> LOCATION
            </span> {{Loc.formatted_address}}
          </p>
          <p>
            <span class="label-Fees">
              <font-awesome-icon :icon="ticketIcon" /> FEES
            </span> {{Fees}}
          </p>
          <p>
            <span class="label-Dates">
            <font-awesome-icon :icon="calendarIcon" />  DATES
          </span> {{StartDate}}
          </p>
          <p>
            <span class="label-Time">
              <font-awesome-icon :icon="clockIcon" /> TIME
            </span> {{StartTime}} - {{FinishTime}}
          </p>
        </b-col>
      </b-row>
    </div>
    <b-button variant="success" size="sm" @click="openTicketCart">TICKETS</b-button>
    <b-button variant="outline-secondary" size="sm" :to="{name: 'EventView', params: { email: this.flyer.publisher, eventkey: this.flyer._id}}">VIEW DETAILS</b-button>
  </div>
</div>
</template>

<style>
.card-mod {
  color: black;
  font-weight: normal;
  font-size: 100%;
  text-align: left;
}

a.card-mod:hover {
  color: #28a745;
  border-color: #28a745;
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
import moment from 'moment'
import swal from 'sweetalert2'
export default {
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      clockIcon: faClock,
      calendarIcon: faCalendarAlt,
      ticketIcon: faTicketAlt,
      mapIcon: faMapMarkerAlt
    }
  },
  props: [
    'flyer'
  ],
  computed: {
    flyerImageSrc() {
      if (this.flyer.flyer != null) {
        if (this.flyer.flyer != '') {
          let flyerImg = JSON.parse(this.flyer.flyer)
          let imgsrc = process.env.VUE_APP_API_URL + '/' + flyerImg.filename + '-' + flyerImg.originalname
          return imgsrc;
        } else {
          return "http://via.placeholder.com/350x150"
        }
      } else {
        return "http://via.placeholder.com/350x150"
      }
    },
    Fees() {
      if (this.flyer.tickets.length > 0) {
        let priceArray = []
        this.flyer.tickets.forEach((element) => {
          if (element.price != null) {
            priceArray.push(element.price)
          }
        })
        let lowest = 0.00
        let highest = 0.00
        priceArray.forEach((element) => {
          if (element >= highest) {
            highest = element
          }
          if (element <= lowest) {
            lowest = element
          }
        })

        if (lowest == highest) {
          return 'Free'
        } else {
          return "$" + lowest.toFixed(2) + " - $" + highest.toFixed(2)
        }
      }
    },
    StartDate() {
      // return this.flyer.startTime
      return moment(this.flyer.startTime).local().format("MMMM Do YYYY")
    },
    StartTime() {
      return moment(this.flyer.startTime).local().format("h:mm a")
    },
    FinishDate() {
      // return "";
      return moment(this.flyer.finishTime).local().format("MMMM Do YYYY")
    },
    FinishTime() {
      return moment(this.flyer.finishTime).local().format("h:mm a")
    },
    Loc() {
      if (this.flyer.location != null) {
        return JSON.parse(this.flyer.location)
      } else {
        return {
          formatted_address: 'Not Set'
        }
      }
    },
  },
  methods: {
    openTicketCart(event) {
      if (this.$store.state.user.user.email) {
        this.$emit('open-ticket-cart', this.flyer)
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
    }
  }
}
</script>
