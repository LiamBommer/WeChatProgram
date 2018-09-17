// pages/memberList/memberList.js
var Bmob = require('../../../../utils/bmob.js')
var DELETE_PROJECT_MEMBER = "删除了项目成员"
var RECEIVE_DELETE_NOTI = "你已被踢出了项目："
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    memberId: -1,
    //判断项目负责人
    isLeader:false,
    //项目成员
    ProjectMemember: [
      {
        id:"",
        icon: "/img/me.png",
        name: '帅涛',
        checked: true
      },
    ],

    // 新用户标识，显示新手指引
    // 0 首页欢迎语
    // 1 高亮项目详情
    // 2 项目详情页 高亮成员
    // 3 成员列表 高亮添加成员
    // 4 返回项目首页 高亮项目
    // 5 进入任务页 高亮任务列表名
    // 6 高亮任务
    // 7 进入任务详情 探索
    is_beginner: false,
    guide_step: 0,

    frame_title_3: '邀请成员加入',
    frame_desc_3: '点击图标即可邀请好友加入',

  },

  // 新手指引按钮步骤
  GuideNext: function() {
    var guide_step = this.data.guide_step
    guide_step = guide_step + 1
    this.setData({
      is_beginner: false,
      guide_step: guide_step
    })
    wx.setStorageSync('is_beginner', false)
    wx.setStorageSync('guide_step', guide_step)
  },

  //选择项目成员
  ProjectMememberChange: function (e) {
    var memberId = e.detail.value
    console.log("测试",memberId)
    this.setData({
      memberId: memberId,
    });
  },

 

  //完成
  Finish: function () {
    var that = this;
    var memberId = that.data.memberId;
    var memberIdLength = memberId.length;
    var NomemberId = []
    var NomemberIdLength = 0
    var ProjectMemember = that.data.ProjectMemember;

    //判断用户是否对项目成员删除
    if (memberId == -1 || that.data.ProjectMemember == memberId.length){
      wx.navigateBack({
        url: '../ProjectDetail',
      })
      return;
    }
    
    if (memberIdLength == 0) {//全部未选
      for (var i in ProjectMemember)
        NomemberId.push(ProjectMemember[i].id)
    }
    else {//个别未选
      var memberMap = {}
      for (var i in memberId) {
        var key = memberId[i]
        memberMap[key] = true     //建一个没被删除的成员的哈希表
      } 
      for (var j in ProjectMemember) {
        if (memberMap[ProjectMemember[j].id] != true)   //在哈希表里面找不到的则是要删除的成员id
          NomemberId.push(ProjectMemember[j].id)
      }
    }

    wx.getStorage({
      key: 'Project-detail',
      success: function (res) {
        console.log('未选中的成员ID', NomemberId, 'projId', res.data.id);//未选中的成员ID
        that.deleteProjectMember(res.data.id, NomemberId)
      },
    })
  },

  /**
 * 2018-05-22
 * @anthor mr.li
 * @parameter projId项目id, memberIds 成员id数组
 * 删除成员
 */
  deleteProjectMember:function (projId, memberIds){

    var that = this
    var Proj_Member = Bmob.Object.extend("proj_member")
    //若数组非空，则开始删除成员
    if (memberIds != null && memberIds.length > 0) {
      var projmemberQuery = new Bmob.Query(Proj_Member)
      projmemberQuery.containedIn("user_id", memberIds)
      projmemberQuery.equalTo('proj_id', projId)
      projmemberQuery.destroyAll({
        success: function () {
          //删除成功
          console.log('删除项目成员成功!')
          //删除任务成员
          that.deleteTaskMember(projId,memberIds)
          //删除会议成员
          that.deleteMeetingMember(projId,memberIds)
          //删除通知
          that.deleteUserProjNotification(projId, memberIds)//此函数内调用了通知其他项目成员 ，项目成员被删除
          
          wx.navigateBack({
            url: '../ProjectDetail',
          })
  
        },
        error: function (err) {
          // 删除失败
          console.log('删除任务成员失败!')
        }
      })

    }

},
  /**
  * 2018-06-13
  *  @parameter projId项目id，memberIds被删除的成员id数组
  * 项目删除成员后的删除任务成员
  */
  deleteTaskMember: function (projId, memberIds) {
    var that = this
    var Taskmember = Bmob.Object.extend('task_member')
    var taskmemberQuery = new Bmob.Query(Taskmember)
    if (memberIds != null && memberIds.length > 0) {
      
      taskmemberQuery.equalTo('project', projId)
      taskmemberQuery.containedIn('user_id', memberIds)
      //taskmemberQuery.limit(50)//没有这个limit，应该是删除全部
      //删除任务成员
      taskmemberQuery.destroyAll({
        success: function () {
          //删除成功
          console.log("删除项目后删除任务成员成功！")
        },
        error: function (err) {
          // 删除失败
        }
      })
    }
  },

  /**
   * 2018-06-13
   * 
  * 项目删除成员后的删除会议成员
   */
  deleteMeetingMember:function(projId,memberIds){

    var that = this
    var Meetingmember = Bmob.Object.extend('meeting_member')
    var meetingmemberQuery = new Bmob.Query(Meetingmember)

    meetingmemberQuery.equalTo('project',projId)
    meetingmemberQuery.containedIn('user',memberIds)
    //meetingmemberQuery.limit(50)  //没有这个limit，应该是删除全部
    //删除任务成员
    meetingmemberQuery.destroyAll({
      success: function () {
        //删除成功
        console.log("删除项目后删除会议成员成功！")
      },
      error: function (err) {
        // 删除失败
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
 * 根据projId 和 userId 删除通知
 */
  deleteUserProjNotification: function(projId,memberIds){

    var that = this
    var Notification = Bmob.Object.extend('notification')
    var notificationQuery = new Bmob.Query(Notification)

    if(memberIds != null && memberIds.length > 0){
      notificationQuery.equalTo('project', projId)
      notificationQuery.containedIn('to_user_id', memberIds)
      notificationQuery.destroyAll({
        success: function () {
          //删除成功
          console.log("删除项目成员后的删除相关通知成功!")
          //再加上通知其他项目成员这些删除成员的情况
          var _type = 0  //表示可以进入项目详情
          that.addProjectNotification(projId, DELETE_PROJECT_MEMBER,_type, projId)

          //再加上通知被删除的成员他们已被踢出了项目
          var _type2 = -1 //表示不可展示通知详情
          that.notiDeleteProjmember(projId, RECEIVE_DELETE_NOTI + wx.getStorageSync('Project-detail').name,_type2,memberIds)

        },
        error: function (err) {
          // 删除失败
        }
      })
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
 *
 * @parameter projId项目id,projName项目名称，content通知内容，_type通知类型，memberIds被踢出的成员的id数组 
 * 通知被删除的项目成员他们已被踢出了项目
 */
  notiDeleteProjmember: function(projId, content, _type, memberIds){
    if (memberIds != null && memberIds.length > 0){
      var that = this
      var fromUser = Bmob.Object.createWithoutData('_User',getApp().globalData.userId)
      var project = Bmob.Object.createWithoutData('project', projId)
      var request_id = -1
      var notificationArr = []

      var Notification = Bmob.Object.extend('notification')
      for(var i in memberIds){
        var notification = new Notification()
        notification.set('project',project)
        notification.set('from_user',fromUser)
        notification.set('type',_type)
        notification.set('request_id',request_id)
        notification.set('content',content)
        notification.set('is_read',false)
        notification.set('to_user_id',memberIds[i])

        notificationArr.push(notification)

        if(notificationArr != null && notificationArr.length > 0){
          Bmob.Object.saveAll(notificationArr).then(function (notificationArr) {
            // 通知添加成功
            console.log("通知被删除成员成功！")
          },
            function (error) {
              // 通知添加失败处理
            })
        }
        
      }

    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    //判断当前操作人是否为项目负责人
    var isLeader = wx.getStorageSync("ProjectDetail-isLeader")
    this.setData({
      isLeader: isLeader
    })


    // 获取新用户标识，显示新手指引
    var is_beginner = wx.getStorageSync('is_beginner')
    var guide_step = wx.getStorageSync('guide_step')
    if(is_beginner != true) is_beginner = false;    // 排除获取不到出错的情况
    if(!guide_step) guide_step = 0;
    this.setData({
      is_beginner: is_beginner,
      guide_step: guide_step
    })

    var that = this
    wx.getStorage({
      key: 'ProjectDetail-memberList',
      success: function(res) {
        var memberList = res.data
        that.setData({
          ProjectMemember: memberList,
        })
        console.log("projectmember",that.data.ProjectMemember)
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
