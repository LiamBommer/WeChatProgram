// pages/memberList/memberList.js
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
        id:"",
        index: 0,
        icon: "/img/me.png",
        name: '帅涛',
        checked: true
      },
    ],
  },

  //选择项目成员
  ProjectMememberChange: function (e) {
    this.setData({
      ProjectIndex: e.detail.value,
    });
  },

  //添加新成员
  Addmember: function () {
    wx.navigateTo({
      url: './addMember/addMember',
    })
  },

  //完成
  Finish: function () {
    var that = this;
    var ProjectIndex = that.data.ProjectIndex;
    var ProjectMemember = that.data.ProjectMemember;
    for (var id in ProjectIndex) {
      console.log(ProjectMemember[ProjectIndex[id]]);//删除的项目成员
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
    var memberList = wx.getStorageSync("ProjectDetail-memberList")
    this.setData({
      ProjectMemember: memberList
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