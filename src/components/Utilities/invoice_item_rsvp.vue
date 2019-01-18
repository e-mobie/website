<template>
<li class="list-group-item">
  <span v-if="(!checked_in)" class="float-right">Click to Confirm</span>
  <font-awesome-icon :icon="checkIcon" v-if="!checked_in" class="float-right" size="lg">
  </font-awesome-icon>
  Name: {{item.name}} <br />
  Email Address: {{item.email}} <br />
</li>
</template>

<script>
export default {
  props: [
    'item'
  ],
  computed: {
    checked_in() {
      if ((item.scanned_in != true) || (item.signed_in != true)) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
