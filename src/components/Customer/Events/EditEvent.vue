<template>
<b-container>
  <b-row class="m-3">
    <b-col>
      <b-nav>
        <b-nav-item :to="{ name: 'CustomerEventList'}">Back to Event Menu</b-nav-item>
        <b-nav-item :to="{name: 'ManageTickets', params: {eventId: this.eventObj._id, eventObj: this.eventObj}}">ManageTickets</b-nav-item>
      </b-nav>
      <b-card :title="eventObj.title">

        <hr />
        <b-form enctype="multipart/form-data" @submit.prevent="submitChanges">
          <div class="form-row">
            <b-col>
              <b-form-group label="Title">
                <b-form-input type="text" v-model="eventObj.title"></b-form-input>
              </b-form-group>
            </b-col>

            <b-col>
              <b-form-group label="Event Purpose">
                <b-form-select v-model="eventObj.category" :options="categories"></b-form-select>
              </b-form-group>
            </b-col>
          </div>

          <b-form-group label="Description">
            <b-form-textarea placeholder="Enter a description" v-model="eventObj.description"></b-form-textarea>
          </b-form-group>


          <hr />
          <div class="form-row">
            <b-form-group>
              <b-form-radio-group :options="event_frequency_options" v-model="event_frequency"></b-form-radio-group>
            </b-form-group>
          </div>
          <div class="form-row">
            <b-col>
              <b-form-group label="Start Date & Time">
                <b-form-group label="Date">
                  <b-form-input type="date" v-model="startTime.date"></b-form-input>
                </b-form-group>
                <b-form-group label="Time">
                  <b-form-input type="time" v-model="startTime.time"></b-form-input>
                </b-form-group>
              </b-form-group>
            </b-col>

            <b-col>
              <b-form-group label="Finish Date & Time">

                <b-form-group label="Date">
                  <b-form-input type="date" v-model="finishTime.date" :disabled="event_frequency != 'recurring'"></b-form-input>
                </b-form-group>
                <b-form-group label="Time">
                  <b-form-input type="time" v-model="finishTime.time"></b-form-input>
                </b-form-group>
              </b-form-group>
            </b-col>

          </div>


          <hr />
          <b-row>

            <b-col>
              <h4>Flyer</h4>
              <b-img :src="existingFlyer.src" fluid></b-img>
              <hr />
              <b-button variant="outline-info" @click="toggleFlyer">
                <span v-if="!change_flyer">
                  Change Flyer
                </span>
                <span v-else>
                  Nevermind...
                </span>
              </b-button>
              <b-form-group label="Upload a Flyer" v-if="change_flyer">
                <b-form-file accept="image/jpeg, image/png" ref="flyerInput" v-model="imageFile"></b-form-file>
              </b-form-group>
            </b-col>

            <b-col>
              <h4>Location</h4>
              <googleMap :canEdit="true" :MapMarker="map_marker"></googleMap>
              <hr />
              <GmapAutocomplete class="form-control" @place_changed="updateLocationData" :value="currentLocation.formatted_address" v-if="currentLocation != null"></GmapAutocomplete>
              <GmapAutocomplete class="form-control" @place_changed="updateLocationData" v-else></GmapAutocomplete>
            </b-col>
          </b-row>

          <hr />
          <div class="float-right">
            <b-button type="submit" variant="primary">Update Event</b-button>
          </div>

          <b-button-group>
            <b-button v-if="!published" variant="outline-primary" @click="PublishEvent">
              Publish
            </b-button>
            <b-button v-else variant="outline-danger" @click="CancelEvent">
              Cancel Event
            </b-button>
            <b-button variant="outline-danger" @click="DeleteEvent">
              Delete Event
            </b-button>
          </b-button-group>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import swal from 'sweetalert2'
