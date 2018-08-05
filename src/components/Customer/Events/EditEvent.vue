<template>
<b-container>
  <b-row class="m-3">
    <b-col>
      <b-card :title="eventObj.title">
        <b-button-group>
          <b-button v-if="!published" variant="outline-primary" size="sm" @click="PublishEvent">
            Publish
          </b-button>
          <b-button v-else variant="outline-danger" @click="CancelEvent" size="sm">
            Cancel Event
          </b-button>
          <b-button variant="outline-primary" :to="{name: 'ManageTickets', params: {eventId: this.eventObj._id}}">
            Manage Tickets
          </b-button>
          <b-button variant="outline-danger" @click="DeleteEvent">
            Delete Event
          </b-button>
          <b-button variant="outline-secondary" :to="{ name: 'CustomerEventList'}"> Back to Event Menu</b-button>
        </b-button-group>
        <hr />
        <b-form enctype="multipart/form-data" @submit.prevent="submitChanges">
          <b-form-group label="Title">
            <b-form-input type="text" v-model="eventObj.title"></b-form-input>
          </b-form-group>

          <b-form-group label="Event Purpose">
            <b-form-select v-model="eventObj.category" :options="categories"></b-form-select>
          </b-form-group>

          <b-form-group label="Description">
            <b-form-textarea placeholder="Enter a description" v-model="eventObj.description"></b-form-textarea>
          </b-form-group>

          <b-form-group label="Upload a Flyer" v-if="!existingFlyer.exists">
            <b-form-file accept="image/jpeg, image/png" ref="flyerInput" v-model="imageFile"></b-form-file>
          </b-form-group>
          <hr />
          <b-form-group label="Start Date & Time" label-size="lg" horizontal>
            <b-form-group label="Month" label-class="text-sm-right" horizontal>
              <b-form-select v-model="startTime.month" :options="Months.options"></b-form-select>
            </b-form-group>

            <b-form-group label="Date" label-class="text-sm-right" horizontal>
              <b-form-select v-model="startTime.date" :options="StartDays.options"></b-form-select>
            </b-form-group>

            <b-form-group label="Year" label-class="text-sm-right" horizontal>
              <b-form-select v-model="startTime.year" :options="Years.options"></b-form-select>
            </b-form-group>

            <b-form-group label="Hour" label-class="text-sm-right" horizontal>
              <b-form-select v-model="startTime.hour" :options="Hours"></b-form-select>
            </b-form-group>

            <b-form-group label="Minute" label-class="text-sm-right" horizontal>
              <b-form-select v-model="startTime.min" :options="Minutes"></b-form-select>
            </b-form-group>

            <b-form-group label="AM/PM" label-class="text-sm-right" horizontal>
              <b-form-select v-model="startTime.amPm">
                <option value="AM">
                  AM
                </option>
                <option value="PM">
                  PM
                </option>
              </b-form-select>
            </b-form-group>
          </b-form-group>
          <hr />
          <b-form-group label="Finish Date & Time" label-size="lg" horizontal>
            <b-form-group label="Month" label-class="text-sm-right" horizontal>
              <b-form-select v-model="finishTime.month" :options="Months.options"></b-form-select>
            </b-form-group>

            <b-form-group label="Date" label-class="text-sm-right" horizontal>
              <b-form-select v-model="finishTime.date" :options="StartDays.options"></b-form-select>
            </b-form-group>

            <b-form-group label="Year" label-class="text-sm-right" horizontal>
              <b-form-select v-model="finishTime.year" :options="Years.options"></b-form-select>
            </b-form-group>

            <b-form-group label="Hour" label-class="text-sm-right" horizontal>
              <b-form-select v-model="finishTime.hour" :options="Hours"></b-form-select>
            </b-form-group>

            <b-form-group label="Minute" label-class="text-sm-right" horizontal>
              <b-form-select v-model="finishTime.min" :options="Minutes"></b-form-select>
            </b-form-group>

            <b-form-group label="AM/PM" label-class="text-sm-right" horizontal>
              <b-form-select v-model="finishTime.amPm">
                <option value="AM">
                  AM
                </option>
                <option value="PM">
                  PM
                </option>
              </b-form-select>
            </b-form-group>
          </b-form-group>
          <hr />

          <b-card header-tag="header" v-if="existingFlyer.exists" :img-src="existingFlyer.src" title="Current Flyer" img-bottom>
            <b-button variant="outline-info" size="sm" class="float-right">Change Flyer</b-button>
          </b-card>

          <b-form-group>
            <googleMap @location_Changed="updateLocationData" :canEdit="true" :MapMarker="currentLocation"></googleMap>
          </b-form-group>
          <hr />
          <div class="float-right">
            <b-button type="submit" variant="primary">Update Event</b-button>
          </div>
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
      location: null,
      eventObj: {},
      imageFile: {},
      has_location: false,
      startTime: {
        year: moment().year(),
        month: moment().month(),
        date: moment().date(),
        hour: 12,
        min: 0,
        amPm: "AM"
      },
      finishTime: {
        year: moment().year(),
        month: moment().month(),
        date: moment().date(),
        hour: 12,
        min: 0,
        amPm: 'AM'
      },
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
  created: function() {
    /* eslint-disable no-console */
    let eventData = this.$store.getters['user/userEventByKey'](this.$route.params.eventkey);
    this.eventObj = eventData
    /* eslint-enable no-console */
  },
  computed: {
    currentLocation() {
      if (this.eventObj != null) {
        if (this.eventObj.location != null) {
          let result = JSON.parse(this.eventObj.location)
          this.has_location = true
          return result
        }
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
    //Shared variable
    Months() {
      let currentMonth = moment().month()
      let obj = {
        selectedMonth: currentMonth,
        options: [{
            value: 0,
            text: "January"
          },
          {
            value: 1,
            text: "February"
          },
          {
            value: 2,
            text: "March"
          },
          {
            value: 3,
            text: "April"
          },
          {
            value: 4,
            text: "May"
          },
          {
            value: 5,
            text: "June"
          },
          {
            value: 6,
            text: "July"
          },
          {
            value: 7,
            text: "August"
          },
          {
            value: 8,
            text: "September"
          },
          {
            value: 9,
            text: "October"
          },
          {
            value: 10,
            text: "November"
          },
          {
            value: 11,
            text: "December"
          }
        ]
      }
      return obj
    },
    /* eslint-disable no-console */
    StartDays() {
      let optionsArray = []
      let month = this.startTime.month + 1
      for (var i = 1; i <= moment(this.startTime.year + '-' + month, "YYYY-MM").daysInMonth(); i++) {
        optionsArray.push({
          value: i,
          text: i
        })
      }

      let currentDate = moment().date()
      let obj = {
        selectedDate: currentDate,
        options: optionsArray
      }
      return obj;
    },
    /* eslint-disable no-console */
    FinishDays() {
      let optionsArray = []
      let month = this.startTime.month + 1
      for (var i = 1; i <= moment(this.finishTime.year + '-' + month, "YYYY-MM").daysInMonth(); i++) {
        optionsArray.push({
          value: i,
          name: i
        })
      }

      let currentDate = moment().date()
      let obj = {
        selectedDate: currentDate,
        options: optionsArray
      }

      return obj;
    },
    Minutes() {
      let optionsArray = []
      for (var i = 0; i < 60; i++) {
        if (i < 10) {
          optionsArray.push({
            value: i,
            text: '0' + i
          })
        } else {
          optionsArray.push({
            value: i,
            text: i
          })
        }
      }
      return optionsArray;
    },
    Hours() {
      let optionsArray = []
      for (var i = 1; i <= 12; i++) {
        optionsArray.push({
          value: i,
          text: i
        })
      }
      return optionsArray;
    },
    eventStartTimestamp() {
      let year = this.startTime.year;
      let month = this.startTime.month + 1;
      if (month <= 9) {
        month = '0' + month
      }
      let day = this.startTime.date;
      if (day <= 9) {
        day = '0' + day
      }
      let dateString = year + '-' + month + '-' + day;
      let minute = this.startTime.min;
      let hour = this.startTime.hour;
      if (hour <= 9) {
        hour = '0' + hour
      }
      let am_pm = this.startTime.amPm;
      if (minute <= 9) {
        minute = '0' + minute;
      }
      let timeString = hour + ':' + minute + ':00' + ' ' + am_pm

      let timeStampString = dateString + ' ' + timeString
      // return timeStampString
      return moment(timeStampString, 'YYYY-MM-DD hh:mm:ss a', true).format()
    },
    eventFinishTimestamp() {
      let year = this.finishTime.year;
      let month = this.finishTime.month + 1;
      if (month <= 9) {
        month = '0' + month
      }
      let day = this.finishTime.date;
      if (day <= 9) {
        day = '0' + day
      }
      let dateString = year + '-' + month + '-' + day;
      // moment().utc()
      let minute = this.finishTime.min;
      let hour = this.finishTime.hour;
      if (hour <= 9) {
        hour = '0' + hour
      }
      let am_pm = this.finishTime.amPm;
      if (minute <= 9) {
        minute = '0' + minute;
      }
      let timeString = hour + ':' + minute + ':00 ' + am_pm

      let timeStampString = dateString + ' ' + timeString
      // return timeStampString;
      return moment(timeStampString, 'YYYY-MM-DD hh:mm:ss a', true).format()
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
        // if (!response.data.success) {
        //   swal({
        //     title: 'Something went wrong!',
        //     text: 'Please check your connection or contact System Admin',
        //     type: 'error'
        //   })
        // } else {
        //   let currentEvent = response.data.updatedEvent
        //   if (currentEvent._id === this.customerEvent._id) {
        //     this.customerEvent.status = 'published'
        //     swal({
        //       title: 'Event Published',
        //       text: 'Ok now it\'s share-able',
        //       type: 'success',
        //     })
        //   }
        // }

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
      this.location = JSON.stringify(data)
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
