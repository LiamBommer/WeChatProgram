// pages/changePrincepal/changePrincepal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    selectedMemberId: "",
    //任务成员
    TaskMemember: [
      {
        index: 0,
        icon:"/img/me.png",
        name: '帅涛' ,
        checked: true,
      },
      {
        index: 1 ,
        icon: "/img/me.png",
        name: '美国队长',
        checked: false,
      },
      {
        index: 2,
        icon: "/img/me.png",
        name: '灭霸',
        checked: false,
      },
    ],

  },

  //选择任务成员
  radioChange: function (e) {
    this.setData({
      selectedMemberId: e.detail.value,
    });
  },

  // 更改完成
  save: function() {
    // 获取新选中的负责人Id

    // 传送后台确认更改，返回

    wx.navigateBack();
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
