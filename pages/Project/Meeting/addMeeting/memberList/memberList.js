// pages/memberList/memberList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    MemberId: "",
    //项目成员
    ProjectMemember: [
      {
        id:"", 
        icon: "/img/me.png",
        name: '帅涛',
        checked: true
      },
      {
        id: "",
        icon: "/img/me.png",
        name: '帅涛',
        checked: true
      },
      {
        id: "",
        icon: "/img/me.png",
        name: '帅涛',
        checked: true
      },
    ],
  },

  //选择项目成员
  ProjectMememberChange: function (e) {
    this.setData({
      MemberId: e.detail.value,
    });
  },

  //完成
  Finish: function () {
    var that = this;
    var MemberId = that.data.MemberId;
    var ProjectMemember = that.data.ProjectMemember;
    var icon = []
    for (var id in ProjectMemember) {
      for (var i in MemberId) {
        if (ProjectMemember[id].id == MemberId[i]) {
          icon.push(ProjectMemember[id].userPic)
        }
      }
    }
    //设置选中成员的id数组缓存
    wx.setStorageSync("meetingDetail-memberList-MemberId", MemberId)
    //设置选中成员的图标缓存
    wx.setStorageSync("meetingDetail-memberList-icon", icon)
    wx.navigateBack({
      url: '../ProjectDetail',
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
    //初始化成员列表
    var memberList = wx.getStorageSync("meetingDetail-member")
    console.log("memberList", memberList)
    if (memberList != "") {
      for (var i in memberList)
        memberList[i].checked = false
      that.setData({
        ProjectMemember: memberList
      });
    }
    else{
      
    }

    //初始化选中成员
    var membericon = wx.getStorageSync("meetingDetail-membericon")
    if (membericon != "") {
      for (var i in memberList) {
        for (var j in membericon)
          if (memberList[i].userPic == membericon[j]) {
            memberList[i].checked = true
            that.setData({
              ProjectMemember: memberList,
            });
          }
      }
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