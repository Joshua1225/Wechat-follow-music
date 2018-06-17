var config = require('../../config')
var app = getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["选项一", "选项二", "选项三"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    songListName: "",
    music: {},//歌单下歌曲数组
    collection: false,
    songListId: ""
  },
  //设置该页面的转发信息
  onShareAppMessage: function () {
    console.log(this.data.songListId)
    return {
      title: '转发给你一个好听的歌单',
      path: '/pages/songList/songList?songListId=' + this.data.songListId,
      desc: 'desc',
      success: function (res) {
        var shareTickets = res.share
      }
    }
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    })
    console.log(options)
    var that = this;
    //获取手机系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    //显示当前页面的转发按钮
    wx.showShareMenu({
      withShareTicket: true
    })
    //显示歌单名称

    that.setData({
      songListId: options.songListId
    })
    wx.request({
      url:config.service.musiclist_getbyidUrl,// 
      data: {
        id: that.data.songListId
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          songListName: res.data[0].MusiclistName
        });
        wx.hideLoading()
      },
      fail: function (err) {
        console.log("err");
      }
    })
    //显示歌曲
    var music = that.data.music;
    wx.request({
      url: config.service.musiclist_musicsUrl,
      data: {
        id: that.data.songListId
      },
      success: function (res) {
        console.log(res);
        that.setData({
          music: res.data
        })
      }
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //改变点赞状态
  addSongList: function (e) {
    var that = this;
    var value = wx.getStorageSync('userid');
    var temp = this.data.collection;
    console.log(temp);
    this.setData({
      collection: !temp
    })
    wx.request({
      url:config.service.Musiclist_copy,
      data: {
        musiclistid: this.data.songListId,
        userid: value
      },
      success: function (res) {
        console.log("add success");
        console.log(that.data.songListId);
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //分享
  share:function(){
    this.onShareAppMessage();
  },
  //播放歌单里的歌
  playSong: function (e) {
    var musicid = e.target.dataset.musicid;
    console.log("musicId" + musicid);
    app.globalData.addSongs = [musicid];
    app.globalData.done = false;
    wx.switchTab({
      url: '/pages/index/index',
      success: function (res) {
        console.log("tosong");
        console.log(res);
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //播放歌单里的所有歌曲
  playSongs: function () {
    var len = this.data.music.length
    var idList =new Array()
    for (var i = 0; i < len; i++) {
      idList.push(this.data.music[i].MusicId)
    }
    app.globalData.addSongs =idList;
    app.globalData.done = false;

    wx.switchTab({
      url: '/pages/index/index',
      success: function (res) {
        console.log(res);
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  deleteSong: function (e) {
    wx.showLoading({
      title: '删除中',
    })
    //获取列表中要删除项的下标
    var musicid = e.target.dataset.musicid;
    var music = new Array()
    console.log(this.data.music)
    console.log(musicid)
    //移除列表中下标为MusiclistId的项
    for(var i=0;i<this.data.music.length;i++)
    {
      if (this.data.music[i]['MusicId'] != musicid)
      {
        music.push(this.data.music[i])
      }
    }
    console.log(music)
    //更新歌单列表的状态
    var value = wx.getStorageSync('userid');
    var that = this;
    
    //从歌单里删除歌曲记录
    wx.request({
      url: config.service.musiclist_deleteUrl,
      data: {
        musiclistid: that.data.songListId,
        musicid: musicid
      },
      success: function (res) {
        console.log("music del");
        that.setData({
          music: music
        })
        wx.hideLoading()
        wx.showToast({
          title: '删除成功',
          duration: 1000
        })

      },
      fail: function (err) {
        console.log(err);
      }
    })
  }
});