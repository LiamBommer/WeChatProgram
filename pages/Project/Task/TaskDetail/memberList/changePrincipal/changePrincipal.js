// pages/changePrincepal/changePrincepal.js

const Bmob = require('../../../../../../utils/bmob.js')
var MODIFY_TASK_LEADER = "变更了任务负责人"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    selectedMemberId: "",
    //任务成员
    TaskMember: [],

  },

  //选择任务成员
  radioChange: function (e) {
    console.log("radioChange",e.detail.value)
    this.setData({
      selectedMemberId: e.detail.value,
    });
  },

  // 更改完成
  save: function() {
    var that = this
    
    var newLeaderId = that.data.selectedMemberId// 获取新选中的负责人Id
    var userName = getApp().globalData.nickName// 获取当前操作者名字

    //获取任务ID
    wx.getStorage({
      key: 'TaskDetail-memberList-TaskId',
      success: function (res) {
        var taskId = res.data
        console.log("transferTaskLeader", taskId, newLeaderId)
        //设置新负责人缓存
        wx.setStorageSync('changePrincipal-newLeaderId', newLeaderId)
        // 传送后台确认更改，返回
        that.transferTaskLeader(taskId, newLeaderId,userName)
      },
    })
  },

  /**
 * 2018-06-02
 * 变更任务负责人 userName当前操作者名字
 */
  transferTaskLeader: function (taskId, newLeaderId, userName) {
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)
    var user = Bmob.Object.createWithoutData("_User", newLeaderId)

    //变更任务负责人
    taskQuery.get(taskId, {
      success: function (result) {
        //成功
        result.set('leader',user)
        result.save()
        //记录操作
        that.addTaskRecord(taskId, userName, MODIFY_TASK_LEADER)
        //通知其他任务成员
        that.addTaskNotification(wx.getStorageSync('Project-detail').id,taskId,MODIFY_TASK_LEADER)
        console.log("变更任务负责人成功！")
        wx.showToast({
          title: '变更任务负责人成功',
        })
        wx.navigateBack();
      },
      error: function (error) {
        //失败
        console.log("变更任务负责人失败！")
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
  *添加任务记录
  */
  addTaskRecord: function (taskId, userName, record) {
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
    //获取任务成员
    wx.getStorage({
      key: 'TaskDetail-memberList-TaskMember',
      success: function (res) {
        var TaskMember = res.data
        //往任务成员中添加“checked”属性
        for (var i in TaskMember){
          if (i == 0) {
            TaskMember[i]['checked'] = true
          }
          else {
            TaskMember[i]['checked'] = false
          }
        }
        console.log('任务成员:', TaskMember)
        that.setData({
          TaskMember: TaskMember
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
      wx.removeStorage({
        key: 'TaskDetail-memberList-TaskMember',
        success: function(res) {},
    })
    wx.removeStorage({
      key: 'TaskDetail-memberList-TaskId',
      success: function (res) { },
    })
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
