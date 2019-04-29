<template>
<section id="main-showcase" class="showcase grid">
  <div class="carousel-container">
    <carousel :autoplay="true" :dots="false" :loop="true" :nav="false" :responsive="{0:{items: 1}, 768: {items: 2}, 1020:{items: 4}}">
      <img src="https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" />
      <img src="https://images.pexels.com/photos/1449791/pexels-photo-1449791.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" />
      <img src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" />
      <img src="https://i0.wp.com/content.phuket101.net/wp-content/uploads/20180930211152/phuket-full-moon-party3-1024x682.jpg?resize=1024%2C682&ssl=1" />
      <img src="https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=940" style="max-height: 650px" />
    </carousel>
  </div>
</section>
</template>

<style>
#main-showcase {
  background-image: none;
  min-height: 50px;
}

.carousel-container {
  position: relative;
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
