var config = require('../../config')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({
  data: {
    tabs: ["选项一", "选项二", "选项三"],
    activeIndex: 1,
    sliderOffset: 0,
    sliderLeft: 0,
    inputShowed: false,
    inputVal: "",
    musicName:"",
    musicSinger:"",
    cache:false,
    test: [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true,],
    collection2:[],
    //评论是否点赞数组
    MusicId:""
  },

  onLoad: function (options) {
    var that=this;
    //显示歌曲名称
    that.setData({
      music_id:options.music_id
    })
    var music_id = this.data.music_id;
    wx.request({
      url: `${config.service.host}/Music_controller/Music_getbyid`,
      data: {
        id: music_id
      },
      success: function (res) {
        that.setData({
          musicName: res.data[0].MusicName,
          musicSinger: res.data[0].MusicSinger
        })
      },
      fail: function (err) {
        console.log("err");
      }
    })

    //评论列表渲染
    wx.request({
      url: `${config.service.host}/Comment_selectbymusic`,
      data: {
        MusicId: music_id
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          commentList: res.data
        });
        //评论是否点赞数组初始化
        var value = wx.getStorageSync('userid');var j;
        var comListLen = that.data.commentList.length;
        var collection = [];
        for (j = 0; j < comListLen;j++){
          console.log("j"+j);
            wx.request({
              url: `${config.service.host}/Like_isliked`,
              data:{
                UserId:value,
                MusicId:that.data.music_id,
                CommentId: that.data.commentList[j].CommentId
              },
              success:function(res1){
                collection.push(res1.data);
                  that.setData({
                    collection1: collection
                  })
                  
              },
              fail:function(err){
                console.log(err);
              }
            })
        }
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
  },//onload结束

  //改变点赞状态
  like:function(e){
    var that=this;
    var value = wx.getStorageSync('userid');
    var commentId=e.target.dataset.id;
    var temp = that.data.collection;
    console.log("toCollect");
    that.setData({
      collection: !temp
    })
      wx.request({
        url: `${config.service.host}/Like_give`,
        data:{
          UserId:value,
          MusicId: that.data.music_id,
          CommentId:commentId
        }
      })
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  //searchbar函数
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  insertComment: function () {
    var that=this;
    var value=wx.getStorageSync('userid')
    this.setData({
      inputShowed: false
    });
    //将inputVal插入这首歌的评论库
    wx.request({
      url: `${config.service.host}/Comment_add`,
      data:{
        UserId: value,
        MusicId: this.data.music_id,
        Content: this.data.inputVal
      },
      success:function(){
        //重新渲染评论列表
        wx.request({
          url: `${config.service.host}/Comment_selectbymusic`,
          data: {
            MusicId: that.data.music_id
          },
          success: function (res) {
            console.log(res.data);
            that.setData({
              commentList: res.data
            });
          }
        })
      },
      fail:function(err){
        console.log(err);
      }
    })
  },
  //清楚评论内容
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
  test:function(){
    this.setData({
      collection2:this.data.collectoin1
    })
    console.log("that.data.collection1");
    console.log(this.data.collection1);
    console.log("that.data.collection2");
    console.log(this.data.collection2);
  }
});


