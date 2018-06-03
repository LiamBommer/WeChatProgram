// pages/memberList/memberList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    TaskIndex: "",
    // ProjectIndex: "",
    // principalName: "帅涛",
    // principalIicon: "/img/me.png",
    // principalIndex: 0,
    // principalChecked: true,
    // 是否在任务中
    isInTask: false,
    //任务成员
    TaskMemember: [
      // {
      //   //任务负责人
      //   index: 0,
      //   icon:"/img/me.png",
      //   name: '帅涛' ,
      //   checked: true,
      // },
      // {
      //   index: 1 ,
      //   icon: "/img/me.png",
      //   name: '美国队长',
      //   checked: true,
      // },
      // {
      //   index: 2,
      //   icon: "/img/me.png",
      //   name: '灭霸',
      //   checked: true,
      // },
    ],
    
  },


  //添加成员
  joinTask: function(){
    var that = this;

    // 添加本id至任务成员中

    // 隐藏按钮
    that.setData({
      isInTask: true
    });

    // origin

    // var ProjectIndex = that.data.ProjectIndex;
    // var ProjectMemember = that.data.ProjectMemember;
    //
    // for (var id in ProjectIndex) {
    //   console.log(ProjectMemember[ProjectIndex[id]]);//添加的项目成员
    // }
    //
    // var TaskMemember = that.data.TaskMemember;
    // var TaskIndex = that.data.TaskIndex;
    //
    // for (var id in TaskMemember) {
    //   console.log(TaskMemember[TaskIndex[id]]);//添加的任务成员
    // }


  },

  //
  showEditMemberList: function () {
    wx.navigateTo({
      url: './editMemberList/editMemberList'
    })
  },

  //
  showChangePrinciple: function () {
    wx.navigateTo({
      url: './changePrincipal/changePrincipal'
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
    // TaskMemember: [
    //   {
    //     //任务负责人
    //     index: 0,
    //     icon: "/img/me.png",
    //     name: '帅涛',
    //     checked: true,
    //   },
    var that = this 
    wx.getStorage({
      key: 'TaskDetail-member',
      success:function(res){
        console.log(res)
        that.setData({
          TaskMemember: res.data
        })
      }
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
