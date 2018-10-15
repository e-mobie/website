<template>
<div class="container">
  <div class="row">
    <div class="col-12">
      <div class="card border-info m-2">
        <span class="mx-3 float-right">
          {{open_slots}} of {{ticket_stubbs}} spots left
        </span>
        <p class="form-text mx-3">
          Use this form to add those you would like to send this ticket to.
        </p>
        <form @submit.prevent="add_invite" class="form">
          <div class="form-row mx-2">
            <div class="col">
              <input type="text" v-model="new_entry.name" placeholder="John Snow" class="form-control" />
            </div>
              <div class="col">
                <input type="email" v-model="new_entry.email" placeholder="jSnow@theNorth.com" class="form-control" />
            </div>
              </div>
              <button class="btn btn-primary m-2 float-right" type="submit" >Add Invite</button>
        </form>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <div class="card border-info m-2">
        <v-client-table :data="ticket_box" :columns="ticket_headers"></v-client-table>
      </div>
      <div>
        <button class="btn btn-primary m-2 float-right" type="button" @click="CreateAndSendInvites">Send Invites</button>
      </div>
    </div>
  </div>
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
  mounted() {
    // load created guests
    let url = process.env.VUE_APP_API_URL + '/invites/all/' + this.ticketId
    axios.create({
      withCredentials: true
    }).get(url).then((response) => {
      console.log(response.data);
      this.ticket = response.data.ticket
      this.ticket_box = response.data.invites
    })
  },
  props: [
    'ticketId',
  ],
  data() {
    return {
      ticket: {},
      new_entry: {
        name: "",
        email: "",
        status: 'Not Sent'
      },
      ticket_box: [],
      ticket_headers: ['name', 'email', 'status']
    }
  },
  computed: {
    ticket_stubbs() {
      if (this.ticket != null) {
        let total_quantity = (this.ticket.qty_sold + this.ticket.quantity_available)
        return total_quantity
      } else {
        return 0
      }
    },
    open_slots() {
      if (this.ticket != null) {
        let total_quantity = (this.ticket.qty_sold + this.ticket.quantity_available)
        return (total_quantity - this.ticket_box.length)
      } else {
        return 0
      }
    }
  },

  methods: {
    add_invite(e) {
      // console.log(e);
      if (!(this.ticket_box.length >= this.ticket_stubbs)) {
        this.ticket_box.push(this.new_entry)
        this.new_entry = {
          name: "",
          email: "",
          status: 'Not Sent'
        }
        e.target[0].focus()
      }
    },
    CreateAndSendInvites() {
      let payload = {
        ticketObj: this.ticket,
        invitelist: this.ticket_box
      }
      let url = process.env.VUE_APP_API_URL + '/invite/' + this.ticketId + '/create'
      axios.create({
        withCredentials: true
      }).post(url, payload).then((response) => {
        let invites = response.data
        // console.log(invites);
        let ticket_box_temp = this.ticket_box
        invites.forEach((el) => {
          if (ticket_box_temp[el.index_position].status != el.status) {
            ticket_box_temp[el.index_position].status = el.status
          }
          this.ticket_box = ticket_box_temp
        })
        swal({
          title: 'Invites Sent',
          text: 'We sent the invites :)',
          type: 'success'
        })
      })
    }
  }
}
</script>
