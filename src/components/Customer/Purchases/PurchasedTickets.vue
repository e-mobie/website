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
        <b-list-group-item v-for="purchase in Purchases" :key="purchase._id" @click="findInvoice(purchase._id)">
          <h5 v-if="purchase.ticketId != null">{{purchase.ticketId.title}}</h5>
          <h5 v-else>N/A</h5>
          <dl class="dl-horizontal">
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
export default {
  data: function() {
    return {
      Purchases: this.$store.state.user.Invoices
    }
  },
  mounted: function() {
    this.$store.dispatch('user/initCustomerInvoices')
  },
  computed: {
    PurchaseCount: function() {
      return this.Purchases.length
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
    }
  }

}
</script>
