//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  globalData:{
    addSongs:[],
    done:true,
    authorized:false
  },
  onLaunch: function () {
    var islogin = false;
    try {
      //提取缓存
      var value = wx.getStorageSync('userid')
      console.log(value)

      wx.request({//检查userid是否有效
        url: config.service.isloginUrl,
        data: {
          userid: value
        },
        success: function (res1) {//回调函数获取结果处理
          console.log('islogin'+res1.data)
          if (res1.data == 'bool(false)\n') {//失效-重新获取code登录
            console.log('false')
            wx.login({
              success: function (res2) {//回填函数向服务器转发code换取3rd-key
                console.log(res2.code)
                wx.request({
                  url: config.service.loginUrl,
                  data: {
                    code: res2.code
                  },
                  success: function (res3) {//回填函数userid存入缓存
                    wx.setStorageSync('userid', res3.data)
                    wx.request({
                      url: config.service.authUrl,
                      data: {
                        userid: value
                      },
                      success: function (res4) {
                        if (res4.data == 'bool(true)\n')
                          getApp().globalData.authorized = true
                      }
                    })
                    
                  },
                  fail:function(res6){

                  }
                })
              }
            })
          }
          else{
            wx.request({
              url: config.service.authUrl,
              data:{
                userid:value
              },
              success:function(res1){
                if (res1.data =='bool(true)\n')
                  getApp().globalData.authorized=true
              }
            })
            
          }
        }
      })

    } catch (e) {
      console.log('userid not exist')
    }


  }
})