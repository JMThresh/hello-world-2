// 0 引入 用来发送请求的 方法 一定要把路径补全
import { request } from "../../request/index.js";

//Page Object
Page({
  data: {
    // 轮播图 数据
    swiperList: [],
    // 导航 数据
    catesList: [],
    // 楼层 数据
    floorList: []
  },
  // 页面开始加载  就会触发
  onLoad: function (options) {
    // 1 发送异步请求获取轮播图数据
    // wx.request({
    //       url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //       success: (result) => {
    //         this.setData({
    //           swiperList:result.data.message
    //         })
    //       }
    //     })
    //   }
    // });


    // 这个三个请求函数  同时请求  对谁先回来后回来没有要求就不必使用es7的async语法（即同步处理）
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: "/home/swiperdata" })
      .then(result => {
        let url = "";
        result.forEach((v, i) => {
          v.navigator_url = "/pages/goods_detail/index?goods_id=" + v.goods_id;
        });
        this.setData({
          swiperList: result
        })
      })
  },
  // 获取分类导航数据
  getCateList() {
    request({ url: "/home/catitems" })
      .then(result => {
        result.forEach((v) => {
          v.navigator_url = "/pages/category/index"
        });
        this.setData({
          catesList: result
        })
      })
  },
  // 获取楼层数据
  async getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        result.forEach((v) => {
          v.product_list.forEach((v2) => {
            v2.navigator_url = v2.navigator_url.replace(/goods_list/, "goods_list/index");
          });
        });
        this.setData({
          floorList: result
        })
      })
  }
});


