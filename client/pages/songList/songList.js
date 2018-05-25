var config = require('../../config')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["选项一", "选项二", "选项三"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    songListName:""
  },

  onLoad: function (options) {
    var that=this;
    //显示歌单名称和歌
    var songListId=options.songListId;
    console.log(songListId);
    wx.request({
      url: `${config.service.host}/Musiclist_controller/Musiclist_getbyid`,
      data:{
        id:songListId
      },
      success:function(res){
        console.log(res.data[0].MusicIdList[0]);
        that.setData({
          songListName: res.data[0].MusiclistName,
          music: res.data[0].MusicIdList
        });
        //通过歌曲id得到歌曲json
        wx.request({
          url: `${config.service.host}/Music_controller/Music_getbyid`,
          data:{
            
          }
        })
      },
      fail: function (err) {
        console.log("err");
      }
    })
    
    this.setData({
      icon: '../../icon_nav_feedback'
    });
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
  }
});