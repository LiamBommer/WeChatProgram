Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalputTitle: true,//弹出标题模态框
    title: '公告标题',//标题
    inputTitle:'',//输入的标题
    content: '因为 Mr.Li 也很牛逼balabal ...\n'+
            '我就不说什么了，大家都知道的。\n'+
            '请同学们抓紧时间做完原型图，做完了请大家吃鸡腿',
    note_time: '2018/05/01',
    note_user: '产品经理',
    belonging: '项目名',//项目名
    icon_share: '/img/share.png',
    icon_belonging: '/img/belonging.png',
    icon_close: '/img/close.png',
    icon_more: '/img/more.png',
    
    //未读成员
    noread: [
      {
        id: "",
        icon: '/img/member.png',
        name:"同学A",
      },
      {
        id: "",
        icon: '/img/member.png',
        name: "同学B",
      },
    ],

    //已读成员
    read: [
      // {
      //   id:"",
      //   icon: '',
      //   name: '',
      // },
    ],
  },


  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinputTitle: function () {
    this.setData({
      hiddenmodalputTitle: false
    })
  },
  //取消按钮  
  cancelTitle: function () {
    this.setData({
      hiddenmodalputTitle: true,
    });
  },
  //确认  
  confirmTitle: function (e) {
    this.setData({
      hiddenmodalputTitle: true,
      title: this.data.inputTitle
    })
  }, 

  //标题
  input: function (e){
    var inputTitle = e.detail.value
    this.setData({
      inputTitle: inputTitle
    })
  },
  
  //内容
  Content: function (e) {
    wx.setStorageSync("announcementDetail-content", this.data.content)
    wx.navigateTo({
      url: './Content/Content',
    })
  }, 

  //点击收到
  ClickRead:function(){
    var that = this
    var hasRead = false//判断是否已点过“收到”
    var CurrentMemberId = getApp().globalData.userId//当前用户ID
    var CurrentMemberIcon = getApp().globalData.userPic//当前用户头像
    var CurrentMemberName = getApp().globalData.nickName//当前用户姓名
    
    var read = that.data.read
    for(var i in read){
      if (read[i].id == CurrentMemberId)//已点击"收到"
      {
        wx.showToast({
          title: '你已阅读过了',
          icon:'none',
        })
        hasRead = true
      }
    }
    if (hasRead == false) {//未点击"收到"
    //删除未读成员
      var memberList = wx.getStorageSync("ProjectDetail-memberList")//未读成员列表
      for (var i in memberList ){
        if (memberList[i].id == CurrentMemberId){
          memberList.splice(i,1)
        }
      }
      that.setData({
        noread: memberList
      })
    //增加已读成员
      read.push({
        id: CurrentMemberId,
        icon: CurrentMemberIcon,
        name: CurrentMemberName,
      })
      that.setData({
        read: read
      })
    }
    
  },

  //已读成员列表
  readMember: function () {
    wx.setStorageSync("announcementDetail-readMember", this.data.read)
    wx.navigateTo({
      url: './memberList/memberList',
    })
  },

  //删除公告
  Delete: function () {

    wx.showModal({
      title: '提示',
      content: '确定要删除此公告吗',
      success:function(res){
        if(res.confirm){//点击确定
          wx.navigateBack({
            url: '../../ProjectMore/ProjectMore',
          })
        }
        else{//点击取消

        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   var that = this

   var content = wx.getStorageSync("announcementDetail-Content-content")//会议内容
   that.setData({
     content: content
   })

   var memberList = wx.getStorageSync("ProjectDetail-memberList")//未读成员列表
   that.setData({
     noread: memberList
   })
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
    wx.removeStorageSync("announcementDetail-Content-content")
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
