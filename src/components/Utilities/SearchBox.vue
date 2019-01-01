<template>
<b-container fluid class="search-container">
  <b-row>
    <b-col md="12">
      <div class="search-title">
        Looking for your next adventure?
      </div>
    </b-col>
  </b-row>

  <div class="row search-row">
    <div class="col-12">
      <div class="section-wrapper">
        <div class="section location-section">
          <img src="img/location-marker.png" alt="">
          <GmapAutocomplete class="location-input" @place_changed="setLocation" v-model="locationModel.formatted_address"></GmapAutocomplete>
          <button class="btn" type="button" @click="detectLocation" :disabled="searching">
            <img src="img/gps-marker.png" alt="">
            <span v-if="!searching">DETECT LOCATION</span>
            <span v-else>SEARCHING...</span>
          </button>
        </div>
        <div class="section-border"></div>
        <div class="section text-section">
          <input type="text" name="location" placeholder="Search keywords for your activity..." v-model="SearchDetails.keywords" @input="lookFor">
          <a href="#">
            <img src="img/search-icon.png" alt="">
          </a>
        </div>
      </div>

      <p class="search-summary">
        {{search_summary}}
      </p>
      <button type="button" class="btn btn-default btn-sm" @click="clearFilters">Reset Search</button>
    </div>
  </div>


</b-container>
</template>
<style lang="scss">
@import '../../assets/_variables.scss';
.location-input {
    display: inherit;
}

.search-summary {
    color: $white;
}
</style>
<script>
import {
  gmapApi
} from 'vue2-google-maps'
import Fuse from 'fuse.js'
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
import {
  faSearch,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert2'
export default {
  components: {
    FontAwesomeIcon,
  },
  props: ['events', 'search_summary'],
  mounted() {
    let options = {
      keys: ['title'],
      id: '_id'
    }
    this.fuse = new Fuse(this.events, options)
  },
  data: function() {
    return {
      searching: false,
      fuse: {},
      locationModel: {},
      LocationIcon: faMapMarkerAlt,
      SearchIcon: faSearch,
      SearchDetails: {
        location: null,
        keywords: null
      }
    }
  },
  methods: {
    clearFilters: function() {
      this.setLocation({})
    },
    lookFor: function(e) {
      this.$emit('search-request', this.fuse.search(e.target.value));
    },
    setLocation: function(e) {
      this.locationModel = e
      this.$emit('location-filter', e)
    },
    findUserLocation(position, error) {
      let latlang = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      let geocoder = new this.google.maps.Geocoder;
      geocoder.geocode({
        'location': latlang
      }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.locationModel = results[0]
            this.setLocation(results[0])
            this.searching = false
          }
        }
      })
    },
    detectLocation: function() {
      if (navigator.geolocation) {
        this.searching = true
        navigator.geolocation.getCurrentPosition(this.findUserLocation)
      } else {
        swal({
          title: 'Location Unavailable',
          text: 'Geolocation is not supported by this browser.',
          type: 'error'
        })
      }
    }
  },
  computed: {
    google: gmapApi,
    no_keywords() {
      if (this.SearchDetails.keywords == '' || this.SearchDetails.keywords == null) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
