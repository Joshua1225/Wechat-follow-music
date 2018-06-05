
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

  
  //手指触摸动作开始
  touchS: function (e) {
    if (e.touches.length == 1) {//当前停留在屏幕中的触摸点信息的数组
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX//距离页面可显示区域左上角距离，横向为x轴
      });
    }
  },
  //手指移动
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;//事件源组件上由data-开头的自定义属性组成的集合
      var music = this.data.music;
      if (index >= 0) {
        music[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          music: music
        });
      }
    }
  },
  //手指触摸结束s
  touchE: function (e) {
    if (e.changedTouches.length == 1) {//表示有变化的触摸点
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var music = this.data.music;
      console.log(e);
      if (index >= 0) {
        list[index].txtStyle = txtStyle;
        //更新列表的状态
        this.setData({
          music: music
        });
      }
    }
  },
  //点击删除按钮事件
  delItem: function (e) {
    //获取列表中要删除项的下标
    var index = e.target.dataset.index;
    var music = this.data.music;
    //移除列表中下标为index的项
    music.splice(index, 1);
    //更新列表的状态
    this.setData({
      music: music
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

