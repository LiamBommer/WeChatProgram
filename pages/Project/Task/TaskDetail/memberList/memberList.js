// pages/memberList/memberList.js

const Bmob = require('../../../../../utils/bmob.js')

var ADD_TASK_MEMBER = "添加了新的任务成员"
var DELETE_TASK_MEMBER = "删除了任务成员"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    TaskIndex: "",//是否选中
    taskId:'',//任务Id
    // ProjectIndex: "",
    // principalName: "帅涛",
    // principalIicon: "/img/me.png",
    // principalIndex: 0,
    // principalChecked: true,
    // 是否在任务中
    isInTask: false,
    //项目成员
    projectMember:[],
    //任务成员
    TaskMemember: [
      // {
      //   //任务负责人
      //   index: 0,
      //   icon:"/img/me.png",
      //   name: '帅涛' ,
      //   checked: true,
      // },
      // {
      //   index: 1 ,
      //   icon: "/img/me.png",
      //   name: '美国队长',
      //   checked: true,
      // },
      // {
      //   index: 2,
      //   icon: "/img/me.png",
      //   name: '灭霸',
      //   checked: true,
      // },
    ],
    
  },


  //加入任务
  joinTask: function(e){
    var that = this;
    console.log("123")
    wx.getStorage({
      key: 'TaskDetail-taskId',
      success: function (res) {
        var taskId = res.data
        // 添加本id至任务成员中
        var userId = getApp().globalData.userId//当前操作者ID
        var userPic = getApp().globalData.userPic//当前操作者头像
        var userName = getApp().globalData.nickName//当前操作者姓名
        var TaskMemember = that.data.TaskMemember//任务成员
        TaskMemember.push({
          userPic: userPic,
          nickName: userName
        })
        console.log("JoinTask", userName, userId, taskId)
        that.setData({
          TaskMemember: TaskMemember
        })
        that.JoinTask(taskId, userId, userName, TaskMemember[0].objectId)
      },
    })
   
  },

  //管理任务成员
  showEditMemberList: function () {
    var that = this
    var projectMember = that.data.projectMember//项目成员
    var TaskMemember = that.data.TaskMemember//任务成员
    var EditMemberList = []//管理任务成员列表，第一位为任务负责人

    console.log("项目成员", projectMember)
    console.log("任务成员", TaskMemember)
    
    for (var i in TaskMemember) {
        for (var j in projectMember) {
          if (TaskMemember[i].objectId == projectMember[j].id) {//项目成员中被选中的任务成员
            projectMember[j].checked = true
            EditMemberList.push(projectMember[j])
            console.log("被选中的任务成员", projectMember[j])
            break
          }
        }
    }

    for (var k in projectMember){
      if (projectMember[k].checked == "")//未被选中的项目成员
      {
        EditMemberList.push(projectMember[k])
        projectMember[k].checked = false
        console.log("未选中的项目成员", projectMember[k])
      }
    }

    console.log("成员管理列表", EditMemberList)


    //设置成员管理列表缓存
    wx.setStorage({
      key: 'TaskDetail-memberList-EditMemberList',
      data: EditMemberList,
    })
    //设置任务ID缓存
    wx.setStorage({
      key: 'TaskDetail-memberList-TaskId',
      data: that.data.taskId,
    })
    wx.navigateTo({
      url: './editMemberList/editMemberList'
    })
  },

  //变更负责人
  showChangePrinciple: function () {
    var that = this
    //获取任务成员，第一位为负责人
    wx.setStorage({
      key: 'TaskDetail-memberList-TaskMember',
      data: that.data.TaskMemember,
    })
    //设置任务ID缓存
    wx.setStorage({
      key: 'TaskDetail-memberList-TaskId',
      data: that.data.taskId,
    })
    //获取任务成员列表
    wx.navigateTo({
      url: './changePrincipal/changePrincipal'
    })
  },

  /**
 * 2018-05-29
 * @parameter taskId任务id，leaderId任务负责人的id
 * 获取任务成员，成员数组的第一个是任务负责人
 */
  getTaskMember:function (taskId, leaderId){
    var that = this
    var TaskMember = Bmob.Object.extend('task_member')
    var taskmemberQuery = new Bmob.Query(TaskMember)

    var memberArr = []  //任务成员数组
    //查询任务成员
    taskmemberQuery.equalTo("task_id", taskId)
    taskmemberQuery.include("user_id")
    taskmemberQuery.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          var result = results[i]
          if (leaderId == result.get("user_id").objectId) {
            memberArr.unshift(result.get("user_id"))
          } else {
            memberArr.push(result.get("user_id"))
          }
        }
        //在这里设置setData
        console.log("任务成员", memberArr)
        

        that.setData({
          TaskMemember: memberArr
          })


        //刷新“加入任务”是否隐藏
        var TaskMememberId = getApp().globalData.userId//当前操作者ID
        var TaskMemember = memberArr//任务成员
        var check = false//判断当前操作者是否还在任务中
        for (var i in TaskMemember) {
          if (TaskMemember[i].objectId == TaskMememberId) {//如果当前操作者已在任务中
            that.setData({
              isInTask: true
            })
            check = true
          }
        }  
        if (check == false)//如果当前操作者不在任务中
          that.setData({
            isInTask: false
          })
        

        // 加载完成
        wx.hideLoading()

      },
      error: function (error) {

      }
    })
  },

  /**
 * 2018-06-02
 * @parameter taskId 任务id,memberId当前操作成员ID,userName用户昵称（记录操作用），leaderId任务负责人ID（刷新任务成员用）
 * 加入任务
 */
  JoinTask: function (taskId, memberId, userName, leaderId) {
    console.log("添加的成员", memberId)
    var that = this
    var Taskmember = Bmob.Object.extend('task_member')
    var memberObjects = []

        var user = Bmob.Object.createWithoutData("_User", memberId)
        var task = Bmob.Object.createWithoutData("task", taskId)
        var project = Bmob.Object.createWithoutData("project", wx.getStorageSync('Project-detail').id)
        var taskmember = new Taskmember()
        taskmember.set('user_id', user)
        taskmember.set('task_id', taskId)
        taskmember.set('task',task)
        taskmember.set('project', project)
        
        memberObjects.push(taskmember)
      if (memberObjects != null && memberObjects.length > 0) {
        Bmob.Object.saveAll(memberObjects).then(function (memberObjects) {
          // 成功
          //记录操作
          that.addTaskRecord(taskId, userName, ADD_TASK_MEMBER)
          
          console.log("添加任务成员成功！")
          //隐藏“加入任务”按钮
          that.setData({
            isInTask:true
          })
          wx.showToast({
            title: '添加成功',
          })
          that.getTaskMember(taskId, leaderId)

        },
          function (error) {
            // 异常处理
            console.log(error)
          })
      }


    
  },





