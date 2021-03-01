/*
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底时间 微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数 只有总条数
      总页数 = Math.ceil( 总条数 / 页容量 )
            = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码 pagenum
  3 假如没有下一页数据 弹出一个提示
  4 加入还有下一页数据 来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来 要对data中的数组 进行 拼接 而不是全部替换！！！
2 下拉刷新页面
  1 触发下拉刷新时间 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组
  3 重置页码 设置为1
  4 重新发送请求

*/


import { request } from "../../request/index.js";

// pages/goods_list/index.js
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },

  // 全部页数的全局变量
  totalPages: 1,

  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid||"";
    this.QueryParams.query = options.query||"";
    this.getGoodsList();
  },

  async getGoodsList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    const total = res.total;
    this.data.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.data.totalPages);
    this.setData({
      // 拼接了数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    wx.stopPullDownRefresh();
  },

  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    // 2 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },

  // 页面触底函数
  onReachBottom() {
    if (this.QueryParams.pagenum >= this.data.totalPages) {
      // console.log("没有下一页了");
      wx.showToast({ title: '没有下一页了' });
    } else {
      // console.log("还有下一页");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    // 1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.QueryParams.pagenum = 1;
    // 3 发送请求
    this.getGoodsList();
  }
})