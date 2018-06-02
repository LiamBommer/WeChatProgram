// pages/editMemberList/editMemberList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    memberId: "",
    checked:true,//成员默认选中
    //项目成员
    ProjectMemember: [
      // {
      //   index: 0,
      //   icon: "/img/me.png",
      //   name: '钢铁侠',
      //   checked: false
      // },
      // {
      //   index: 1,
      //   icon: "/img/me.png",
      //   name: '美国队长',
      //   checked: true,
      // },
      // {
      //   index: 2,
      //   icon: "/img/me.png",
      //   name: '灭霸',
      //   checked: false,
      // },
    ],

  },

  //选择项目成员
  ProjectMememberChange: function (e) {
    var memberId = e.detail.value
    this.setData({
      memberId: memberId,
    });
  },


  //完成
  save: function () {
    var that = this;
    var memberId = that.data.memberId;
    var memberIdLength = memberId.length;
    var NomemberId = []
    var NomemberIdLength = 0
    var ProjectMemember = that.data.ProjectMemember;
    var projId = wx.getStorageSync("Project-id")

    if (memberIdLength == 0) {//全部未选
      for (var id in ProjectMemember)
        NomemberId.push(ProjectMemember[id].id)
    }
    else {//个别未选
      for (var id in ProjectMemember) {

        for (var i in memberId) {
          if (ProjectMemember[id].id != memberId[i])
            NomemberIdLength++

          if (NomemberIdLength == memberIdLength)
            NomemberId.push(ProjectMemember[id].id)//未选中的成员ID

        }
        NomemberIdLength = 0

      }
    }

    console.log("NomemberId", NomemberId);//未选中的成员ID
    // that.deleteProjectMember(projId, NomemberId)

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
    wx.getStorage({
      key: 'TaskDetail-member',
      success: function (res) {
        console.log(res.data)
        that.setData({
          ProjectMemember: res.data
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
