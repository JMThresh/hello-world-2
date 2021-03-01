import { request } from "../../request/index.js";

Page({
  /*
  1 输入框绑定 值改变事件 input事件
    1 获取到输入框的值
    2 合法性判断
    3 检验通过 把输入框的值 发送到后台
    4 返回的数据打印到页面上
  2 防抖（防止抖动） 定时器 节流
    0 防抖 一般 输入框中 防止重复输入 发送请求
    1 节流 一般是用在页面下拉和上拉
    1 定义全局的定时器id
  */
  data: {
    goods:[],
    isFocus:false,
    inpValue:""
  },
  // 定义全局定时器id
  TimeId:-1,
  // 输入框的值改变 就会触发的事件
  handleInput(e){
    // 1 获取输入框的值
    const {value} = e.detail;
    // 2 检测合法性
    if (!value.trim()) {
      //值不合法
      // 清除定时器，定时器是异步的，倒计时结束后还会发送请求，goods还会有值
      clearTimeout(this.TimeId);
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    this.setData({
      isFocus:true
    })
    // 清除定时器id
    clearTimeout(this.TimeId);
    // 为请求设置定时器，并储存TimeId
    this.TimeId=setTimeout(()=>{
      // 3 发送请求获取搜索建议 数据
      this.qsearch(value);
    },500);
  },
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}})||[];
    this.setData({
      goods: res
    })
  },
  handleCancel(){
    this.setData({
      inpValue:"",
      goods:[],
      isFocus:false
    })
  }
})