/**
*添加任务记录
*/
addTaskRecord:function (taskId, userName, record){
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
    //获得任务Id
    wx.getStorage({
      key: 'TaskDetail-taskId',
      success: function (res) {
        that.setData({
          taskId:res.data
        })
      },
    })
    //获得任务成员
    wx.getStorage({
      key: 'TaskDetail-member',
      success:function(res){
        console.log("获得任务成员",res)
        //隐藏按钮
        var TaskMememberId = getApp().globalData.userId//当前操作者ID
        var TaskMemember = res.data//任务成员
        console.log("TaskMemember", TaskMemember)
        var check = false//判断当前操作者是否还在任务中
        for (var i in TaskMemember) {
          if (TaskMemember[i].objectId == TaskMememberId) {//如果当前操作者已在任务中
            that.setData({
              isInTask: true
            })
            check = true
          }
        }
        if (check == false)//如果当前操作者不在任务中
          that.setData({
            isInTask: false
          })


        that.setData({
          TaskMemember: res.data
        }) 
      }
    })
    //获得项目成员
    wx.getStorage({
      key: 'TaskDetail-projectMember',
      success: function (res) {
        var memberList = res.data
        console.log('projectMember', memberList)
        that.setData({
          projectMember: memberList
        })
      },
    })
    //从后台刷新任务成员
    var leaderId = wx.getStorageSync('changePrincipal-newLeaderId')//任务负责人ID
    if (that.data.taskId != "" && leaderId != "") {
      console.log("新负责人：刷新后台！", that.data.taskId, leaderId)
      wx.showLoading({
        title: '正在加载',
        mask: 'true'
      })
      that.getTaskMember(that.data.taskId, leaderId)
    }
    else if (that.data.taskId != "" && that.data.TaskMemember[0].objectId != "") {
      console.log("刷新后台！", that.data.taskId, that.data.TaskMemember[0].objectId)
      wx.showLoading({
        title: '正在加载',
        mask: 'true'
      })
      that.getTaskMember(that.data.taskId, that.data.TaskMemember[0].objectId)
    }
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
      key: 'TaskDetail-taskId',
      success: function(res) {},
    })
    wx.removeStorage({
      key: 'TaskDetail-member',
      success: function (res) { },
    })
    wx.removeStorage({
      key: 'TaskDetail-projectMember',
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
