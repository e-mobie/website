<template>
<b-list-group-item>
  <b-button-group>
    <b-button variant="danger" @click="deleteTicket" size="sm">Delete</b-button>
    <b-button variant="warning" size="sm" @click="editMe">Edit</b-button>
    <b-button variant="primary" size="sm" :to="{name: 'GuestListManagerNewInvites', params: {ticket: ticket, ticketId: ticket._id, eventId: ticket.eventId}}">Manage Guest list</b-button>
  </b-button-group>
  <dl class="horizontal">
    <dt>Title</dt>
    <dd>{{ticket.title}}</dd>
    <dt>Paid Or Free</dt>
    <dd>{{ticket.paid_or_free}}</dd>
    <dt>Qty Avaiable</dt>
    <dd>{{ticket.quantity_available}}</dd>
    <dt>Description</dt>
    <dd>{{ticket.description}}</dd>
  </dl>
</b-list-group-item>
</template>

<script>
import swal from 'sweetalert2'
export default {
  props: [
    'ticket'
  ],
  methods: {
    editMe() {
      this.$emit('edit_me', this.ticket._id)
    },
    deleteTicket() {
      swal({
        title: 'Are you sure?',
        text: 'Once done, it\'s gone!',
        type: 'warning',
        showCancelButton: true,
        confirmButton: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.$store.dispatch('user/DeleteEventTicket', this.ticket).then((response) => {
            if (response.data.success) {
              this.$store.dispatch('user/DropEventTicket', this.ticket).then((response) => {
                if (response.success) {
                  swal({
                    title: "Ticket Deleted",
                    text: response.message,
                    type: "success"
                  })
                } else {
                  swal({
                    title: "Ticket Not Deleted",
                    text: response.message,
                    type: "error"
                  })
                }
              })
            } else {
              swal({
                title: "Ticket Not Deleted",
                text: response.data.message,
                type: "error"
              })
            }
          })
        }
      })
    }
  }
}
</script>
