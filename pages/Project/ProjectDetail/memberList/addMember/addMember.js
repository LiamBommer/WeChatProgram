//addMember.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  onLoad: function () {
    wx.showShareMenu({

      　　withShareTicket: true

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
    var projectId = wx.getStorageSync("Project-id") 
    return{
      title:'邀请你加入我的项目',
      path:"pages/Project/Project?id="+projectId,
      success:function(res){
        wx.showToast({
          title: '分享成功',
          icon: 'success',
        })
      },
    }
  }
})
