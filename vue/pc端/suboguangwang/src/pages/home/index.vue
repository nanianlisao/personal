<template>
  <div class="home-box">
    <full-page ref="fullpage" :options="options" id="fullpage">
      <div class="section">
        <Carousel autoplay loop id="banner" arrow="never" :autoplay-speed="speed">
          <Carousel-item v-for="(item, index) in bannerList" :key="index">
            <div class="demo-carousel" @click="onBannerDetails(item)">
              <img :src="item.url" alt>
            </div>
          </Carousel-item>
        </Carousel>
        <a @click="$refs.fullpage.api.moveSectionDown()" class="next-button" href="javascript:;">
          <img src="../../assets/img/next.png" alt>
        </a>
      </div>

      <div class="section">
        <div class="professional-field all-main-box" id="expertise">
          <div class="professional-title title">
            <h2>专业领域</h2>
            <span>EXPERTISE</span>
            <a href="javascript:;" @click="onDetails()">更多&nbsp;&nbsp;></a>
          </div>
          <div class="professional-box">
            <div v-for="(item, index) in professionalList" :key="index" class="wrap">
              <div class="expertise-box" @mouseover="onHoverCard(index)" @mouseout="onLeave(index)">
                <div style="text-align:center">
                  <img v-lazy="item.icon">
                  <h2>{{item.name}}</h2>
                  <p>{{item.text}}</p>
                  <span v-show="item.hover" @click="onDetails(item.id, item.columnName)">查看详情 &gt;</span>
                </div>
              </div>
              <div class="article-none" v-if="!professionalList.length">
                <img src="../../assets/img/no-msg.png" alt>
                <p>暂无相关领域</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="all-main-box-third">
          <div class="news-case-box flex all-main-box">
            <div class="hot-case public-box">
              <div class="public-title flex">
                <div>
                  <h2>热点案例</h2>
                  <span>HOT CASE</span>
                </div>
                <a href="javascript:;" @click="onHotCasePage()">更多 ></a>
              </div>
              <div class="hot-case-main">
                <div
                  class="hot-case-item"
                  v-for="(item, index) in hotCaseList"
                  :key="index"
                  @click="onHotCasePage(item.id)"
                >
                  <div class="img-box">
                    <img v-lazy="item.url" alt>
                  </div>
                  <div class="box-content">
                    <h2>{{item.title}}</h2>
                  </div>
                </div>
                <div class="article-none" v-if="!hotCaseList.length">
                  <img src="../../assets/img/no-msg.png" alt>
                  <p>暂无相关案例</p>
                </div>
              </div>
            </div>

            <div class="news-information public-box">
              <div class="public-title flex">
                <div>
                  <h2>新闻资讯</h2>
                  <span>NEWS INFORMATION</span>
                </div>
                <a href="javascript:;" @click="onNewsPage()">更多 ></a>
              </div>
              <div class="news-main">
                <div class="main-news-box" @click="onNewsPage(mainNew.id)" v-if="mainNew.id">
                  <img v-lazy="mainNew.photoFileId" alt>
                  <p>{{mainNew.title}}</p>
                </div>
                <ul class="news-list">
                  <li v-for="(item, index) in newsList" :key="index" @click="onNewsPage(item.id)">
                    <p>{{item.title}}</p>
                    <span>{{item.date}}</span>
                  </li>
                </ul>
                <div class="article-none" v-if="!mainNew.id && !newsList.length">
                  <img src="../../assets/img/no-msg.png" alt>
                  <p>暂无相关资讯</p>
                </div>
              </div>
            </div>
          </div>

          <div class="banner-img">
            <img src="../../assets/img/banner_img.png" alt>
            <div class="text-content">
              <div class="specialty-box">
                <p>专业</p>
                <p>·</p>
                <p>全面</p>
                <p>·</p>
                <p>贴心</p>
              </div>
              <div class="service">一站式全方位优质服务 尽职尽责为当事人服务</div>
              <div class="start-box">
                <p>始于初心</p>
                <p>只为安稳</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <w-contact></w-contact>
        <w-footer footStyle="bottom: 1.1rem;"></w-footer>
      </div>
    </full-page>
  </div>
</template>

