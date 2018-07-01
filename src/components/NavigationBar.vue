<template>
<b-navbar toggleable="md" type="dark" variant="dark">

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  <b-navbar-brand href="#">E-mobie</b-navbar-brand>

  <b-collapse is-nav id="nav_collapse">
    <b-navbar-nav>
      <b-nav-item>Entertainment</b-nav-item>
      <b-nav-item>Outdoor Adventures</b-nav-item>
      <b-nav-item>Water Sports</b-nav-item>
      <b-nav-item>Everything else...</b-nav-item>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <b-button variant="info" :to="{name: 'Customer' , params: { email: customer.email }}">
        <font-awesome-icon :icon="homeIcon" />
      </b-button>
      <b-button variant="info" :to="{ name: 'CustomerLogin' }" v-if="!LoggedIn">Sign In</b-button>
    </b-navbar-nav>
  </b-collapse>

</b-navbar>
</template>

<style>

</style>

<script>
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
import {
  faHome
} from '@fortawesome/free-solid-svg-icons';
export default {
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      homeIcon: faHome
    }
  },
  computed: {
    LoggedIn() {
      return this.$store.getters.userLoggedIn
    },
    customer() {
      return this.$store.state.user.user
    }
  }
}
</script>
