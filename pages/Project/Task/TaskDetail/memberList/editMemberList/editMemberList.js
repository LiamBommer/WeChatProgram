// pages/editMemberList/editMemberList.js

const Bmob = require('../../../../../../utils/bmob.js')

var ADD_TASK_MEMBER = "添加了新的任务成员"
var DELETE_TASK_MEMBER = "删除了任务成员"
var MODIFY_TASK_MEMBER = "修改了任务成员"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //初始化项目成员
    InitProjectMember:[],
    //项目成员
    ProjectMember: [
    ],

  },


  //点击成员复选框
  clickCheck: function (e) {
    var that = this
    var checked = !e.currentTarget.dataset.checked//当前成员的选中情况
    var id = e.currentTarget.dataset.id//当前成员的id
    var index = e.currentTarget.dataset.index//当前成员下标
    var ProjectMember = that.data.ProjectMember//成员列表

    for (var i in ProjectMember){
         if(i == index)
         {
           ProjectMember[i].checked = !ProjectMember[i].checked
         }
    }

    //获取选中的成员ID
    that.setData({
      ProjectMember: ProjectMember,
    });
  },


  //完成
  save: function () {
    var that = this
    var memberId = that.data.memberId//选中的成员下标
    var ProjectMember = that.data.ProjectMember//项目成员
    var InitProjectMember = that.data.InitProjectMember//项目成员
    var memberIds = []//新添加的任务成员ID数组
    var NomemberIds = []//新删除的任务成员ID数组

    console.log("InitProjectMember", InitProjectMember)
    console.log("ProjectMember", ProjectMember)
    
    for (var i in InitProjectMember){
        if (InitProjectMember[i].checked != ProjectMember[i].checked)//有更改
        {
          //新添加的成员id
          if (ProjectMember[i].checked == true){
            memberIds.push(ProjectMember[i].id)
          }
          //新删除的成员id
          else if (ProjectMember[i].checked == false) {
            NomemberIds.push(ProjectMember[i].id)
          }
        }
    }
    console.log("选中的成员ID", memberIds)
    console.log("未选中的成员ID", NomemberIds)

    //获取任务ID
    wx.getStorage({
      key: 'TaskDetail-memberList-TaskId',
      success: function(res) {
        var userName = getApp().globalData.nickName
        var taskId = res.data
        if (memberIds == "" && NomemberIds == "")//无成员变化
        {
          wx.navigateBack({
            url: "../../memberList/memberList"
          })
        }
        else {
          that.modifyTaskMember(wx.getStorageSync('Project-detail').id, taskId, NomemberIds, memberIds)
        }
      },
    })
  },
  /**
 * @parameter projId项目id ，meetingId会议id，oldmemberIds 旧的成员id数组, newmemberIds 新的成员id数组
 * 修改会议成员， 删掉原来的成员id数组,添加新的成员ids数组
 */
  modifyTaskMember:function(projId, taskId, oldmemberIds, newmemberIds) {
    var that = this
    var Taskmember = Bmob.Object.extend('task_member')
    var taskmemberQuery = new Bmob.Query(Taskmember)
    var taskmemberArr = []
    var task = Bmob.Object.createWithoutData('task', taskId)
    var project = Bmob.Object.createWithoutData('project', projId)

    if (oldmemberIds != null && oldmemberIds.length > 0) {
        taskmemberQuery.containedIn('user_id', oldmemberIds)
        taskmemberQuery.equalTo('task_id', taskId)

        taskmemberQuery.destroyAll({
          success: function () {
            //删除成功
            if (newmemberIds == null || newmemberIds.length == 0) {
              //在这里做跳转
              wx.navigateBack()

            }
          },
          error: function (error) {
            //失败
            console.log('删除会议成员失败', error)
          }
        })
    }
      //然后添加新的成员
      if (newmemberIds != null && newmemberIds.length > 0) {
        for (var i in newmemberIds) {
          var member = new Taskmember()
          var user = Bmob.Object.createWithoutData('_User', newmemberIds[i])
          member.set('task_id', taskId)
          member.set('user_id', user)
          member.set('task', task)
          member.set('project', project)
          taskmemberArr.push(member)
        }

        if (taskmemberArr != null && taskmemberArr.length > 0) {
          Bmob.Object.saveAll(taskmemberArr).then(function (results) {
            // 重新添加关联的任务成功
            var _type = 1  //通知类型
            that.addProjectNotification(projId, MODIFY_TASK_MEMBER, _type, taskId/*会议id*/)  //通知其他项目成员
            console.log('修改任务关联成员成功！')
            //在这里做跳转
            wx.navigateBack()

          },
            function (error) {
              // 异常处理
              console.log('修改任务关联成员成功！')
            })
        }
      }

      //做任务记录
      if((oldmemberIds != null && oldmemberIds.length > 0) || (newmemberIds != null && newmemberIds.length > 0)){
        that.addTaskRecord(taskId, getApp().globalData.nickName, MODIFY_TASK_MEMBER)
      }
    
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
 * 2018-06-02
 * @parameter taskId 任务id,memberIds新添加的任务成员id数组,userName用户昵称（记录操作用）
 * 额外添加任务成员
 */
  addTaskMember:function (projId,taskId, memberIds, userName){
    var that = this
    var Taskmember = Bmob.Object.extend('task_member')
    var memberObjects = []
    
    if(memberIds!=null && memberIds.length > 0) {
      for (var i = 0; i < memberIds.length; i++) {
        var user = Bmob.Object.createWithoutData("_User", memberIds[i])
        var task = Bmob.Object.createWithoutData("task", taskId)
        var project = Bmob.Object.createWithoutData("project", projId)
        var taskmember = new Taskmember()

        taskmember.set('user_id', user)
        taskmember.set('task_id', taskId)
        taskmember.set('task',task)
        taskmember.set('project',project)
        memberObjects.push(taskmember)
      }
      if (memberObjects != null && memberObjects.length > 0) {
        Bmob.Object.saveAll(memberObjects).then(function (memberObjects) {
          // 成功
          //记录操作
          that.addTaskRecord(taskId, userName, ADD_TASK_MEMBER)
          
          console.log("添加任务成员成功！")
          wx.showToast({
            title: '添加成功',
          })
          wx.navigateBack({
            url: "../../memberList/memberList"
          })

        },
          function (error) {
            // 异常处理
            console.log(error)
          })
      }


    }
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
    var ProjectMember = []
    //获取任务管理列表成员
    wx.getStorage({
      key: 'TaskDetail-memberList-EditMemberList',
      success: function (res) {
        var memberList = res.data
        console.log('EditMemberList: ', memberList)
        that.setData({
          InitProjectMember: memberList,
          ProjectMember: memberList,
        });
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
    wx.removeStorage({
      key: 'TaskDetail-memberList-EditMemberList',
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
