// pages/auth/index.js
import { request } from "../../request/index.js";
import { login } from "../../utils/asyncWx.js";

Page({
  async handleGetUserInfo(e) {
    try {
          // 1 获取用户信息
    const { encryptedData, rawData, iv, signature } = e.detail;
    // 2 获取小程序登陆成功后的code
    const { code } = await login();
    const loginParams = { encryptedData, rawData, iv, signature, code };
    // 3 发送请求 获取用户的token
    // let {token} = await request({ url: "/users/wxlogin", data: loginParams, method: "post" });
    // 4 将获取的token存入缓存中
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
    wx.setStorageSync("token", token);
    // 5 返回上一层
    wx.navigateBack({
      delta: 1
    }); 
    } catch (err) {
      console.log(err);
    }
  }
})