// pages/user/index.js
Page({
  data: {
    userInfo: {},
    // 被收藏的商品数量
    collectNums: 0
  },
  onShow(){
    const userInfo = wx.getStorageSync("userinfo");
    const collect = wx.getStorageSync("collect")||[];
    this.setData({
      userInfo,
      collectNums: collect.length
    })
  },
  handleGetUserInfo(e){
    const {userInfo} = e.detail;
    wx.setStorageSync("userinfo", userInfo);
    wx.navigateTo({
      url: '/page/user/index'
    });
  }
})