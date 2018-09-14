<template>
<b-container v-if="Purchases.length <= 0">
  <div class="card-body">
    <b-jumbotron>
      <p>
        When you purchase a ticket or voucher it will show up here.
      </p>
    </b-jumbotron>
  </div>
</b-container>
<span v-else>
  <b-card>
    <b-card-body>
        Purchases: {{ PurchaseCount }}
    </b-card-body>
    <b-list-group style="max-height: 20rem; overflow-y: scroll;">
      <b-list-group-item v-for="purchase in Purchases" :key="purchase._id">
                  <b-button-group class="float-md-right">
                    <b-button variant="info" size="sm" @click="findInvoice(purchase._id)">Open Invoice</b-button>
                    <b-button variant="danger" size="sm" @click="DeleteInvoice(purchase._id)">Delete</b-button>
                  </b-button-group>
        <h5 v-if="purchase.ticketId != null">{{purchase.ticketId.title}}</h5>
        <h5 v-else>N/A</h5>
        <p v-if="purchase.eventId != null">
          {{purchase.eventId.title}}<br />
          ${{purchase.cost.toFixed(2)}} <br />
          {{purchase.rsvp_list.length}} RSVP, {{purchase.guest_passes.length}} Guest
        </p>
        <p v-else>
          N/A
        </p>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</span>
</template>
<script>
import swal from 'sweetalert2'
export default {
  data: function() {
    return {
      Purchases: this.$store.getters['user/Invoices']
    }
  },
  mounted: function() {
    this.$store.dispatch('user/initCustomerInvoices')
  },
  computed: {
    PurchaseCount: function() {
      return this.$store.getters['user/Invoices'].length
    },
    setFlush: function() {
      return false
    },
  },
  methods: {
    findInvoice(invoiceId) {
      this.$store.dispatch('user/FindInvoice', invoiceId).then((response) => {
        if (response.success) {
          this.$router.push({
            name: 'FindInvoice',
            params: {
              'invoiceId': invoiceId
            }
          })
        } else {
          alert('addd')
        }
      })
    },
    DeleteInvoice(invoiceId) {
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
          this.$store.dispatch('user/deleteCustomerInvoice', invoiceId).then((response) => {
            if (response.success) {
              this.Purchases = this.$store.getters['user/Invoices']
              swal({
                title: 'Invoice Deleted',
                text: 'Your Invoice was successfully deleted',
                type: 'success'
              })
            }
          })
        }
      })
    }
  }


}
</script>
