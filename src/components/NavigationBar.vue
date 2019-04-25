<template>
<span>
  <!-- <header>

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
  </header> -->


  <header>
    <div class="mobile-header">
      <div class="dropdown-btn" @click="open = !open"><i class="fas fa-bars"></i></div>
      <div id="logo"><span class="logo-img">
          <router-link :to="{ name: 'HomePage', params: {} }">E-MOBiE</router-link>
        </span></div>
      <div class="dsk-top-nav">
        <ul>
          <li><a href="#">Entertainment</a></li>
          <li>
            <router-link :to="{ name: 'AboutPage', params: {} }">About Us</router-link>
          </li>
          <li><a href="#">Contact Us</a></li>
          <li v-if="!LoggedIn">
            <router-link :to="{ name: 'CustomerLogin', params: {} }" class="special-btn-dsktop">Sign In</router-link>
          </li>
          <span v-else>
            <li>
              <router-link :to="{ name: 'CustomerTickets', params: { email: customer.email } }" class="home-btn">
                <font-awesome-icon :icon="homeIcon"></font-awesome-icon>
              </router-link>
            </li>
            <li>
              <a href="#" @click="CustomerLogout">
                <font-awesome-icon :icon="SignOff"></font-awesome-icon>
              </a>
            </li>
          </span>
        </ul>

      </div>

    </div>

  </header>
  <VueSlideToggle :open="open">
    <div class="dropdown-content">
      <ul>
        <li><a href="#">Entertainment</a></li>
        <li>
          <router-link :to="{ name: 'About', params: {} }">About Us</router-link>
        </li>
        <li><a href="#">Contact Us</a></li>
        <li v-if="!LoggedIn">
          <router-link :to="{ name: 'CustomerLogin', params: {} }" class="special-btn-dsktop">Sign In</router-link>
        </li>
        <span v-else>
          <li>
            <router-link :to="{ name: 'CustomerTickets', params: { email: customer.email } }" class="home-btn">
              <font-awesome-icon :icon="homeIcon"></font-awesome-icon>
            </router-link>
          </li>
          <li>
            <a href="#" @click="CustomerLogout">
              <font-awesome-icon :icon="SignOff"></font-awesome-icon>
            </a>
          </li>
        </span>

      </ul>
    </div>
  </VueSlideToggle>

</span>
</template>

<script>
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import {
  VueSlideToggle
} from 'vue-slide-toggle';
export default {
  components: {
    FontAwesomeIcon,
    VueSlideToggle
  },
  data: function() {
    return {
      homeIcon: faHome,
      SignOff: faSignOutAlt,
      open: false
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
