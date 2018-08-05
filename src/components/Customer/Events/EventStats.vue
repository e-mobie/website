<template>
<b-container>
  <b-card class="m-3" title="Statistics" :sub-title="eventObj.title">
    <p class="card-text">
      Total Value: ${{totalValue.toFixed(2)}}, Total Sales: ${{currentSalesValue.toFixed(2)}}
    </p>
    <b-button variant="outline-info" size="sm" @click="downloadPDF">Download Guest List</b-button>
    <hr />
    <h4>Tickets</h4>
    <b-list-group>
      <b-list-group-item v-for="ticket in eventObj.tickets" :key="ticket._id">
        <h6>{{ticket.title}}</h6>
        <p>
          Price: ${{(ticket.price / 100).toFixed(2)}}, Sold: {{ticket.qty_sold}}, Available: {{ticket.quantity_available}}, Sales Value: ${{((ticket.price * ticket.qty_sold)/ 100).toFixed(2)}}
        </p>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</b-container>
</template>

<script>
import axios from 'axios'
import download from 'downloadjs'
// let download = require('./download.js')
export default {
  mounted() {
    // console.log(this.$route.params);
    axios.create({
      withCredentials: true
    }).get(process.env.VUE_APP_API_URL + '/events/' + this.$route.params.eventkey + '/stats').then((response) => {
      // console.log(response.data);
      this.eventObj = response.data.eventDetails;
      this.invoices = response.data.invoices
    })
  },
  data: function() {
    return {
      eventObj: {},
      invoices: []
    }
  },
  computed: {
    currentSalesValue: function() {
      if (this.eventObj.tickets != null) {
        let completeAmount = 0
        for (var i = 0; i < this.eventObj.tickets.length; i++) {
          completeAmount += (this.eventObj.tickets[i].price * this.eventObj.tickets[i].qty_sold)
        }
        return (completeAmount / 100)
      } else {
        return 0
      }
    },
    totalValue: function() {
      if (this.eventObj.tickets != null) {
        let completeAmount = 0
        for (var i = 0; i < this.eventObj.tickets.length; i++) {
          completeAmount += (this.eventObj.tickets[i].price * (this.eventObj.tickets[i].qty_sold + this.eventObj.tickets[i].quantity_available))
        }
        return (completeAmount / 100)
      } else {
        return 0
      }
    }
  },
  methods: {
    downloadPDF: function() {
      axios.create({
        withCredentials: true
      }).get(process.env.VUE_APP_API_URL + '/events/' + this.eventObj._id + '/download').then((response) => {
        download(response.data, 'stats.pdf', 'application/pdf')
      })
    }
  }
}
</script>
