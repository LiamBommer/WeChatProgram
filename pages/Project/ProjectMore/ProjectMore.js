// pages/ProjectMore/ProjectMore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //隐藏判断
    exitAnnouncement: true,
    exitMeeting: false,
    exitSchedule: false,
  },

  // 导航栏选择公告
  selectAnnouncement:function(){
    var that = this;
    that.setData({
      exitAnnouncement: true,
      exitMeeting: false,
      exitSchedule: false,
    });
  },

  // 导航栏选择会议
  selectMeeting: function () {
    var that = this;
    that.setData({
      exitMeeting: true,
      exitAnnouncement: false,
      exitSchedule: false,
    });
  }, 
  
  // 导航栏选择日程
  selectSchedule: function() {
    var that = this;
    that.setData({
      exitSchedule: true,
      exitMeeting: false,
      exitAnnouncement: false,
    });
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