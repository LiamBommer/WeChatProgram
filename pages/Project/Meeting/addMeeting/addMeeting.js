//addMember.js
var Bmob = require('../../../../utils/bmob.js')
var util = require('../../../../utils/util.js')
var ADD_MEETING = "添加了新的会议"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_deadline: '/img/deadline.png',
    icon_cycle: '/img/cycle.png',
    icon_member: '/img/member.png',
    icon_close: '/img/close.png',
    icon_create: '/img/create.png',
    starttime: '', 
    time:'',//时间
    index:'',//选择重复时间
    repeatTime: ["每天", "每周", "每月", "每年"],
    memberIcon: [
      "/img/create.png",
    ],
    memberId:[],//选中的成员id数组
    projMember:[],//项目成员列表
  },

  // 重复时间
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  // 开始时间
  starttimeChange: function (e) {
    console.log("starttime", e.detail.value)
    this.setData({
      starttime: e.detail.value
    })
  },
  //选择时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },

  // 成员列表
  memberList: function (e) {
    var memberIcon = this.data.memberIcon
    var projMember = this.data.projMember
    //设置成员图标缓存
    console.log("addMeeting-memberIcon", memberIcon)
    wx.setStorageSync("meetingDetail-membericon", memberIcon)
    //设置成员列表缓存
    console.log("addMeeting-projMember", projMember)
    wx.setStorageSync("meetingDetail-member", projMember)

    wx.navigateTo({
      url: './memberList/memberList',
    })
  },
  
  //创建会议
  BuildMeeting: function (e) {
    var that = this
    var title = e.detail.value.title
    var content = e.detail.value.content
    var startTime = that.data.starttime
    var time = that.data.time
    var memberIds = that.data.memberId
    wx.getStorage({
      key: 'ProjectMore-projId',
      success: function (res) { 
        var projId = res.data
        console.log("BuildMeeting")
        console.log(projId, title, content, startTime, memberIds)
        if (startTime == "" || time == "" || content == "" || title == "" ){
         wx.showToast({
           title: '请填写完整',
           icon:"none",
           duration:1500,
         })
        }
        else{
          that.createMeeting(projId, title, content, startTime, time, memberIds)
        }
      },
    })
    
  },
  /**
   * @parameter projId 项目id，title会议标题，content 会议内容(可以为空）
   * ，start_time开始时间（最好让用户填好,方便后面排序和显示）time为具体时间如05:50
   * memberIds 添加的会议成员id 数组（可以为空），没有重复的值（这个功能没想到怎么做）
   * 创建会议
   * 内部调用添加会议成员的函数addCreateMeetingMember
   * 内部调用通知项目成员的函数addProjectNotification
   */
  createMeeting:function (projId, title, content, startTime, time, memberIds){
    var that = this
    var Meeting = Bmob.Object.extend('meeting')
    var meeting = new Meeting()
    //添加会议
    meeting.save({
      proj_id: projId,
      title: title,
      start_time: startTime,
      time:time,
      content: content,
      is_delete: false

    }, {
        success: function (result) {
          //添加会议成功
          console.log("提示用户添加会议成功！")
          //添加会议成员
          if (memberIds != null && memberIds.length > 0) {
            that.addCreateMeetingMember(projId, result.id/*会议id*/, memberIds)
          }

          ///通知其他项目成员
          var _type = 4  //通知类型，会议通知
          that.addProjectNotification(projId, ADD_MEETING, _type, result.id/*创建的会议id*/)  //通知其他项目成员
          wx.navigateBack({
            url:"../../ProjectMore/ProjectMore"
          })

        },
        error: function (result, error) {
          //失败
          console.log("提示用户添加会议成功！")
        }
      })
  },
  /**
 * 2018-05-31
 * @parameter projId项目id，toUserIds通知的目标用户id数组，_type是通知的类型(我发了关于这个的文档),requestId是通知跳转
 * 页面所有携带的请求数据，比如（taskId，meetingId 等）
 * 存储通知,往往都是批量添加的
 */
  addProjectNotification:function (projId, content, _type, requestId) {

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
 * 这是创建会议时添加会议成员用的，创建会议已经通知了项目其他成员，所以这个添加会议成员函数将不会通知项目成员
 * 添加会议成员，此函数不会调用 通知项目成员的函数。请与addMeetingMember(会调用通知函数)区分开
 */
  addCreateMeetingMember:function (projId, meetingId, memberIds) {

    var that = this
    var Meetingmember = Bmob.Object.extend('meeting_member')
    var meetingmemberArr = []

    if (memberIds != null && memberIds.length > 0) {
      for (var i in memberIds) {
        var memberId = memberIds[i]
        var user = Bmob.Object.createWithoutData("_User", memberId)
        var meetingmember = new Meetingmember()
        meetingmember.set('meeting_id', meetingId)
        meetingmember.set('user', user)
        meetingmemberArr.push(meetingmember)
      }

      if (meetingmemberArr != null && meetingmemberArr.length > 0) {
        Bmob.Object.saveAll(meetingmemberArr).then(function (meetingmemberArr) {
          //批量增加会议成员成功
          console.log("创建会议时增加会议成员成功!");

        },
          function (error) {
            // 异常处理
            console.log("创建会议时增加会议成员成功失败！", error);
          })
      }
    }
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
    //获取项目成员缓存
    wx.getStorage({
      key: 'ProjectMore-projectMember',
      success:function(res){
      console.log("addMeeting-projectMember",res.data)
       that.setData({
         projMember:res.data
       })
      }
    })

    //初始化时间为当前时间
    var starttime = util.formatTime(new Date())
    console.log("time", starttime)
    that.setData({
      starttime: starttime
    })

    //获取选中成员列表的id缓存
    var memberId = wx.getStorageSync("meetingDetail-memberList-MemberId")
    that.setData({
      memberId: memberId
      })
    //获取选中成员列表的头像缓存
    var icon = wx.getStorageSync("meetingDetail-memberList-icon")
    if (icon == "") {
      that.setData({
        "memberIcon[0]": "/img/create.png"
      })
    }
    else {
      that.setData({
        memberIcon: icon
      })
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

    wx.removeStorageSync("meetingDetail-memberList-icon")
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
