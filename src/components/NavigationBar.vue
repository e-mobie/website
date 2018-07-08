<template>
<b-navbar toggleable="md" type="dark" variant="dark">

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  <b-navbar-brand :to="{ name: 'HomePage'}">E-mobie</b-navbar-brand>

  <b-collapse is-nav id="nav_collapse">
    <b-navbar-nav>
      <b-nav-item>Entertainment</b-nav-item>
      <b-nav-item>Outdoor Adventures</b-nav-item>
      <b-nav-item>Water Sports</b-nav-item>
      <b-nav-item>Everything else...</b-nav-item>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <b-button-group>
        <b-button variant="outline-info" :to="{name: 'Customer' , params: { email: customer.email }}" v-if="LoggedIn">
          <font-awesome-icon :icon="homeIcon" />
        </b-button>
        <b-button variant="outline-warning" @click="CustomerLogout" v-if="LoggedIn">
          <font-awesome-icon :icon="SignOff"></font-awesome-icon>
        </b-button>
        <b-button variant="info" :to="{ name: 'CustomerLogin' }" v-if="!LoggedIn">Sign In</b-button>
      </b-button-group>
    </b-navbar-nav>
  </b-collapse>

</b-navbar>
</template>

<script>
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
export default {
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      homeIcon: faHome,
      SignOff: faSignOutAlt
    }
  },
  computed: {
    LoggedIn() {
      return this.$store.getters.userLoggedIn
    },
    customer() {
      return this.$store.state.user.user
    }
  },
  methods: {
    CustomerLogout() {
      this.$store.dispatch('user/LogOut')
    }
  }
}
</script>
