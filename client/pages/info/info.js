var config = require('../../config')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["选项一", "选项二", "选项三"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    hiddenmodalput: true,
    inputVal:"",
    nickName:"",
    avatarUrl:"",
    canIUse: false,//wx.canIUse('button.open-type.getUserInfo')
    favorite:0
  },
  onLoad: function () {
    this.getData();    
  },
  onShow:function()
  {
    wx.showLoading({
      title: '正在加载',
    })
    this.getData()
  },
  getData:function()
  {
    var that= this;
    //获取userid
    var value=wx.getStorageSync('userid')
    wx.request({
      url: config.service.getMusicListUrl,
      data: {
        userid: value
      },
      success: function (res1) {
        that.setData({
          favorite:res1.data
        })
        wx.request({
          url: config.service.musiclist_getbyuseridUrl,
          data: {
            userid: value
          },
          success: function (res2) {
            console.log(res2.data)

            var preMusicList = res2.data
            var tmp = new Array()
            for (var i = 0; i < preMusicList.length; i++) {
              if (preMusicList[i]['MusiclistId'] != res1.data)
                tmp.push(preMusicList[i])
            }
            that.setData({
              musicList: tmp
            })
          }

        })
      }
    })
    //歌单列表渲染
    

    //评论列表渲染
    wx.request({
      url: config.service.comment_selectbyuserUrl,
      data: {
        UserId: value
      },
      success: function (res2) {
        that.setData({
          commentList: res2.data,
        });
        wx.hideLoading()
      }
    })
    /*
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      },
      fail: function (res) {

      }
    })
    */
  },
  bindGetUserInfo: function (e) {
    wx.showLoading({
      title: '正在加载',
    })
    if (e.detail.userInfo) {
      this.getData()
      this.setData({
        canIUse:wx.canIUse('button.open-type.getUserInfo'),
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl,
      })
      console.log(e.detail.userInfo)
      var value = wx.getStorageSync('userid')

      wx.request({
        url:config.service.updateinfoUrl,
        data: {
          userid: value,
          userinfo: e.detail.userInfo
        }
      })
      getApp().globalData.authorized = true
      //用户按了允许授权按钮
    } else {
      //用户按了拒绝按钮
      wx.hideLoading()
    }
  },
  tabClick: function (e) {
    //获取userid
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  //创建歌单弹出框
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  inputSLName: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //确认  
  confirm: function (e) {
    wx.showLoading({
      title: '正在添加',
    })
    var that = this;
    var value=wx.getStorageSync('userid')
    //将输入文本inputVal插入歌单
    wx.request({
      url: config.service.musiclist_insertUrl,
      data: {
        name: that.data.inputVal,
        userid: value
      },
      method: 'GET',
      success: function (res2) {
        
        //歌单列表重新渲染
        wx.request({
          url: config.service.musiclist_getbyuseridUrl,
          data: {
            userid: value
          },
          success: function (res) { 
            wx.hideLoading()
            wx.showToast({
              title: '添加成功',
              duration:1000
            })
            that.setData({
              musicList: res.data,
              hiddenmodalput: true
            });
          }
        })
      },
      fail: function (err) {
        console.log(err.data);
      }
    })
  },
  
  

  //点击删除按钮事件
  delItem: function (e) {
    var value = wx.getStorageSync('userid');
    var that = this;

    wx.showLoading({
      title: '正在删除',
    })
    //获取列表中要删除项的下标
    var musiclistId = e.target.dataset.musiclistid;
    var preMusicList = this.data.musicList;
    
    var musicList=new Array();
    

    //移除列表中下标为MusiclistId的项
    for (var i = 0; i < preMusicList.length; i++) {
      if (preMusicList[i]['MusiclistId'] != musiclistId) {
        musicList.push(preMusicList[i])
      }
    }
    //更新歌单列表的状态
    //数据库删除歌单
    
    wx.request({
      url: config.service.musiclist_removeUrl,
      data: {
        userid:value,
        musiclistid: musiclistId
      },
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        wx.showToast({
          title: '删除成功',
          duration:500
        })
        that.setData({
          musicList:musicList
        })
      },
      fail: function (err) {
        console.log(err);
      }
    })
    
  },  


  
  //跳转歌单页面!!!!!!!!!!!!
  toSongList:function(e){
    console.log(e.target.id)
    
    var sli = e.target.id;
    this.setData({
      hidden:true
    })
    wx.navigateTo({
      url: '../songList/songList?songListId='+sli,
      
    })
  },
  delComment:function(e){
    wx.showLoading({
      title: '正在删除',
    })
    //获取列表中要删除项的下标
    var value=wx.getStorageSync('userid')
    var commentid = e.target.dataset.commentid;
    var userid = wx.getStorageSync('userid');
    var commentList = new Array();
    console.log("userid"+userid);
    console.log("commid"+commentid);
    //移除列表中下标为的项
    for (var i = 0; i <this.data.commentList.length;i++)
    {
      if (this.data.commentList[i]['CommentId'] != commentid)
      {
        commentList.push(this.data.commentList[i])
      }
    }
    console.log(commentList);
    
    var that = this;
    wx.request({
      url: config.service.comment_deleteUrl,
      data: {
        CommentId:commentid,
        UserId: userid
      },
      success: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '删除成功',
          duration:500
        })
        that.setData({
          commentList: commentList
        })
      },
      fail:function(err){
        console.log(err);
      }
    })
  }
});


