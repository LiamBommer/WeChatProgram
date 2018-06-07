// pages/Project/Task/TaskDetail/CommModel/ModelDetail/ModelDetail.js
var Bmob = require('../../../../../../utils/bmob.js')
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
    var userId = getApp().globalData.userId
    var _type = that.data._type
    var modelId = wx.getStorageSync('CommModel-id')
    console.log("沟通模板保存：", userId, modelId, content)
    that.modifyCommunicateModel(userId, modelId, content)
  },

  /**
 * @parameter userId 用户id， modelId模板id ，newModelContent新的模板内容
 * 修改一个沟通模板的内容
 */
  modifyCommunicateModel:function (userId, modelId, newModelContent){
    var that = this
    var CommunicateMod = Bmob.Object.extend('communicate_mod')
    var communicatemodQuery = new Bmob.Query(CommunicateMod)

    //修改一个沟通模板的内容
    communicatemodQuery.get(modelId, {
        success: function (result) {
        //成功
        result.set('content', newModelContent)
        result.save()

        console.log('修改模板内容成功！')
        wx.showToast({
          title: '修改成功',
        })
        wx.navigateBack()
      },
      error: function (error) {
        //失败
        console.log('修改模板内容失败！')
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
    var that = this
    var content = wx.getStorageSync('CommModel-content')
    that.setData({
      content: content,
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