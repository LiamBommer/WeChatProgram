// pages/Project/Meeting/meetingDetail/meetingDetai.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalputTitle: true,//弹出标题模态框
    title: '策划讨论',//标题
    inputTitle: '',//输入的标题
    content: " 讨论如何创新活动，增加活动趣味性",//会议内容
    icon_share: '/img/share.png',
    icon_deadline: '/img/deadline.png',
    icon_cycle: '/img/cycle.png',
    icon_member: '/img/member.png',
    icon_close: '/img/close.png',
    stattime: '2018-05-22 21:00', //开始时间
    index: '不',//选择重复时间
    repeatTime: ["每天", "每周", "每月", "每年"],
    memberIcon:[
      "/img/create.png",
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
  input: function (e) {
    var inputTitle = e.detail.value
    this.setData({
      inputTitle: inputTitle
    })
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

  //会议记录
  Record: function (e) {
    wx.navigateTo({
      url: './Record/Record',
    })
  }, 
  
  //会议内容
  Content: function (e) {
    wx.setStorageSync("meetingDetail-content", this.data.content)
    wx.navigateTo({
      url: './Content/Content',
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
  
  //删除
  Delete: function () {
    wx.showModal({
      title: '提示',
      content: '确定要删除此会议吗',
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
    var that = this
    var content = wx.getStorageSync("meetingDetail-Content-content")
    //视频
    // that.setData({
    //   content: content
    // })

    var icon = wx.getStorageSync("meetingDetail-memberList-icon")
    if(icon == ""){
      that.setData({
        "memberIcon[0]": "/img/create.png"
      })
    }
    else{
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
    wx.removeStorageSync("meetingDetail-Content-content")
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
