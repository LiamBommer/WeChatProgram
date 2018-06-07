//addMember.js
//获取应用实例
const app = getApp()

Page({

  data: {
    projectId: -1,
    projectName: '',
    projectDetail: ''
  },

  onLoad: function () {
    var that = this
    wx.showShareMenu({

      　　withShareTicket: true

    })

    wx.getStorage({
      key: 'Project-detail',
      success: function (res) {
        that.setData({
          projectDetail: res.data
        })
      },
    })

  },

  //事件处理函数

  // 扫描二维码添加
  QRCode: function () {
    
  },
  
  //点击分享
  inviteWeChat: function () {
    
  },

    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    var projectId = that.data.projectDetail.id
    var projectName = that.data.projectDetail.name

    // 分享
    console.log('分享的项目ID： ' + projectId + '\n分享的项目名称： ' + projectName)
    return {
      title: '邀请你加入我的项目：' + projectName,
      path: "pages/Project/Project?projectid=" + projectId,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
        })
      },
    }

  }
})
