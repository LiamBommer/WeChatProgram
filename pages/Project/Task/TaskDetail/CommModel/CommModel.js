// pages/Project/Task/TaskDetail/CommModel/CommModel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选择判断
    exitComment: true,
    exitQuestion: false,
    exitLike: false,
  },

  // 导航栏选择意见
  selectComment: function () {
    var that = this;
    that.setData({
      exitComment: true,
      exitQuestion: false,
      exitLike: false,
    });
  },

  // 导航栏选择提问
  selectQuestion: function () {
    var that = this;
    that.setData({
      exitComment: false,
      exitQuestion: true,
      exitLike: false,
    });
  },

  // 导航栏选择点赞
  selectLike: function () {
    var that = this;
    that.setData({
      exitComment: false,
      exitQuestion: false,
      exitLike: true,
    });
  },
  
  // 添加模板
  addModel: function () {
    wx.navigateTo({
      url: './addModel/addModel',
    })
  }, 

  // 编辑模板
  ModelDetail: function() {
    wx.navigateTo({
      url: './ModelDetail/ModelDetail',
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