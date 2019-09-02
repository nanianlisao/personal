<template>
  <div class="contact-field all-main-box">
    <div class="contact-title title">
      <h2>{{allColumnInfo[6].name}}</h2>
      <span>{{allColumnInfo[6].english}}</span>
    </div>
    <div class="contact-box flex">
      <Form
        ref="contactMsg"
        :model="contactMsg"
        label-position="right"
        class="contact-input"
        :rules="roleValidate"
      >
        <FormItem :prop="item.name" v-for="(item, index) in formList" :key="index">
          <Input
            type="text"
            v-model="contactMsg[item.name]"
            :placeholder="item.label"
            class="form-large"
            @on-focus="onFocus(index)"
            :maxlength="item.length"
            clearable
          >
            <img :src="item.focus ? item.imgFocus : item.img" alt slot="prefix">
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" size="large" @click="onSubmit" class="consult-btn">我要咨询</Button>
        </FormItem>
      </Form>
      <div>
        <a
          class="contact-qq"
          target="_blank"
          :href="'http://wpa.qq.com/msgrd?v=3&uin='+ baseMsg.qqNumber +'&site=qq&menu=yes'"
        >
          <img src="../../assets/img/qq.gif" alt>
          点击这里进行QQ咨询!
        </a>
        <div id="container"></div>
        <div class="contact-ads">
          <div class="code-img">
            <img v-lazy="baseMsg.codeFileId" alt>
          </div>
          <div class="address">
            <p>
              联系电话：
              <span>{{baseMsg.phone}}</span>
            </p>
            <p>电子邮箱：{{baseMsg.email}}</p>
            <p>联系地址：{{baseMsg.address}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import MapLoader from "./../Map";
import { apiContact } from "js/api";
import { Form, FormItem, Input, Button, Message, Modal } from "iview";
import { storage } from "utils/storage";
import Constant from "utils/Constant";
Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;

export default {
  components: {
    Form,
    FormItem,
    Input,
    Button
  },
  data() {
    const validePhone = (rule, value, callback) => {
      value = value.replace(/[^0-9]/gi, "");
      if (!/^1[23456789]\d{9}$/.test(value)) {
        callback(new Error("请输入正确手机号"));
      } else {
        callback();
      }
    };

    const valideEmail = (rule, value, callback) => {
      if (
        !/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(
          value
        )
      ) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    return {
      contactMsg: {
        name: "",
        phone: "",
        email: "",
        remark: ""
      },
      roleValidate: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: validePhone, trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: valideEmail, trigger: "blur" }
        ],
        remark: [{ required: true, message: "请输入案件描述", trigger: "blur" }]
      },
      allColumnInfo: [{}, {}, {}, {}, {}, {}, {}, {}],
      formList: [
        {
          name: "name",
          label: "姓名",
          img: require("../../assets/img/user.png"),
          imgFocus: require("../../assets/img/user_active.png"),
          focus: false,
          length: 10
        },
        {
          name: "phone",
          label: "电话",
          img: require("../../assets/img/phone.png"),
          imgFocus: require("../../assets/img/phone_active.png"),
          focus: false,
          length: 11
        },
        {
          name: "email",
          label: "邮箱",
          img: require("../../assets/img/email.png"),
          imgFocus: require("../../assets/img/email_active.png"),
          focus: false,
          length: 64
        },
        {
          name: "remark",
          label: "案件描述",
          img: require("../../assets/img/pen.png"),
          imgFocus: require("../../assets/img/pen_active.png"),
          focus: false,
          length: 200
        }
      ],
      baseMsg: {}
    };
  },
  created() {},
  mounted() {
    this._fetchBaseMsg();
    this.allColumnInfo = storage.get("allColumnInfo");
  },
  methods: {
    // 获取基本信息
    _fetchBaseMsg() {
      let _this = this;
      let timer = setInterval(() => {
        const obj = storage.get("baseMsg");
        if (obj.codeFileId) {
          obj.codeFileId = Constant.data.picUrl + obj.codeFileId;
          _this.baseMsg = obj;
          if (_this.baseMsg) {
            clearInterval(timer);
            MapLoader().then(
              AMap => {
                _this.map = new AMap.Map("container", {
                  center: [_this.baseMsg.lon, _this.baseMsg.lat],
                  zoom: 14
                });
                var marker = new AMap.Marker({
                  position: [_this.baseMsg.lon, _this.baseMsg.lat] // 位置
                });
                _this.map.add(marker); // 添加到地图
              },
              e => {
                console.log("地图加载失败", e);
              }
            );
          }
        }
      }, 100);
    },
    // 提交
    onSubmit() {
      this.$refs.contactMsg.validate(valid => {
        if (valid) {
          this.$Modal.confirm({
            title: "提示",
            content: "是否确认提交信息？",
            onOk: () => {
              apiContact(this.contactMsg).then(data => {
                this.$Message.success("提交成功！");
                for (let key in this.contactMsg) {
                  this.contactMsg[key] = "";
                }
              });
            }
          });
        }
      });
    },
    // 改变获取焦点时的样式
    onFocus(idx) {
      this.formList.forEach((item, index) => {
        if (index == idx) {
          item.focus = true;
        } else {
          item.focus = false;
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.contact-field
  padding 0.48rem 0
  .contact-title
    border-bottom 0.01rem solid #E1E1E1
    height 0.45rem
    a
      float right
      margin-top 0.05rem
  .contact-box
    padding-top 0.32rem
    .contact-input
      width 5.34rem
    .consult-btn
      width 2.1rem
      height 0.65rem
      font-size 0.22rem
      background #3F51B5
      border 0.01rem solid #3F51B5
    .contact-qq
      text-align left
      background #3F51B5
      color #ffffff
      font-weight bold
      font-size 0.24rem
      margin-bottom 0.3rem
      display block
      width 5.69rem
      height 0.65rem
      line-height 0.65rem
      img
        width 0.34rem
        height 0.34rem
        vertical-align middle
        margin 0 0.1rem 0 0.2rem
    #container
      height 1.6rem
      width 5.69rem
    .contact-ads
      display flex
      margin-top 0.57rem
      text-align left
      .code-img
        width 0.95rem
        height 0.95rem
        margin-top 0.15rem
        img
          width 0.95rem
          height 0.95rem
      .address
        margin-left 0.32rem
        p
          font-size 0.2rem
          font-weight 400
          line-height 0.42rem
          color rgba(51, 51, 51, 1)
          span
            font-size 0.28rem
            line-height 0.42rem
            color #3F51B5
</style>

<style lang="stylus">
.contact-input
  .form-large
    input
      height 0.65rem
      line-height 0.65rem
      background rgba(240, 241, 245, 1)
      padding-left 0.65rem
      font-size 0.2rem
    .ivu-input:hover, .ivu-input:focus
      border 0.03rem solid rgba(63, 81, 181, 1)
    .ivu-input-icon
      height 0.65rem
      line-height 0.65rem
  .ivu-input-prefix
    img
      margin-top 0.15rem
      margin-left 0.13rem
      width 0.3rem
      height 0.3rem
</style>
