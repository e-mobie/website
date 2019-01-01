<template>
<div class="card">
  <v-client-table :data="ticket_box" :columns="ticket_headers"></v-client-table>
</div>
</template>

<script>
import swal from 'sweetalert2'
import axios from 'axios'
import DataTables from './Utilities/DataTables.vue'
export default {
  name: 'guest_list_history',
  mounted() {
    // load created guests
    let url = process.env.VUE_APP_API_URL + '/invites/all/' + this.ticketId
    axios.create({
      withCredentials: true
    }).get(url).then((response) => {
      // console.log(response.data);
      this.ticket = response.data.ticket
      this.ticket_box = response.data.invites
    })
  },
  props: [
    'ticketId', 'eventId'
  ],
  data() {
    return {
      ticket: {},
      new_entry: {
        name: "",
        email: "",
        status: 'Not Sent',
        ticketId: this.ticketId,
        eventId: this.eventId
      },
      ticket_box: [],
      ticket_headers: ['name', 'email', 'status']
    }
  },
}
</script>
