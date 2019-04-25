<template>
<div id="woodCard" class="card">
  <button class="price">FREE</button>
  <div class="mb-4">
    <div class="bgimg-container" :style="{'background-image': 'url(\'' + flyerImageSrc + '\')'}">
    </div>
    <div class="img-container">
      <img :src="flyerImageSrc" />
    </div>
  </div>

  <div class="general-info">

    <h1>{{flyer.title}}</h1>

    <div class="info">
      <span class="icon"><i class="fas fa-map-marker-alt"></i></span>
      <p>Location: {{Loc.formatted_address}}</p>
    </div>


    <div class="info">
      <span class="icon"><i class="fas fa-dollar-sign"></i></span>
      <p>Fees: {{Fees}}</p>
    </div>


    <div class="info">
      <span class="icon"><i class="fas fa-calendar-week"></i></span>
      <p>Dates: {{StartDate}}</p>
    </div>


    <div class="info">
      <span class="icon"><i class="far fa-clock"></i></span>
      <p>Time: {{StartTime}}</p>
    </div>

    <p class="text-truncate">{{ flyer.description}}</p>

    <!-- <button @click="openTicketCart">Tickets</button> -->
    <button>
      <router-link :to="{name: 'EventView', params: { email: this.flyer.publisher, eventkey: this.flyer._id}}">
        <font-awesome-icon :icon="ticketIcon"></font-awesome-icon>
        View Details
      </router-link>
    </button>
  </div>

</div>
</template>

<style type="scss">
.img-container {
  height: 400px;
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
    has_thumbnail() {
      if (this.flyer.flyer_thumbnail != null) {
        if (this.flyer.flyer_thumbnail != '') {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    thumbnail() {
      if (this.flyer.flyer_thumbnail != null) {
        if (this.flyer.flyer_thumbnail != '') {
          let flyerImg = JSON.parse(this.flyer.flyer)
          let imgsrc = process.env.VUE_APP_API_URL + '/' + this.flyer.flyer_thumbnail
          return imgsrc
        }
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
      } else {
        return 'None Avaiable'
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
