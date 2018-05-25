// pages/Project/ProjectDetail/ProjectBelong/ProjectBelong.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    memberId:'',//选中的成员
    //项目成员
    ProjectMemember: [
      {
        id: 0,
        icon: "/img/me.png",
        name: '帅涛',
        checked: true,
      },
      {
        id: 1,
        icon: "/img/me.png",
        name: '钢铁侠',
        checked: false
      },
      {
        id: 2,
        icon: "/img/me.png",
        name: '美国队长',
        checked: false,
      },
      {
        id: 3,
        icon: "/img/me.png",
        name: '灭霸',
        checked: false,
      },
    ],
  },

  //选择项目成员
  ProjectMememberChange: function (e) {
    this.setData({
      memberId: e.detail.value,//选中的项目成员iD
    });
  },

  //添加成员
  Finish:function () {
    var that = this
    var memberId = that.data.memberId
    console.log(memberId)
    wx.setStorageSync("ProjectBelong-memberId", memberId)//选中的成员ID
    wx.navigateBack({
      url: '../ProjectDetail',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var ProjectMemember = wx.getStorageSync("ProjectDetail-memberList")
    this.setData({
      ProjectMemember: ProjectMemember
    });
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
    for (var i in ProjectMemember){
      if(i != 0)
        ProjectMemember[i].checked = false
    }
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