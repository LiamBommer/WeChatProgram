// pages/memberList/memberList.js
var Bmob = require('../../../../../utils/bmob.js')
var MODIFY_MEETING_MEMBER = "修改了会议成员"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projId:'',//项目ID
    meetingId:'',//会议ID
    InitProjectMember:'',//初始化项目成员
    //项目成员
    ProjectMember: [
      {
        id:"",
        icon: "/img/me.png",
        name: '帅涛',
        checked: true
      },
    ],
  },

  //选择项目成员
  Clickmember: function (e) {

    var that = this
    var checked = !e.currentTarget.dataset.checked//当前成员的选中情况
    var index = e.currentTarget.dataset.index//当前成员下标
    var ProjectMember = that.data.ProjectMember//成员列表

    for (var i in ProjectMember) {
      if (i == index) {
        ProjectMember[i].checked = !ProjectMember[i].checked
      }
    }

    //获取选中的成员ID
    that.setData({
      ProjectMember: ProjectMember,
    });
  },


  //完成
  Finish: function () {
    var that = this
    // var memberId = that.data.memberId//选中的成员下标
    var ProjectMember = that.data.ProjectMember//项目成员
    var InitProjectMember = that.data.InitProjectMember//初始化项目成员
    var InitmemberIds = []//原有的成员id数组
    var memberIds = []//修改后的成员id数组

    console.log("InitProjectMember", InitProjectMember)
    console.log("ProjectMember", ProjectMember)

    for (var i in InitProjectMember) {
      //原有的成员id数组
      if (InitProjectMember[i].checked == true)
      InitmemberIds.push(InitProjectMember[i].id)
    }
    for (var i in ProjectMember) {
      //修改后的成员id数组
      if (ProjectMember[i].checked == true)
      memberIds.push(ProjectMember[i].id)
    }
    console.log("原有选中的成员ID", InitmemberIds)
    console.log("修改后选中的成员ID", memberIds)

    // if (memberIds == InitmemberIds)//无成员变化
    //     {
    //       wx.navigateBack()
    //     }
        // else {
    console.log("modifyMeetingMember",that.data.projId, that.data.meetingId, InitmemberIds, memberIds)
    that.modifyMeetingMember(that.data.projId, that.data.meetingId, InitmemberIds,memberIds)
          
        // }
  },

  /**
 * @parameter projId项目id ，meetingId会议id，oldmemberIds 旧的成员id数组, newmemberIds 新的成员id数组
 * 修改会议成员， 删掉原来的成员id数组,添加新的成员ids数组
 */
  modifyMeetingMember:function (projId, meetingId, oldmemberIds, newmemberIds){
    var that =  this
    var Meetingmember = Bmob.Object.extend('meeting_member')
    var meetingmemberQuery = new Bmob.Query(Meetingmember)
    var meeting = Bmob.Object.createWithoutData('meeting', meetingId)
    var meetingmemberArr = []

    if (oldmemberIds != null && oldmemberIds.length > 0) {
        meetingmemberQuery.containedIn('user', oldmemberIds)
        meetingmemberQuery.equalTo('meeting_id', meetingId)

      meetingmemberQuery.destroyAll({
        success: function () {
          console.log("删除成功")
          //删除成功
          if(newmemberIds == null || newmemberIds.length == 0)
            wx.navigateBack()
            

        },
        error:function(error){
          //失败
          console.log('删除任务成员失败',error)
        }
      })
    }
      //然后添加新的成员
      console.log('newmemberIds', newmemberIds)
      if (newmemberIds != null && newmemberIds.length > 0) {
        for (var i in newmemberIds) {
          var member = new Meetingmember()
          var user = Bmob.Object.createWithoutData('_User', newmemberIds[i])
          member.set('meeting_id', meetingId)
          member.set('user', user)
          member.set('meeting',meeting)
          meetingmemberArr.push(member)
        }

        if (meetingmemberArr != null && meetingmemberArr.length > 0) {
          Bmob.Object.saveAll(meetingmemberArr).then(function (results) {
            // 重新添加关联的任务成功
            var _type = 4  //通知类型
            that.addProjectNotification(projId, MODIFY_MEETING_MEMBER, _type, meetingId/*会议id*/)  //通知其他项目成员
            console.log('修改会议关联成员成功！')
            wx.navigateBack()
            
          },
            function (error) {
              // 异常处理
              console.log('修改会议关联成员失败！')
            })
        }
      }
    
  },
  
//   /**
//  * parameter projId项目的id ，meetingId 会议id, memberIds 新添加的成员id数组
//  * 非创建会议时添加会议成员，请与addCreateMeetingMember 区分开
//  * 内部调用通知项目成员的函数addProjectNotification
//  */
//   addMeetingMember:function (projId, meetingId, memberIds){

//     var that = this
//     var Meetingmember = Bmob.Object.extend('meeting_member')
//     var meetingmemberArr = []

//     if(memberIds !=null && memberIds.length > 0) {
//         for (var i in memberIds) {
//         var memberId = memberIds[i]
//         var user = Bmob.Object.createWithoutData("_User", memberId)
//         var meetingmember = new Meetingmember()
//         meetingmember.set('meeting_id', meetingId)
//         meetingmember.set('user', user)
//         meetingmemberArr.push(meetingmember)
//       }

