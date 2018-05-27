// pages/Project/Task/TaskDetail/CommModel/addModel/addModel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:'',//会议记录
  },

  save:function(e){
    var record = e.detail.value.record
    wx.setStorageSync("announcementDetail-Content-content", record)
    this.setData({
      record:record
    })
    wx.navigateBack({
      url:'../meetingDetail'
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
    var record = wx.getStorageSync("announcementDetail-content")
    that.setData({
      record: record
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
    wx.removeStorageSync("announcementDetail-content")
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