<script>
import Vue from "vue";
import { Carousel, CarouselItem } from "iview";
import { apiBanner, apiClassify, apiMessage } from "js/api";
import Constant from "utils/Constant";
import { storage } from "utils/storage";

export default {
  name: "home",
  components: {
    Carousel,
    CarouselItem
  },
  data() {
    return {
      speed: 3000,
      bannerList: [],
      professionalList: [],
      hotCaseList: [],
      mainNew: {
        id: null,
        photoFileId: "",
        title: ""
      },
      newsList: [],
      options: {
        licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
        navigation: true,
        anchors: ["page1", "page2", "page3", "page4"],
        sectionsColor: ["#F0F1F5", "#F0F1F5", "#FFFFFF", "#F0F1F5"]
      },
      allColumnInfo: []
    };
  },
  created() {
    this._fetchBannerImg();
    this._fetchExpertise();
    this._fetchHotCase();
    this._fetchNews();
    this.allColumnInfo = storage.get("allColumnInfo");
  },
  methods: {
    // 跳转关于我们页面
    onKnowUs() {
      this.$router.push("/aboutUs");
    },

    // 轮播跳转详情
    onBannerDetails(opt) {
      if (opt.detail) {
        this.$router.push(`/home/bannerDetail/${opt.id}`);
        storage.set("bannerDetail", opt);
      }
    },
    // 鼠标移入
    onHoverCard(opt) {
      this.professionalList[opt].hover = true;
    },
    // 鼠标移出
    onLeave(opt) {
      this.professionalList[opt].hover = false;
    },
    // 查看详情按钮跳转到具体领域页面
    onDetails(id, name) {
      if (id && name) {
        this.$router.push(`/expertise/expertiseDetail/${id}?name=${name}`);
      } else {
        this.$router.push("/expertise");
      }
    },
    // 跳转到具体案子页面
    onHotCasePage(id) {
      if (id) {
        this.$router.push(`/hotCase/hotCaseDetail/${id}`);
      } else {
        this.$router.push("/hotCase");
      }
    },
    // 跳转到新闻页面
    onNewsPage(id) {
      if (id) {
        this.$router.push(`/newsCenter/newsCenterDetail/${id}`);
      } else {
        this.$router.push("/newsCenter");
      }
    },
    // 获取轮播图片
    async _fetchBannerImg() {
      const obj = await apiBanner();
      if (obj.items.length) {
        this.bannerList = obj.items.map(item => {
          let url = Constant.data.picUrl + item.photoFileId;
          return {
            url: url,
            id: item.id,
            detail: item.detail,
            name: item.name
          };
        });
      }
    },
    // 获取专业领域
    async _fetchExpertise() {
      let params = { homeShow: 1 };
      const obj = await apiClassify(params);
      if (obj.items.length) {
        this.professionalList = obj.items.map(item => {
          item.photoFileId = Constant.data.picUrl + item.photoFileId;
          return {
            name: item.name,
            icon: item.photoFileId,
            text: item.remark,
            hover: false,
            id: item.id,
            columnName: item.columnName
          };
        });
      }
    },
    // 获取新闻资讯
    async _fetchNews() {
      let params = {
        columnId: 5,
        homeShow: 1,
        startIndex: 0,
        pageSize: 3
      };
      const obj = await apiMessage(params);
      let arr = [];
      if (obj.items.length) {
        arr = obj.items.map(item => {
          item.photoFileId = Constant.data.picUrl + item.photoFileId;
          return {
            title: item.title,
            date: item.date,
            photoFileId: item.photoFileId,
            id: item.id
          };
        });
        this.newsList = arr.slice(1, 4);
        this.mainNew = arr.slice(0, 1)[0];
      }
    },
    // 获取热点案例
    async _fetchHotCase() {
      let params = {
        columnId: 6,
        homeShow: 1,
        startIndex: 0,
        pageSize: 3
      };
      const obj = await apiMessage(params);
      let arr = [];
      if (obj.items.length) {
        this.hotCaseList = obj.items.map(item => {
          item.photoFileId = Constant.data.picUrl + item.photoFileId;
          return {
            title: item.title,
            url: item.photoFileId,
            id: item.id,
            text: item.body
          };
        });
      }
    }
  }
};
</script>

<style lang="stylus">
@import './../../assets/css/home.styl'
</style>
