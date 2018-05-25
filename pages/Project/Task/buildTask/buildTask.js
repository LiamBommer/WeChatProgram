// pages/Task/buildTask/buildTask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: '',//成员头像
    deadline: '',//截止时间
  },

  // 截止时间
  DeadLineChange: function (e) {
    this.setData({
      deadline: e.detail.value
    })
  },

   // 添加成员
  AddMember: function () {
    var icon = this.data.icon
    wx.setStorageSync("buildTask-membericon", icon)
    wx.navigateTo({
      url: './memberList/memberList',
    })
  },

  //提交表单
  BuildTask:function(e){
    console.log(e.detail.value);
    wx.navigateBack({
      url:"../../ProjectMore/ProjectMore"
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
    var icon = wx.getStorageSync("buildTask-memberList-membericon")
    console.log(icon)
    if(icon == "")
    this.setData({
      icon: "/img/add_solid.png"
    })
    else{
      this.setData({
        icon: icon
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
   wx.removeStorageSync("buildTask-memberList-membericon")
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