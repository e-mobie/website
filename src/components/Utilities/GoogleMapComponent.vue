<template>
<b-card title="Location">
  <GmapMap :center="center" :zoom="zoom" map-type-id="roadmap" :style="mapStyle" :class="mapClass">
    <GmapMarker :position="MapGeoMarker.geometry.location" v-if="hasMarker">
    </GmapMarker>
  </GmapMap>
  <span v-if="canEdit">
    <hr />
    <b-button variant="info" size="sm" v-if="!editing" class="float-right" @click="isEditing">Change Location</b-button>
    <GmapAutocomplete class="form-control" @place_changed="updateLocation" :required="!hasMarker" v-if="editing"></GmapAutocomplete>
    <b-button variant="outline-warning" @click="notEditing" v-if="editing" size="sm" class="float-right">Cancel</b-button>
  </span>
</b-card>
</template>

<style>

</style>

<script>
export default {
  mounted: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
      })
    } else {
      this.errors.push({
        node: 'Location',
        message: "Location data not available"
      })
    }
  },
  data: function() {
    return {
      currentLocation: {},
      userlocation: {},
      raw_location_data: {},
      editing: false
    }
  },
  props: {
    canEdit: {
      type: Boolean
    },
    MapMarker: {
      type: Object,
    },
    mapStyle: {
      default: function() {
        return {
          width: '500px',
          height: '300px'
        }
      }
    },
    mapClass: {
      default: function() {
        return {
          'img-responsive': true
        }
      }
    },
    zoom: {
      type: Number,
      default: 8
    }
  },
  computed: {
    hasMarker: function() {
      if (this.MapMarker != null) {
        return true
      } else {
        return false
      }
    },
    MapGeoMarker: function() {
      if (this.hasMarker) {
        return this.MapMarker
      } else {
        return {
          geometry: {
            location: {
              lat: 25.06,
              lng: -77.345
            }
          }
        }
      }
    },
    center: function() {
      if (this.MapGeoMarker.geometry.location != null) {
        return this.MapGeoMarker.geometry.location
      } else {
        return {
          lat: 25.0479835,
          lng: -77.355413
        }
      }
    },
  },
  methods: {
    updateLocation: function(data) {
      this.$emit('location_Changed', data)
      this.userlocation = data
    },

    isEditing: function() {
      this.editing = true
    },
    notEditing: function() {
      this.editing = false
    }
  }
}
</script>
