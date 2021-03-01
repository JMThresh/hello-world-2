/*
  1 获取用户的收货地址
    1 绑定点击事件
    2 调用小程序内置 api 获取用户的收货地址 wx.chooseAddress()

    2 获取 用户 对小程序 所授予 获取地址的 权限 状态 scope
      1 假设 用户 点击获取收货地址的提示框 确定 authSetting scope.address
        scope 值 true
      2 假设 用户 从来没有调用过 收货地址的api
        scope underfined 直接调用 获取收货地址
      3 假设 用户 点击获取收货地址的提示框 取消
        scope 值 false
        1 诱导用户 自己 打开 授权设置页面(wx.openSetting) 当用户重新给予 获取地址权限的时候
        2 获取收货地址
      4 把获取到的收货地址 存入到 本地存储中
  2 页面加载完毕
    0 onLoad onShow
    1 获取本地存储中的地址数据
    2 把数据 设置给data中的一个变量
  3 onShow
    0 回到商品详情页面 第一次添加商品的时候 手动添加属性
      1 num = 1;
      2 checked = true;
    1 获取缓存中的购物车数组
    2 把购物车数据 填充到data中
  4 全选的实现 数据的展示
    1 onShow 获取缓存中的购物车数组
    2 根据购物车中的商品数据 所有的商品都被选中 checked = true 全选就被选中
  5 总价格和总数量
    1 都需要商品被选中 我们才拿它来计算
    2 获取购物策划数组
    3 遍历
    4 判断商品是否被选中
    5 总价格 += 商品的单价 * 商品的数量
      总数量 += 商品的数量
    6 把计算后的价格和数量 设置回data中即可
  6 商品的选中
    1 绑定change事件
    2 获取到被修改的商品对象
    3 商品对象的选中状态 取反
    4 重新填充回data中和缓存中
    5 重新计算全选 总价格 总数量。。。
  7 全选和反选
    1 全选复选框绑定事件 change
    2 获取 data中的全选变量 allChecked
    3 直接取反 allChecked = !allChecked
    4 遍历购物车数组 让里面 商品 选中状态跟随 allChecked 改变而改变
    5 把购物车数组 和 allChecked 重新设置回data 把购物车重新设置回 缓存中
  8 商品数量的编辑
    1 "+" "-" 按钮 绑定同一个点击事件 区分的关键 自定义属性
      1 "+" "+1"
      2 "-" "-1"
    2 传递被点击的商品id goods_id
    3 获取data中的购物车数组 来获取需要被修改的商品对象
    4 当 购物车的数量 =1 同时 用户点击 "-"
      弹窗提示(showModal) 询问用户 是否要删除
      1 确定 直接执行删除
      2 取消 什么都不做
    4 直接修改商品对象的数量 num
    5 把cart数组 重新设置会缓存中 和data中 this.setCart
  9 点击结算
    1 判断用户有收货地址信息
    2 判断用户有没有选购商品
    3 经过以上的验证 跳转到 支付页面！
*/
import { request } from "../../request/index.js";
import { chooseAddress, getSetting, navigateTo, openSetting, showModal, showToast } from "../../utils/asyncWx.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  onShow() {
    // 1 获取本地存储中的地址数据
    const address = wx.getStorageSync("address");
    // 1 获取缓存中购物车的数据
    const cart = wx.getStorageSync("cart") || [];
    // 1 计算全选
    // every 数组方法 会遍历 会接受一个回调函数 那么 没一个回调函数都返回true 那么 every方法的返回值为true
    // 只要 有一个回调函数返回了false 那么不在循环执行 直接返回false
    // 空数组 调用 every,返回值就是true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false;
    // let allChecked = true;
    // // 1 总数量 总价格
    // let totalPrice = 0;
    // let totalNum = 0;
    // cart.forEach(v => {
    //   if (v.checked) {
    //     totalPrice += v.goods_price * v.num;
    //     totalNum += v.num;
    //   } else {
    //     allChecked = false;
    //   }
    // });
    // // 判断数组是否为空
    // allChecked = cart.length != 0 ? allChecked : false;
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   totalPrice,
    //   totalNum
    // })
    this.setCart(cart);
    this.setData({
      address
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  // Promise优化前的代码
  // handleChooseAddress() {
  //   wx.chooseAddress({
  //     success: (result) => {
  //       console.log(result);
  //     }
  //   });
  // },

  // Promise 优化过的代码
  async handleChooseAddress() {
    let address = await chooseAddress();
    address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
    wx.setStorageSync("address", address);
  },

  // 
  // async handleChooseAddress() {
  //   try {
  //     // 1 获取 权限状态
  //   const res1 = await getSetting();
  //   //   获取 权限状态 主要发现一些 属性名很怪异的时候  都要使用[]形式来获取属性值
  //   const scopeAddress = res1.authSetting["scope.address"];
  //   // 2 判断 权限状态
  //   if (scopeAddress === false) {
  //     // 3 用户 以前拒绝过授予权限 先诱导用户打开授权页面
  //     await openSetting();
  //   }
  //   // 4 调用获取收货地址的 api
  //   const address = await chooseAddress();
  //   // 5 存入本地存储中
  //   wx.setStorageSync("address", address);
  //   } catch (error) {
  //     // 利用trycatch解决报错问题 并打印出来
  //     console.log(error);
  //   }
  // }

  handleItemChange(e) {
    // 1 获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组
    let { cart } = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 5 重新填充回data中和缓存中
    this.setCart(cart);
  },

  handleToolChange() {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => { v.checked = allChecked; });
    this.setCart(cart);
  },

  async handleItemNumEdit(e) {
    let { operation, id } = e.currentTarget.dataset;
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);//只对数组内一个循环项操作就用findIndex
    if (cart[index].num + operation === 0) {
      const res = await wx.showModal({ content: '是否删除该商品？' });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      // 处理取消购物车的情况
      this.setCart(cart);
    }

  },

  async handlePay() {
    const { address, totalNum } = this.data;
    if (totalNum === 0) {
      await showToast({ title: '您还没有添加购物车' });
      return;
    }
    if (!address.userName) {
      await showToast({ title: '您还没有添加地址' });
      return;
    }
    await navigateTo({ url: '/pages/pay/index' });
  },

  // 设置购物车状态同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.goods_price * v.num;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart);
  }
})