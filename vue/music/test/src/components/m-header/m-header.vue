<template>
  <div class="m-header">
    <div class="icon">
      <img src="./logo@3x.png" alt="">
    </div>
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
  // @import '../../common/less/mixin.less';
  @color-theme: #fff;
  .m-header{
    position: relative;
    height: 44px;
    text-align: center;
    color: @color-theme;
    font-size: 0;
    .icon{
      display: inline-block;
      vertical-align: top;
      margin-top: 6px;
      width: 30px;
      height: 32px;
      margin-right: 9px;
      // .bg-image('./common/image/logo');
      // background-size: 30px 32px;
      img{
        width: 30px;
        height: 32px;
      }
    }
    .text{
      display: inline-block;
      vertical-align: top;
      line-height: 44px;
      font-size: 18px;
    }
  }
</style>
