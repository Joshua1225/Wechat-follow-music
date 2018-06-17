   // pages/play/play.js
var config = require('../../config')
var innerAudioContext = wx.getBackgroundAudioManager()
const Lyric = require('../../utils/lyric.js')
var imageUtil = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicListIndex: 0,
    playMode: 0,
    curTimeVal: 0,
    duration: 0,
    actionSheetHidden:true,
    actionSheetItems:[],
    listBgColor: '',
    isLight: true,
    lyric:null,
    currentLineNum: 0,
    currentText: '',
    toLineNum: -1,
    picturePath:`${config.service.coverUrl}/0`,
    title:'',
    favorite:-1,
    musicList:[],
    iconList_1: [
      {
        imagePath: "../../src/search.png",
        func: "f_1_0"
      },
      {
        imagePath: "../../src/share.png"
      }
    ],
    iconList_2: [
      {
        imagePath: "../../src/like.png",
        i: 0,
        func: "f_2_0"
      },
      {
        imagePath: "../../src/add.png",
        func: "f_2_1"
      },
      {
        imagePath: "../../src/comment.png",
        func: "f_2_2"
      }
    ],
    iconList_3: [
      {
        imagePath: "../../src/sequential_cycle.png",
        func: "f_3_0",
        i: 0
      },
      {
        imagePath: "../../src/previous.png",
        func: "f_3_1"
      },
      {
        imagePath: "../../src/play.png",
        func: "f_3_2",
        i: 0
      },
      {
        imagePath: "../../src/next.png",

        func: "f_3_3"
      },
      {
        imagePath: "../../src/playlist.png",
        func: "f_3_4"
      }
    ]
  },

  f_1_0: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  f_2_0: function (event) {
    if (getApp().globalData.authorized == false) {
      wx.showToast({
        title: '请授权登录',
        icon: 'loading'
      })
      return
    }
    
    var up = "iconList_2[0].imagePath";
    var op = "iconList_2[0].i";
    var that = this
    if (that.data.iconList_2[0].i == 0) {
      wx.request({
        url: `https://hy6e9qbe.qcloud.la/Musiclist_controller/Musiclist_add`,
        data: {
          musiclistid: that.data.favorite,
          musicid: that.data.musicList[that.data.musicListIndex]['id']
        },
        success: function (res) {
          that.setData({
            [up]: "../../src/dislike.png",
            [op]: 1
          })
        }
      })
    }
    else {
      wx.request({
        url: `https://hy6e9qbe.qcloud.la/Musiclist_controller/Musiclist_delete`,
        data: {
          musiclistid: that.data.favorite,
          musicid: that.data.musicList[that.data.musicListIndex]['id']
        },
        success: function (res) {
          that.setData({
            [up]: "../../src/like.png",
            [op]: 0
          })
        }
      })
    }
  },

  f_2_1: function (){
    if (getApp().globalData.authorized == false) {
      wx.showToast({
        title: '请授权登录',
        icon: 'loading'
      })
      return
    }
    wx.showLoading({
      title: '正在加载',
    })
    var userid = wx.getStorageSync('userid')
    var that=this
    console.log(userid)
    wx.request({
      url: `https://hy6e9qbe.qcloud.la/Musiclist_controller/Musiclist_getbyuserid?userid=` + userid,
      success: function (res) {
        wx.hideLoading()
        var arr = res.data
        that.setData({
          actionSheetItems: arr
        });
      }
    })
    this.openList()
  },  

  openList: function () {
    this.setData({
      translateCls: 'uptranslate'
    })
  },
  close: function () {
    this.setData({
      translateCls: 'downtranslate'
    })
  },

  bindItemTap: function (e) {
    var that=this
    wx.request({
      url: `https://hy6e9qbe.qcloud.la/Musiclist_controller/Musiclist_add`,
      data:{
        musiclistid: e.currentTarget.dataset.id,
        musicid: that.data.musicList[that.data.musicListIndex]['id']
      },
      success: function (res) {
        wx.showToast({
          title: '添加成功',
          duration:500
        })
        that.close()
      }
    })
  },

  listenerActionSheet: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  f_2_2: function () {
    if (getApp().globalData.authorized==false)
    {
      wx.showToast({
        title: '请授权登录',
        icon:'loading'
      })
      return
    }
    console.log('id');
    console.log(this.data.musicListIndex);
    wx.navigateTo({
      url: '../comment/comment?musicId=' + this.data.musicList[this.data.musicListIndex]['id'] + '&musicCover=' + this.data.musicList[this.data.musicListIndex]['MusicCover']
     
    })    
  },

  f_3_0: function (event) {
    var up = "iconList_3[0].imagePath";
    var op = "iconList_3[0].i";
    if (this.data.iconList_3[0].i == 0) {
      this.setData({
        [up]: "../../src/random_cycle.png",
        [op]: 1,
        playMode: 1
      })
    }
    else if (this.data.iconList_3[0].i == 1) {
      this.setData({
        [up]: "../../src/single_cycle.png",
        [op]: 2,
        playMode: 2
      })
    }
    else {
      this.setData({
        [up]: "../../src/sequential_cycle.png",
        [op]: 0,
        playMode: 0
      })
    }
  },

  f_3_1: function () {
    var musicListIndex = this.data.musicListIndex
    var musicListLength = this.data.musicList.length
    var op = "iconList_3[2].i"
    if (this.data.playMode == 1) {
      this.setData({
        musicListIndex: Math.floor(Math.random() * musicListLength)
      })
    }
    else if (this.data.playMode == 0){
      this.setData({
        musicListIndex: (musicListIndex + musicListLength - 1) % musicListLength
      })
    }
    this.setData({
      [op]: 0
    })
    this.f_3_2()
  },

  f_3_2: function () {
    var up = "iconList_3[2].imagePath"
    var op = "iconList_3[2].i"
    if(this.data.musicList.length!=0)
    {
      
      if (this.data.iconList_3[2].i == 0) {
        this.setData({
          [up]: "../../src/pause.png",
          [op]: 1
        })
        console.log(this.data.iconList_3[2].imagePath)
        if (innerAudioContext.src != `${config.service.musicUrl}/` + this.data.musicList[this.data.musicListIndex]['id'] + '.mp3')
        {
          this.setTitle()
          this.getPicture()
          this.getLyric()
          this.isFavorite()
          innerAudioContext.src = `${config.service.musicUrl}/` + this.data.musicList[this.data.musicListIndex]['id'] + '.mp3'
        }
        innerAudioContext.play()
        console.log('innerAudioContext.src:'+innerAudioContext.src)
      }
      else {
        this.setData({
          [up]: "../../src/play.png",
          [op]: 0
        })
        console.log(this.data.iconList_3[2].imagePath)
        innerAudioContext.pause(this.data.iconList_3[2].imagePath)
      }
    }
    else
    {
      this.setData({
        [up]: "../../src/play.png",
        [op]: 0
      })
      console.log(this.data.iconList_3[2].imagePath)
    }
  },

  f_3_3: function (event) {
    var musicListIndex = this.data.musicListIndex
    var musicListLength = this.data.musicList.length
    var op = "iconList_3[2].i"
    if (this.data.playMode == 1) {
      this.setData({
        musicListIndex: Math.floor(Math.random() * musicListLength)
      })
    }
    else if (this.data.playMode == 0){
      this.setData({
        musicListIndex: (musicListIndex + 1) % musicListLength
      })
    }
    this.setData({
       [op]: 0
    })
    this.f_3_2()
  },

  f_3_4: function () {
    this.setData({
      currentIndex: 1
    })
  },

  Return:function()
  {
    this.setData({
      currentIndex: 0
    })
  },

  //进度条相关
  updateTime: function (that) {

    
  },
  //拖动滑块



  slideBar: function (e) {

    let that = this;

    var curval = e.detail.value; //滑块拖动的当前值
    var op = "iconList_3[2].i"
    this.setData({
      [op]: 0
    })
    this.f_3_2()
    innerAudioContext.seek(curval / 100); //让滑块跳转至指定位置

    //this.updateTime(that) //注意这里要继续出发updataTime事件，
  },

  //播放列表点击播放
  playsongTap: function (e) {
    var op = "iconList_3[2].i"
    this.setData({
      [op]: 0,
      musicListIndex: e.currentTarget.dataset.index
    })
    this.f_3_2()
  },

  //添加播放列表相关
  insertMusic:function(id0){
    var op = "iconList_3[2].i"
    var that = this
    var flag = 0

    for (var i=0; i < this.data.musicList.length;i++)
    {
      if (id0 == this.data.musicList[i]['id'])
      {
        this.setData({
          musicListIndex:i,
          [op]: 0
        })
        this.f_3_2()
        flag = 1
        break
      }
    }

    if(flag==0)
    {
      
      wx.request({
        url: `${config.service.music_getbyidUrl}?id=` + id0,
        success: function (res) {
          console.log('test:' + res.data + 'id0:' + id0 + ' musicListIndex:' + that.data.musicListIndex)
          that.data.musicList.push({ id: id0, name: res.data[0]['MusicName'], singer: res.data[0]['MusicSinger'], MusicCover: res.data[0]['MusicCover'], MusicLyric: res.data[0]['MusicLyric'] })
          var arr = that.data.musicList
          that.setData({
            musicListIndex: that.data.musicList.length-1,
            [op]: 0,
            musicList: arr
          })
            wx.setStorage({
            key: "musicList",
            data: that.data.musicList,
            success() {
              console.log('缓存成功')
            }
          })
          
          that.f_3_2()
        }
      })
    }
    
  },
  //从播放列表删除
  deleteMusic:function(e)
  {
    var arr=new Array()
    for (var i = 0; i < this.data.musicList.length;i++)
    {
      if (i != e.currentTarget.dataset.index)
      {
        arr.push(this.data.musicList[i])
      }
    }
    this.setData({
      musicList:arr
    })
    if (this.data.musicList.length!=0)
    {
      if (this.data.musicListIndex == e.currentTarget.dataset.index)
      {
        this.setData({
          musicListIndex: this.data.musicListIndex % arr.length
        })
        innerAudioContext.stop()
        var op = "iconList_3[2].i"
        this.setData({
          [op]: 1
        })
        this.isFavorite()
        this.f_3_2()
      }
      else if(this.data.musicListIndex > e.currentTarget.dataset.index)
      {
        this.setData({
          musicListIndex: this.data.musicListIndex -1
        })
      }
    }
    else
    {
      innerAudioContext.stop()
      var op = "iconList_3[2].i"
      this.setData({
        [op]: 1
      })
      this.isFavorite()
      this.f_3_2()
    }
    this.getLyric()
    this.getPicture()
    this.setTitle()
    wx.setStorage({
      key: "musicList",
      data: this.data.musicList,
      success() {
        console.log('缓存成功')
      }
    })
  },
  //播放列表全删除
  DeleteAll:function()
  {
    innerAudioContext.stop()
    this.setData({
      musicList:[],
      lyric: null,
      title:'',
      picturePath: `${config.service.coverUrl}/0`
    })
    var op = "iconList_3[2].i"
    this.setData({
      [op]: 1
    })
    this.f_3_2()
    wx.setStorage({
      key: "musicList",
      data: this.data.musicList,
      success() {
        console.log('缓存成功')
      }
    })
  },

  //是否是喜欢的歌曲
  isFavorite:function()
  {
    var that =this
    var up = "iconList_2[0].imagePath";
    var op = "iconList_2[0].i";
    var value=wx.getStorageSync('userid')
    if (this.data.musicList.length != 0)
    {
      wx.request({
        url: config.service.getMusicListUrl,
        data: {
          userid: value
        },
        success: function (res1) {
          that.setData({
            favorite:res1.data
          })
          console.log(res1.data)
          wx.request({
            url: config.service.musiclist_containsUrl,
            data: {
              musiclistid:res1.data,
              musicid: that.data.musicList[that.data.musicListIndex]['id']
            },
            success: function (res) {
              console.log(res.data)
              if (res.data == "bool(true)\n") {
                that.setData({
                  [up]: "../../src/dislike.png",
                  [op]: 1
                })
              }
              else {
                that.setData({
                  [up]: "../../src/like.png",
                  [op]: 0
                })
              }
            }
          })
        }
      })
      
    }
    else
    {
      this.setData({
        [up]: "../../src/like.png",
        [op]: 0
      })
    }
  },

  //获取封面
  getPicture:function()
  {
    if (this.data.musicList.length != 0 && this.data.musicList[this.data.musicListIndex]['MusicCover'] == 1)
    {
      this.setData({
        picturePath: `${config.service.coverUrl}/` + this.data.musicList[this.data.musicListIndex]['id']
      })
      innerAudioContext.coverImgUrl = `${config.service.coverUrl}/` + this.data.musicList[this.data.musicListIndex]['id']
    }
    else
    {
      this.setData({
        picturePath: `${config.service.coverUrl}/0`
      })
      innerAudioContext.coverImgUrl = `${config.service.coverUrl}/0`
    }
  },

  //获取歌词
  getLyric:function()
  {
    if (this.data.musicList.length != 0 && this.data.musicList[this.data.musicListIndex]['MusicLyric'] == 1)
    {
      var that = this
      wx.request({
        url: `${config.service.lyricUrl}/` + that.data.musicList[that.data.musicListIndex]['id'] + '.lrc',
        success: function (res) {
          if (res.statusCode == 200) {
            const lyric = that._normalizeLyric(res.data)
            const currentLyric = new Lyric(lyric)
            that.setData({
              lyric: currentLyric
            })
          }
        }
      })
    }
    else
    {
      this.setData({
        lyric: null,
        currentText: ''
      })
    }
    
  },


  // 歌词滚动回调函数
  handleLyric: function (currentTime) {
    let lines = [{ time: 0, txt: '' }], lyric = this.data.lyric, lineNum
    lines = lines.concat(lyric.lines)
    for (let i = 0; i < lines.length; i++) {
      if (i < lines.length - 1) {
        let time1 = lines[i].time, time2 = lines[i + 1].time
        if (currentTime > time1 && currentTime < time2) {
          lineNum = i - 1
          break;
        }
      } else {
        lineNum = lines.length - 2
      }
    }
    this.setData({
      currentLineNum: lineNum,
      currentText: lines[lineNum + 1] && lines[lineNum + 1].txt
    })

    let toLineNum = lineNum - 5
    if (lineNum > 5 && toLineNum != this.data.toLineNum) {
      this.setData({
        toLineNum: toLineNum
      })
    }
  },
  
  // 去掉歌词中的转义字符
  _normalizeLyric: function (lyric) {
    return lyric.replace(/&#58;/g, ':').replace(/&#10;/g, '\n').replace(/&#46;/g, '.').replace(/&#32;/g, ' ').replace(/&#45;/g, '-').replace(/&#40;/g, '(').replace(/&#41;/g, ')')
  },

  //改变标题
  setTitle:function()
  {
    if (this.data.musicList.length!=0)
    {
      this.setData({
        title: this.data.musicList[this.data.musicListIndex]['name']
      })
      innerAudioContext.title = this.data.musicList[this.data.musicListIndex]['name']
    }
    else
    {
      this.setData({
        title: ''
      })
      innerAudioContext.title =''
    }
    console.log('title:'+this.data.title)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.musicId) {
      this.insertMusic(options.musicId)
      options.musicId = null
    }
    var that = this
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.getLyric()
      console.log(innerAudioContext.src)
      //that.updateTime(that)
      var up = "iconList_3[2].imagePath"
      var op = "iconList_3[2].i"
      that.setData({
        [up]: "../../src/pause.png",
        [op]: 1
      })
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.onPause((res) => {
      /*var up = "iconList_3[2].imagePath"
      var op = "iconList_3[2].i"
      that.setData({
        [up]: "../../src/play.png",
        [op]: 0
      })*/
    })
    innerAudioContext.onStop((res) => {
      /*var up = "iconList_3[2].imagePath"
      var op = "iconList_3[2].i"
      that.setData({
        [up]: "../../src/play.png",
        [op]: 0
      })*/
    })
    innerAudioContext.onTimeUpdate((res) => {

      //更新时把当前的值给slide组件里的value值。slide的滑块就能实现同步更新


      that.setData({
        duration: innerAudioContext.duration.toFixed(2) * 100,
        curTimeVal: innerAudioContext.currentTime.toFixed(2) * 100,
      })
      if (that.data.lyric) {
        that.handleLyric(innerAudioContext.currentTime * 1000)
      }

    })
    innerAudioContext.onEnded(() => {
      var musicListIndex = this.data.musicListIndex
      var musicListLength = this.data.musicList.length
      var op = "iconList_3[2].i"
      if (this.data.playMode == 0) {
        this.setData({
          musicListIndex: (musicListIndex + 1) % musicListLength
        })
      }
      else if (this.data.playMode == 1) {
        this.setData({
          musicListIndex: Math.floor(Math.random() * musicListLength)
        })
      }
      this.setData({
        curTimeVal: 0
      })
      this.setData({
        [op]: 0
      })
      this.f_3_2()
    })

    wx.getStorage({
      key: 'musicList',
      success: function (res) {
        var userid = wx.getStorageSync('userid')
        console.log(userid)
        that.setData({
          musicList: res.data
        })
        
        innerAudioContext.pause()
        
        that.isFavorite()
        
        that.setTitle()
        that.getPicture()
        that.getLyric()
      }
    })
    this.setData({
      isLight: true,
      listBgColor: this.dealColor('14737632')
    })
  },
  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  dealColor: function (rgb) {
    if (!rgb) { return; }
    let r = (rgb & 0x00ff0000) >> 16,
      g = (rgb & 0x0000ff00) >> 8,
      b = (rgb & 0x000000ff);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (opt) {
    var done = getApp().globalData.done
    if(!done)
    {
      getApp().globalData.done=true
      var addSongs = getApp().globalData.addSongs
      console.log('addSongs:'+addSongs)
      for(var i=0;i<addSongs.length;i++)
      {
        this.insertMusic(addSongs[i])
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log(this.data.musicList[this.data.musicListIndex])
    return {
      title: '分享给你一首好听的歌',
      desc: '音乐随想',
      path: '/pages/index/index?musicId='+this.data.musicList[this.data.musicListIndex]['id']
    }
  },
})