var config = require('../../config')
var app=getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["选项一", "选项二", "选项三"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    songListName:"",
    music:{},//歌单下歌曲数组
    collection:false,
    songListId:""
  },
  //设置该页面的转发信息
  onShareAppMessage: function () {
    console.log(this.songListId)
    return {
      title: '转发标题',
      path: '/pages/songList/songList?songListId='+this.data.songListId,
      desc:'desc',
      success:function(res){
        var shareTickets=res.share
      }
      }
  },
  onLoad: function (options) {
    
    console.log(options)
    var that=this;
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
      withShareTicket:true
    })  
    //显示歌单名称
    
    that.setData({
      songListId:options.songListId
    })
    wx.request({
      url: `${config.service.host}/Musiclist_controller/Musiclist_getbyid`,
      data:{
        id:that.data.songListId
      },
      success:function(res){
        that.setData({
          songListName: res.data[0].MusiclistName
        });
      },
      fail: function (err) {
        console.log("err");
      }
    })
    //显示歌曲
    var music = that.data.music;
    wx.request({
      url: `${config.service.host}/Musiclist_controller/Musiclist_musics`,
      data: {
        id: that.data.songListId
      },
      success: function (res) {
        console.log(res);
        that.setData({
          music:res.data
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
  dianZan: function (e) {
    var that=this;
    var value = wx.getStorageSync('userid');
    var temp = this.data.collection;
    console.log(temp);
    this.setData({
      collection: !temp
    }) 
      wx.request({
        url: `${config.service.host}/Musiclist_controller/Musiclist_copy`,
        data:{
          musiclistid: this.data.songListId,
          userid:value
        },
        success:function(res){
          console.log("add success");
          console.log(that.data.songListId);
        },
        fail:function(err){
          console.log(err);
        }
      })
  },
  //播放歌单里的歌
  playSong: function (e) {
    var musicid = e.target.dataset.musicid;
    console.log("musicId"+musicid);
    app.globalData.addSongs=[musicid];
    app.globalData.done=false;
    console.log("app.globalData.musicId" + app.globalData.musicId);
    wx.switchTab({
      url: '/pages/index/index',
      success:function(res){
        console.log("tosong");
        console.log(res);
      },
      fail:function(err){
        console.log(err);
      }
    })
  },
  //播放歌单里的所有歌曲
  playSongs:function()
  {
    var len = this.data.music.length
    var idList=[]
    for(var i=0;i<len;i++)
    {
      idList[i]=this.data.music[i].MusicId
    }
    app.globalData.addSongs = [idList];
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
  deleteSong:function(e)
  {
    //获取列表中要删除项的下标
    var musicid = e.target.dataset.musicid;
    var music = this.data.music;
    //移除列表中下标为MusiclistId的项
    music.splice(musicid, 1);
    //更新歌单列表的状态
    var value = wx.getStorageSync('userid');
    var that = this;
    that.setData({
      music:music
    })
    //从歌单里删除歌曲记录
    wx.request({
      url: `${config.service.host}/Musiclist_controller/Musiclist_delete`,
      data: {
        musiclistid:that.data.songListId,
        musicid: musicid
      },
      success: function (res) {
        console.log("music del");
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },  
  //反馈提示
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
  addSonglist:function()
  {
    var value=wx.getStorageSync('userid')
    console.log(value)
    wx.request({
      url: 'https://hy6e9qbe.qcloud.la/Musiclist_controller/Musiclist_copy',
      data:{
        musiclistid:this.data.songListId,
        userid:value
      },
      success:function(res)
      {
        console.log(res)
      }
    })
    
  }
});