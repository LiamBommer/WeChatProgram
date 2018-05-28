// pages/editMemberList/editMemberList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    TaskIndex: "",
    ProjectIndex: "",
    //任务负责人
    principalName: "帅涛",
    principalIicon: "/img/me.png",
    principalIndex: 0,
    principalChecked: true,
    //项目成员
    ProjectMemember: [
      {
        index: 0,
        icon: "/img/me.png",
        name: '钢铁侠',
        checked: false
      },
      {
        index: 1,
        icon: "/img/me.png",
        name: '美国队长',
        checked: true,
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
  TaskMememberChange: function (e) {
    this.setData({
      TaskIndex: e.detail.value,
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