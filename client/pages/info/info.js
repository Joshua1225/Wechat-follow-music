
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
    delBtnWidth: 180//删除按钮宽度单位（rpx）
    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框  
  },
  onLoad: function () {
    var that=this;
    //获取userid
    var value=wx.getStorageSync('userid');
    //歌单列表渲染
    wx.request({
      url: `${config.service.host}/Musiclist_controller/Musiclist_getbyuserid`,
      data: {
        userid: value
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          musicList: res.data
        });
      }
    })
    
    //评论列表渲染
    wx.request({
      url: `${config.service.host}/Comment_selectbyuser`,
      data: {
        UserId: value
      },
      success: function (res2) {
        that.setData({
          commentList: res2.data
        });
      }
    })
    

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    //获取微信头像，昵称
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
        })
      },
    })
    
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
    var that = this;
    var value=wx.getStorageSync('userid')
    //将输入文本inputVal插入歌单
    wx.request({
      url: `${config.service.host}/Musiclist_controller/Musiclist_insert`,
      data: {
        name: that.data.inputVal,
        userid: value
      },
      method: 'GET',
      success: function (res2) {
        that.openToast();
        //歌单列表重新渲染
        wx.request({
          url: `${config.service.host}/Musiclist_controller/Musiclist_getbyuserid`,
          data: {
            userid: value
          },
          success: function (res) {
            that.setData({
              musicList: res.data
            });
          }
        })
      },
      fail: function (err) {
        console.log(err.data);
      }
    })
  },

  openToast: function () {
    wx.showToast({
      title: '已完成',
      icon: 'success',
      duration: 3000
    });
  },
  openLoading: function () {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 3000
    });
  },

  

  //点击删除按钮事件
  delItem: function (e) {
    //获取列表中要删除项的下标
    var index = e.target.dataset.id;
    var musicList = this.data.musicList;
    //移除列表中下标为index的项
    musicList.splice(index, 1);
    //更新列表的状态
    this.setData({
      musicList: musicList
    });
  },  


  
  //跳转歌单页面!!!!!!!!!!!!
  toSongList:function(e){
    var sli = (e.target.id);
    wx.navigateTo({
      url: '../songList/songList?songListId='+sli
    })
  }
});

