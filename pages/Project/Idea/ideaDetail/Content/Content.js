
var Bmob = require('../../../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: '',
    ideaId: -1,
    projectId: -1,
  },

  save: function(e){

    var that = this
    var record = e.detail.value.record
    var ideaId = that.data.ideaId
    var projectId = that.data.projectId

    if(record == this.data.record) {
      // 未做改动

      wx.navigateBack({
        url:'../ideaDetail/ideaDetail'
      })
      return;

    } else {

      wx.showLoading({
        title: '正在修改...',
        mask: 'true'
      })

      // Submit
      that.modifyIdeaContent(projectId, ideaId, record)

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
  * @parameter projId项目id，ideaId点子id ，newContent
  * 修改点子内容,内部调用了addProjectNotification
  */
  modifyIdeaContent: function (projId,ideaId,newContent){

    var that = this
    var Idea = Bmob.Object.extend('idea')
    var ideaQuery = new Bmob.Query(Idea)

    ideaQuery.get(ideaId,{
      success: function(result){
        result.set('content',newContent)
        result.save()
        //修改成功
        //通知其他项目成员
        var _type = 5   //通知的类型
        // that.addProjectNotification(projId, MODIFY_IDEA_CONTENT, _type, ideaId)  //通知其他项目成员
        console.log('提示用户修改成功！')

        wx.hideLoading()
        wx.navigateBack({
          url:'../ideaDetail/ideaDetail'
        })
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })

      },
      error: function(error){
        //修改失败
        console.log('提示用户修改失败！', error)

        wx.hideLoading()
        wx.showToast({
          title: '修改失败',
          duration: 1000
        })
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

    // 点子内容
    wx.getStorage({
      key: 'ideaDetail-content',
      success: function(res) {
        that.setData({
          record: res.data
        })
      }
    })

    // 点子id
    wx.getStorage({
      key: 'ProjectMore-ideaDetail-id',
      success: function(res) {
        that.setData({
          ideaId: res.data
        })
      }
    })

    // 项目id
    wx.getStorage({
      key: 'Project-detail',
      success: function(res) {
        that.setData({
          projectId: res.data.id
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
    wx.removeStorageSync("ideaDetail-content")
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
