// pages/Project/Task/TaskDetail/CommModel/ModelDetail/ModelDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",//内容
  },

  //保存
  save: function (e) {
    var that = this
    var content = e.detail.value.content
    wx.setStorageSync("ModelDetail-content", content)
   
    wx.navigateBack({
      url: '../TaskDetail',
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
    console.log("12")
    wx.getStorage({
      key: 'CommModel',
      success: function (res) {
        var content = res.data;
        console.log(res.data)
        that.setData({
          content: content
        })
      }
    })

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