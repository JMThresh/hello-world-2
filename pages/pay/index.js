/*
1 页面加载的时候
  1 从缓存中获取购物车数据 渲染到页面中
    这些数据 checked = true
  2 微信支付
    1 哪些人 那些账号 可以实现微信支付
      1 企业账号
      2 企业账号的小程序后台中 必须 给开发者 添加上白名单
        1 一个 appid 可以同时绑定多个开发者
        2 这些开发者就可以公用这个appid 和 它的开发权限
  3 支付按钮
    1 先判断缓存中有没有token
    2 没有 跳转到授权页面 进行获取token
    3 有token 。。。
*/


import { request } from "../../request/index.js";
import { requestPayment ,showToast } from "../../utils/asyncWx.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 1 获取本地存储中的地址数据
    const address = wx.getStorageSync("address");
    // 1 获取缓存中购物车的数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },

  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.goods_price * v.num;
      totalNum += v.num;
    });
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      totalPrice,
      totalNum
    })
  },

  async handleOrderPay() {
    try {
      // 1 判断缓存中又饿米有token
      const token = wx.getStorageSync("token");
      // 2 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      // 3 创建订单
      console.log("已经存在token了");
      // 3.1 准备 请求头参数
      const header = { Authorization: token };
      // 3.2 准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      let goods = [];
      const { cart } = this.data;
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }));
      const orderParams = { order_price, consignee_addr, goods };
      // 4 准备发送请求 创建订单 获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams, header });
  
  
      // 5 发起预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number }, header });
      // 6 发起微信支付
      await requestPayment(pay);
      // 7 查询后台 订单状态
      const res = await request({ url: "my/orders/chkOrder", method: "POST", data: { order_number }, header })
      await showToast({title:"支付成功"});
      // 8 手动删除缓存中 已经支付了的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v=>v.checked===false);
      wx.setStorageSync("cart", newCart);        
    } catch (error) {
      await showToast({title:"支付失败"});
      console.log(error);
    }
  }
})