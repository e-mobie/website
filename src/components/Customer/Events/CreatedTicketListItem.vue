<template>
<b-list-group-item>
  <b-button variant="danger" size="sm" @click="deleteTicket">Delete</b-button>
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
    deleteTicket() {
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
  }
}
</script>
