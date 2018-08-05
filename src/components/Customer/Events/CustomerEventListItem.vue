<template>
<b-list-group>
  <b-list-group-item>
    <b-button-group>
      <b-button variant="outline-info" size="sm" :to="{ name: 'EditEvent', params: {email: user.email, eventkey: customerEvent._id }}">
        <font-awesome-icon :icon="editIcon">
        </font-awesome-icon> Edit </b-button>

      <b-button variant="outline-info" size="sm" :to="{ name: 'QrReader', params: {eventId: customerEvent._id} }">
        <font-awesome-icon :icon="qrIcon">
        </font-awesome-icon>
        Ticket Scanner
      </b-button>

      <b-button variant="outline-info" size="sm" :to="{ name: 'EventStats', params: {eventkey: customerEvent._id, email: user.email}}">
        <font-awesome-icon :icon="chartIcon">
        </font-awesome-icon>
        Stats
      </b-button>
    </b-button-group>

    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">{{customerEvent.title}}</h5>
      <small class="text-muted">{{customerEvent.status}}</small>
    </div>
    <small class="text-muted">{{customerEvent.category}}</small>
    <p class="mb-1" v-if="customerEvent.description">
      {{ customerEvent.description }}
    </p>
    <p class="mb-1" v-else>Umm... you have yet to say what this awesome event is all about...</p>
  </b-list-group-item>
</b-list-group>
</template>

<script>
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
import {
  faEdit,
  faQrcode,
  faChartBar
} from '@fortawesome/free-solid-svg-icons'
import swal from 'sweetalert2'
export default {
  components: {
    FontAwesomeIcon
  },
  props: [
    'customerEvent', 'user'
  ],
  data: function() {
    return {
      chartIcon: faChartBar,
      editIcon: faEdit,
      qrIcon: faQrcode
    }
  },
  computed: {
    published() {
      if (this.customerEvent != null) {
        if (this.customerEvent.status == 'published') {
          return true
        } else {
          return false
        }
      }
    }
  },
  methods: {
    DeleteEvent: function() {
      this.$store.dispatch('DeleteEvent', this.customerEvent)
    },
    ManageTickets() {
      this.$router.push({
        name: 'ManageTickets',
        params: {
          eventId: this.customerEvent._id
        }
      })
    },
    PublishEvent() {
      this.$store.dispatch('publishEvent', this.customerEvent._id).then((response) => {
        if (!response.data.success) {
          swal({
            title: 'Something went wrong!',
            text: 'Please check your connection or contact System Admin',
            type: 'error'
          })
        } else {
          let currentEvent = response.data.updatedEvent
          if (currentEvent._id === this.customerEvent._id) {
            this.customerEvent.status = 'published'
            swal({
              title: 'Event Published',
              text: 'Ok now it\'s share-able',
              type: 'success',
            })
          }
        }
      })
    },
    CancelEvent() {
      this.$store.dispatch('cancelEvent', this.customerEvent._id).then((response) => {
        if (!response.data.success) {
          swal({
            title: 'Something went wrong!',
            text: 'Please check your connection or contact System Admin',
            type: 'error'
          })
        } else {
          let currentEvent = response.data.updatedEvent
          if (currentEvent._id === this.customerEvent._id) {
            this.customerEvent.status = 'unpublished'
            swal({
              title: 'Event Canceled',
              text: ':( We hope it\'s just postponed',
              type: 'warning',
            })
          }
        }
      })
    }
  }
}
</script>
