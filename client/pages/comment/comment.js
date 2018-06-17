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
    num:[1,3,4],
    commentList:[],
    collection2:[],
    test1:"",
    test2:"",
    //评论是否点赞数组
    musicId:"",
    loadingLower:false,
    loadingUpper:false,
    loadinglowerComplete:false,
    loadingUpperComplete:true,
    start:0,
    clickGood:true
  },
  onLoad: function (options) {
    console.log("options");
    console.log(options);
    //显示歌曲名称
    this.setData({
      musicId: options.musicId
    })
    if(options.musicCover=="0"){
      this.setData({
        songImg: `${config.service.coverUrl}/0` 
      })
    }
    else{
      this.setData({
        songImg: `${config.service.coverUrl}/` + options.musicId
      })
    }
    this.getMusicInfo()
    this.getLowerComment()

    // wx.getSystemInfo({
    //   success: function (res) {
    //     that.setData({
    //       sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
    //       sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
    //     });
    //   }
    // });
  },//onload结束
  getMusicInfo:function()
  {
    var that = this;
    //歌曲名称信息
    var value = wx.getStorageSync('userid');
    wx.request({
      url: config.service.music_getbyidUrl,
      data: {
        id: this.data.musicId
      },
      success: function (res) {
        // console.log("comment err");
        // console.log(res.data);
        
        that.setData({
          musicName: res.data[0].MusicName,
          musicSinger: res.data[0].MusicSinger,
        })
      },
      fail: function (err) {
        console.log("err");
      }
    })
  },
  //点赞列表渲染
  getLowerComment:function()
  {
    var that =this 
    var value = wx.getStorageSync('userid');
    if(that.data.loadingLowerComplete==true)
      return
    else
      that.setData({
        loadingLower:true,
        loadingLowerComplete:false
      })

    console.log(this.data.musicId)
    console.log(this.data.start)
    wx.request({
      url: config.service.comment_selectbymusicUrl,
      data: {
        UserId:value,
        MusicId: this.data.musicId,
        Start: this.data.start
      },
      success: function (res) {
        console.log(res)
      
      
        if(res.data.length!=0)
        {
          that.setData({
            commentList:that.data.commentList.concat(res.data),
            loadingLower:false,
            loadingLowerComplete:false
          });
        }
        else
        {
          that.setData({
            loadingLower: false,
            loadingLowerComplete: true
          });
        }
      },
      fail:function(res1)
      {
        //wx.hideLoading()
      }
    })
    that.setData({
      start:that.data.start+10
    })
  },
  getUpperComment:function()
  {
    var that = this
    var value = wx.getStorageSync('userid');
    
    if (that.data.loadingUpperComplete == true||that.data.start-10<0)
      return
    else
      that.setData({
        loadingUpper: true,
        loadingUpperComplete: false
      })
    wx.request({
      url: config.service.comment_selectbymusicUrl,
      data: {
        UserId:value,
        MusicId: this.data.musicId,
        Start: this.data.start-10
      },
      success: function (res) {
        if (res.data.length != 0) {
          console.log(res)
          that.setData({
            commentList: res.data.concat(that.data.commentList),
            loadingUpper: false,
            loadingUpperComplete: false
          });
        }
        else {
          that.setData({
            loadingUpper: false,
            loadingUpperComplete: true
          });
        }
      },
      fail: function (res1) {
        
      }
    })
    that.setData({
      start: that.data.start-10
    })


  },
  //点赞
  like:function(e){
    if (!this.data.clickGood)
      return
    this.setData({
      clickGood:false
    })
    wx.showLoading({
      title: '正在点赞',
    })
    console.log("test");
    console.log(e.target.dataset.test);
    var tempIndex = e.target.dataset.idx;
    console.log("tempIndex" + tempIndex);
    console.log(this.data.commentList[tempIndex]);
    var up = "commentList[" + tempIndex +"].IsLike"
    this.setData({
      [up]:true
    })
    var down = "commentList[" + tempIndex + "].Likes"
    var downAdd = (parseInt(this.data.commentList[tempIndex].Likes) + 1).toString();
    this.setData({
      [down]: downAdd
    })
    var that=this;
    var value = wx.getStorageSync('userid');
    var commentId=e.target.dataset.id;
    console.log(that.data.commentList);
      wx.request({
        url: config.service.like_giveUrl,
        data:{
          UserId:value,
          MusicId: that.data.musicId,
          CommentId:commentId,
        },
        success:function(res){
          that.setData({
            commentList: that.data.commentList,
            clickGood:true
          })
          wx.hideLoading()
          wx.showToast({
            title: '点赞成功',
            duration: 1000
          })
        }
      })
  },
  delLike: function (e) {
    if (!this.data.clickGood)
      return
    wx.showLoading({
      title: '正在取消',
    })
    this.setData({
      clickGood: false
    })
    var tempIndex = e.target.dataset.idx;
    console.log("tempIndex" + tempIndex);
    console.log(this.data.commentList[tempIndex]);
    var up = "commentList[" + tempIndex + "].IsLike"
    this.setData({
      [up]: false
    })
    var down = "commentList[" + tempIndex + "].Likes"
    var downAdd = (parseInt(this.data.commentList[tempIndex].Likes) - 1).toString();
    this.setData({
      [down]: downAdd
    })
    var that = this;
    var value = wx.getStorageSync('userid');
    var commentId = e.target.dataset.id;
    console.log(that.data.commentList);
    wx.request({
      url:         config.service.like_withdrawUrl,
      data: {
        UserId: value,
        MusicId: that.data.musicId,
        CommentId: commentId
      },
      success: function (res) {
        console.log(that.data.commentList);
        that.setData({
          clickGood: true
        })
        wx.hideLoading()
        wx.showToast({
          title: '取消成功',
          duration: 1000
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
  //searchbar函数
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  insertComment: function () {
    if(this.data.inputVal=='')
      return 
    var that=this;
    var value=wx.getStorageSync('userid')
    
    wx.showLoading({
      title: '正在添加',
    })
    //将inputVal插入这首歌的评论库
    wx.request({
      url: config.service.comment_addUrl,
      data:{
        UserId: value,
        MusicId: this.data.musicId,
        Content: this.data.inputVal
      },
      success:function(res){
        wx.hideLoading()
        wx.showToast({
          title: '添加成功',
          duration:500
        })
      
           //重新渲染评论列表
        var count
        wx.request({
          url: comment_countUrl,
          data:{
            MusicId:that.data.musicId
          },
          success:function(res)
          {
            var count = parseInt(res.data)
            if(count<10)
              count=10
            
            that.data.loadingLowerComplete=true
            that.setData({
              start: count,
              commentList: [],
              loadingUpperComplete:false,
              loadingLowerComplete:false
            })
            that.data.loadingLowerComplete = true
            that.getUpperComment()
          }
        })
        
      },
      fail:function(err){
        console.log(err);
      }
    })
    this.clearInput()
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


