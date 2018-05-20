// pages/Task/Task.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //任务列表
    tasklist: [
        '待处理',
        '执行中',
    ],
    //任务项
    task: [
      {
        title: '任务一',
        time: '6月1日 18:00', 
        timestatus: 'green',
      },
      {
        title: '任务二',
        time: '6月1日 18:00',
        timestatus: 'red',
      },
    ],
    //任务图标描述
    icon: [
      "/img/me.png", 
      "/img/task_list.png", 
    ],

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