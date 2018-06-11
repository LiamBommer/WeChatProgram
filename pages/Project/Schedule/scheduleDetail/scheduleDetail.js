
var Bmob = require('../../../../utils/bmob.js')
var ADD_SCHEDULE = "添加了新的日程"
var DELETE_SCHEDULE = "删除了日程"
var MODIFY_SCHEDULE_START = "修改了日程开始时间"
var MODIFY_SCHEDULE_END = "修改了日程截止时间"
var MODIFY_SCHEDULE_TITLE = "修改了日程标题"
var ADD_SCHEDULE_TASK = "添加了日程关联的任务"
var MODIFY_RELATED_TASK = "修改了日程关联的任务"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    NotificationId:'',//通知传来的ID
    icon_share: '/img/share.png',
    icon_deadline: '/img/deadline.png',
    icon_task_list: '/img/task_list.png',
    icon_add: '/img/add.png',
    icon_member: '/img/member.png',
    icon_close: '/img/close.png',
    icon_create: '/img/create.png',

    hiddenmodalputTitle: true,//弹出标题模态框
    inputTitle: '',//输入的标题

    // 本日程的详情
    scheduleId: -1,
    scheduleContent: '',//标题
    startTime: '',
    endTime: '',
    tasks: [],

    // 本项目详情，用于通知
    projectDetail: {}

  },

  //点击按钮弹出指定的hiddenmodalput弹出框
  modalInputTitle: function () {

    // Get & set schedule title
    var title = this.data.scheduleContent
    this.setData({
      inputTitle: title
    })

    // Show modal
    this.setData({
      hiddenmodalputTitle: false
    })

  },

  //取消按钮
  cancelTitle: function () {
    this.setData({
      hiddenmodalputTitle: true,
    });
  },

  //确认
  confirmTitle: function (e) {

    var that = this

    var projectId = that.data.projectDetail.id
    var scheduleId = that.data.scheduleId
    var scheduleContent = that.data.scheduleContent

    var input = that.data.inputTitle
    if (scheduleContent == input) {
      that.setData({
        hiddenmodalputTitle: true,
      })
      return;
    }

    wx.showLoading({
      title: '正在修改...',
      mask: 'true'
    })

    // Submit
    that.modifyScheduleTitle(projectId, scheduleId, scheduleContent)

  },

  //标题
  input: function (e) {
    var inputTitle = e.detail.value
    this.setData({
      inputTitle: inputTitle
    })
  },

  // 截止时间
  DeadLineChange: function (e) {

    var that = this
    var projectId = that.data.projectDetail.id
    var scheduleId = that.data.scheduleId
    var endTime = e.detail.value

    wx.showLoading({
      title: '正在修改...',
      mask: 'true'
    })
    // Submit
    that.modifyScheduleEndtime(projectId, scheduleId, endTime)

  },

  // 开始时间
  StartTimeChange: function (e) {

    var that = this
    var projectId = that.data.projectDetail.id
    var scheduleId = that.data.scheduleId
    var startTime = e.detail.value

    wx.showLoading({
      title: '正在修改...',
      mask: 'true'
    })
    // Submit
    that.modifyScheduleStartTime(projectId, scheduleId, startTime)

  },

  // 关联任务
  connectTask: function (e) {

    var that = this
    // 把本日程的详情加入缓存，给关联的列表用
    var scheduleDetail = {}
    var oldTasks = that.data.tasks
    var oldTaskIds = []
    for (var i in oldTasks) {
      oldTaskIds.push(oldTasks[i].task_id)
    }
    scheduleDetail.scheduleId = that.data.scheduleId
    scheduleDetail.taskIds = oldTaskIds

    // 设置标识，进入人物列表后完成即保存
    wx.setStorage({
      key: 'isScheduleDetail',
      data: true,
      success: function () {

        wx.setStorage({
          key: 'ScheduleDetail-scheduleDetail',
          data: scheduleDetail,
          success: function() {

            wx.navigateTo({
              url: '../ScheduleTaskList/ScheduleTaskList',
            })

          }
        })

      }

    })

  },

  //删除
  Delete: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除此日程吗',
      success: function (res) {

        if (res.confirm) {//点击确定

          wx.showLoading({
            title: '正在删除',
            mask: 'true'
          })
          // Submit
          that.deleteSchedule(that.data.projectDetail.id, that.data.scheduleId)

        }
        else {//点击取消

        }
      }
    })

  },

  
  /**
* 2018-05-31
* @parameter projId项目id，toUserIds通知的目标用户id数组，_type是通知的类型(我发了关于这个的文档),requestId是通知跳转
* 页面所有携带的请求数据，比如（taskId，meetingId 等）
* 存储通知,往往都是批量添加的
*/
  addProjectNotification: function (projId, content, _type, requestId) {

    var Projectmember = Bmob.Object.extend('proj_member')
    var projectkmemberQuery = new Bmob.Query(Projectmember)
    var Notification = Bmob.Object.extend('notification')
    var toUserIds = []  //被通知的用户的id数组
    var notificationObjects = []

    var project = Bmob.Object.createWithoutData("project", projId)
    var fromUser = Bmob.Object.createWithoutData("_User", Bmob.User.current().id)

    //查询项目下的所有成员id
    projectkmemberQuery.equalTo('proj_id', projId)
    projectkmemberQuery.find({
      success: function (results) {
        //成功
        for (var i = 0; i < results.length; i++) {
          toUserIds.push(results[i].get('user_id'))
        }
        if (toUserIds != null && toUserIds.length > 0) {
          for (var i = 0; i < toUserIds.length; i++) {
            //无需通知操作人本身
            if (toUserIds[i] != Bmob.User.current().id) {
              var notification = new Notification()
              notification.set('to_user_id', toUserIds[i])
              notification.set('content', content)
              notification.set('type', _type)
              notification.set('is_read', false)
              notification.set('request_id', requestId)
              notification.set('project', project)
              notification.set('from_user', fromUser)

              notificationObjects.push(notification)  //存储本地通知对象
            }
          }

          if (notificationObjects != null && notificationObjects.length > 0) {
            Bmob.Object.saveAll(notificationObjects).then(function (notificationObjects) {
              // 通知添加成功
              console.log("添加项目成员通知成功！")
            },
              function (error) {
                // 通知添加失败处理
              })
          }
        }

      },
      error: function (error) {
        //项目成员查询失败
      }
    })
  },
  /**
  * @parameter projId项目id, scheduleId日程id, newTitle新标题
  * 修改日程标题
  *  内部调用了addProjectNotification
  */
  modifyScheduleTitle: function (projId, scheduleId, newTitle) {

    var that = this
    var Schedule = Bmob.Object.extend('schedule')
    var scheduleQuery = new Bmob.Query(Schedule)
    //删除日程
    scheduleQuery.get(scheduleId, {
      success: function (result) {
        result.set('title', newTitle)
        result.save()

        var _type = 3  //通知类型
        that.addProjectNotification(projId, MODIFY_SCHEDULE_TITLE , _type, scheduleId/*日程id*/)  //通知其他项目成员

        wx.hideLoading()
        wx.showToast({
          title: '修改日程标题成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          hiddenmodalputTitle: true,
          scheduleContent: that.data.inputTitle
        })

      },
      error: function (error) {

        wx.hideLoading()
        wx.showToast({
          title: '修改日程标题失败，请稍后再试:\n' + JSON.stringify(error),
          icon: 'none',
          duration: 10000
        })
        that.setData({
          hiddenmodalputTitle: true,
        })

      }
    })
  },


  /**
  * @parameter projId项目id, scheduleId日程id, newStartTime新的开始时间
  * 修改日程开始时间
  *  内部调用了addProjectNotification
  */
  modifyScheduleStartTime: function (projId, scheduleId, newStartTime) {

    var that = this
    var Schedule = Bmob.Object.extend('schedule')
    var scheduleQuery = new Bmob.Query(Schedule)
    //删除日程
    scheduleQuery.get(scheduleId, {
      success: function (result) {
        result.set('start_time', newStartTime)
        result.save()

        var _type = 3  //通知类型
        that.addProjectNotification(projId, MODIFY_SCHEDULE_START, _type, scheduleId/*日程id*/)  //通知其他项目成员

        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          startTime: newStartTime
        })

      },
      error: function (error) {

        wx.hideLoading()
        wx.showToast({
          title: '修改失败，请稍后再试:\n' + JSON.stringify(error),
          icon: 'none',
          duration: 1000
        })

        console.log('scheduleId: ', scheduleId)
        console.log('Error: ', error)

      }
    })
  },


  /**
  * @parameter projId项目id, scheduleId日程id, newTitle新标题
  * 修改日程结束时间
  *  内部调用了addProjectNotification
  */
  modifyScheduleEndtime: function (projId, scheduleId, newEndTime) {

    var that = this
    var Schedule = Bmob.Object.extend('schedule')
    var scheduleQuery = new Bmob.Query(Schedule)
    //删除日程
    scheduleQuery.get(scheduleId, {
      success: function (result) {
        result.set('end_time', newEndTime)
        result.save()

        var _type = 3  //通知类型
        that.addProjectNotification(projId, MODIFY_SCHEDULE_END, _type, scheduleId/*日程id*/)  //通知其他项目成员

        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          endTime: newEndTime
        })

      },
      error: function (error) {

        wx.hideLoading()
        wx.showToast({
          title: '修改失败，请稍后再试:\n' + JSON.stringify(error),
          icon: 'none',
          duration: 1000
        })

      }
    })
  },

  /**
   * @parameter projId 项目id, scheduleId日程id
   * 删除日程
   *  内部调用了addProjectNotification
   */
  deleteSchedule: function (projId, scheduleId) {
    
    var that = this
    var Schedule = Bmob.Object.extend('schedule')
    var scheduleQuery = new Bmob.Query(Schedule)
    //删除日程
    scheduleQuery.get(scheduleId, {
      success: function (result) {
        result.set('is_delete', true)
        result.save()
        console.log("提示用户删除日程成功！")

        var _type = 3  //通知类型
        that.addProjectNotification(projId, DELETE_SCHEDULE, _type, scheduleId/*日程id*/)  //通知其他项目成员

        wx.hideLoading()
        wx.navigateBack({
          url: '../../ProjectMore/ProjectMore',
        })
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })

      },
      error: function (error) {
        console.log("提示用户删除日程失败！\n", error)
        wx.hideLoading()
        wx.showToast({
          title: '删除失败：'+JSON.stringify(error),
          icon: 'success',
          duration: 3000
        })
      }
    })
  },


  /**
  * @parameter scheduleId 日程id
  * 获取某个日程的详情
  * var scheduleObject = {
  "objectId": '0',     //日程关联任务的id ，不是日程，也不是任务，而是两个的关联的id ，hh后面会设置（好像以后都没有用到）
  "scheduleId":'',  //日程id
  "scheduleContent": '',  //日程内容
  "startTime": '', //日程开始时间,
  "endTime": '', //日程结束时间,
  "tasks": []  //关联的任务数组
  }
  *
  */
  getOneSchedule: function (scheduleId){

    var that = this
    var Schedule = Bmob.Object.extend('schedule')
    var scheduleQuery = new Bmob.Query(Schedule)
    var ScheduleTask = Bmob.Object.extend('schedule_task')
    var scheduletaskQuery = new Bmob.Query(ScheduleTask)
    var scheduleObject = {
      "objectId": '0',     //日程关联任务的id ，不是日程，也不是任务，而是两个的关联的id ，hh后面会设置（好像以后都没有用到）
      "scheduleId":'',  //日程id
      "scheduleContent": '',  //日程内容
      "startTime": '', //日程开始时间,
      "endTime": '', //日程结束时间,
      "tasks": []  //关联的任务数组
    }

    //获取日程的基本信息
    scheduleQuery.get(scheduleId,{
      success: function(schedule){
        //成功，获取schedule

        scheduleObject.scheduleId =  schedule.id //日程id
        scheduleObject.scheduleContent = schedule.get('content') //日程内容
        scheduleObject.startTime = schedule.get('start_time')//日程开始时间,
        scheduleObject.endTime = schedule.get('end_time')//日程结束时间,

        var tasks = []
        //然后获取日程下的关联的任务
        scheduletaskQuery.equalTo('schedule_id', schedule.id)
        console.log(schedule.id)
        scheduletaskQuery.include('task')
        scheduletaskQuery.include('task.leader')
        scheduletaskQuery.find({
          success: function(results){
            //获取关联任务成功
            console.log('获取关联任务成功',results)
            //注意下面的for循环是 j ，不是 i
            for (var j = 0; j < results.length; j++) {
              if (results[j].get("task").is_delete != true) {
                var taskObject = {
                  "task_id": results[j].get("task") != null ? results[j].get("task").objectId :null,  //任务id
                  "task_title": results[j].get("task") != null ? results[j].get("task").title:null,  //任务标题
                  "task_userPic": results[j].get("task").leader != null ? results[j].attributes.task.leader.userPic :null //任务负责人头像
                }
                tasks.push(taskObject)
              }

            }

            //获取成功，scheduleObject,在这里setData
            console.log('获取成功，scheduleObject',scheduleObject)

            that.setData({
              scheduleContent: scheduleObject.scheduleContent,
              startTime: scheduleObject.startTime,
              endTime: scheduleObject.endTime,
              tasks: tasks
            })
            wx.hideLoading()


          },
          error: function(error){
            //获取关联任务失败
            console.log('获取关联任务失败！')
          }
        })
      },
      error: function(error){
        //失败
        console.log('获取日程失败',error)
      }
    })

  },


