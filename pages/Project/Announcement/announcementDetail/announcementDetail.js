Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '公告标题',
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
      {
        id:"",
        icon: '/img/member.png',
      },
      {
        id:"",
        icon: '/img/member.png',
      },
    ],
  },
  
  //点击收到
  ClickRead:function(){

  },

  //已读成员列表
  readMember: function () {
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
