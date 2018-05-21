// pages/test/test.js
//测试model的接口

var test = require('../../model/announcementDetail.js')
var testBuild = require('../../model/buildProject.js')

function testbuildProject() {

  var title = "testBuildProject"
  var desc = "测试新建项目"
  var type = 1

  buildProjectModel.buildProject(title, desc, type)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("开始测试")
    // var r = test.getProjectList()
    test.createAnnouncement("374623ab99","鲨鱼派对","我真的是日了狗了","我觉得涛哥和PK都非常帅",true)

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