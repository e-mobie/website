<template>
<b-container>
  <b-jumbotron v-if="tickets.length == 0">
    <template slot="header">
        <h2>Tickets for <br /> '{{event.title}}'</h2>
          <h3>There are '0' Tickets... </h3>
          <b-button variant="primary" v-b-modal.createTicketForm>Create Ticket</b-button>
    </template>
  </b-jumbotron>
  <span v-else>

  <b-row >
    <b-col>
      <hr />
      '{{tickets.length}}' tickets for {{event.title}}
      <b-button-group class="float-right">
        <b-button size="sm" :to="{ name: 'EditEvent', params: { email: this.$store.state.user.user.email, eventkey: event._id} }">Back to Event</b-button>
        <b-button variant="primary" size="sm" v-b-modal.createTicketForm>
          Create New Ticket
        </b-button>
      </b-button-group>
      <hr />
      <b-list-group>
        <CreatedTicket v-for="ticket in tickets" :key="ticket._id" :ticket="ticket" @edit_me="editTicket"></CreatedTicket>
      </b-list-group>
      <hr />
    </b-col>
  </b-row>

</span>
  <b-modal id="createTicketForm" title="So this ticket is..." ref="CreateTicket">
    <p class="lead">
      Please provide basic information about the ticket
    </p>
    <b-form enctype="multipart/form-data" @submit.prevent="CreateTicket">
      <b-form-group label="Title">
        <b-form-input type="text" v-model="newTicket.title"></b-form-input>
      </b-form-group>

      <b-form-group label="Quantity Available">
        <b-form-input v-model="newTicket.quantity_available" type="number" step="1" min="5"></b-form-input>
      </b-form-group>

      <b-form-group label="Is it Free? Or Pay to Purchase?">
        <b-form-radio-group v-model="newTicket.paid_or_free">
          <b-form-radio value="Paid" :disabled="true">Pay to Purchase</b-form-radio>
          <b-form-radio value="Free">Free for all</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <b-form-group label="Ticket Image">
        <b-form-file placeholder="Upload a Ticket Stub"></b-form-file>
      </b-form-group>

      <b-form-group label="A Short Description">
        <b-form-textarea v-model="newTicket.description"></b-form-textarea>
      </b-form-group>
      <b-button type="submit" variant="primary">Create Ticket</b-button>
    </b-form>
  </b-modal>

  <b-modal id="editTicketForm" title="So Change this ticket to..." ref="EditTicket">
    <p class="lead">
      Updating the basic information about the ticket
    </p>
    <b-form enctype="multipart/form-data" @submit.prevent="CreateTicket">
      <b-form-group label="Title">
        <b-form-input type="text" v-model="editing_Ticket.title"></b-form-input>
      </b-form-group>

      <b-form-group label="Quantity Available">
        <b-form-input v-model="editing_Ticket.quantity_available" type="number" step="1" min="5"></b-form-input>
      </b-form-group>

      <b-form-group label="Is it Free? Or Pay to Purchase?">
        <b-form-radio-group v-model="editing_Ticket.paid_or_free">
          <b-form-radio value="Paid" :disabled="true">Pay to Purchase</b-form-radio>
          <b-form-radio value="Free">Free for all</b-form-radio>
        </b-form-radio-group>
      </b-form-group>

      <b-form-group label="Ticket Image">
        <b-form-file accept="image/*" placeholder="Upload a Ticket Stub" v-if="editing_Ticket.ticket_image == null"></b-form-file>
      </b-form-group>

      <b-form-group label="A Short Description">
        <b-form-textarea v-model="editing_Ticket.description"></b-form-textarea>
      </b-form-group>
      <b-button type="submit" variant="primary">Update Ticket</b-button>
    </b-form>
  </b-modal>
</b-container>
</template>
<script>
import swal from 'sweetalert2'
import axios from 'axios'
import CreatedTicket from './Customer/Events/CreatedTicketListItem.vue'
export default {
  components: {
    CreatedTicket
  },
  props: [
    'eventId'
  ],
  data() {
    return {
      editing_Ticket: {},
      newTicket: {
        title: "",
        quantity_available: 5,
        description: '',
        paid_or_free: "Free"
      },
      new_ticket_image: {}
    }
  },

  computed: {
    event: function() {
      return this.$store.state.user.Events.find(
        (element) => {
          if (element._id == this.eventId) {
            return true
          }
        }
      )
    },
    tickets: function() {
      if (this.event != null) {
        return this.event.tickets
      }
    }
  },
  methods: {
    fileSelected(evt) {
      let image = evt.target.files || evt.dataTransfer.files
      this.new_ticket_image = image
    },
    CreateTicket() {
      const formData = new FormData();
      if (this.$data.new_ticket_image[0] != null) {
        formData.append('ticket_image', this.$data.new_ticket_image[0], this.$data.new_ticket_image[0].name);
      }
      let data = this.$data.newTicket;

      formData.append('seedData', JSON.stringify(data))

      let post_url = process.env.VUE_APP_API_URL + '/tickets/' + this.event.publisher + '/' + this.eventId + '/create'
      axios({
        url: post_url,
        method: 'POST',
        data: formData,
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'mutlipart/form-data'
        }
      }).then((response) => {
        console.log(response);
        if (response.data.success) {
          this.$refs.CreateTicket.hide()
          this.$store.dispatch('user/UpdateEvents', response.data.data)
          swal({
            title: 'Ticket Created',
            type: 'success',
          })
        } else {
          this.$refs.CreateTicket.hide()
          if (response.data.status != 401) {
            swal({
              title: 'Something Went Wrong',
              type: 'error',
              text: response.data.message
            })
          } else {
            swal({
              title: 'Please Sign In',
              text: response.data.message,
              type: 'warning'
            }).then((response) => {
              if (response) {
                this.$router.push({
                  name: 'CustomerLogin'
                })
              }
            })
          }

        }
      })
    },
    editTicket(ticketId) {
      let currentTickets = this.tickets
      //catch it
      let index = currentTickets.findIndex((element) => {
        if (element._id == ticketId) {
          return true
        }
      })
      this.editing_Ticket = currentTickets[index]
      this.$refs.EditTicket.show()
    }
  }
}
</script>
