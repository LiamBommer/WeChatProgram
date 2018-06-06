// pages/Project/Task/TaskDetail/CommModel/addModel/addModel.js
var Bmob = require('../../../../../../utils/bmob.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _type: '',//添加的模板类型
    content: "",//内容
  },

  //保存
  save: function (e) {
    var that = this
    var content = e.detail.value.content
    var userId = getApp().globalData.userId
    var _type = that.data._type
    console.log("沟通模板保存：", userId, _type, content)
    that.addCommunicateModel(userId, _type, content)
  },

  /**
 * @parameter userId用户id， _type模板类型 1 代表 ‘意见’，2 代表’提问‘， 3 代表’点赞‘, modelContent 模板内容
 * 根据用户id 和 模板类型添加模板
 */
  addCommunicateModel:function (userId, _type, modelContent){
    var that = this
    var CommunicateMod = Bmob.Object.extend('communicate_mod')
    var communicatemod = new CommunicateMod()

    //添加指定类型的沟通模板
    if(modelContent != null && modelContent != '') {
      communicatemod.save({
        user_id: userId,  //用户id
        type: _type,      //模板类型   1 代表 ‘意见’，2 代表’提问‘， 3 代表’点赞‘
        content: modelContent  //模板内容
      }, {
          success: function (result) {
            //成功
            console.log('提示用户添加沟通模板成功过！')
            wx.showToast({
              title: '添加模板成功',
            })
            wx.navigateBack()


          },
          error: function (result, error) {
            //失败
            console.log('添加指定类型的沟通模板失败:', error)
          }
        })
    }

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
    var _type = wx.getStorageSync("CommModelType")
    console.log("onShow_type", _type)
    that.setData({
      _type:_type
    })
    
    // that.getTaskDetail(that.data.taskId)
    // var content = wx.getStorageSync("TaskDetail-desc")
    // if (content != "") {
    //   that.setData({
    //     content: content
    //   })
    // }
    // else {

    // }
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