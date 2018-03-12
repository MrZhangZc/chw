<template lang="pug">
  #main
    swiper
    .quickmessage
      lavel 快讯
      span {{quickmessage}}
    shops
</template>
<script>
import Swiper from '../components/swiper'
import Shops from '../components/shops'
export default {
    data () {
      return {
        quickmessage: '本周商品优惠, 上架商品一律5折'
      }
    },
    components: {
        Swiper,
        Shops
    }
}
</script>
<style lang="less" scoped>
@import '~static/less/index.less';
</style>

