/*
1 发送请求 获取数据
2 点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序的api previewImage
3 点击 加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式
  3 先判断 当前的商品是否已经存在于 购物车
    1 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
    2 不存在购物车的数组中 直接给购物车数组添加一个新元素 新元素 带上 购买数量属性 num 重新把购物车数组 填充回缓存中
  4 弹出提示
4 商品收藏
  1 页面onShow的时候 加载缓存中的商品收藏的数据
  2 判断当前商品是不是被收藏
    1 是 改变页面的图标
    2 不是。。
  3 点击商品收藏按钮
    1 判断该商品是否存在于缓存数组中
      1 已经存在 把该商品删除
      2 没有存在 把商品添加到收藏数组中 存入到缓存中即可
*/

import { request } from "../../request/index.js";


// pages/goods_detail/index.js
Page({
  data: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect: false
  },

  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const { goods_id } = currentPage.options;
    this.getGoodsDetail(goods_id);
  },

  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const res = await request({ url: "/goods/detail", data: { goods_id } });
    this.GoodsInfo = res;
    // 1 获取商品缓存中的收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        pics: res.pics,
        // iphone部分手机 不识别 webp图片格式
        // 最好找到后台 让他进行修改
        // 临时自己改 确保后台存在 1.webp => 1.jpg
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
      },
      isCollect
    })
  },
  handlePreviewImage(e) {
    // 1 要先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_big);
    // 2 接受传递过来的索引
    const currentIndex = e.currentTarget.dataset.index;
    wx.previewImage({
      current: urls[currentIndex],
      urls
    });
  },
  handleCartAdd() {
    // 1 从缓存中获取购物车数据  数组格式
    let cart = wx.getStorageSync("cart") || [];
    // 2 判断商品对象是否存在于购物车数组中
    const index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      // 3 不存在
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 4 存在
      cart[index].num++;
    }
    // 5 把购物车添加入缓存中
    wx.setStorageSync("cart", cart);
    // 6 弹出提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户疯狂点击
      mask: true
    });
  },
  handleCollect() {
    let isCollect = false;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 3 当index != -1 表示 已经收藏过
    if (index !== -1) {
      // 能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'none',
        duration: 1500,
        mask: true
      });
    } else {
      // 没找到 没收藏 用push把商品添加到收藏数组中
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'none',
        duration: 1500,
        mask: true
      });
    }
    // 4 把数组存到缓存中 
    wx.setStorageSync("collect", collect);
    // 5 修改data中的属性
    this.setData({
      // isCollect: !isCollect
      isCollect
    })
  }
})