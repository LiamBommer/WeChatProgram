// pages/Task/buildChildTask/buildChildTask.js
var Bmob = require('../../../../utils/bmob.js')

var ADD_SUB_TASK = "添加了子任务"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: '',//成员头像
    leaderId:"",//成员ID
  },

   // 添加成员
  AddMember: function () {
    var icon = this.data.icon
    wx.setStorageSync("buildTask-membericon", icon)
    console.log("AddMember", icon)
    wx.navigateTo({
      url: './memberList/memberList',
    })
  },

  //提交表单
  BuildTask: function (e) {
    var that = this
    wx.getStorage({
      key: 'TaskDetail-taskId',
      success: function(res) {
        var taskId = res.data
        var title = e.detail.value.name
        var leaderId = that.data.leaderId
        var userName = getApp().globalData.nickName
        that.createSubTask(wx.getStorageSync('Project-detail').id/*项目id*/,taskId, title, leaderId, userName)
      },
    })
  }, 
  
  /**
   * 2018-05-29
   * @parameter taskId父任务的id，title子任务标题，leaderId子任务负责人id（可以为空）
   * 创建子任务
   */
  createSubTask: function (projId,taskId, title, leaderId, userName) {
    var that = this
    var Subtask = Bmob.Object.extend('sub_task')
    var subtask = new Subtask()

    subtask.set("task_id", taskId)
    subtask.set("title", title)
    subtask.set("is_finish", false)
    if (leaderId != null) {
      subtask.set("user", Bmob.Object.createWithoutData("_User", leaderId))
    }

    //添加子任务
    subtask.save({
      success: function (result) {
        //添加成功
        //记录
        that.modifySubNum(taskId,1)  //修改任务的子任务数量
        that.addTaskRecord(projId,taskId, userName, ADD_SUB_TASK + title)
        console.log("提示用户添加子任务成功!")
        wx.showToast({
          title: '添加子任务成功',
          icon: 'success',
        })
        wx.navigateBack({
          url: "../TeskDetail/TeskDetail"
        })
      },
      error: function (result, error) {
        //添加失败
        console.log("提示用户添加子任务失败!", "失败信息", error)
        wx.showToast({
          title: '请填写完所有信息',
          icon:'none'
        })
      }
    })
  },
  /**
   * 2018-05-31
   * @parameter projId 项目id, taskId任务id，content 通知内容
   * (request_id 为tskId)
   * 存储通知,往往都是批量添加的
   */
  addTaskNotification: function (projId,taskId, content){
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
        toUserIds.push(results[i].id)
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
            console.log("添加任务成员通知成功！")


          },
            function (error) {
              // 异常处理
              console.log("添加任务成员通知失败!", error)

            })
        }
      }
    })
  } ,
  /**
   * 修改子任务的数量
   */
  modifySubNum:function(taskId,num){

    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    taskQuery.get(taskId,{
      success: function(result){
        //成功
        result.increment('sub_num',num)
        result.save()
      },
      error: function(error){
        //失败
        console.log("修改子任务的数量失败:",error)
      }
    })
  },
  /**
*添加任务记录
*/
  addTaskRecord: function (projId,taskId, userName, record) {
    var that = this
    var TaskRecord = Bmob.Object.extend('task_record')
    var taskrecord = new TaskRecord()

    //存储任务记录
    taskrecord.save({
      user_name: userName,
      task_id: taskId,
      record: userName + record
    }, {
        success: function (result) {
          //添加成功
          //通知任务其他成员
          that.addTaskNotification(projId,taskId,record)
        },
        error: function (result, error) {
          //添加失败

        }
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
        key: 'buildChildTask-memberList-member',
        success: function (res) {
          var icon = res.data.userPic
          var leaderId = res.data.objectId
          console.log(icon)
          that.setData({
            icon: icon,
            leaderId:leaderId
          })
        },
        fail:function(res){
          that.setData({
            icon: "/img/add_solid.png"
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
   wx.removeStorageSync("buildTask-memberList-membericon")
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
