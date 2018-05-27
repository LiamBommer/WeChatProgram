// pages/memberList/memberList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    MemberId: "",
    //项目成员
    ProjectMember: [
      {
        id: "",
        icon: "/img/me.png",
        name: '帅涛',
        checked: false
      },
      {
        id: "",
        icon: "/img/me.png",
        name: '钢铁侠',
        checked: false
      },
      {
        id: '',
        icon: "/img/me.png",
        name: '美国队长',
        checked: false,
      },
      {
        id: '',
        icon: "/img/me.png",
        name: '灭霸',
        checked: false,
      },
    ],



  },

  //选择项目成员
  ProjectMemberChange: function (e) {
    this.setData({
      MemberId : e.detail.value,
    });
  },

  //完成
  save:function(){
    var that = this;
    var MemberId = that.data.MemberId;//选中的成员ID
    var ProjectMember = that.data.ProjectMember;
    for (var i in ProjectMember)
      if (ProjectMember[i].id == MemberId){
        wx.setStorageSync("buildTask-memberList-membericon", ProjectMember[i].icon)
      }

    wx.navigateBack({
      url:"../buildTask"
    })
  },

  //删除成员
  deleteMember: function () {
    var that = this;
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
    var memberList = wx.getStorageSync("ProjectDetail-memberList")
    for (var i in memberList){
      memberList[i].checked = false
    }
    // that.setData({
    //   ProjectMember: memberList,
    // });

    var membericon = wx.getStorageSync("buildTask-membericon")
    if (membericon != ""){
      for (var i in memberList) {
        if (memberList[i].icon == membericon) {//初始化选中成员
          console.log(memberList[i])
          memberList[i].checked = true
          // that.setData({
          //   ProjectMember: memberList,
          // });
        }
      }
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
    wx.removeStorageSync("buildTask-membericon")
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
