
var Bmob = require('../../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    icon_share: '/img/share.png',
    icon_deadline: '/img/deadline.png',
    icon_task_list: '/img/task_list.png',
    icon_add: '/img/add.png',
    icon_member: '/img/member.png',
    icon_close: '/img/close.png',
    icon_create: '/img/create.png',

    hiddenmodalputTitle: true,//弹出标题模态框
    inputTitle: '',//输入的标题

    // 本日程的详情
    scheduleId: -1,
    scheduleContent: '',//标题
    startTime: '',
    endTime: '',
    tasks: [],

    // 本项目详情，用于通知
    projectDetail: {}

  },

  //点击按钮弹出指定的hiddenmodalput弹出框
  modalInputTitle: function () {

    // Get & set schedule title
    var title = this.data.scheduleContent
    this.setData({
      inputTitle: title
    })

    // Show modal
    this.setData({
      hiddenmodalputTitle: false
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

    var projectId = that.data.projectDetail.id
    var scheduleId = that.data.scheduleId
    var scheduleContent = that.data.scheduleContent

    var input = that.data.inputTitle
    if (scheduleContent == input) {
      that.setData({
        hiddenmodalputTitle: true,
      })
      return;
    }

    wx.showLoading({
      title: '正在修改...',
      mask: 'true'
    })

    // Submit
    that.modifyScheduleTitle(projectId, scheduleId, scheduleContent)

  },

  //标题
  input: function (e) {
    var inputTitle = e.detail.value
    this.setData({
      inputTitle: inputTitle
    })
  },

  // 截止时间
  DeadLineChange: function (e) {

    var that = this
    var projectId = that.data.projectDetail.id
    var scheduleId = that.data.scheduleId
    var endTime = e.detail.value

    wx.showLoading({
      title: '正在修改...',
      mask: 'true'
    })
    // Submit
    that.modifyScheduleEndtime(projectId, scheduleId, endTime)

  },

  // 开始时间
  StartTimeChange: function (e) {

    var that = this
    var projectId = that.data.projectDetail.id
    var scheduleId = that.data.scheduleId
    var startTime = e.detail.value

    wx.showLoading({
      title: '正在修改...',
      mask: 'true'
    })
    // Submit
    that.modifyScheduleStartTime(projectId, scheduleId, startTime)

  },

  // 关联任务
  connectTask: function (e) {

    var that = this

    // 设置标识，进入人物列表后完成即保存
    wx.setStorage({
      key: 'isScheduleDetail',
      data: true,
      success: function () {

        // 把已有的任务列表加入缓存，以便能收到
        var oldTasks = that.data.tasks
        var oldTaskIds = []
        for (var i in oldTasks) {
          oldTaskIds.push(oldTasks[i].task_id)
        }
        wx.setStorage({
          key: 'ScheduleDetail-TaskId',
          data: oldTaskIds,
          success: function() {
            wx.navigateTo({
              url: '../ScheduleTaskList/ScheduleTaskList',
            })
          }
        })

      }

    })

    // 将原本的任务id保存至缓存 ！！！

  },

  //删除
  Delete: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除此日程吗',
      success: function (res) {

        if (res.confirm) {//点击确定

          wx.showLoading({
            title: '正在删除',
            mask: 'true'
          })
          // Submit
          that.deleteSchedule(that.data.projectDetail.id, that.data.scheduleId)

        }
        else {//点击取消

        }
      }
    })

  },

  /**
  * 用户点击右上角分享
  */
  onSareAppMessage: function () {

    var that = this
    var scheduleContent = that.data.scheduleContent

    // 分享
    return {
      title: '日程：' + scheduleContent,
      path: "pages/Project/Schedule/scheduleDetail",
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
        })
      },
    }

  },

  /**
  * @parameter projId项目id, scheduleId日程id, newTitle新标题
  * 修改日程标题
  *  内部调用了addProjectNotification
  */
  modifyScheduleTitle: function (projId, scheduleId, newTitle) {

    var that = this
    var Schedule = Bmob.Object.extend('schedule')
    var scheduleQuery = new Bmob.Query(Schedule)
    //删除日程
    scheduleQuery.get(scheduleId, {
      success: function (result) {
        result.set('title', newTitle)
        result.save()

        var _type = 3  //通知类型
        // that.addProjectNotification(projId, MODIFY_SCHEDULE_TITLE , _type, scheduleId/*日程id*/)  //通知其他项目成员

        wx.hideLoading()
        wx.showToast({
          title: '修改日程标题成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          hiddenmodalputTitle: true,
          scheduleContent: that.data.inputTitle
        })

      },
      error: function (error) {

        wx.hideLoading()
        wx.showToast({
          title: '修改日程标题失败，请稍后再试:\n' + JSON.stringify(error),
          icon: 'none',
          duration: 10000
        })
        that.setData({
          hiddenmodalputTitle: true,
        })

      }
    })
  },


  /**
  * @parameter projId项目id, scheduleId日程id, newStartTime新的开始时间
  * 修改日程开始时间
  *  内部调用了addProjectNotification
  */
  modifyScheduleStartTime: function (projId, scheduleId, newStartTime) {

    var that = this
    var Schedule = Bmob.Object.extend('schedule')
    var scheduleQuery = new Bmob.Query(Schedule)
    //删除日程
    scheduleQuery.get(scheduleId, {
      success: function (result) {
        result.set('start_time', newStartTime)
        result.save()

        var _type = 3  //通知类型
        // that.addProjectNotification(projId, MODIFY_SCHEDULE_START, _type, scheduleId/*日程id*/)  //通知其他项目成员

        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          startTime: newStartTime
        })

      },
      error: function (error) {

        wx.hideLoading()
        wx.showToast({
          title: '修改失败，请稍后再试:\n' + JSON.stringify(error),
          icon: 'none',
          duration: 1000
        })

        console.log('scheduleId: ', scheduleId)
        console.log('Error: ', error)

      }
    })
  },


  /**
  * @parameter projId项目id, scheduleId日程id, newTitle新标题
  * 修改日程结束时间
  *  内部调用了addProjectNotification
  */
  modifyScheduleEndtime: function (projId, scheduleId, newEndTime) {

    var that = this
    var Schedule = Bmob.Object.extend('schedule')
    var scheduleQuery = new Bmob.Query(Schedule)
    //删除日程
    scheduleQuery.get(scheduleId, {
      success: function (result) {
        result.set('end_time', newEndTime)
        result.save()

        var _type = 3  //通知类型
        // that.addProjectNotification(projId, MODIFY_SCHEDULE_END, _type, scheduleId/*日程id*/)  //通知其他项目成员

        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          endTime: newEndTime
        })

      },
      error: function (error) {

        wx.hideLoading()
        wx.showToast({
          title: '修改失败，请稍后再试:\n' + JSON.stringify(error),
          icon: 'none',
          duration: 1000
        })

      }
    })
  },

  /**
   * @parameter projId 项目id, scheduleId日程id
   * 删除日程
   *  内部调用了addProjectNotification
   */
  deleteSchedule: function (projId, scheduleId) {

    var Schedule = Bmob.Object.extend('schedule')
    var scheduleQuery = new Bmob.Query(Schedule)
    //删除日程
    scheduleQuery.get(scheduleId, {
      success: function (result) {
        result.set('is_delete', true)
        result.save()
        console.log("提示用户删除日程成功！")

        var _type = 3  //通知类型
        // that.addProjectNotification(projId, DELETE_SCHEDULE, _type, scheduleId/*日程id*/)  //通知其他项目成员

        wx.hideLoading()
        wx.navigateBack({
          url: '../../ProjectMore/ProjectMore',
        })
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        })

      },
      error: function (error) {
        console.log("提示用户删除日程失败！\n", error)
        wx.hideLoading()
        wx.showToast({
          title: '删除失败：'+JSON.stringify(error),
          icon: 'success',
          duration: 3000
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

    wx.showLoading({
      title: '正在加载',
      mask: 'true'
    })

    //需要任务列表，通过任务ID取任务名和任务执行者
    wx.getStorage({
      key: 'ProjectMore-scheduleDetail',
      success: function (res) {
        that.setData({
          scheduleId: res.data.scheduleId,
          scheduleContent: res.data.scheduleContent,
          startTime: res.data.startTime,
          endTime: res.data.endTime,
          tasks: res.data.tasks
        })
        wx.hideLoading()
      }
    })

    // 获取项目id，通知用
    wx.getStorage({
      key: 'Project-detail',
      success: function (res) {
        that.setData({
          projectDetail: res.data
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

    // 清空缓存列表
    // 以免干扰创建日程页面
    wx.setStorage({
      key: 'ScheduleTaskList-TaskId',
      data: {},
    })

    wx.setStorage({
      key: 'isScheduleDetail',
      data: false,
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