import googleMap from '../../Utilities/GoogleMapComponent.vue'
export default {
  components: {
    googleMap
  },
  data() {
    return {
      errors: [],
      user: this.$store.state.user.user,
      changing_location: false,
      location: null,
      location_Changed: false,
      eventObj: {},
      change_flyer: false,
      imageFile: {},
      // IDEA: Pull event types from the server
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
      ],
      event_frequency: 'same_day',
      event_frequency_options: [{
          text: 'Same Day',
          value: 'same_day'
        },
        {
          text: 'Recurring',
          value: 'recurring'
        }
      ]
    };
  },
  created: function() {
    /* eslint-disable no-console */
    let eventData = this.$store.getters['user/userEventByKey'](this.$route.params.eventkey);
    this.eventObj = eventData
    /* eslint-enable no-console */
  },
  computed: {
    startTime() {
      if (this.eventObj) {
        return {
          date: moment(this.eventObj.startTime).format('YYYY-MM-DD'),
          time: moment(this.eventObj.startTime).format('HH:mm')
        }
      } else {
        return {
          date: moment().format('YYYY-MM-DD'),
          time: moment().format('HH:mm')
        }
      }
    },
    finishTime() {
      if (this.eventObj) {
        return {
          until: false,
          date: moment(this.eventObj.finishTime).format('YYYY-MM-DD'),
          time: moment(this.eventObj.finishTime).format('HH:mm')
        }
      } else {
        return {
          until: false,
          date: moment().format('YYYY-MM-DD'),
          time: moment().format('HH:mm')
        }
      }
    },
    currentLocation() {
      if (this.eventObj != null) {
        if (this.eventObj.location != null) {
          this.location = this.eventObj.location
          let result = JSON.parse(this.eventObj.location)
          return result
        }
      }
    },

    event_has_location() {
      if (this.eventObj != null) {
        if (this.eventObj.location != null) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },

    map_marker() {
      if (this.event_has_location && !this.location_Changed) {
        return JSON.parse(this.eventObj.location)
      } else {
        return JSON.parse(this.location)
      }
    },

    published() {
      if (this.eventObj != null) {
        if (this.eventObj.status == 'published') {
          return true
        } else {
          return false
        }
      }
    },
    existingFlyer() {
      if (this.eventObj.flyer != null) {
        let rawData = JSON.parse(this.eventObj.flyer)
        rawData.exists = true
        rawData.src = process.env.VUE_APP_API_URL + '/' + rawData.filename + '-' + rawData.originalname
        return rawData
      } else {
        return {
          exists: false
        }
      }
    },
    //Shared variable
    Years() {
      let currentYear = moment().year()
      let optionsArray = []
      for (var i = currentYear; i <= currentYear + 10; i++) {
        optionsArray.push({
          value: i,
          text: i
        })
      }
      let obj = {
        selectedYear: currentYear,
        options: optionsArray
      }
      return obj;
    },



    eventStartTimestamp() {
      let timeStampString = this.startTime.date + ' ' + this.startTime.time
      // return timeStampString
      return moment(timeStampString, 'YYYY-MM-DD HH:mm').format()
    },
    eventFinishTimestamp() {

      let timeStampString = this.finishTime.date + ' ' + this.finishTime.time
      // return timeStampString;
      return moment(timeStampString, 'YYYY-MM-DD HH:mm').format()
    }
  },
  methods: {
    /* eslint-disable no-console */
    DeleteEvent: function() {
      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((response) => {
        if (response.value) {
          this.$store.dispatch('events/Delete', this.eventObj._id).then((response) => {
            this.$store.dispatch('user/RemoveEvent', response.data._id).then((response) => {
              swal({
                title: 'Deleted!',
                text: 'Your event has been deleted,',
                type: 'success'
              }).then((response) => {
                if (response.value) {
                  this.$router.push({
                    name: 'CustomerEventList'
                  })
                }
              })
            })
          })
        }
      })

    },
    PublishEvent() {
      this.$store.dispatch('user/PublishEvent', this.eventObj._id).then((response) => {
        console.log(response);
        if (response.success) {
          this.$store.dispatch('user/UpdateEvents', response.updatedEvent)
          swal({
            title: 'Event Updated',
            text: 'Status Updated',
            type: 'success'
          }).then((result) => {
            if (result.value) {
              this.eventObj = response.updatedEvent
            }
          })
        }

      })
    },

    CancelEvent() {
      this.$store.dispatch('user/CancelEvent', this.eventObj._id).then((response) => {
        // console.log(response);
        if (response.success) {
          this.$store.dispatch('user/UpdateEvents', response.updatedEvent)
          swal({
            title: 'Event Updated',
            text: 'Status Updated',
            type: 'success'
          }).then((result) => {
            if (result.value) {
              this.eventObj = response.updatedEvent
            }
          })
        }
      })
    },
    fileSelected(evt) {
      let image = evt.target.files || evt.dataTransfer.files
      this.imageFile = image
    },

    updateLocationData: function(data) {
      // this.location = data
      this.location_Changed = true
      this.location = JSON.stringify(data)
    },

    toggleFlyer() {
      this.change_flyer = !this.change_flyer
    },
    submitChanges() {
      const formData = new FormData();
      if (this.$data.imageFile != null) {
        formData.append('flyer', this.$data.imageFile, this.$data.imageFile.name);
      }
      let data = this.$data;
      data.startTimestamp = this.eventStartTimestamp;
      data.finishTimestamp = this.eventFinishTimestamp;

      formData.append('seedData', JSON.stringify(data))

      let post_url = process.env.VUE_APP_API_URL + '/events/' + this.$data.eventObj._id + '/edit'
      axios({
        url: post_url,
        method: 'POST',
        data: formData,
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'mutlipart/form-data'
        }
      }).then(response => {
        if (response.data.success) {
          // console.log(response.data);
          this.$store.dispatch('user/UpdateEvents', response.data.recieved)
          swal({
            title: 'Event Updated',
            text: 'Changes saved',
            type: 'success'
          }).then((response) => {
            if (response) {
              this.$router.push({
                name: 'CustomerEventList'
              })
            }
          })
        } else {
          if (response.data.status == 401) {
            swal({
              title: 'Not Logged In',
              text: response.data.message,
              type: 'warning'
            }).then((result) => {
              if (result) {
                this.$router.push({
                  name: 'CustomerLogin'
                })
              }
            })
          } else {
            swal({
              title: 'Something Went Wrong',
              text: response.data.message,
              type: 'error'
            })
          }
        }
      }).catch(e => {
        console.log(e);
        swal({
          title: 'Something Went Wrong',
          text: e.message,
          type: 'error'
        })
      })
    }
    /* eslint-enable no-console */
  }
}
</script>
