Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '富民贼牛逼',
    icon_task_list: '/img/task_list.png',
    icon_member: '/img/member.png',
    icon_add: '/img/add.png',
    icon_close: '/img/close.png',
    icon_share: '/img/share.png',

    connectTask: [//关联任务
      {
        id: '',
        name: '任务 A',
        icon: '/img/member.png',
      },
      {
        id: '',
        name: '任务 B',
        icon: '/img/member.png',
      },
    ],
  },

  //点子内容
  Content:function(){
    wx.setStorageSync("ideaDetail-content", this.data.content)
    wx.navigateTo({
      url: './Content/Content',
    })
  },

  //删除
  Delete: function () {
    wx.showModal({
      title: '提示',
      content: '确定要删除此点子吗',
      success: function (res) {
        if (res.confirm) {//点击确定
          wx.navigateBack({
            url: '../../ProjectMore/ProjectMore',
          })
        }
        else {//点击取消

        }
      }
    })
  },

  // 关联任务
  connectTask: function (e) {
    //需要设置任务列表的任务名，执行者头像的缓存
    wx.navigateTo({
      url: '../IdeaTaskList/IdeaTaskList',
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
    var content = wx.getStorageSync("ideaDetail-Content-content")
    that.setData({
      content: content
    })

    var TaskId = wx.getStorageSync("ScheduleTaskList-TaskId")//关联的任务ID
    //需要任务列表，通过任务ID取任务名和任务执行者
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
    wx.removeStorageSync("ideaDetail-Content-content")
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
