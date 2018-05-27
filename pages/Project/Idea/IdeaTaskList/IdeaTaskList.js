// pages/memberList/memberList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    TaskId: "",
    //项目成员
    TaskList: [
      {//任务列表
        title:"待处理",
        list:[
          {
            id: "",
            icon: "/img/me.png",
            name: '任务A',
            checked: true
          },
          {
            id: "",
            icon: "/img/me.png",
            name: '任务B',
            checked: true
          },
        ]
      },

      {//任务列表
        title: "已完成",
        list: [
          {
            id: "",
            icon: "/img/me.png",
            name: '任务A',
            checked: true
          },
          {
            id: "",
            icon: "/img/me.png",
            name: '任务A',
            checked: true
          },
        ]
      },
      
    ],
  },

  //选择项目成员
  ProjectTaskChange: function (e) {
    this.setData({
      TaskId: e.detail.value,
    });
  },

  //完成
  Finish: function () {
    var that = this;
    var TaskId = that.data.TaskId;//被选中的任务ID
    // var TaskList = that.data.TaskList;
    // var ID = []
    // for (var id in TaskList) {
    //   for (var i in TaskList[id].list) {
    //     for (var j in TaskId)
    //     if (TaskList[id].list[i] == TaskId[j]) {//被选中的任务
    //       ID.push(TaskList[id].icon)
    //     }
    //   }
    // }
    wx.setStorageSync("ScheduleTaskList-TaskId", TaskId)
    wx.navigateBack({
      url: '../scheduleDetail/scheduleDetail',
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
    // //初始化成员列表
    // var memberList = wx.getStorageSync("ProjectDetail-memberList")
    // if (memberList != "") {
    //   for (var i in memberList)
    //     memberList[i].checked = false
    //   that.setData({
    //     ProjectMemember: memberList
    //   });
    // }
    // else{
      
    // }

    // //初始化选中成员
    // var membericon = wx.getStorageSync("meetingDetail-membericon")
    // if (membericon != "") {
    //   for (var i in memberList) {
    //     for (var j in membericon)
    //       if (memberList[i].icon == membericon[j]) {
    //         memberList[i].checked = true
    //         that.setData({
    //           ProjectMemember: memberList,
    //         });
    //       }
    //   }
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
    wx.removeStorageSync("meetingDetail-membericon")
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