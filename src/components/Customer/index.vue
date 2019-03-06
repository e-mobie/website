<template>
<div class="container" id="content">
  <div class="row">
    <div class="col-lg-12">
      <div class="card" style="border-color: #0f35f2;">
        <div class="card-header" style="background-color: #1036f2; color: white;">
          <div class="media">
            <img class="mr-3 " :src="profile_picture" style="max-width:95px;" alt="Generic placeholder image">
            <div class="media-body">
              <h5 class="mt-0">{{ this.$store.state.user.user.username }}</h5>
              <p v-if="this.$store.state.user.user.status == null">
                *** No Status ***
              </p>
              <p v-else>
                {{ this.$store.state.user.user.status}}
              </p>
              <p>
                <router-link :to="{ name: 'CustomerPreferences', params: {} }" class="btn btn-outline-primary" id="settings-button" role="button">
                  Settings
                </router-link>
              </p>
            </div>
          </div>
        </div>

        <nav class="nav nav-tabs nav-fill">

          <router-link class="nav-item nav-link" :to="{ name: 'CustomerTickets', params: {} }">My Purchases</router-link>
          <router-link class="nav-item nav-link" :to="{ name: 'CustomerEventList', params: {} }">My Events</router-link>


          <a href="#" class="nav-item nav-link">My Favorites <small><i>coming soon</i></small></a>


          <a href="#" class="nav-item nav-link">My Friends <small><i>coming soon</i></small></a>


        </nav>
        <router-view></router-view>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  mounted() {
    this.addWhiteBody()
  },
  destroyed() {
    this.removeWhiteBody()
  },
  sockets: {
    customerNotifications(data) {
      if (data.to === this.$store.state.user.user.email) {
        /* eslint-disable no-console */
        switch (data.message) {
          case 'Ticket Created':
            this.$store.dispatch('UpdateCreatedTickets', data.data)
            break;

          case 'Event Created':
            this.$store.dispatch('UpdateEvents', data.redis.data);
            break;
          default:
        }
        /* eslint-enable no-console */
      }
    }
  },

  computed: {
    profile_picture() {
      let pic_string = this.$store.state.user.user.ProfilePic
      if (pic_string != null) {
        let picObj = JSON.parse(pic_string)
        let picURL = process.env.VUE_APP_API_URL + '/' + picObj.filename + '-' + picObj.originalname
        return picURL
      } else {
        return "http://via.placeholder.com/100x100"
      }
    }
  },
  methods: {
    addWhiteBody() {
      const el = document.body;
      el.classList.add('white-body')
    },
    removeWhiteBody() {
      const el = document.body;
      el.classList.remove('white-body')
    }
  }
}
</script>

<style>
#content {
  margin-top: 50px;
  margin-bottom: 20px;
}

#settings-button {
  color: white;
  border-color: white;
  background-color: transparent;
  background-image: none;
}

#settings-button:hover {
  color: #6610f2;
  border-color: #6610f2;
  background-color: white;
  background-image: none;
}

#settings-button:active {
  color: #6610f2;
  border-color: #6610f2;
  background-color: white;
  background-image: none;
}
</style>
