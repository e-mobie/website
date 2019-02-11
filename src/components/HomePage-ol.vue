<template>
<span>
  <search-box v-on:search-request="SetSearchQuery" :events="PublicFlyers" :search_summary="search_results" v-on:location-filter="UpdateLocationFilter"></search-box>
  <b-container fluid>
    <div class="row" v-for="flyer_group in GroupedFlyers">
      <div class="col-md-3" v-for="flyer in flyer_group" v-bind:key="flyer._id">
        <div class="event-card-container">
          <EventThumbnail v-if="!hasQueryResults" v-bind:flyer="flyer" v-on:open-ticket-cart="SetTicketCartObject">
          </EventThumbnail>
          <EventThumbnail v-if="hasQueryResults" v-bind:flyer="flyer" v-on:open-ticket-cart="SetTicketCartObject">
          </EventThumbnail>
        </div>
      </div>
      <!-- <div class="event-card-container">
      <EventThumbnail v-if="!hasQueryResults" v-for="flyer in PublicFlyers" v-bind:key="flyer._id" v-bind:flyer="flyer" v-on:open-ticket-cart="SetTicketCartObject">
      </EventThumbnail>
      <EventThumbnail v-if="hasQueryResults" v-for="flyer in queryResults" v-bind:key="flyer._id" v-bind:flyer="flyer" v-on:open-ticket-cart="SetTicketCartObject">
      </EventThumbnail>
    </div> -->
    </div>


    <!-- <b-card-group class="event-card-container d-flex flex-sm-wrap">

  </b-card-group> -->
  </b-container>
  <ticket-cart :eventObj="ticketCartEventObj" :toggle="openTicketModal" v-on:ticket-cart-closed="TicketModalClosed"></ticket-cart>
</span>
</template>



<script>
import TicketCart from './Utilities/TicketCart.vue'
import SearchBox from './Utilities/SearchBox.vue'
import EventThumbnail from './Utilities/PublicEventThumbnail.vue'
import fuse from 'fuse.js'
export default {
  components: {
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
