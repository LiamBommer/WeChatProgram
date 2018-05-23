Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '日程标题',
    icon_share: '/img/share.png',
    icon_deadline: '/img/deadline.png',
    icon_task_list: '/img/task_list.png',
    icon_add: '/img/add.png',
    icon_member: '/img/member.png',
    icon_close: '/img/close.png',
    icon_create: '/img/create.png',
    deadline: '', 
    stattime: '', 
  },

  // 截止时间
  DeadLineChange: function (e) {
    this.setData({
      deadline: e.detail.value
    })
  }, 
  
  // 开始时间
  StatTimeChange: function (e) {
    this.setData({
      stattime: e.detail.value
    })
  }, 

  //删除
  Delete: function () {
    wx.showModal({
      title: '提示',
      content: '确定要删除此日程吗',
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
