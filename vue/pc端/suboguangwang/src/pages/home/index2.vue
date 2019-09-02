<template>
  <div class="home-box">
    <div ref="fullpage" id="fullpage">
      <div class="section">
        <Carousel autoplay loop id="banner" class="banner" arrow="always" :autoplay-speed="speed">
          <Carousel-item v-for="(item, index) in bannerList" :key="index">
            <div class="demo-carousel" @click="onBannerDetails(item)">
              <img :src="item.url" alt />
            </div>
          </Carousel-item>
        </Carousel>
      </div>

      <div class="section">
        <div class="all-main-box-third">
          <div class="news-case-box flex all-main-box">
            <div class="hot-case public-box">
              <div class="public-title flex">
                <div>
                  <h2>{{allColumnInfo&&allColumnInfo[5].name}}</h2>
                  <span>{{allColumnInfo&&allColumnInfo[5].english}}</span>
                </div>
                <a href="javascript:;" @click="onHotCasePage()">更多 ></a>
              </div>
              <div class="hot-case-main">
                <Carousel arrow="hover" :radius-dot="true" trigger="hover">
                  <Carousel-item v-for="(item, index) in hotCaseList" :key="index">
                    <div class="hot-case-item" @click="onHotCasePage(item.id)">
                      <div class="img-box">
                        <img v-lazy="item.url" alt />
                      </div>
                      <div class="box-content">
                        <h2>{{item.title}}</h2>
                        <p>{{item.date}}</p>
                      </div>
                    </div>
                  </Carousel-item>
                </Carousel>

                <div class="article-none" v-if="!hotCaseList.length">
                  <img src="../../assets/img/no-msg.png" alt />
                  <p>暂无相关案例</p>
                </div>
              </div>
            </div>

            <div class="news-information public-box">
              <div class="public-title flex">
                <div>
                  <h2>{{allColumnInfo&&allColumnInfo[4].name}}</h2>
                  <span>{{allColumnInfo&&allColumnInfo[4].english}}</span>
                </div>
                <a href="javascript:;" @click="onNewsPage()">更多 ></a>
              </div>
              <div class="news-main">
                <div class="news-list">
                  <div
                    class="news-item"
                    v-for="(item, index) in newsList"
                    :key="index"
                    @click="onNewsPage(item.id)"
                  >
                    <div class="left">
                      <div class="left-title">{{item.MM}}/{{item.dd}}</div>
                      <div class="left-remark">{{item.yyyy}}</div>
                    </div>
                    <div class="right">
                      <div class="right-title">{{item.title}}</div>
                      <div class="right-remark">{{item.showBody}}</div>
                    </div>
                  </div>
                </div>
                <div class="article-none" v-if="newsList.length===0">
                  <img src="../../assets/img/no-msg.png" alt />
                  <p>暂无相关资讯</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="professional-field all-main-box" id="expertise">
          <div class="professional-title title">
            <h2>{{allColumnInfo&&allColumnInfo[3].name}}</h2>
            <span>{{allColumnInfo&&allColumnInfo[3].english}}</span>
            <a href="javascript:;" @click="onDetails()">更多&nbsp;&nbsp;></a>
          </div>
          <div class="professional-box">
            <div v-for="(item, index) in professionalList" :key="index" class="wrap">
              <div class="expertise-box" @mouseover="onHoverCard(index)" @mouseout="onLeave(index)">
                <div style="text-align:center">
                  <img v-lazy="item.icon" />
                  <h2>{{item.name}}</h2>
                  <p>{{item.text}}</p>
                  <span v-show="item.hover" @click="onDetails(item.id, item.columnName)">查看详情 &gt;</span>
                </div>
              </div>
              <div class="article-none" v-if="!professionalList.length">
                <img src="../../assets/img/no-msg.png" alt />
                <p>暂无相关领域</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="banner-img">
          <img src="../../assets/img/banner_img.png" alt />
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

      <div class="section">
        <w-contact style="padding: 0.8rem 0 1rem;" v-if="allColumnInfo"></w-contact>
        <w-footer></w-footer>
      </div>
    </div>
  </div>
</template>

<script>
// 重新index2 在index.vue的基础上修改了布局
import Vue from "vue";
import { Carousel, CarouselItem } from "iview";
import { apiBanner, apiClassify, apiMessage } from "js/api";
import Constant from "utils/Constant";
import { getSimpleText } from "utils/util";
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
      newsList: [],
      allColumnInfo: null
    };
  },
  created() {
    this._fetchBannerImg();
    this._fetchExpertise();

    let timer = setInterval(() => {
      if (storage.get("allColumnInfo")) {
        clearInterval(timer);
        this.allColumnInfo = storage.get("allColumnInfo");
        this._fetchHotCase();
        this._fetchNews();
      }
    }, 200);
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
        columnId: this.allColumnInfo[4].id,
        homeShow: 1,
        startIndex: 0,
        pageSize: 5
      };
      const obj = await apiMessage(params);
      let arr = [];
      if (obj.items.length) {
        arr = obj.items.map(item => {
          let date = new Date(item.date.replace(/-/g, "/"));
          let MM =
            date.getMonth() > 8
              ? date.getMonth() + 1
              : "0" + (date.getMonth() + 1);
          let dd = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
          let photoFileId = Constant.data.picUrl + item.photoFileId;
          let showBody = getSimpleText(item.body)
            .trim()
            .slice(0, 100);
          return {
            title: item.title,
            yyyy: date.getFullYear(),
            MM: MM,
            dd: dd,
            showBody: showBody,
            photoFileId: item.photoFileId,
            id: item.id
          };
        });
        this.newsList = arr;
      }
    },
    // 获取热点案例
    async _fetchHotCase() {
      let params = {
        columnId: this.allColumnInfo[5].id,
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
            text: item.body,
            date: item.date
          };
        });
      }
    }
  }
};
</script>

<style lang="stylus">
@import './index2.styl'
</style>
