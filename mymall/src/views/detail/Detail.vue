<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" :current-index="currentIndex"/>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            :probe-type="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="goodsList"/>
    </scroll>
    <back-top @click.native="backTop" v-show="isShowBackTop"/>
    <detail-bottom-bar @addToCart="addToCart"/>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import DetailBottomBar from './childComps/DetailBottomBar'
  import CartButton from './childComps/CartButton'

  import GoodsList from 'components/content/goods/GoodsList'

  import Scroll from 'components/common/scroll/Scroll'

  import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail";
  import {backTopMixin, itemListenerMixin} from "common/mixin";
  import {mapActions} from 'vuex'

  import Toast from 'components/common/toast/Toast'

  export default {
    name: "Detail",
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        goodsList: [],
        themeTops: [],
        currentIndex: 0
      }
    },
    mixins: [itemListenerMixin, backTopMixin],
    created() {
      this.iid = this.$route.params.iid;
      // 根据 id 获取详细数据
      getDetail(this.iid).then(res => {
        const data = res.result
        // 轮播图数据
        this.topImages = data.itemInfo.topImages
        // 商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // 店铺信息
        this.shop = new Shop(data.shopInfo)
        // 商品详细信息
        this.detailInfo = data.detailInfo
        // 保存参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // 保存评论数据
        if (data.rate.list) {
          this.commentInfo = data.rate.list[0];
        }
      })
      // 请求推荐数据
      getRecommend().then(res => {
        this.goodsList = res.data.list
      })
    },
    mounted() {
    },
    destroyed() {
      this.$bus.off('itemImageLoad', this.itemImgListener)
    },
    methods: {
      contentScroll(position) {
        this.isShowBackTop = (-position.y) > 1000
      },
      listenScrollTheme(position) {
        let length = this.themeTops.length;
        for (let i = 0; i < length; i++) {
          let iPos = this.themeTops[i];
          if (position >= iPos && position < this.themeTops[i + 1]) {
            if (this.currentIndex !== i) {
              this.currentIndex = i;
            }
            break;
          }
        }
      },
      imageLoad() {
        this.$refs.scroll.refresh()

        this.themeTops = []
        this.themeTops.push(0)
        this.themeTops.push(this.$refs.param.$el.offsetTop)
        this.themeTops.push(this.$refs.comment.$el.offsetTop)
        this.themeTops.push(this.$refs.recommend.$el.offsetTop)
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTops[index], 500)
      },
      addToCart() {
        const obj = {}
        obj.iid = this.iid
        obj.imgURL = this.topImages[0]
        obj.title = this.goods.title
        obj.desc = this.goods.desc
        obj.price = this.goods.realPrice

        this.$store.dispatch('addToCart', obj).then(res => {
          this.$toast({message: '加入购物车成功'})
        })
      }
    },
    components: {
      DetailParamInfo,
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailCommentInfo,
      CartButton,
      GoodsList,
      DetailBottomBar,
      Scroll,
      Toast
    }
  }
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 1;
    background-color: #fff;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    position: absolute;
    top: 44px;
    bottom: 58px;
    left: 0;
    right: 0;
  }
</style>
