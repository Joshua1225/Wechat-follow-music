// pages/play/play.js

const innerAudioContext = wx.createInnerAudioContext()

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
    isLight: false,
    iconList_1: [
      {
        imagePath: "../../src/查询.png",
        func: "f_1_0"
      },
      {
        imagePath: "../../src/分享.png",
        func: "f_1_1"
      }
    ],
    iconList_2: [
      {
        imagePath: "../../src/未添加喜爱.png",
        i: 0,
        func: "f_2_0"
      },
      {
        imagePath: "../../src/添加歌单.jpg",
        func: "f_2_1"
      },
      {
        imagePath: "../../src/评论.png",
        func: "f_2_2"
      }
    ],
    iconList_3: [
      {
        imagePath: "../../src/循环播放.png",
        func: "f_3_0",
        i: 0
      },
      {
        imagePath: "../../src/上一首.png",
        func: "f_3_1"
      },
      {
        imagePath: "../../src/播放.png",
        func: "f_3_2",
        i: 0
      },
      {
        imagePath: "../../src/下一首.png",

        func: "f_3_3"
      },
      {
        imagePath: "../../src/播放列表.png",
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
        [up]: "../../src/添加喜爱.png",
        [op]: 1
      })
    }
    else {
      this.setData({
        [up]: "../../src/未添加喜爱.png",
        [op]: 0
      })
    }
  },

  f_2_1: function () {
    var userid = wx.getStorageSync('userid')
    var that=this
    console.log(userid)
    wx.request({
      url: `https://hy6e9qbe.qcloud.la/Musiclist_controller/Musiclist_getbyuserid?userid=` + userid,
      success: function (res) {
        var arr = res.data
        that.setData({
          actionSheetItems: arr
        });
      }
    })
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  bindItemTap: function (e) {
    var that=this
    wx.request({
      url: `https://hy6e9qbe.qcloud.la/Musiclist_controller/Musiclist_add`,
      data:{
        musiclistid: e.currentTarget.dataset.name,
        musicid: that.data.musicList[that.data.musicListIndex]['id']
      },
      success: function (res) {
        that.setData({
          actionSheetHidden: !that.data.actionSheetHidden
        })
      }
    })
    
  },

  listenerActionSheet: function (e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },

  f_2_2: function () {
    console.log(this.data.musicList);
    wx.navigateTo({
      url: '../comment/comment?music_id=' + this.data.musicList[this.data.musicListIndex]['id']
    })
  },

  f_3_0: function (event) {
    var up = "iconList_3[0].imagePath";
    var op = "iconList_3[0].i";
    if (this.data.iconList_3[0].i == 0) {
      this.setData({
        [up]: "../../src/随机播放.png",
        [op]: 1,
        playMode: 1
      })
    }
    else if (this.data.iconList_3[0].i == 1) {
      this.setData({
        [up]: "../../src/单曲循环.png",
        [op]: 2,
        playMode: 2
      })
    }
    else {
      this.setData({
        [up]: "../../src/循环播放.png",
        [op]: 0,
        playMode: 0
      })
    }
  },

  f_3_1: function () {
    var musicListIndex = this.data.musicListIndex
    var musicListLength = this.data.musicList.length
    var up = "iconList_3[2].imagePath"
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
    if (this.data.iconList_3[2].i == 0) {
      this.setData({
        [up]: "../../src/暂停.png",
        [op]: 1
      })
    }
    innerAudioContext.play()
  },

  f_3_2: function () {

    var up = "iconList_3[2].imagePath";
    var op = "iconList_3[2].i";
    if (this.data.iconList_3[2].i == 0) {
      this.setData({
        [up]: "../../src/暂停.png",
        [op]: 1
      })
      innerAudioContext.play()
      console.log(innerAudioContext.src)
    }
    else {
      this.setData({
        [up]: "../../src/播放.png",
        [op]: 0
      })
      innerAudioContext.pause()
    }
  },

  f_3_3: function (event) {
    var musicListIndex = this.data.musicListIndex
    var musicListLength = this.data.musicList.length
    var up = "iconList_3[2].imagePath"
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
    if (this.data.iconList_3[2].i == 0) {
      this.setData({
        [up]: "../../src/暂停.png",
        [op]: 1
      })
    }
    innerAudioContext.play()
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

      //console.log("duration的值：", that.data.curTimeVal)
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

  //播放列表生成
  buildList:function(){

  },

  //添加播放列表相关
  insertMusic:function(id0){
    for (var i=0; i < this.data.musicList.length;i++)
    {
      if (id0 == this.data.musicList[i]['id'])
      {
        innerAudioContext.src = 'http://140.143.149.22/music/' + this.data.musicList[i]['id'] + '.mp3'
        this.f_3_2()
        return
      }
    }
    console.log('添加成功' + this.data.musicList.length)
    var musicListLength = this.data.musicList.length
    var op = "iconList_3[2].i"
    var that=this

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    innerAudioContext.onPlay(() => {
      console.log('开始播放')
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
    wx.setStorage({
      key: "musicList",
      data: [{ id: '1', name: '第一首歌', singer: '王佳奇' }, { id: '2', name: '第二首歌', singer: '王佳奇' }, { id: '3', name: '第三首歌', singer: '王佳奇' }, { id: '4', name: '第四首歌', singer: '王佳奇' }, { id: '5', name: '第五首歌', singer: '王佳奇'}],
      success() {
        console.log('缓存成功')
      }
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
  onShow: function () {
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