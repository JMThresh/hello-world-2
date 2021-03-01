// 同时发送异步代码的次数
let ajaxTimes = 0;

export const request = (params) => {
    // let header={...params.header};
    // // 判断rul中是否带有 /my/ 请求的是私有的路径 带上header token
    // if (params.url.includes("/my/")) {
    //     // 拼接header 带上 token
    //     header["Authorization"]=wx.getStorageSync("token");  
    // }

    ajaxTimes++;
    wx.showLoading({
        title: "加载中",
        mask: true
    });
    // 定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";    //语句后要加分号
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            // header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes <= 0) {
                    wx.hideLoading();
                }
            }
        });
    })
}