<template>
<section id="showcase" class="showcase grid">
  <carousel :items="1" :autoplay="true" :dots="false" :loop="true" :nav="false">
    <img src="https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" />
    <img src="https://images.pexels.com/photos/1449791/pexels-photo-1449791.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" />
    <img src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" />
    <img src="https://i0.wp.com/content.phuket101.net/wp-content/uploads/20180930211152/phuket-full-moon-party3-1024x682.jpg?resize=1024%2C682&ssl=1" />
    <img src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=940" style="max-height: 650px" />
  </carousel>
</section>
</template>

<style>
#showcase {
  background-image: none;
  background-color: none;
}
</style>

<script>
import carousel from 'v-owl-carousel'
export default {
  name: 'ad-billboard',
  components: {
    carousel
  }
}
</script>