//       if (meetingmemberArr != null && meetingmemberArr.length > 0) {
//         Bmob.Object.saveAll(meetingmemberArr).then(function (meetingmemberArr) {
//           //批量增加会议成员成功
//           console.log("批量增加会议成员成功!");
//           //记录操作
//           var _type = 4  //通知类型，会议通知
//           that.addProjectNotification(projId, MODIFY_MEETING_MEMBER, _type, meetingId/*创建的会议id*/)  //通知其他项目成员
//           wx.navigateBack()
//         },
//           function (error) {
//             // 异常处理
//             console.log("批量增加会议成员成功失败！", error);
//           })
//       }
//     }

//   },

//   /**
//  * parameter projId项目的id ， memberIds 需要删除的成员id数组
//  * 删除成员，目前提供的是删除多个成员的接口
//  * 内部调用通知项目成员的函数addProjectNotification
//  */
//   deleteMeetingMember:function (projId, meetingId, memberIds) {

//     var that = this
//     var Meetingmember = Bmob.Object.extend('meeting_member')
//     var meetingmemberQuery = new Bmob.Query(Meetingmember)

//     if (memberIds != null && memberIds.length > 0) {
//       meetingmemberQuery.containedIn('user', memberIds)
//       //将查询出的全部删除
//       meetingmemberQuery.destroyAll({
//         success: function () {
//           //删除成功
//           console.log('删除会议成员成功！')
//           //记录操作
//           var _type = 4  //通知类型，会议通知
//           that.addProjectNotification(projId, MODIFY_MEETING_MEMBER, _type, meetingId/*创建的会议id*/)  //通知其他项目成员
//           wx.navigateBack()
//         },
//         error: function (err) {
//           // 删除失败
//           console.log('删除会议成员失败！', err)
//         }
//       })
//     }

//   },

/**
 * @parameter projId 项目id
 * 获取项目成员，用来添加会议成员用
 * 项目领导排在第一个
 */
getProjectMember:function (projId) {
    var that = this
    var ProjectMember = Bmob.Object.extend("proj_member")
    var memberQuery = new Bmob.Query(ProjectMember)
    var User = Bmob.Object.extend("_User")
    var userQuery = new Bmob.Query(User)

    var leader_id = "0"
    var memberId = [] //项目的所有成员id数组
    var userArr = [] //项目所有成员数组

    //获取指定项目的所有成员id，50条
    memberQuery.equalTo("proj_id", projId)
    memberQuery.select("user_id", "is_leader")
    memberQuery.limit(50)
    memberQuery.find().then(function (results) {
      //返回成功
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        if (object.get("is_leader")) {
          //项目领导，放在数组的第一个
          leader_id = object.get("user_id")
          memberId.unshift(leader_id)

        } else {
          memberId.push(object.get("user_id"))  //将成员id添加到数组
        }
      }
    }).then(function (result) {

      //获取指定项目的所有成员,一次可以获取50条
      userQuery.select("objectId", "nickName", "userPic")  //查询出用户基本信息，id ，昵称和头像
      userQuery.limit(50)
      userQuery.containedIn("objectId", memberId)

      userQuery.find({
        success: function (results) {
          console.log("共查询到项目成员 " + results.length + " 条记录");
          console.log("共查询到项目成员 " , results);
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var object
            object = {
              'id': results[i].id,
              'nickName': results[i].get('nickName'),
              'userPic': results[i].get('userPic'),
              'checked':false,
            }

            if (object.id == leader_id) {
              //将项目领导放在数组的第一个位置
              userArr.unshift(object)
            } else
              userArr.push(object)
          }
          //在这里设置setdata
          var member = wx.getStorageSync("meetingDetail-member")
          console.log("member", member)
          if (member != "") {
            for (var i in userArr) {
              for (var j in member)
                if (userArr[i].id == member[j].userId) {//初始化选中成员
                  userArr[i].checked = true
                }
            }
          }
          console.log("项目成员：", userArr)
          that.setData({
            InitProjectMember: userArr,
            ProjectMember: userArr,
          });



        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
          //失败情况





        }
      })

    })
  },
/**
 * 2018-05-31
 * @parameter projId项目id，toUserIds通知的目标用户id数组，_type是通知的类型(我发了关于这个的文档),requestId是通知跳转
 * 页面所有携带的请求数据，比如（taskId，meetingId 等）
 * 存储通知,往往都是批量添加的
 */
addProjectNotification: function (projId, content, _type, requestId) {
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
    //获取项目ID缓存
    var projId = wx.getStorageSync("meetingDetail-projId")
    //设置会议ID缓存
    var meetingId = wx.getStorageSync("meetingDetail-meetingId")
    that.setData({
      projId: projId,
      meetingId: meetingId
    })
    that.getProjectMember(projId)//获取项目成员

    

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
    wx.removeStorageSync("meetingDetail-meetingId")
    wx.removeStorageSync("meetingDetail-projId")
    wx.removeStorageSync("meetingDetail-member")
    wx.removeStorageSync("meetingDetail-membericon")
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