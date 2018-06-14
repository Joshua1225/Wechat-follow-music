var config = require('../../config')

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    confirmFlag: false,
    musicLoading: false, 
    musicLoadingComplete: false,
    result:[]
  },
  onLoad: function (option) {
    var that = this;

    wx.getStorage({
      key: 'history',
      success: function (res) {
        that.setData({
          historyRec: res.data
        });
      }
    })

  },  
  listen: function (e) {
    var id = e.currentTarget.dataset.musicid
    // console.log(id)
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    // var prevPage = pages[pages.length - 2];  //上一个页面
    // //直接调用上一个页面的setData()方法，把数据存到上一个页面中去  
    // prevPage.insertMusic(id)
    // wx.navigateBack({
    //   delta: 1
    // })
    getApp().globalData.addSongs=[id];
    getApp().globalData.done = false;

    wx.switchTab({
      url: '/pages/index/index',
    })

  },
  getMusic:function()
  {
    var that=this
    if(this.data.start>=this.data.count)
    {
      this.setData({
        musicloading: false,
        musicloadingComplete: true
      })
      return
    }
    else{
      this.setData({
        musicloading: true,
        musicloadingComplete: false
      })
    }
  
    wx.request({
      url: `${config.service.musicUrl}/music_search`,
      data:{
        keywords:this.data.inputVal,
        start:this.data.start
      },
      success:function(res)
      {
        var tmp=[]
        for(i in res.data)
        {
          tmp.push(res.data[i])
        }
        console.log(tmp)
        that.setData({
          musicloading: false,
          musicloadingComplete: false,
          start:that.data.start+10,
          count:res.data.count,
          result:res.data
        })
      }
    })
  },
  deleteHistory:function(e)
  {
    var tmp=[]
    var value = e.currentTarget.dataset.content
    console.log(value)
    for(let i in this.data.historyRec)
    {
      if(i!=value)
      tmp.unshift(i)
    }
    console.log(value)
    this.setData({
      historyRec:tmp
    })
    wx.setStorageSync('history', tmp)
  },
  deleteAllHistory:function()
  {
    this.setData({
      historyRec: []
    })
    wx.setStorageSync('history', this.data.historyRec)
  },
  inputValUpdate: function (e) {
    this.setData({
      inputVal: e.currentTarget.dataset.content
    });
    this.showInput();
    this.inputConfirm();
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      confirmFlag: false,
      result: []
    });
    this.onLoad()

  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  inputConfirm: function (e) {
    this.setData({
      confirmFlag: true,
      start:0,
      count:1,
      musicLoading:false,
      musicLoadingComplete:false
    });
    //Add history
    if (this.data.historyRec == null)
      this.data.historyRec = [];
    var flag = true;
    for (let i in this.data.historyRec) {
      if (this.data.inputVal == this.data.historyRec[i]) {
        flag = false;
        break;
      }
    }
    if (this.data.inputVal == '')
      flag = false
    if (flag)
      this.data.historyRec.unshift(this.data.inputVal);

    wx.setStorage({
      key: "history",
      data: this.data.historyRec
    });

    //request new musicdata
    this.getMusic()
  }
});
