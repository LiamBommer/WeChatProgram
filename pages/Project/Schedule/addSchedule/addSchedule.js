
var Bmob = require('../../../../utils/bmob.js')

var ADD_SCHEDULE = "添加了新的日程"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_deadline: '/img/deadline.png',
    icon_task_list: '/img/task_list.png',
    icon_add: '/img/add.png',
    icon_member: '/img/member.png',
    deadline: '',
    stattime: '',

    TaskId: {},   // 关联任务的列表id

    projectDetail: '',  // 所在项目信息

    connectTask: [//关联任务

    ],
  },

  //创建日程
  BuildSchedule: function (e) {

    var that = this
    var title = e.detail.value.title
    var startTime = e.detail.value.startTime
    var endTime = e.detail.value.endTime
    var TaskId = that.data.TaskId
    var projectId = that.data.projectDetail.id

    // 数据验证
    if(title == "" || title.length == 0) {
      wx.showToast({
        title: '日程内容不见咯',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (startTime == "" || startTime.length == 0) {
      wx.showToast({
        title: '日程需要开始时间噢',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (endTime == "" || endTime.length == 0) {
      wx.showToast({
        title: '日程还需要截至时间噢',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    console.log('创建日程： \n')
    console.log('Title: ' + title)
    console.log('Start time: ' + startTime)
    console.log('End time: ' + endTime)
    console.log("Tasks' id: " + TaskId)

    wx.showLoading({
      title: '正在创建',
      mask: 'true'
    })
    // submit
    that.createSchedule(projectId, title, startTime, endTime, TaskId)

  },

  // 截止时间
  DeadLineChange: function (e) {
    this.setData({
      deadline: e.detail.value
    })
  },

  // 开始时间
  StatTimeChange: function (e) {
    this.setData({
      stattime: e.detail.value
    })
  },

  // 关联任务
  connectTask: function (e) {

    // 设置创建页面标志缓存
    wx.setStorage({
      key: 'isScheduleDetail',
      data: false,
      success: function() {
        wx.navigateTo({
          url: '../ScheduleTaskList/ScheduleTaskList',
        })
      }
    })

  },

  /**
 * @parameter projId项目id
 * 创建日程时显示项目的任务
 */
  getTasks: function (projId) {

    var that = this
    var TaskId = that.data.TaskId   // 关联的任务id数组
    var Task = Bmob.Object.extend("task")
    var taskQuery = new Bmob.Query(Task)
    var taskArr = []
    console.log('TaskId: '+TaskId)

    //查询出对应的任务看板的所有任务
    taskQuery.limit(20)
    taskQuery.equalTo("proj_id", projId)
    taskQuery.equalTo('is_delete', false) // 过滤掉已删掉的任务
    taskQuery.include("leader")           // 可以查询出leader
    taskQuery.ascending("end_time")       // 根据截止时间升序（越邻近排序最前面）
    taskQuery.find({
      success: function (tasks) {
        //在这里设置setdata
        console.log("获取到的任务: \n", tasks)  //已限定20个以内
        for (var i in tasks) {

          // 根据选中的列表取出名字和头像
          for (var j in TaskId) {
            if (tasks[i].id == TaskId[j]) {

              // 将关联的任务存进数组
              var taskObject = {}
              taskObject = {
                "task_id": tasks[i].id,  //任务id
                "task_title": tasks[i].get('title'),  //任务标题
                "userPic": tasks[i].get('leader').userPic || ''  //负责人头像
              }
              taskArr.push(taskObject)

            }
          }

        }

        //setData
        console.log('关联的任务数组：', taskArr)
        that.setData({
          connectTask: taskArr
        })
        wx.hideLoading()


      },
      error: function (error) {
        console.log("提示用户任务查询失败: " + error.code + " " + error.message);

      }
    })
  },

  /**
 * @parameter projId 项目id，content内容，
 * startTime开始时间(最好不能为空），endTime结束时间（最好不能为空），taskIds任务数组（可以为空）
 * 添加日程
 * 内部添加了调用通知项目成员的函数
 */
  createSchedule: function (projId, content, startTime, endTime, taskIds) {

    var that = this
    var Schedule = Bmob.Object.extend('schedule')
    var Scheduletask = Bmob.Object.extend('schedule_task')
    var schedule = new Schedule()

    //添加日程
    schedule.save({
      proj_id: projId,
      content: content,
      start_time: startTime,
      end_time: endTime,
      is_delete: false  //表示未删除
    }, {
        success: function (result) {
          //添加成功
          //通知其他项目成员
          var _type = 3  //通知类型
          // that.addProjectNotification(projId, ADD_SCHEDULE, _type, result.id/*创建的日程id*/)  //通知其他项目成员
          console.log("添加日程成功！")

          // 操作完成 ???
          wx.hideLoading()
          wx.navigateBack({
            url: '../Schedule/Schedule'
          })
          wx.showToast({
            title: '成功添加日程',
            icon: 'success',
            duration: 1000,
          })

        }, error: function (result, error) {

        }
      }).then(function (schedule) {
        //存储日程与任务的关联
        if (taskIds != null && taskIds.length > 0) {
          var objects = new Array()  //本地schedule_task数组
          for (var i = 0; i < taskIds.length; i++) {
            var taskid = taskIds[i]

            console.log("taskID", taskid)

            var task = Bmob.Object.createWithoutData("task", taskid)
            var cheduletaskObject = new Scheduletask()
            cheduletaskObject.set("schedule_id", schedule.id/*日程id*/)
            cheduletaskObject.set("task", task)
            objects.push(cheduletaskObject)
          }
          //批量添加
          Bmob.Object.saveAll(objects).then(function (objects) {
            // 成功添加关联任务
            console.log("成功添加关联任务！")

          },
            function (error) {
              // 异常处理
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

    wx.removeStorage({
      key: 'ScheduleDetail-scheduleDetail',
    })

    wx.showLoading({
      title: '正在加载',
      mask: 'true'
    })

    //需要任务列表，通过任务ID取任务名和任务执行者
    var that = this


    // 先获取任务详情，用于创建
    wx.getStorage({
      key: 'Project-detail',
      success: function (res) {

        // 存入数据
        that.setData({
          projectDetail: res.data
        })

        // 从缓存中拿关联的任务列表
        wx.getStorage({
          key: 'ScheduleTaskList-TaskId',
          success: function (res) {
            console.log('ScheduleTaskList-TaskId',res.data)

            // 选中关联任务数组不为空
            // 关联数组存进数据
            that.setData({
              TaskId: res.data
            })

            // 获取任务数组，根据选中的列表取出名字和头像
            that.getTasks(that.data.projectDetail.id)

          },
          fail: function(res) {
            // 选中的关联任务数组为空（不存在）
            console.log('!!! Fail to get storage "ScheduleTaskList-TaskId" : ', res)
            wx.hideLoading()
          },
        })

      },
      fail: function(res) {
        console.log('!!! Fail to get Project Detail from storage: ', res)
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
    wx.removeStorage({
      key: 'ScheduleTaskList-TaskId',
    })
    wx.removeStorage({
      key: 'isScheduleDetail',
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
