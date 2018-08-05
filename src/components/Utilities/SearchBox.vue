<template>
<b-container fluid class="search-container">
  <b-row>
    <b-col md="12">
      <div class="search-title">
        Looking for your next adventure?
      </div>
    </b-col>
  </b-row>
  <b-form class="col-md-8 offset-md-2">
    <b-row class="no-gutters">

      <b-col>
        <b-input-group>
          <input class="form-control" v-model="SearchDetails.keywords" type="text" placeholder="Search Keywords for your activity" v-on:input="lookFor" />
          <b-input-group-append>
            <span class="input-group-text">
                      <font-awesome-icon :icon="SearchIcon" />
                    </span>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
  </b-form>

</b-container>
</template>

<script>
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
import {
  faSearch,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
export default {
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      LocationIcon: faMapMarkerAlt,
      SearchIcon: faSearch,
      SearchDetails: {
        location: null,
        keywords: null
      }
    }
  },
  methods: {
    lookFor: function(event) {
      this.$emit('search-request', this.SearchDetails)
    }
  }
}
</script>
