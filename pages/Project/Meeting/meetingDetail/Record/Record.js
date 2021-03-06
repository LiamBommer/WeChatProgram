// pages/Project/Task/TaskDetail/CommModel/addModel/addModel.js
var Bmob = require('../../../../../utils/bmob.js')
var MODIFY_MEETING_RECORD = "修改了会议记录"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:'',//会议记录
  },

  save:function(e){
    var that = this
    var meetingRecord = e.detail.value.record
    console.log("modifyMeetingRecord", that.data.projId, that.data.meetingId, meetingRecord)
    that.modifyMeetingRecord(that.data.projId, that.data.meetingId, meetingRecord)
    that.setData({
      record: meetingRecord
    })
  },

  /**
 * @parameter projId项目id, meetingId 会议id, meetingRecord 新的会议记录
 * 修改会议记录，第一次添加会议记录也用这个函数。 
 * 没有一键删除会议记录的函数,如果要删除的话就等于清空记录内容。
 * 内部调用通知项目成员的函数addProjectNotification
 */
  modifyMeetingRecord:function (projId, meetingId, meetingRecord){

    var that = this
    var Meeting = Bmob.Object.extend('meeting')
    var meetingQuery = new Bmob.Query(Meeting)

    //修改会议记录
    meetingQuery.get(meetingId, {
      success: function (result) {
        //成功
        result.set('meeting_record', meetingRecord)
        result.save()
        console.log("修改会议记录成功！")
        //添加记录操作
        var _type = 4  //通知类型，会议通知
        that.addProjectNotification(projId, MODIFY_MEETING_RECORD, _type, result.id/*创建的会议id*/)  //通知其他项目成员



      },
      error: function (error) {
        //失败
        console.log("修改会议记录失败！")
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
        wx.navigateBack({
          url: '../meetingDetail'
        })

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
    //获取会议内容缓存
    var record = wx.getStorageSync("meetingDetail-record")
    //获取项目ID缓存
    var projId = wx.getStorageSync("meetingDetail-projId")
    //获取会议ID缓存
    var meetingId = wx.getStorageSync("meetingDetail-meetingId")
    that.setData({
      record: record,
      projId: projId,
      meetingId: meetingId,
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