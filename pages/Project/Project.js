//index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //星标项目
    StarProject:[
      {
        icon:"/img/logo.png",
        name:"鲨鱼不排队",
      },
      {
        icon: "/img/logo.png",
        name: "我爱大白鲨",
      },
    ],
    //普通项目
    Project: [
      {
        icon: "/img/logo.png",
        name: "鲨鱼不排队",
      },
      {
        icon: "/img/logo.png",
        name: "我爱大白鲨",
      },
    ],
  },
  
  //创建项目
  buildProject:function(){
    wx.navigateTo({
      url: './buildProject/buildProject',
    })
  },

  //项目详情
  projectmore:function(){
    wx.navigateTo({
      url: './ProjectMore/ProjectMore',
    })
  },

  //项目编辑
  showProjectDetail: function() {
    wx.navigateTo({
      url: './ProjectDetail/ProjectDetail',
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
