// pages/Project/Task/TaskDetail/CommModel/addModel/addModel.js
var Bmob = require('../../../../../utils/bmob.js')
var MODIFY_TASK_DESC = "修改了任务描述"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: "",//当前任务ID
    content: "",//内容
  },



  //保存
  save: function (e) {
    var that = this
    var content = e.detail.value.content
    var userName = getApp().globalData.nickName
    var taskId = wx.getStorageSync("TaskDetail-taskId")
    var description = content
    console.log("save",description)
    that.modifyTaskDesc(taskId, description, userName)
    // wx.setStorageSync("FeedBack-content", content)
  },
  
  //任务描述
  modifyTaskDesc:function (taskId, description, userName) {
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    //添加反馈时间
    taskQuery.get(taskId, {
      success: function (result) {
        //成功情况
        result.set('desc', description)
        result.save()
        //记录操作
        that.addTaskRecord(taskId, userName, MODIFY_TASK_DESC)

        // 移动到这里，解决跳转后还没修改的bug
        wx.navigateBack({
          url: '../TaskDetail',
        })

      },
      error: function (object, error) {
        //失败情况
      }
    })
  },



  /**
 *添加任务记录
 */
  addTaskRecord: function (taskId, userName, record) {
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
* 获取某个任务的基本信息
*/
  getTaskDetail: function (taskId) {
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    taskQuery.get(taskId, {
      success: function (result) {
        //反馈模板
        console.log("getTaskDetail:", result.attributes.desc)
        //任务描述
        if (result.attributes.desc != null && result.attributes.desc != '') {
          that.setData({
            content: result.attributes.desc,
          })
        }

        //成功
      },
      error: function (error) {
        //失败
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
    var taskId = wx.getStorageSync("TaskDetail-taskId")
    that.setData({
      taskId: taskId
    })
    that.getTaskDetail(that.data.taskId)
    var content = wx.getStorageSync("TaskDetail-desc")
    if (content != "") {
      that.setData({
        content: content
      })
    }
    else {

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
    wx.removeStorageSync("TaskDetail-desc")
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