// pages/Task/buildTask/buildTask.js
var Bmob = require('../../../../utils/bmob.js')
var ADD_TASK = '创建了新的任务：'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deadline: '',//截止时间
    list_id: 0,  // 所属任务看板id
    taskMemberID:[],//任务成员id列表，第一位为任务负责人
    icon: '',//选中任务成员头像

    submitNum: 0, //点击完成的次数
  },

  // 截止时间
  DeadLineChange: function (e) {
    this.setData({
      deadline: e.detail.value
    })
  },

   // 添加成员
  AddMember: function () {
    var that = this
    var icon = this.data.icon
    wx.setStorageSync("buildTask-membericon", icon)
    wx.navigateTo({
      url: './memberList/memberList',
    })
  },

  //提交表单
  BuildTask:function(e){
    var that = this
    var submitNum = that.data.submitNum; //点击完成的次数
    if (submitNum == 0) {//点击完成次数限制在一次
    console.log('Form data: ' + JSON.stringify(e.detail.value));
    // data validate
    var name = e.detail.value.name
    var end_time = e.detail.value.time
    var memberId = that.data.taskMemberID//任务成员ID数组
    console.log("创建任务memberId：", memberId)
    if (name == "" || name.length == 0 || memberId.length == 0) {
      wx.showToast({
        title: '请填写完整',
        icon:"none",
        duration:1500,
      })
      return;
    }
    wx.getStorage({
      key: "ProjectMore-projId",
      success: function(res) {
        console.log("BuildTask", res.data, that.data.list_id, name, memberId[0], end_time)
        that.createTask(res.data, that.data.list_id, name, memberId[0], end_time)
      },
    })
    that.setData({
      submitNum: submitNum + 1
    })
    }
  },

  /**
   * 2018-05-19
   * @author mr.li
   * @parameter
   *  projId
      listId任务看板id，
      title任务名称
      memberId任务负责人ID
      endTime截止时间
   * 创建任务，成员id数组里面只需要id，endTime 的数据类型是string
   */
  createTask: function(projId ,listId, title, memberId, endTime){
    console.log("项目id",projId)
    var that = this
    var Task = Bmob.Object.extend("task")
    var task = new Task()

    console.log('创建任务信息： \nListId: ' + listId + '\nTitle: ' + title + '\nMemberId: ' + memberId+'\nEndTime: '+endTime)

    var leaderId = memberId  //删除并返回第一个任务负责人的id
    var leader = Bmob.Object.createWithoutData("_User", leaderId)  //负责人,存储到数据库

    //添加任务
    task.save({
      list_id: listId,
      title: title,
      leader: leader,  // 数据库关联，用id可以关联一个user
      end_time: endTime,
      is_finish: false,
      has_sub: false,
      is_delete: false,
      sub_num:0,
      proj_id: projId
    },{
      success: function(result){
        //添加成功
        //添加任务成员信息
        that.addTaskMembers(projId,result.id/*任务id*/, leaderId, [])
        // 提示用户添加成功
        // console.log("添加任务成功")
        //通知项目成员
        var _type = 1  //通知类型
        that.addProjectNotification(projId, ADD_TASK + title, _type, result.id/*任务的id*/) 
        wx.showToast({
          title: '添加任务成功',
          icon: 'success',
        })
        wx.navigateBack({
          url: "../../ProjectMore/ProjectMore"
        })

      },
      error: function(result,error){
        //添加失败
        console.log("添加任务失败！",error)
        //提示用户添加失败
      }
    })

  },

  /**
 * 2018-05-19
 * @author mr.li
 * @parameter taskId任务id，leaderId任务负责人id，memberIds除负责人以外的任务成员id数组
 * 为任务添加成员
 */
  addTaskMembers:function (projId,taskId, leaderId, memberIds){
    var that = this
    var TaskMember = Bmob.Object.extend("task_member")

    var leader = Bmob.Object.createWithoutData("_User", leaderId)
    var task = Bmob.Object.createWithoutData("task",taskId)
    var project = Bmob.Object.createWithoutData("project", projId)
    var memberObjects = []
    
    var taskMember = new TaskMember()
    taskMember.set('task_id', taskId)
    taskMember.set('user_id', leader)
    taskMember.set('task',task)
    taskMember.set('project', project)
    memberObjects.push(taskMember)  //添加任务负责人id

    for(var i= 0;i<memberIds.length;i++){
      var taskMember = new TaskMember()
      var member = Bmob.Object.createWithoutData("_User", memberIds[i])
      var task = Bmob.Object.createWithoutData("task", taskId)
      taskMember.set('task_id', taskId)
      taskMember.set('user_id', member)
      taskMember.set('task', task)
      taskMember.set('project', project)
      memberObjects.push(taskMember)  //添加任务成员
    }

    //批量添加任务成员
    Bmob.Object.saveAll(memberObjects).then(function (memberObjects) {
      // 成功
      console.log("批量添加任务成员成功！")
    },
      function (error) {
        // 异常处理
        console.log("批量添加任务成员成功！", error)
      })
},

/**
 * 2018-05-31
 * @parameter projId项目id，toUserIds通知的目标用户id数组，_type是通知的类型(我发了关于这个的文档),requestId是通知跳转
 * 页面所有携带的请求数据，比如（taskId，meetingId 等）
 * 存储通知,往往都是批量添加的
 */
addProjectNotification:function (projId, content, _type, requestId) {
    var that = this
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
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
    //获取任务列表ID
    wx.getStorage({
      key: 'ProjectMore-TaskListId',
      success: function(res) {
        var list_id = res.data
        that.setData({
          list_id: list_id
        })
      },
    })
    //获取任务负责人图标
    var icon = wx.getStorageSync("buildTask-memberList-membericon")
    console.log(icon)
    if (icon == "")
      this.setData({
        icon: "/img/add_solid.png"
      })
    else {
      this.setData({
        icon: icon
      })
    }
    //获取任务成员
    wx.getStorage({
      key: 'buildTask-memberList-memeberId',
      success: function(res) {
        that.setData({
          taskMemberID:res.data
        })
      },
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
