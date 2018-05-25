//addMember.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_deadline: '/img/deadline.png',
    icon_cycle: '/img/cycle.png',
    icon_member: '/img/member.png',
    icon_close: '/img/close.png',
    icon_create: '/img/create.png',
    stattime: '', 
    index:'',//选择重复时间
    repeatTime: ["每天", "每周", "每月", "每年"],
    memberIcon: [
      "/img/create.png",
    ],
  },

  // 重复时间
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  // 开始时间
  StatTimeChange: function (e) {
    this.setData({
      stattime: e.detail.value
    })
  },

  // 成员列表
  memberList: function (e) {
    var memberIcon = this.data.memberIcon
    wx.setStorageSync("meetingDetail-membericon", memberIcon)
    wx.navigateTo({
      url: './memberList/memberList',
    })
  },
  
  //创建会议
  BuildMeeting: function (e) {
    var title = e.detail.value.title
    var content = e.detail.value.content
    console.log(title)
    console.log(content)
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
    var icon = wx.getStorageSync("meetingDetail-memberList-icon")
    if (icon == "") {
      that.setData({
        "memberIcon[0]": "/img/create.png"
      })
    }
    else {
      that.setData({
        memberIcon: icon
      })
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

    wx.removeStorageSync("meetingDetail-memberList-icon")
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
