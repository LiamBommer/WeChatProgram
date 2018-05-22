// pages/Project/ProjectDetail/ProjectBelong/ProjectBelong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    ProjectIndex: "",
    //项目成员
    ProjectMemember: [
      {
        index: 0,
        icon: "/img/me.png",
        name: '帅涛',
        checked: true,
      },
      {
        index: 1,
        icon: "/img/me.png",
        name: '钢铁侠',
        checked: false
      },
      {
        index: 2,
        icon: "/img/me.png",
        name: '美国队长',
        checked: false,
      },
      {
        index: 3,
        icon: "/img/me.png",
        name: '灭霸',
        checked: false,
      },
    ],
  },

  //选择项目成员
  ProjectMememberChange: function (e) {
    this.setData({
      ProjectIndex: e.detail.value,
    });
  },

  //添加成员
  Finish: function () {
    var that = this;
    var ProjectIndex = that.data.ProjectIndex;
    var ProjectMemember = that.data.ProjectMemember;
    for (var id in ProjectIndex) {
      console.log(ProjectMemember[ProjectIndex[id]]);//选中的项目成员
    } 
    wx.navigateBack({
      url: '../ProjectDetail',
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
    var ProjectMemember = wx.getStorageSync("ProjectDetail-memberList")
    this.setData({
      ProjectMemember: ProjectMemember
    });
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