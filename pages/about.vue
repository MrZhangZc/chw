<template>
  <section class="container">
    <img src="../assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
  </section>
</template>
<script>
import { mapState } from 'vuex'
export default {
  asyncData ({ req }) {
    return {
      name: req ? 'server' : 'client'
    }
  },
  head () {
    return {
      title: `zzc啊`
    }
  },
  computed: {
    ...mapState([
      'baseUrl'
    ])
  },
  beforeMount() {
    const wx = window.wx
    const url = window.location.href
    console.log('我访问的地址是：', url)

    this.$store.dispatch('getWechatSignature', encodeURIComponent(url)).then(res => {
      if (res.data.success) {
        const parmas = res.data.parmas

        wx.config({
          debug: true,
          appId: parmas.appId,
          timestamp: parmas.timestamp,
          nonceStr: parmas.nonceStr,
          signature: parmas.signature,
          jsApiList: [
            'previewImage',
            'hideAllNonBaseMenuItem',
            'showMenuItems' ]
        })
        wx.ready(() => {
          wx.hideAllNonBaseMenuItem()
          console.log('成功调用jssdk')
        })
      }
    })
  }
}
</script>

<style scoped>
.title
{
  margin-top: 50px;
}
.info
{
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button
{
  margin-top: 50px;
}
</style>
