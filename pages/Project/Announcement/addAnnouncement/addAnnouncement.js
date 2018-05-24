//addAnnouncement.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },

  //完成
  BuildAnnouncement:function(e){
    var title = e.detail.value.title
    var content = e.detail.value.content
    console.log(title);
    console.log(content);
  },
  
  onLoad: function () {

  },

  //事件处理函数

  // 扫描二维码添加
  QRCode: function () {

  },

  inviteWeChat: function () {

  }
})
