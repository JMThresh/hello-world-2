/*
1 点击“+”触发tap点击事件
  1 调用小程序内置的 选择图片的 api
  2 获取到 图片的路径 数组
  3 把图片路径 存到 data的变量中
  4 页面就可以根据 图片数组 进行循环显示
2 点击 自定义图片 组件
  1 获取被点击的元素的索引
  2 获取 data 中的图片数组
  3 根据索引 数组中删除对应的元素
  4 把数组重新设置回data中
3 点击“提交”
  1 获取文本域的内容
    1 data中定义变量 表示 输入框内容
    2 文本域 绑定 输入事件 时间触发的时候 把输入框的值 存入到变量中
  2 对这些内容 合法性验证
  3 验证通过 用户选择的图片 上传到专门的图片的服务器 返回图片外网的链接
    1 遍历图片数组
    2 挨个上传
    3 自己再维护图片数组 存放 图片上传后的外网的链接
  4 文本域 和 外网的图片的路径  一起提交到服务器
  5 清空当前页面
  6 返回上一页
*/
import { request } from "../../request/index.js";
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的 路径 数组
    chooseImgs: [],
    textVal: ""
  },
  // 外网图片的路径数组
  UpLoadImgs: [],
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
  // 点击“+”选择图片
  handleChooseImg() {
    // 2调用小程序内置的选择图片api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组 进行拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
  },
  // 点击自定义图片组件
  // handleRemoveImg(e){
  //   // 2 获取被点击的组件的索引
  //   const {index} = e.currentTarget.dataset;
  //   // 3 获取data中的图片数组
  //   let {chooseImgs} = this.data;
  //   // 4 删除元素 splice(下标,删除数目)
  //   chooseImgs.splice(index,1);
  //   this.setData({
  //     chooseImgs
  //   })
  // },

  // 1 点击X型icon图标
  handleRemoveImg(e) {
    // 2 获取被点击的组件的索引
    const index = e.detail;
    // 3 获取data中的图片数组
    let { chooseImgs } = this.data;
    // 4 删除元素 splice(下标,删除数目)
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮的点击
  handleFormSubmit() {
    // 1 获取文本域的内容
    const { textVal } = this.data;
    // 2 合法性的验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    const { chooseImgs } = this.data;
    // 3 准备上传图片 到专门的图片服务器
    //   2 上传图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });
    // 判断有没有图片需要上传
    if (chooseImgs.length !== 0) {
      //   1 获取图床网站token
      wx.request({
        url: 'https://img.coolcr.cn/api/token',
        data: {
          email: "1529641312@qq.com",
          password: "pujiaming7518",
        },
        method: 'POST',
        success: (result) => {
          wx.setStorageSync("tokenImg", result.data.data.token);
        }
      });
      // 上传文件的 api 不支持 多个文件同时上传 遍历数组 挨个上传
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: 'https://img.coolcr.cn/api/upload',
          // 被上传的文件的路径
          filePath: v,
          // 上传的文件的名称 后台来获取文件 file
          name: "image",
          header: {
            'token': wx.getStorageSync("tokenImg")
          },
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).data.url;
            this.UpLoadImgs.push(url);
          }
        });
        if (i === chooseImgs.length - 1)
          console.log("把文本的内容和外网的图片数组 提交到后台中");
        // 提交成功了
        wx.hideLoading();
        // 重置页面
        this.setData({
          textVal: "",
          chooseImgs: []
        })
        // 返回上一个页面
        wx.navigateBack({
          delta: 1
        });
      });
    } else {
      console.log("只是把文本提交了");
      wx.hideLoading();
      this.setData({
        textVal: "",
        chooseImgs: []
      })
      wx.navigateBack({
        delta: 1
      });
    }
  }
})