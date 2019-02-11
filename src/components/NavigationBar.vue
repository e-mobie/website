<template>
<span>

  <header>
    <div class="mobile-header">
      <div class="dropdown-btn"><i class="fas fa-bars"></i></div>
      <div id="logo"><span class="logo-img"><a href="index.html">E-MOBiE</a></span></div>
      <div class="dsk-top-nav">
        <ul>
          <li><a href="#">Entertainment</a></li>
          <li><a href="#">Outdoor Adventures</a></li>
          <li><a href="#">Water Sports</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Contact Us</a></li>
          <li><a class="special-btn-dsktop" href="#"> Sign Up</a></li>
        </ul>

      </div>

    </div>



  </header>
  <div class="dropdown-content">
    <ul>
      <li><a href="#">Entertainment</a></li>
      <li><a href="#">Outdoor Adventures</a></li>
      <li><a href="#">Water Sports</a></li>
      <li><a href="#">About Us</a></li>
      <li><a href="#">Contact Us</a></li>
      <li><a class="special-btn" href="#"> Sign Up</a></li>
    </ul>
  </div>
</span>
</template>

<script>
// import {
//   FontAwesomeIcon
// } from '@fortawesome/vue-fontawesome';
// import {
//   faHome,
//   faSignOutAlt
// } from '@fortawesome/free-solid-svg-icons';
export default {
  // components: {
  //   FontAwesomeIcon
  // },
  data: function() {
    return {
      // homeIcon: faHome,
      // SignOff: faSignOutAlt
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
