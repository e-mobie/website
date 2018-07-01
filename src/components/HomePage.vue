<template>
<span>
    <b-carousel>
      <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=58">
      </b-carousel-slide>
      <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=53">
      </b-carousel-slide>
      <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=55">
      </b-carousel-slide>
    </b-carousel>
    <b-container fluid>
      <b-card-group columns>
        <EventThumbnail v-for="flyer in PublicFlyers" v-bind:key="flyer._id" v-bind:flyer="flyer">
        </EventThumbnail>
      </b-card-group>
    </b-container>
  </span>
</template>

<style>

</style>

<script>
import EventThumbnail from './Utilities/PublicEventThumbnail.vue'
export default {
  components: {
    EventThumbnail
  },
  computed: {
    PublicFlyers() {
      return this.$store.state.events.publishedEvents
    }
  }
}
</script>
