Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_more: '/img/more.png',
    icon_member: '/img/member.png',
    project_name: '项目名称',
    project_desc: '鲨鱼派对致力于开发基于微信小程序的团队协作应用。',
    project_type: '社团组织',
    project_response: '大佬涛',
  },

  showMemberList: function() {
    wx.navigateTo({
      url: 'memberList/memberList'
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
