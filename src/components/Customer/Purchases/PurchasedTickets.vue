<template>
<b-container>
  <b-jumbotron v-if="Purchases.length <= 0">
    <p>
      When you purchase a ticket or voucher it will show up here.
    </p>
  </b-jumbotron>
  <b-row v-else>
    <b-col>
      <p>
        Purchases: {{ PurchaseCount }}
      </p>
      <hr />
      <b-list-group>
        <b-list-group-item v-for="purchase in Purchases" :key="purchase._id">
          <b-button-group class="float-right">
            <b-button variant="info" size="sm" @click="findInvoice(purchase._id)">Open Invoice</b-button>
            <b-button variant="danger" size="sm" @click="DeleteInvoice(purchase._id)">Delete</b-button>
          </b-button-group>
          <h5 v-if="purchase.ticketId != null">{{purchase.ticketId.title}}</h5>
          <h5 v-else>N/A</h5>
          <dl>
            <dt>
                Event
              </dt>
            <dd v-if="purchase.eventId != null">
              {{purchase.eventId.title}}
            </dd>
            <dd v-else>
              N/A
            </dd>
          </dl>
        </b-list-group-item>
      </b-list-group>
    </b-col>
  </b-row>
</b-container>
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
    PO: function() {
      if (this.openedTicket) {
        return this.Purchases.find((element) => {
          if (element._id == this.openedTicket) {
            return true
          }
        })
      }
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
  }


}
</script>
