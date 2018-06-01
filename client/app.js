//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  onLaunch: function () {
    var islogin=false;
    try {
		  //提取缓存
      var value = wx.getStorageSync('userid')
<<<<<<< HEAD
      console.log(value)
=======
     
        wx.request({
          url: config.service.isloginUrl,
          data: {
            userid: value
          },
          success: function (res) {
            if (res.data == '(bool)true') {
              islogin = true
            }
            //未登录需要登录
            if (islogin == false) {
              wx.login({
                success: function (res) {
                  wx.request({
                    url: config.service.loginUrl,
                    data: {
                      code: res.code
                    },
                    success: function (response) {
                      try {
                        wx.setStorageSync('userid', response.data)
                        console.log(response.data);
                      } catch (e) {
                        console.log('error')
                      }
                    }
>>>>>>> f1331cd1fa7354e27a98b96c46bd60a1881fae59

      wx.request({//检查userid是否有效
        url: config.service.isloginUrl,
        data:{
          userid:value
        },
        success: function (res1) {//回调函数获取结果处理
          //console.log(res1)
          if(res1.data=='(bool)false'){//失效-重新获取code登录
            wx.login({
              success:function(res2){//回填函数向服务器转发code换取3rd-key
                wx.request({
                  url: config.service.loginUrl,
                  data:{
                    code:res2.code
                  },
                  success: function (res3) {//回填函数userid存入缓存
                    wx.setStorageSync('userid', res3.data)
                    console.log(res3.data)
                  }
                })
              }
            })
          }
<<<<<<< HEAD
        }
      })
=======
        })
      
      console.log(value);
>>>>>>> f1331cd1fa7354e27a98b96c46bd60a1881fae59
    } catch (e) {
      console.log('userid not exist')
    }


  }
})
