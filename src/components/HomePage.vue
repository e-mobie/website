<template>
<span>
  <show-case></show-case>

  <section id="middle">
    <SearchBox></SearchBox>
  </section>

  <section id="tickets">
    <div id="container-tickets">
      <div class="ticket-grid">
        <EventThumbnail v-for="flyer in PublicFlyers" v-bind:flyer="flyer" v-on:open-ticket-cart="SetTicketCartObject">
        </EventThumbnail>
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
        <!-- <li>
          <a href="#"><i class="fab fa-twitter"></i></a>
        </li> -->
        <li>
          <a href="https://www.facebook.com/Emobie242/"><i class="fab fa-facebook-f"></i></a>

        </li>

        <li>
          <a href="https://www.instagram.com/emobie_242/"><i class="fab fa-instagram"></i></a>
        </li>
        <!-- <li>
          <a href="#"><i class="fab fa-youtube"></i></a>
        </li> -->
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
  <ticket-cart :eventObj="ticketCartEventObj" :toggle="openTicketModal" v-on:ticket-cart-closed="TicketModalClosed"></ticket-cart>
</span>
</template>

<style>

</style>

<script>
import ShowCase from './Utilities/Showcase.vue'
import TicketCart from './Utilities/TicketCart.vue'
import SearchBox from './Utilities/SearchBox.vue'
import EventThumbnail from './Utilities/PublicEventThumbnail.vue'
import fuse from 'fuse.js'
export default {
  components: {
    ShowCase,
    SearchBox,
    EventThumbnail,
    TicketCart
  },
  data: function() {
    return {
      hasLocationFilter: false,
      LocationFilter: {},
      emptyLocation: false,
      hasQueryResults: false,
      queryResults: [],
      ticketCartEventObj: {},
      openTicketModal: false
    };
  },
  computed: {
    PublicFlyers() {
      return this.$store.state.events.publishedEvents
    },
    LocationResults() {
      if (this.emptyLocation) {
        return false
      } else {
        return true
      }
    },
    FilteredResults() {
      if (this.hasLocationFilter) {
        let filteredList = []
        if (this.PublicFlyers != null) {
          this.PublicFlyers.forEach((element) => {
            if (element.location != null) {
              if (JSON.parse(element.location).formatted_address == this.LocationFilter.formatted_address) {
                filteredList.push(element)
              }
            }
          })
        }
        if (filteredList.length > 0) {
          this.emptyLocation = false
          return filteredList
        } else {
          this.emptyLocation = true
          return this.PublicFlyers
        }
      } else {
        if (this.PublicFlyers != null) {
          return this.PublicFlyers
        } else {
          return []
        }
      }
    },
    search_results() {
      if (this.emptyLocation === true) {
        return 'There\'s Nothing happening'
      } else {
        return null
      }
    },
    GroupedFlyers() {
      if (this.hasQueryResults) {
        let collatedArray = []
        let currentGroup = []
        for (var i = 0; i < this.queryResults.length; i++) {
          currentGroup.push(this.queryResults[i])
          if (currentGroup.length % 4 == 0) {
            collatedArray.push(currentGroup)
            currentGroup = []
          }
        }
        collatedArray.push(currentGroup)
        return collatedArray
      } else {
        if (this.PublicFlyers != null) {
          let collatedArray = []
          let currentGroup = []
          for (var i = 0; i < this.FilteredResults.length; i++) {
            currentGroup.push(this.FilteredResults[i])
            if (currentGroup.length % 4 == 0) {
              collatedArray.push(currentGroup)
              currentGroup = []
            }
          }
          collatedArray.push(currentGroup)
          return collatedArray
        } else {
          return []
        }
      }
    }
  },
  methods: {
    SetSearchQuery: function(query) {
      let grossResults = []
      if (query.length > 0) {
        this.FilteredResults.forEach((element) => {
          if (query.indexOf(element._id) != -1) {
            grossResults.push(element)
          }
        })
      }
      if (grossResults.length > 0) {
        this.hasQueryResults = true
      } else {
        this.hasQueryResults = false
      }
      this.queryResults = grossResults
    },
    SetTicketCartObject: function(eventObj) {
      this.ticketCartEventObj = eventObj
      this.openTicketModal = true
    },
    TicketModalClosed: function(evt) {
      this.ticketCartEventObj = {},
        this.openTicketModal = false
    },
    UpdateLocationFilter(e) {
      this.LocationFilter = e
      this.hasLocationFilter = true
    }
  }
}
</script>
