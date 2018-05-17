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