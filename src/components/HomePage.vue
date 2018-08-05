<template>
<span>
  <search-box v-on:search-request="SetSearchQuery"></search-box>
<b-container fluid>
  <b-card-group columns class="event-card-container">
    <EventThumbnail v-if="!hasQueryResults" v-for="flyer in PublicFlyers" v-bind:key="flyer._id" v-bind:flyer="flyer" v-on:open-ticket-cart="SetTicketCartObject">
    </EventThumbnail>
    <EventThumbnail v-if="hasQueryResults" v-for="flyer in queryResults" v-bind:key="flyer._id" v-bind:flyer="flyer" v-on:open-ticket-cart="SetTicketCartObject">
    </EventThumbnail>
  </b-card-group>
</b-container>
<ticket-cart :eventObj="ticketCartEventObj" :toggle="openTicketModal" v-on:ticket-cart-closed="TicketModalClosed"></ticket-cart>
</span>
</template>



<script>
import TicketCart from './Utilities/TicketCart.vue'
import SearchBox from './Utilities/SearchBox.vue'
import EventThumbnail from './Utilities/PublicEventThumbnail.vue'
export default {
  components: {
    SearchBox,
    EventThumbnail,
    TicketCart
  },
  data: function() {
    return {
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
  },
  methods: {
    SetSearchQuery: function(query) {
      let grossResults = []
      let keywords = query.keywords
      if (keywords.length > 0) {
        this.PublicFlyers.forEach((element) => {
          if (element.title.toLowerCase().indexOf(keywords.toLowerCase()) != -1) {
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
    }
  }
}
</script>
