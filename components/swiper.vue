<template lang="pug">
  #app
    .swiper-container(ref="slider")
        .swiper-wrapper
            .swiper-slide
                img(src="~/static/img/1.png")
            .swiper-slide
                img(src="~/static/img/2.png")
            .swiper-slide
                img(src="~/static/img/3.png")
            .swiper-slide
                img(src="~/static/img/4.png")
        .swiper-pagination(ref="pagination")
</template>
<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
export default {
  mounted () {
    new Swiper(this.$refs.slider, {
      pagination: {
          el: this.$refs.pagination,
          type : 'progressbar'
      },
      paginationClickable: true,
      speed: 2000,
      loop: true,
      observer:true,
      observeParents:true,
      autoplayDisableOnInteraction : false,
      autoplay: {
          delay: 1000,
          stopOnLastSlide: false,
          disableOnInteraction: true,
      }
    })
  }
}
</script>
<style lang="less" scoped>
@import '../static/less/swiper.less';
</style>



