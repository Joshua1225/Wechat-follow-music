var config = require('../../config')
Page({
  data: {
    inputShowed: false,
    inputVal: "",
    confirmFlag:false
  },
  onLoad:function(option)
  {
    var that= this;
    
    wx.getStorage({
      key: 'history',
      success: function(res) {
        that.setData({
          historyRec:res.data
        });
      }
    })
      
  },
  listen:function(e)
  {
    var id = e.currentTarget.dataset.musicid
    console.log(id)

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去

    wx.navigateBack({
      delta: 1
    })
    prevPage.setData({
      mydata: {
      musicIndex: id,
      musicChange: 1 
      }
    })
    
  },
  inputValUpdate:function(e)
  {
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
      confirmFlag:false,
      result:[]
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
  inputConfirm:function(e){
    this.setData({
        confirmFlag:true
    });
    
    if (this.data.historyRec == null)
      this.data.historyRec = [];
    var flag=true;
    for (let i in this.data.historyRec){
      if (this.data.inputVal == this.data.historyRec[i]){
        flag = false;
        break;
      }
    }
    if(this.data.inputVal=='')
      flag=false
    if(flag)
      this.data.historyRec.unshift(this.data.inputVal);

    wx.setStorage({
      key: "history",
      data: this.data.historyRec
    });

    var that = this; 
    wx.request({
      url: `${config.service.host}/Music_controller/Music_search`,
      data:{
        keywords: this.data.inputVal
        
      },
      success:function(res)
      {
        
        console.log(res.data)
        that.setData({
            result:res.data
        })
      },
      fail:function(err)
      {
        console.log(err.data);
      }
    });
  }
});