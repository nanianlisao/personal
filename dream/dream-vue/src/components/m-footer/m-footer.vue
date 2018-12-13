<template>
  <div class="footer">
    <ul class="footer-nav">
      <li>
        <router-link tag="span" class="tab-item" to="/home">
          首页
        </router-link>
      </li>
      <li>
        <router-link tag="span" class="tab-item" to="/about">
          关于集梦
        </router-link>
      </li>
      <li>
        <router-link tag="span" class="tab-item" to="/recruit">
          诚招英才
        </router-link>
      </li>
    </ul>
    <div class="footer-mark">
      COPYRIGHT @ 2017.COMPANY NAME DREAMEDIA. 苏ICP备14037308号-5
    </div>
  </div>
</template>
<script>
export default {}

</script>
<style lang="less">
.footer {
  padding: 0 5%;
  background-color: #2b2b2b;
  color: #fff;
  .footer-nav {
    display: flex;
    li {
      position: relative;
      flex: 1;
      text-align: center;
      line-height: 0.34rem;
      font-size: 0.14rem;
      &:not(:last-child):before {
        content: '|';
        position: absolute;
        right: 0; // top: 0;
      }
      span {
        line-height: 0.34rem;
      }
    }
  }
  .footer-mark {
    text-align: center;
    font-size: 0.1rem;
    line-height: 0.18rem;
    padding: 0.05rem 0;
  }
}

</style>
