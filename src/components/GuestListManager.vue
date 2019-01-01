<template>
<div class="container">
  <ul class="nav nav-tabs">
    <li class="nav-item">
      <router-link class="nav-link" :to="{ name: 'GuestListManagerNewInvites', params: {ticketId: ticketId, eventId: eventId} }">Create New Invites</router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" :to="{ name: 'TicketGuestListHistory', params: {ticketId: ticketId, eventId: eventId} }">Invite History</router-link>
    </li>
  </ul>
  <router-view></router-view>
</div>
</template>

<script>
import swal from 'sweetalert2'
import axios from 'axios'
import DataTables from './Utilities/DataTables.vue'
export default {
  components: {
    DataTables
  },
  props: [
    'ticketId', 'eventId'
  ],
}
</script>
