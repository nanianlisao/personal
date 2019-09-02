<template>
  <div class="loading">
    <div class="pic">
      <span></span>
      <b>{{percent}}%</b>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    imgsArr: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data() {
    return {
      percent: '',
      num: 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.num = 0
      this.imgsArr.map(x => {
        let oImg = new Image()
        oImg.onload = () => {
          this._callback(oImg)
        }
        oImg.onerror = () => {
          this._callback(oImg)
        }
        oImg.src = x.src
      })
    },
    _callback(oImg) {
      oImg.onload = null
      this.num++
      this.percent = parseInt(this.num / this.imgsArr.length * 100)
      if (this.num === this.imgsArr.length) {
        this.$emit('hide')
        this.$emit('refresh')
      }
    }
  }
}

</script>
<style lang="less" scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  .pic {
    position: relative;
    width: 100px;
    height: 100px;
    line-height: 100px;
    font-size: 30px;
    text-align: center;
    span {
      display: block;
      width: 80px;
      height: 80px;
      position: absolute;
      top: 10px;
      left: 10px;
      border-radius: 50%;
      box-shadow: 0 3px 0 #f00;
      animation: rotate 1s infinite linear;
      -webkit-animation: rotate 1s infinite linear;
    }
  }
}

@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
