// pages/Project/Meeting/meetingDetail/meetingDetai.js
var Bmob = require('../../../../utils/bmob.js')
var ADD_MEETING = "添加了新的会议"
var DELETE_MEETING = "删除了会议"

var MODIFY_MEETING_TITLE = "修改了会议标题"
var MODIFY_MEETING_CONTENT = "修改了会议内容"
var MODIFY_MEETING_START = "修改了会议开始时间"
var MODIFY_MEETING_RECORD = "修改了会议记录"
var MODIFY_MEETING_MEMBER = "修改了会议成员"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalputTitle: true,//弹出标题模态框
    meetingId:'',//会议ID
    projId:"",//项目ID
    title: '策划讨论',//标题
    inputTitle: '',//输入的标题
    content: "",//会议内容
    meetingRecord:'',//会议记录
    icon_share: '/img/share.png',
    icon_deadline: '/img/deadline.png',
    icon_cycle: '/img/cycle.png',
    icon_member: '/img/member.png',
    icon_close: '/img/close.png',
    starttime: '2018-05-22', //开始时间
    time:"",//时间
    index: '不',//选择重复时间
    repeatTime: ["每天", "每周", "每月", "每年"],
    member:[],
    
  },
  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinputTitle: function (e) {
    var title = e.currentTarget.dataset.title
    this.setData({
      hiddenmodalputTitle: false,
      inputTitle: title
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
    var projId = that.data.projId
    var meetingId = that.data.meetingId
    var newTitle = that.data.inputTitle
    console.log("modifyMeetingTitle", projId, meetingId, newTitle)
    that.modifyMeetingTitle(projId, meetingId, newTitle)
    that.setData({
      hiddenmodalputTitle: true,
      title: newTitle
    })
  },

  //标题
  input: function (e) {
    var inputTitle = e.detail.value
    this.setData({
      inputTitle: inputTitle
    })
  },

  // 重复时间
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  // 开始时间
  StatTimeChange: function (e) {
    var that = this
    var projId = that.data.projId
    var meetingId = that.data.meetingId
    var newStartTime = e.detail.value
    var newtime = that.data.time
    that.modifyMeetingStartTime(projId, meetingId, newStartTime, newtime)
    this.setData({
      starttime: newStartTime
    })
  },

  //选择时间
  bindTimeChange: function (e) {
    var that = this
    var projId = that.data.projId
    var meetingId = that.data.meetingId
    var newStartTime = that.data.starttime
    var newtime = e.detail.value
    that.modifyMeetingStartTime(projId, meetingId, newStartTime, newtime)
    this.setData({
      time: e.detail.value
    })
  },


  //会议记录
  Record: function (e) {
    var that = this
    //设置会议记录缓存
    wx.setStorageSync("meetingDetail-record", that.data.meetingRecord)
    //设置项目ID缓存
    wx.setStorageSync("meetingDetail-projId", that.data.projId)
    //设置会议ID缓存
    wx.setStorageSync("meetingDetail-meetingId", that.data.meetingId)
    wx.navigateTo({
      url: './Record/Record',
    })
  }, 
  
  //会议内容
  Content: function (e) {
    var that = this
    //设置会议内容缓存
    wx.setStorageSync("meetingDetail-content", that.data.content)
    //设置项目ID缓存
    wx.setStorageSync("meetingDetail-projId", that.data.projId)
    //设置会议ID缓存
    wx.setStorageSync("meetingDetail-meetingId", that.data.meetingId)
    wx.navigateTo({
      url: './Content/Content',
    })
  }, 

  // 成员列表
  memberList: function (e) {
    var that = this
    var member = that.data.member
    //设置选中项目成员缓存
    console.log("member",member)
    wx.setStorageSync("meetingDetail-member", member)
    //设置项目ID缓存
    wx.setStorageSync("meetingDetail-projId", that.data.projId)
    //设置会议ID缓存
    wx.setStorageSync("meetingDetail-meetingId", that.data.meetingId)
    wx.navigateTo({
      url: './memberList/memberList',
    })
  },
  
  //删除
  Delete: function () {
   var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除此会议吗',
      success: function (res) {
        if (res.confirm) {//点击确定
          that.deleteOneMeeting(that.data.projId, that.data.meetingId)
        }
        else {//点击取消

        }
      }
    })
  },

  /**
* 获取某个会议的详情
* meeting =
'id': result.id || '', //会议id
'title': result.get('title') || '', //会议标题
'start_time': result.get('start_time') || '', //会议开始时间
'content': result.get('content') || '', //会议内容
'meetingRecord': result.get('meeting_record') || '' , //会议记录

*/
  getOneMeeting:function (meetingId){
    var that = this
    var Meeting = Bmob.Object.extend('meeting')
    var meetingQuery = new Bmob.Query(Meeting)

    //获取某个会议的详情
    meetingQuery.get(meetingId, {
      success: function (result) {
        //成功
        var meeting
        meeting = {
          'id': result.id || '', //会议id
          'title': result.get('title') || '', //会议标题
          'start_time': result.get('start_time') || '', //会议开始时间
          'time': result.get('time') || '', //会议开始时间
          'content': result.get('content') || '', //会议内容
          'meetingRecord': result.get('meeting_record') || '', //会议记录
        }
        //获取到的会议 meeting
        console.log("会议详情",meeting)
      
        that.setData({
          meetingId: meeting.id,
          title: meeting.title,
          content: meeting.content,
          starttime: meeting.start_time,
          time: meeting.time,
          meetingRecord: meeting.meetingRecord,
        })
        wx.hideLoading()

      },
      error: function (error) {
        //失败
        console.log('获取会议失败', error)

      }
    })
  },

  /**
 * @parameter meetingId会议id
 * 获取会议成员, 有userId ，userPic，nickName
 */
  getMeetingMember:function (meetingId){
    var that = this
    var Meetingmember = Bmob.Object.extend('meeting_member')
    var meetingmemberQuery = new Bmob.Query(Meetingmember)
    var meetingmemberArr = []


    //获取会议成员
    meetingmemberQuery.equalTo('meeting_id', meetingId)
    meetingmemberQuery.include('user')
    meetingmemberQuery.find({
        success: function (results) {
        //成功
        for (var i in results) {
          var member
          member = {
            'userId': results[i].attributes.user.objectId,
            'userPic': results[i].attributes.user.userPic,
            'nickName': results[i].attributes.user.nickName
          }
          meetingmemberArr.push(member)
        }

        if (meetingmemberArr != null && meetingmemberArr.length > 0) {
          //在这里setData
          //meetingmemberArr 即是获取到的成员数据
          console.log('会议成员', meetingmemberArr)
            that.setData({
              member: meetingmemberArr
            })
        }
        else {
          console.log('会议成员', meetingmemberArr)
          that.setData({
            member:''
          })
        }

        wx.hideLoading()
      },
      error: function (error) {
        //失败
        console.log("获取会议成员失败！")
      }
    })
  },

  /**
 * @parameter projId项目id,meetingId会议id,newStartTime新的会议开始时间
 * 修改会议开始时间
 * 内部调用通知项目成员的函数addProjectNotification
 */
  modifyMeetingStartTime: function (projId, meetingId, newStartTime, newtime){

    var that = this
    var Meeting = Bmob.Object.extend('meeting')
    var meetingQuery = new Bmob.Query(Meeting)

    //修改会议开始时间
    meetingQuery.get(meetingId, {
      success: function (result) {
        //成功
        result.set('start_time', newStartTime)
        result.set('time', newtime)
        result.save()
        console.log("修改会议开始时间成功！")
        //添加记录操作
        var _type = 4  //通知类型，会议通知
        that.addProjectNotification(projId, MODIFY_MEETING_START, _type, result.id/*创建的会议id*/)  //通知其他项目成员

      },
      error: function (error) {
        //失败
        console.log("修改会议开始时间失败！")
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
 * @parameter projId项目id,meetingId会议id,newTitle新的会议标题
 * 修改会议标题
 * 内部调用通知项目成员的函数addProjectNotification
 */
  modifyMeetingTitle:function (projId, meetingId, newTitle) {

    var that = this
    var Meeting = Bmob.Object.extend('meeting')
    var meetingQuery = new Bmob.Query(Meeting)

    //修改会议标题
    meetingQuery.get(meetingId, {
      success: function (result) {
        //成功
        result.set('title', newTitle)
        result.save()
        console.log("修改会议标题成功！")
        //添加记录操作
        var _type = 4  //通知类型，会议通知
        that.addProjectNotification(projId, MODIFY_MEETING_TITLE, _type, result.id/*创建的会议id*/)  //通知其他项目成员

      },
      error: function (error) {
        //失败
        console.log("修改会议标题失败！")
      }
    })
  },
  /**
   * @parameter projId 项目id，meetingId 会议的id
   * 删除某个会议
   * 内部调用通知项目成员的函数addProjectNotification
   */
  deleteOneMeeting:function (projId, meetingId){

    var that = this
    var Meeting = Bmob.Object.extend('meeting')
    var meetingQuery = new Bmob.Query(Meeting)

    //删除某个会议
    meetingQuery.get(meetingId, {
        success: function (result) {
        result.set('is_delete', true)
        result.save()
        console.log("删除某个会议成功!")
        //添加记录
        var _type = 4  //通知类型，会议通知
        that.addProjectNotification(projId, DELETE_MEETING, _type, result.id/*创建的会议id*/)  //通知其他项目成员
        wx.navigateBack({
          url: '../../ProjectMore/ProjectMore',
        })
      },
      error: function (error) {
        //删除失败
        console.log("删除某个会议失败!", error)
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
    wx.showLoading({
      title: '正在加载',
    })

    //获取通知的会议ID
    var requestId = wx.getStorageSync("Notification-meetingId")
    var projId = wx.getStorageSync("Notification-projId")
    if (requestId != "" && projId != '') {
      console.log("获取通知的会议ID", requestId, projId)
      that.setData({
        meetingId: requestId,
        projId: projId
      })
      that.getOneMeeting(requestId)//获取会议详情
      that.getMeetingMember(requestId)//获取会议成员
    }
    else {
      //获取后台会议详情
      wx.getStorage({
        key: 'ProjectMore-meetingId',
        success: function (res) {
          var meetingId = res.data
          that.setData({
            meetingId: res.data
          })
          console.log('meetingId', meetingId)
          that.getOneMeeting(meetingId)//获取会议详情
          that.getMeetingMember(meetingId)//获取会议成员
        }
      })
      //获取项目ID缓存
      wx.getStorage({
        key: 'ProjectMore-projId',
        success: function (res) {
          that.setData({
            projId: res.data
          })
        }
      })
    }

    
    //获取会议内容
    var content = wx.getStorageSync("meetingDetail-Content-content")
    that.setData({
      content: content
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
    wx.removeStorageSync("meetingDetail-Content-content")
    wx.removeStorageSync("Notification-meetingId")
    wx.removeStorageSync("Notification-projId")
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
