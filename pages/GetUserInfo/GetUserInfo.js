
const Bmob = require('../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 点击按钮，确认获取信息
   */
  confirm: function () {

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log('获取用户信息成功', res.userInfo)

              var userId = getApp().globalData.userId
              var nickName = res.userInfo.nickName
              var avatarUrl = res.userInfo.avatarUrl
              var openid = getApp().globalData.openid
              getApp().globalData.nickName = res.userInfo.nickName
              getApp().globalData.userPic = res.userInfo.avatarUrl

              // 存进数据库
              var u = Bmob.Object.extend("_User");
              var query = new Bmob.Query(u);
              // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
              query.get(userId, {
                success: function (result) {
                  // 自动绑定之前的账号
                  result.set("nickName", nickName);
                  result.set("userPic", avatarUrl);
                  result.set("openid", openid);
                  //result.set("gender",gender);  //再添加数据就不能正常初始化了
                  result.save();

                }
              });
              
              
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      }
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

    // 取当前用户id
    var currentUserId = Bmob.User.current().id
    this.setData({
      currentUserId: currentUserId
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