/**
   * 分享页面按钮，回到日程列表
   */
  showScheduleList: function() {
    wx.navigateTo({
      url: '/pages/Project/Project'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    // 接收页面参数，判断是否从分享进入
    console.log('页面参数', option)
    this.setData({
      isShared: option.isShared,
      scheduleId: option.scheduleId,
    })
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

    wx.showLoading({
      title: '正在加载',
      // mask: 'true'
    })

    //获取通知的日程ID
    var requestId = wx.getStorageSync("Notification-scheduleId")
    var isShared = this.data.isShared
    
    if (requestId != ""){
      that.getOneSchedule(requestId)
    }
    else if(isShared) {
      // 从分享的页面进入
      that.getOneSchedule(this.data.scheduleId)
    }
    else{
      // 获取日程id，进行查询
      wx.getStorage({
        key: 'ProjectMore-scheduleDetail-id',
        success: function (res) {
          that.setData({
            scheduleId: res.data
          })
          // Get schedule detail
          that.getOneSchedule(res.data)
        }
      })
    }


    // 获取项目id，通知用
    wx.getStorage({
      key: 'Project-detail',
      success: function (res) {
        that.setData({
          projectDetail: res.data
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

    // 清空缓存列表

    // 本日程id
    wx.removeStorageSync('ProjectMore-scheduleDetail-id')

    // 给关联任务页的标识
    wx.removeStorageSync('isScheduleDetail')

    // 本日程详情缓存
    wx.removeStorageSync('ScheduleDetail-scheduleDetail')

    // 通知进入的日程id
    wx.removeStorageSync('Notification-scheduleId')

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

    var that = this
    var currentUserName = getApp().globalData.nickName
    var scheduleContent = that.data.scheduleContent
    var scheduleId = that.data.scheduleId
    var projectId = that.data.projectDetail.id

    // 分享
    return {
      title: currentUserName + '给你分享了日程: ' + scheduleContent,
      path: "pages/Project/Schedule/scheduleDetail/scheduleDetail?isShared=true&scheduleId=" + scheduleId,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
        })
      },
    }

  }
})
