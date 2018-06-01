// pages/Mine/Mine.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hiddenmodalput: true,//弹出我的标签模态框
    hiddenmodalputTag: true,//编辑已有的标签
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
 
    //隐藏判断
    exitTask: true,
    exitMeeting: false,
    exitIdea: false,
    
    //标签
    Tag:[
      "大帅哥",
      "彪悍",
    ],

    //我的任务列表
    Task: [
      {
        content: "请帅涛吃饭",
        project: "鲨鱼派对",
        time: "2月12日20:00截止",
      },
      {
        content: "请帅涛吃饭",
        project: "鲨鱼派对",
        time: "2月12日20:00截止",
      },
      {
        content: "请帅涛吃饭",
        project: "鲨鱼派对",
        time: "2月12日20:00截止",
      },
    ],

    //我的会议列表
    Meeting: [
      {
        month: "2019年5月",
      },
      {
        day: "2日",
        time: "21:00",
        content: "第一次面基",
      },
      {
        day: "2日",
        time: "21:00",
        content: "第一次面基",
      },
      {
        month: "2019年6月",
      },
      {
        day: "2日",
        time: "21:00",
        content: "第一次面基",
      },
    ],

    //我的点子列表
    Idea: [
      {
        time: "2月12日20:00",
        content: "请帅涛吃饭",
      },
      {
        time: "2月12日20:00",
        content: "请帅涛吃饭",
      },
      {
        time: "2月12日20:00",
        content: "请帅涛吃饭",
      },
    ],
    

  },

  //编辑已有标签
  modalinputTag: function () {
    this.setData({
      hiddenmodalputTag: false,
    })
  },
  //取消按钮  
  cancelTag: function () {
    this.setData({
      hiddenmodalputTag: true,
    });
  },
  //确认  
  confirmTag: function () {
    this.setData({
      hiddenmodalputTag: true,
    })
  }, 

  //添加标签
  modalinput: function () {
    this.setData({
      hiddenmodalput: false,
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      hiddenmodalput: true,
    })
  }, 

  //跳转沟通模板 
  CommModel: function () {
    wx.navigateTo({
      url: '../Project/Task/TaskDetail/CommModel/CommModel',
    })
  }, 

  //跳转任务详情
  TaskDetail: function () {
    wx.navigateTo({
      url: '../Project/Task/TaskDetail/TaskDetail',
    })
  }, 

  //跳转会议详情
  MeetingDetail: function() {
    wx.navigateTo({
      url: '../Project/Meeting/meetingDetail/meetingDetail',
    })
  },

  //跳转点子详情
  MeetingDetail: function () {
    wx.navigateTo({
      url: '../Project/Idea/ideaDetail/ideaDetail',
    })
  },
  
  // 导航栏选择任务
  selectTask: function () {
    var that = this;
    that.setData({
      exitTask: true,
      exitMeeting: false,
      exitIdea: false,
    });
  },

  // 导航栏选择会议
  selectMeeting: function () {
    var that = this;
    that.setData({
      exitTask: false,
      exitMeeting: true,
      exitIdea: false,
    });
  },

  // 导航栏选择点子
  selectIdea: function () {
    var that = this;
    that.setData({
      exitTask: false,
      exitMeeting: false,
      exitIdea: true,
    });
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../addMember/addMember'
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
