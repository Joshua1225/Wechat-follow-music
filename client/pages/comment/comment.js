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
    arr: ["bool(true)", "bool(false)", "bool(false)", "bool(true)", "bool(false)", "bool(true)"],
    num:[1,3,4],
    commentList:[],
    collection2:[],
    test1:"",
    test2:"",
    //评论是否点赞数组
    MusicId:"",
    hidden:false
  },

  onLoad: function (options) {
    var that=this;
    //显示歌曲名称
    that.setData({
      music_id:options.music_id,
      songImg: 'http://140.143.149.22/picture/' + options.music_id
    })
    var music_id = this.data.music_id;
    var value=wx.getStorageSync('userid');
    wx.request({
      url: `${config.service.host}/Music_controller/Music_getbyid`,
      data: {
        id: music_id
      },
      success: function (res) {
        that.setData({
          musicName: res.data[0].MusicName,
          musicSinger: res.data[0].MusicSinger,
        })
      },
      fail: function (err) {
        console.log("err");
      }
    })

    //点赞列表渲染
    wx.request({
      url: `${config.service.host}/Comment_selectbymusic`,
      data: {
        MusicId: music_id,
        UserId:value
      },
      success: function (res) {
        that.setData({
          commentList: res.data,
          hidden: true
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
  },//onload结束

  //点赞
  like:function(e){
    var tempIndex = e.target.dataset.idx;
    console.log("tempIndex" + tempIndex);
    console.log(this.data.commentList[tempIndex]);
    var up = "commentList[" + tempIndex +"].IsLike"
    this.setData({
      [up]:true
    })
    var that=this;
    var value = wx.getStorageSync('userid');
    var commentId=e.target.dataset.id;
    console.log(that.data.commentList);
      wx.request({
        url: `${config.service.host}/Like_give`,
        data:{
          UserId:value,
          MusicId: that.data.music_id,
          CommentId:commentId
        },
        success:function(res){
          console.log("显示成功提示框");
          that.openToast();
          console.log(that.data.commentList);
        }
      })
  },
  delLike: function (e) {
    var tempIndex = e.target.dataset.idx;
    console.log("tempIndex" + tempIndex);
    console.log(this.data.commentList[tempIndex]);
    var up = "commentList[" + tempIndex + "].IsLike"
    this.setData({
      [up]: false
    })
    var that = this;
    var value = wx.getStorageSync('userid');
    var commentId = e.target.dataset.id;
    console.log(that.data.commentList);
    wx.request({
      url: `${config.service.host}/Like_withdraw`,
      data: {
        UserId: value,
        MusicId: that.data.music_id,
        CommentId: commentId
      },
      success: function (res) {
        console.log("显示成功提示框");
        that.openToast();
        console.log(that.data.commentList);
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
  }
});


