<template>
<b-navbar toggleable="md" type="light" variant="light" class="navbar-expand-lg">

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
  <b-navbar-brand :to="{ name: 'HomePage'}">E-MOBiE</b-navbar-brand>

  <b-collapse is-nav id="nav_collapse">

    <b-navbar-nav class="ml-auto">
      <b-nav-item>Entertainment</b-nav-item>
      <b-nav-item>Outdoor Adventures</b-nav-item>
      <b-nav-item>Water Sports</b-nav-item>
      <b-button-group class="btn-container" v-if="LoggedIn">
        <b-button variant="outline-info" :to="{name: 'CustomerTickets' , params: { email: customer.email }}">
          <font-awesome-icon :icon="homeIcon" />
        </b-button>
        <b-button variant="outline-warning" @click="CustomerLogout">
          <font-awesome-icon :icon="SignOff"></font-awesome-icon>
        </b-button>
      </b-button-group>
      <b-button variant="primary" :to="{ name: 'CustomerLogin' }" v-if="!LoggedIn" size="sm">Sign In</b-button>

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
      this.$router.push({
        name: 'CustomerLogin'
      })
    }
  }
}
</script>
