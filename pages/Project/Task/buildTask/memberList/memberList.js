// pages/memberList/memberList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    MemberId: "",
    //项目成员
    ProjectMember: [
      
    ],



  },

  //选择项目成员
  ProjectMemberChange: function (e) {
    this.setData({
      MemberId : e.detail.value,
    });
  },

  //完成
  save:function(){
    var that = this;
    var TaskMemberId = []//任务成员id列表，第一位为负责人
    var MemberId = that.data.MemberId;//选中的成员ID
    var ProjectMember = that.data.ProjectMember;
    for (var i in ProjectMember) {
      if (ProjectMember[i].id == MemberId) {
        TaskMemberId.push(ProjectMember[i].id)//选中的任务成员ID
        wx.setStorageSync("buildTask-memberList-membericon", ProjectMember[i].userPic)//设置选中的成员头像缓存
      }
    }

    for (var i in ProjectMember)
      if (ProjectMember[i].id != MemberId) {
        TaskMemberId.push(ProjectMember[i].id)//没选中的任务成员ID
      }

    console.log("任务成员id列表：", TaskMemberId)
    //设置任务成员ID列表缓存，第一位为任务负责人
    wx.setStorage({
      key: 'buildTask-memberList-memeberId',
      data: TaskMemberId,
    })
    
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
    wx.getStorage({
      key: 'ProjectMore-projectMember',
      success: function(res) {
        console.log('onShow',res.data)
        var memberList = res.data
        for (var i in memberList) {
          memberList[i].checked = false
        }

        console.log('Member list: ' + memberList)

        that.setData({
          ProjectMember: memberList,
        });

        var membericon = wx.getStorageSync("buildTask-membericon") 
        if (membericon != "") {
          for (var i in memberList) {

            if (memberList[i].userPic == membericon) {//初始化选中成员
              console.log("memberList",memberList[i])
              memberList[i].checked = true
              that.setData({
                ProjectMember: memberList,
              });
            }
          }
        }

      },
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
