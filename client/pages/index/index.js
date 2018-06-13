  // pages/play/play.js
var config = require('../../config')
const innerAudioContext = wx.createInnerAudioContext()
const Lyric = require('../../utils/lyric.js')
var imageUtil = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicListIndex: 0,
    playMode: 0,
    curTimeVal: 0,
    duration: 0,
    hiddenLoading:true,
    actionSheetHidden:true,
    actionSheetItems:[],
    listBgColor: '',
    isLight: true,
    lyric:null,
    currentLineNum: 0,
    currentText: '',
    toLineNum: -1,
    picturePath:'',
    musicList:[],
    iconList_1: [
      {
        imagePath: "../../src/search.png",
        func: "f_1_0"
      },
      {
        imagePath: "../../src/share.png",
        func: "f_1_1"
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
    var up = "iconList_2[0].imagePath";
    var op = "iconList_2[0].i";
    if (this.data.iconList_2[0].i == 0) {
      this.setData({
        [up]: "../../src/dislike.png",
        [op]: 1
      })
    }
    else {
      this.setData({
        [up]: "../../src/like.png",
        [op]: 0
      })
    }
  },

  f_2_1: function () {
    this.setData({
      hiddenLoading:false
    })
    var userid = wx.getStorageSync('userid')
    var that=this
    console.log(userid)
    wx.request({
      url: `https://hy6e9qbe.qcloud.la/Musiclist_controller/Musiclist_getbyuserid?userid=` + userid,
      success: function (res) {
        var arr = res.data
        that.setData({
          actionSheetItems: arr,
          hiddenLoading: true
        });
      }
    })
    this.openList()
    /*this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })*/
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
    wx.navigateTo({
      url: '../comment/comment?music_id=' + this.data.musicList[this.data.musicListIndex]['id']
     
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
    else {
      this.setData({
        musicListIndex: (musicListIndex + musicListLength - 1) % musicListLength
      })
    }
    innerAudioContext.src = 'http://140.143.149.22/music/' + this.data.musicList[this.data.musicListIndex]['id'] + '.mp3'
    this.setData({
      [op]: 0
    })
    this.f_3_2()
  },

  f_3_2: function () {
    var up = "iconList_3[2].imagePath"
    var op = "iconList_3[2].i"
    this.getPicture()
    if (this.data.iconList_3[2].i == 0) {
      this.setData({
        [up]: "../../src/pause.png",
        [op]: 1
      })
      innerAudioContext.play()
      console.log(innerAudioContext.src)
    }
    else {
      this.setData({
        [up]: "../../src/play.png",
        [op]: 0
      })
      innerAudioContext.pause()
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
    else {
      this.setData({
        musicListIndex: (musicListIndex + 1) % musicListLength
      })
    }
    innerAudioContext.src = 'http://140.143.149.22/music/' + this.data.musicList[this.data.musicListIndex]['id'] + '.mp3'
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

  //进度条相关
  updateTime: function (that) {

    innerAudioContext.onTimeUpdate((res) => {

      //更新时把当前的值给slide组件里的value值。slide的滑块就能实现同步更新


      that.setData({
        duration: innerAudioContext.duration.toFixed(2) * 100,
        curTimeVal: innerAudioContext.currentTime.toFixed(2) * 100,
      })
      if (that.data.lyric) {
        that.handleLyric(innerAudioContext.currentTime*1000)
      }
      
    })
  },
  //拖动滑块



  slideBar: function (e) {

    let that = this;

    var curval = e.detail.value; //滑块拖动的当前值

    innerAudioContext.seek(curval / 100); //让滑块跳转至指定位置

    innerAudioContext.onSeeked((res) => {

      this.updateTime(that) //注意这里要继续出发updataTime事件，

    })
  },

  //播放列表点击播放
  playsongTap: function (e) {
    var op = "iconList_3[2].i"
    this.setData({
      [op]: 0,
      musicListIndex: e.currentTarget.dataset.index
    })
    innerAudioContext.src = 'http://140.143.149.22/music/' + e.currentTarget.dataset.id + '.mp3'
    this.f_3_2()
  },

  //添加播放列表相关
  insertMusic:function(id0){
    var musicListLength = this.data.musicList.length
    var op = "iconList_3[2].i"
    var that = this

    for (var i=0; i < this.data.musicList.length;i++)
    {
      if (id0 == this.data.musicList[i]['id'])
      {
        this.setData({
          musicListIndex:i,
          [op]: 0
        })
        innerAudioContext.src = 'http://140.143.149.22/music/' + this.data.musicList[i]['id'] + '.mp3'
        this.f_3_2()
        return
      }
    }
    console.log('添加成功' + this.data.musicList.length)

    wx.request({
      url: `https://hy6e9qbe.qcloud.la/Music_controller/Music_getbyid?id=` + id0,
      success: function (res) {
        var name0 = res.data[0]['MusicName']
        var singer0 = res.data[0]['MusicSinger']
        that.data.musicList.push({ id: id0, name: name0, singer:singer0})
        var arr = that.data.musicList
        console.log(res.data[0]['MusicName'])
        console.log(name0)
        that.setData({
          musicListIndex: musicListLength,
          [op]: 0,
          musicList : arr
        })
        innerAudioContext.src = 'http://140.143.149.22/music/' + that.data.musicList[that.data.musicListIndex]['id'] + '.mp3'
        console.log(that.data.musicList)
        that.f_3_2()
      }
    })
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
      musicListIndex: 0,
      musicList:arr
    })
    innerAudioContext.src = 'http://140.143.149.22/music/' + this.data.musicList[0]['id'] + '.mp3'
    this.getLyric()
    this.getPicture();
  },

  //获取封面
  getPicture:function()
  {
    this.setData({
      picturePath: 'http://140.143.149.22/picture/' + this.data.musicList[this.data.musicListIndex]['id']
    })
  },

  //获取歌词
  getLyric:function()
  {
    var that=this
    wx.request({
      url: 'http://140.143.149.22/lyric/' + that.data.musicList[that.data.musicListIndex]['id'] +'.lrc',
      success: function (res) {
        if (res.statusCode==200){
          const lyric = that._normalizeLyric(res.data)
          const currentLyric = new Lyric(lyric)
          that.setData({
            lyric: currentLyric
          })
        }
        else{
          that.setData({
            lyric: null,
            currentText: ''
          })
        }
      },
      fail:function(res)
      {
        console.log(res)
      }
    })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    getApp().globalData.indexPage=this
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      that.getLyric()
      console.log(innerAudioContext.src)
      that.updateTime(that)
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.onEnded(() => {
      var musicListIndex = that.data.musicListIndex
      var musicListLength = that.data.musicList.length
      if (this.data.playMode == 0) {
        that.setData({
          musicListIndex: (musicListIndex + 1) % musicListLength
        })
      }
      else if (this.data.playMode == 1) {
        that.setData({
          musicListIndex: Math.floor(Math.random() * musicListLength)
        })
      }
      that.setData({
        curTimeVal: 0
      })
      innerAudioContext.src = 'http://140.143.149.22/music/' + that.data.musicList[that.data.musicListIndex]['id'] + '.mp3'
      innerAudioContext.play()
    })

    wx.getStorage({
      key: 'musicList',
      success: function (res) {
        console.log(res.data)
        that.setData({
          musicList: res.data
        })
        innerAudioContext.src = 'http://140.143.149.22/music/' + res.data[that.data.musicListIndex]['id'] + '.mp3'
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
    //console.log(getApp().globalData.addSongs + "  " + getApp().globalData.done)
    var done = getApp().globalData.done
    if(!done)
    {
      getApp().globalData.done=false
      var addSongs = getApp().globalData.addSongs
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

  }
})