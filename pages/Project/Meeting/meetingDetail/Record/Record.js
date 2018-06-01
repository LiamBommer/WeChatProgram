// pages/Project/Task/TaskDetail/CommModel/addModel/addModel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:'填写会议记录...',//会议记录
  },

  save:function(e){
    var record = e.detail.value.record
    console.log(record)
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
    this.setData({
      record: "会议要点：1、挑选有趣的嘉宾 2、合理设置分享内容 3、丰富活动当天流程  4、提供有趣的预热活动  5、设置丰富的奖品"
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