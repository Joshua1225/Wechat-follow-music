//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  onLaunch: function () {
    //检查登录密钥userid是否存在且有效
    var islogin = false;
    try {
      //检查缓存
      var value = wx.getStorageSync('userid')
     
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
                        //console.log("response"+response.data);
                      } catch (e) {
                        console.log('error')
                      }
                    }

                  })
                }
              })
            }
          }
        })
      
      //console.log("appvalue"+value);
    } catch (e) {
      console.log('userid not exist')
    }


  }
})
