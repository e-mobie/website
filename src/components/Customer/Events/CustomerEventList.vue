<template>
<span>
  <b-row v-if="eventCounter < 1">
    <b-col>
      <b-jumbotron header="Having Something Big? :)" lead="Create an event and share it with the world, or keep it close to home and only invite your bestest buds!">
        <hr />
        <b-button size="lg" variant="success" v-b-modal.createEventForm>
          Create an Event
        </b-button>
      </b-jumbotron>
    </b-col>
  </b-row>
  <b-row v-else>
    <b-col>
      <b-card>
        <b-card-body>
          Your Events: {{eventCounter}}
          <span class='float-right'>
            <b-button variant="primary" size="sm" v-b-modal.createEventForm>
              <font-awesome-icon :icon="PlusIcon"></font-awesome-icon>
              Create a new Event
            </b-button>
          </span>
</b-card-body>
<b-list-group>
  <CustomerEventListItem v-for="item in userEvents" :key="item._id" :customer-event="item" :user="user"></CustomerEventListItem>
</b-list-group>
</b-card>
</b-col>
</b-row>

<b-modal ref="createEventForm" id="createEventForm" hide-footer title="Before we get started...">
  <p class="lead">
    We just need some general information about your event
  </p>
  <form @submit.prevent="seedEvent">
    <b-form-group label="Is this a Public or Private event?">
      <b-form-radio-group v-model="eventType" :options="eventStatus"></b-form-radio-group>
    </b-form-group>
    <b-form-group label="What is the purpose of your event?">
      <b-form-select v-model="eventPurpose" :options="categories"></b-form-select>
    </b-form-group>
    <b-form-group label="Now... Let's give it a name :)">
      <b-form-input type="text" v-model="eventName" placeholder="Just another Awesome event :D"></b-form-input>
    </b-form-group>
    <div class="ml-auto">
      <b-button-group>
        <b-button variant="secondary">Not ready yet..</b-button>
        <b-button type="submit" variant="success">Awesome-sauce, let's get started :)</b-button>
      </b-button-group>
    </div>
  </form>
</b-modal>
</span>
</template>

<script>
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'
import {
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import Loader from 'vue-spinner/src/PulseLoader.vue'
import CustomerEventListItem from './CustomerEventListItem.vue'
import swal from 'sweetalert2'
export default {
  components: {
    CustomerEventListItem,
    Loader,
    FontAwesomeIcon
  },
  data() {
    return {
      PlusIcon: faPlus,
      loading: false,
      loaderColor: '#fff',
      loaderSize: '6px',
      user: this.$store.state.user.user,
      eventPurpose: 'Entertainment',
      eventName: null,
      eventType: "Public",
      errors: [],
      eventStatus: [{
          value: 'Public',
          text: 'Public'
        },
        {
          value: 'Private',
          text: 'Private (Coming Soon)',
          disabled: true
        }
      ],
      categories: [{
          value: 'Entertainment',
          text: 'Entertainment'
        },
        {
          value: 'Social',
          text: 'Social Gathering'
        },
        {
          value: 'Networking',
          text: 'Networking'
        },
        {
          value: 'Fundraiser',
          text: 'Fundraiser'
        },
        {
          value: 'Education',
          text: 'Education & Awareness'
        },
        {
          value: 'Religious',
          text: 'Spiritual & Religious'
        }
      ]
    };
  },
  mounted: function() {
    this.$store.dispatch('user/initCustomerEvents')
  },
  computed: {
    userEvents() {
      return this.$store.state.user.Events;
    },
    eventCounter() {
      return this.userEvents.length
    }
  },
  methods: {
    validateForm() {

    },
    seedEvent() {
      this.loading = true
      let data = {
        // user: this.user,
        eventPurpose: this.eventPurpose,
        eventName: this.eventName,
        eventType: this.eventType
      }
      this.$store.dispatch('events/Create', data).then(
        response => {
          this.loading = false
          // this.$refs.createEventForm.hide()
          /* eslint-disable no-console */
          if (response.data.success) {
            this.$store.dispatch('user/UpdateEvents', response.data.response)
            this.$refs.createEventForm.hide()
            swal({
              title: 'Event Created',
              text: 'Ok now it\'s time for more details, add more info under the edit screen',
              timer: 4500,
              type: 'success',
              showConfirmButton: false
            }).then((result) => {
              if (result) {
                this.$data.eventName = "",
                  this.$data.eventType = "",
                  this.$data.eventPurpose = null
              }
            })
          } else {
            if (response.data.status == 401) {
              swal({
                title: response.message,
                text: 'Please login',
                type: 'warning'
              }).then((result) => {
                if (result) {
                  this.$router.push({
                    name: 'CustomerLogin'
                  })
                }
              })
            }
          }
          /* eslint-enable no-console */
        }
      ).catch((e) => {
        this.loading = false
        swal({
          title: "Something Went Wrong",
          text: e.message,
          type: 'error'
        })
      })
    },
  }
}
</script>
