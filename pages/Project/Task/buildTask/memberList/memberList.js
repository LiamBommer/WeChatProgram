// pages/memberList/memberList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    ProjectIndex: "", 
    //项目成员
    ProjectMemember: [
      {
        index: 0,
        icon: "/img/me.png",
        name: '帅涛',
        checked: false
      },
      {
        index: 1,
        icon: "/img/me.png",
        name: '钢铁侠',
        checked: false
      },
      {
        index: 2,
        icon: "/img/me.png",
        name: '美国队长',
        checked: false,
      },
      {
        index: 3,
        icon: "/img/me.png",
        name: '灭霸',
        checked: false,
      },
    ],


    
  },

  //选择项目成员
  ProjectMememberChange: function (e) {
    this.setData({
      ProjectIndex : e.detail.value,
    });
  }, 
  
  //完成
  save:function(){
    var that = this;
    var ProjectIndex = that.data.ProjectIndex;
    var ProjectMemember = that.data.ProjectMemember;
    for (var id in ProjectIndex) {
      console.log(ProjectMemember[ProjectIndex[id]]);//添加的项目成员
    }
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