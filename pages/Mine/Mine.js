// pages/Mine/Mine.js
//获取应用实例
const app = getApp()

var Bmob = require('../../utils/bmob.js')
var FINISH_TASK = '完成了任务'
var REDO_TASK = '重做了任务'

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
    Tag: [
      "大帅哥",
      "彪悍",
    ],

    //我的任务列表
    Task: [],

    //我的会议列表
    Meeting: [],

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

    wx.setStorage({
      key: 'isMine',
      data: true,
      success: function() {
        wx.navigateTo({
          url: '../Project/Task/TaskDetail/CommModel/CommModel',
        })
      }
    })

    
  },

  //跳转任务详情
  TaskDetail: function () {
    wx.navigateTo({
      url: '../Project/Task/TaskDetail/TaskDetail',
    })
  },

  //跳转会议详情
  MeetingDetail: function () {
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


  // 完成/重做任务选中
  taskFinishAction: function(e) {
    console.log('选中列表信息：', e)

    // 选择状态
    var cbValue = e.detail.value
    var checked = true
    if(cbValue.length == 0) {
      checked = false
    }
    var taskId = e.currentTarget.dataset.id
    var projectId = e.currentTarget.dataset.projectId

    wx.showLoading({
      title: '正在修改',
    })
    
    // Submit
    this.finishMytask(projectId, taskId, checked)

  },


  /*
 * 获取我的任务, 限制50条
  * 按任务截止时间升序排列
 'id':  //任务id
  'taskTitle':   //任务标题
  'taskEndTime':  //任务截止时间，只有年月日
  'projectName' ://项目名称
  projectId      //项目id，用来通知任务其他成员
  */
  getMyTasks: function (userId) {

    var that = this
    var Taskmember = Bmob.Object.extend('task_member')
    var taskmemberQuery = new Bmob.Query(Taskmember)
    var taskArr = []  //用户的任务数组,空就是无

    taskmemberQuery.equalTo('user_id', userId)
    taskmemberQuery.include('task')
    taskmemberQuery.include('project')
    taskmemberQuery.ascending('task.end_time')
    taskmemberQuery.limit(50)  //限制50条
    taskmemberQuery.find({
      success: function (results) {
        //成功
        for (var i in results) {
          if (results[i].get('task').is_delete != true) {
            var taskObject = {}
            taskObject = {
              'id': results[i].get('task').objectId,   //任务id
              'taskTitle': results[i].get('task').title,   //任务标题
              'taskEndTime': results[i].get('task').end_time, //任务截止时间，只有年月日
              'projectName': results[i].get('project').name,  //项目名称
              'projectId': results[i].get('project').objectId  //项目id
            }
            taskArr.push(taskObject)
          }
          if (taskArr != null && taskArr.length > 0) {
            //在这里setData
            console.log('我的任务', taskArr)

            that.setData({
              Task: taskArr
            })
            wx.hideLoading()

          }
        }

      },
      error: function (error) {
        //失败
      }
    })
  },


  /**
 * @parameter projId 项目id ，taskId 任务id ,isFinish 是否完成（true表示完成，false表示重做任务）
 * 完成/重做我的任务
 */
  finishMytask: function (projId, taskId, isFinish) {
    console.log('isFinish：' + isFinish)
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    taskQuery.get(taskId, {
      success: function (result) {
        //成功
        ////////// 此处做了修改 Liam //////////////
        // result.set('is_finish', true)
        result.set('is_finish', isFinish)
        
        wx.hideLoading()
        wx.showToast({
          title: '成功修改',
          icon: 'success',
          duration: 1000
        })

        result.save()

        //通知任务其他成员
        if (isFinish)
          that.addTaskNotification(projId, taskId, FINISH_TASK + result.get('title'))
        else
          that.addTaskNotification(projId, taskId, REDO_TASK + result.get('title'))
      }
    })
  },


  /**
     * 2018-05-31
     * @parameter projId 项目id, taskId任务id，content 通知内容
     * (request_id 为tskId)
     * 存储通知,往往都是批量添加的
     */
  addTaskNotification: function (projId, taskId, content) {
    var that = this
    var _type = 1;  //任务是通知的第一种类型
    var Taskmember = Bmob.Object.extend('task_member')
    var taskmemberQuery = new Bmob.Query(Taskmember)
    var toUserIds = []  //需要通知到的任务成员id数组
    var Notification = Bmob.Object.extend('notification')
    var notificationObjects = []

    //查询任务成员
    taskmemberQuery.equalTo('task_id', taskId)
    taskmemberQuery.select("user_id");
    taskmemberQuery.find().then(function (results) {
      // 返回成功
      for (var i = 0; i < results.length; i++) {
        toUserIds.push(results[i].get('user_id').id)
      }

      if (toUserIds != null && toUserIds.length > 0) {
        var fromUser = Bmob.Object.createWithoutData("_User", Bmob.User.current().id)
        var project = Bmob.Object.createWithoutData("project", projId)

        for (var i = 0; i < toUserIds.length; i++) {
          //无需通知操作人本身
          if (toUserIds[i] != Bmob.User.current().id) {
            var notification = new Notification()
            notification.set('to_user_id', toUserIds[i])
            notification.set('content', content)
            notification.set('type', _type)
            notification.set('is_read', false)
            notification.set('request_id', taskId)
            notification.set('project', project)
            notification.set('from_user', fromUser)

            notificationObjects.push(notification)  //存储本地通知对象
          }
        }
        if (notificationObjects != null && notificationObjects.length > 0) {
          //在数据库添加通知
          Bmob.Object.saveAll(notificationObjects).then(function (notificationObjects) {
            // 成功
            console.log("添加任务成员通知成功！", notificationObjects)


          },
            function (error) {
              // 异常处理
              console.log("添加任务成员通知失败!", error)

            })
        }
      }
    })

  },



  /**
   * 获取我的点子,最多50条
   * 'id':     //点子id
      'content':  //点子内容
      'createdAt':  //点子发表时间
      'projectName':   //项目名字
   */
  getMyidea: function (userId) {

    var that = this
    var Idea = Bmob.Object.extend('idea')
    var ideaQuery = new Bmob.Query(Idea)
    var ideaArr = []  //获取的点子数组

    ideaQuery.equalTo('user', userId)
    ideaQuery.include('project')
    ideaQuery.find({
      success: function (results) {
        //成功
        for (var i in results) {
          var ideaObject = {}
          ideaObject = {
            'id': results[i].id,    //点子id
            'content': results[i].get('content'),  //点子内容
            'createdAt': results[i].createdAt,   //点子发表时间
            'projectName': results[i].get('project').name  //项目名字
          }
          ideaArr.push(ideaObject)
        }
        if (ideaArr != null && ideaArr.length > 0) {
          //在这里setData
          console.log('获取点子列表成功', ideaArr)
          that.setData({
            Idea: ideaArr
          })
        }
      },
      error: function (error) {
        //失败
        console.log('获取点子列表失败!', error)
      }
    })

  },


  /**
  * 获取我的未删除的会议，最多50条
  'id':  //会议id
  'startTime': //会议的年月日
  'time': //会议的时分秒
  'title':  //会议名称
  */
  getMyMeeting: function (userId) {

    var that = this
    var Meetingmember = Bmob.Object.extend('meeting_member')
    var meetingmemberQuery = new Bmob.Query(Meetingmember)
    var meetingArr = []   //获取的用户的会议数组，没有则为空

    meetingmemberQuery.equalTo('user', userId)
    meetingmemberQuery.include('meeting')
    meetingmemberQuery.find({
      success: function (results) {
        //成功
        for (var i in results) {
          if (results[i].get('meeting').is_delete != true)
            var meetingObject = {}

          // 时间处理
          var startTime = results[i].get('meeting').start_time
          var startTime = new Date(new Date(startTime.replace(/-/g, "/")))
          var year = startTime.getFullYear()
          var month = startTime.getMonth()
          var date = startTime.getDate()

          meetingObject = {
            'id': results[i].get('meeting').objectId, //会议id
            'title': results[i].get('meeting').title,  //会议名称
            'time': results[i].get('meeting').time,  //会议的时分秒
            'startTime': results[i].get('meeting').start_time, //会议的年月日
            'year': year,
            'month': month,
            'date': date,
          }
          meetingArr.push(meetingObject)
        }
        if (meetingArr != null && meetingArr.length > 0) {
          //在这里setData
          console.log('获取用户的会议', meetingArr)
          that.setData({
            Meeting: meetingArr
          })
        }
      },
      error: function (error) {
        //失败
        console.log('获取我的会议失败：', error)
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


  onShow: function () {

    var userId = this.data.userInfo.userId

    wx.showLoading({
      title: '正在加载',
      mask: 'true'
    })

    // 获取点子列表
    this.getMyidea(userId)
    this.getMyMeeting(userId)
    this.getMyTasks(userId)

  },


  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },


  onUnload: function() {
    
  }

})
