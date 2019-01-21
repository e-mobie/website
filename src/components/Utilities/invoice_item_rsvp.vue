<template>
<button class="list-group-item" :disabled="checked_in" @click="pass_verification">
  <span v-if="plus1" style="color: purple;">
    <span style="color: purple" v-if="!checked_in">
      CLICK TO CONFIRM PLUS ONE HERE
    </span>
    <span style="color: green" v-else>
      PLUS ONE CONFIRMED
    </span>
  </span>

  <span v-else>
    <div style="color: green;">
      <font-awesome-icon :icon="checkIcon" v-if="checked_in == true" class="float-right" size="lg">
      </font-awesome-icon>
      <span v-if="checked_in == true" class="float-right">VERIFIED</span>
    </div>
    <span v-if="checked_in == false" class="float-right" style="color: red;">Click to Confirm</span>
    <div style="float: left">
      Name: {{name}} <br />
      Email Address: {{item.email}} <br />
    </div>
  </span>
</button>
</template>

<script>
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
import {
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export default {
  components: {
    FontAwesomeIcon,
    faCheckCircle
  },
  data() {
    return {
      checkIcon: faCheckCircle,
    }
  },
  props: [
    'item',
    'array_index'
  ],
  computed: {
    name() {
      if (this.item.name != null) {
        return this.item.name
      } else {
        return ''
      }
    },

    checked_in() {
      if ((this.item.scanned_in != null) && (this.item.outstanding != null)) {
        if ((this.item.outstanding == true) && (this.item.scanned_in == false)) {
          return false
        } else if ((this.item.outstanding == false) && (this.item.scanned_in == false)) {
          return false
        } else if ((this.item.outstanding == false) && (this.item.scanned_in == true)) {
          return true
        } else {
          return true
        }
      }
      if (this.item.scanned_in != null) {
        if (this.item.scanned_in != true) {
          return false
        } else {
          return true
        }
      } else if (this.item.outstanding != null) {
        console.log('guest item');
        if (this.item.outstanding == true) {
          return false
        } else {
          return true
        }
      }
    },

    verification_info() {
      if (this.item.email != null) {
        return {
          email: this.item.email,
          index: this.array_index,
          rsvp: true
        }
      } else {
        return {
          index: this.array_index,
          rsvp: false
        }
      }
    },
    plus1() {
      if (this.item.guest_spot) {
        return true
      } else {
        return false
      }
    }
  },

  methods: {
    pass_verification() {
      this.$emit('guest_verified', this.verification_info)
    }
  }
}
</script>
