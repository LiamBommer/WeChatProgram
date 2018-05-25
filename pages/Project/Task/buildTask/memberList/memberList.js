// pages/memberList/memberList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    MememberId: "", 
    //项目成员
    ProjectMemember: [
      {
        id: "",
        icon: "/img/me.png",
        name: '帅涛',
        checked: false
      },
      {
        id: "",
        icon: "/img/me.png",
        name: '钢铁侠',
        checked: false
      },
      {
        id: '',
        icon: "/img/me.png",
        name: '美国队长',
        checked: false,
      },
      {
        id: '',
        icon: "/img/me.png",
        name: '灭霸',
        checked: false,
      },
    ],


    
  },

  //选择项目成员
  ProjectMememberChange: function (e) {
    this.setData({
      MememberId : e.detail.value,
    });
  }, 
  
  //完成
  save:function(){
    var that = this;
    var MememberId = that.data.MememberId;//选中的成员ID
    var ProjectMemember = that.data.ProjectMemember;
    for (var i in ProjectMemember)
      if (ProjectMemember[i].id == MememberId){
        wx.setStorageSync("buildTask-memberList-membericon", ProjectMemember[i].icon)
      }

    wx.navigateBack({
      url:"../buildTask"
    })
  }, 

  //删除成员
  deleteMember: function () {
    var that = this;
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
    var memberList = wx.getStorageSync("ProjectDetail-memberList") 
    for (var i in memberList){
      memberList[i].checked = false
    }
    that.setData({
      ProjectMemember: memberList,
    });

    var membericon = wx.getStorageSync("buildTask-membericon") 
    if (membericon != ""){
      for (var i in memberList) {
        if (memberList[i].icon == membericon) {//初始化选中成员
          console.log(memberList[i])
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
    wx.removeStorageSync("buildTask-membericon") 
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