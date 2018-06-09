// pages/Mine/Mine.js
//获取应用实例
const app = getApp()

var Bmob = require('../../utils/bmob.js')


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
    Idea: [],

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


  /**
   * 获取我的点子,最多50条
   * 'id':     //点子id
      'content':  //点子内容
      'createdAt':  //点子发表时间
      'projectName':   //项目名字
   */
  getMyidea: function (userId){

    var that = this
    var Idea = Bmob.Object.extend('idea')
    var ideaQuery = new Bmob.Query(Idea)
    var ideaArr = []  //获取的点子数组

    ideaQuery.equalTo('user',userId)
    ideaQuery.include('project')
    ideaQuery.find({
      success: function(results){
        //成功
        for(var i in results){
          var ideaObject = {}
          ideaObject = {
            'id': results[i].id,    //点子id
            'content': results[i].get('content'),  //点子内容
            'createdAt': results[i].createdAt,   //点子发表时间
            'projectName': results[i].get('project').name  //项目名字
          }
          ideaArr.push(ideaObject)
        }
        if (ideaArr != null && ideaArr.length > 0){
          //在这里setData
          console.log('获取点子列表成功',ideaArr)
          that.setData({
            Idea: ideaArr
          })
        }
      },
      error: function(error){
        //失败
        console.log('获取点子列表失败!',error)
      }
    })

  },


  onLoad: function () {
    if (app.globalData.userId) {
      var userInfo = {
        'userId': app.globalData.userId,
        'nickName': app.globalData.nickName,
        'userPic': app.globalData.userPic
      }
      this.setData({
        // userInfo: app.globalData.userInfo,
        userInfo: userInfo,
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


  onShow: function() {

    var userId = this.data.userInfo.userId

    // 获取点子列表
    this.getMyidea(userId)


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
