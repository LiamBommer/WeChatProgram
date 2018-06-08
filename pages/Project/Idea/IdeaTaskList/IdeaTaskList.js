// pages/memberList/memberList.js
var Bmob = require('../../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 用于从缓存中获取本项目id
    projectDetail: '',

    // checkbox 选中列表
    TaskId: {},

    // tasklist 后面代码自动添加
    tasklist: [],

    // 验证是否从日程详情页进入，
    //  true则完成并保存
    //  false则不修改
    isIdeaDetail: false,

    // 日程详情页进入的话
    // 日程的详情
    ideaDetail: {},

  },

  //选择项目成员
  ProjectTaskChange: function (e) {
    this.setData({
      TaskId: e.detail.value,
    });
  },

  //完成
  Finish: function () {

    wx.showLoading({
      title: '正在加载',
      mask: 'true'
    })

    var that = this
    var TaskId = that.data.TaskId //被选中的任务ID


    // 从点子详情页进入，需要修改任务列表至点子
    if (that.data.isIdeaDetail == true) {

      // 获取数据
      var projId = that.data.projectDetail.id
      var ideaId = that.data.ideaDetail.ideaId
      var oldTaskIds = that.data.ideaDetail.taskIds

      // Submit
      // that.modifyRelatedTasks(projId, ideaId, oldTaskIds, TaskId)


    // 从日程创建页进入，只需要设置缓存
    } else {

      wx.hideLoading()
      // 将获取的任务id存进缓存
      wx.setStorage({
        key: 'IdeaTaskList-TaskId',
        data: TaskId,
        success: function () {
          wx.navigateBack({
            url: '../addIdea/addIdea',
          })
          wx.showToast({
            title: '关联成功',
            icon: 'success',
            duration: 1000
          })
        }
      })

    }

  },

  /**
  * 获取任务列表
  * 2018-06-04
  * 根据项目id获取所有任务看板的id和标题
  * （函数内还默认会获取第一个看板的所有任务）
  */
  getTaskLists: function (projId) {

    var that = this
    var TaskList = Bmob.Object.extend('task_list')
    var tasklistQuery = new Bmob.Query(TaskList)

    //查询所有的任务列表
    tasklistQuery.ascending('createdAt')   //最先创建的排序最前面
    tasklistQuery.equalTo('proj_id', projId)
    tasklistQuery.notEqualTo("is_delete", true)

    //第一次默认添加任务看板
    console.log("TaskList: ", TaskList)
    tasklistQuery.find({

      success: function (results) {
        //这里设置setdata
        console.log('Successfully got task lists: \n  ' + JSON.stringify(results));

        console.log("getTaskLists:", results)
        //results的第一个是最早创建的
        var listIndex = 0;

        var taskList = []
        // 循环获取任务看板的任务
        for (var i = 0; i < results.length; i++) {
          var object
          var task = new Array()
          object = {
            title: results[i].attributes.title,
            is_delete: results[i].attributes.is_delete,
            listId: results[i].id,
            tasks: task,
          }
          taskList.push(object)
          that.getTasks(results[i].id, i, taskList)
        }

      },
      error: function (error) {

      }
    })

  },

  /**
   * 2018-05-19
   * @author mr.li
   * @parameter
      listId 任务看板对应的id
      listIndex 任务看板所在数组下标
      tasklists 任务看板列表
   * 获取对应任务看板的所有任务（20条），数组
   * 每个任务为object类型
   */
  getTasks: function (listId, listIndex, tasklists) {

    console.log('查询任务信息：\nlistId: ' + listId + '\nlistIndex: ' + listIndex)

    var that = this
    var Task = Bmob.Object.extend("task")
    var TaskId = that.data.TaskId
    var taskQuery = new Bmob.Query(Task)

    //查询出对应的任务看板的所有任务
    taskQuery.limit(20)
    taskQuery.equalTo("list_id", listId)
    taskQuery.notEqualTo("is_delete", true)
    taskQuery.include("leader")  //可以查询出leader
    taskQuery.ascending("end_time")  //根据截止时间升序（越邻近排序最前面）
    taskQuery.find({
      success: function (tasks) {
        console.log("共查询到任务 " + tasks.length + " 条记录");
        console.log('任务：')
        console.log(tasks)

        // 将任务插入到对应看板列表中
        for (var i in tasks) {

          // 判断是否在选中的关联列表中
          tasks[i].checked = false
          for (var j in TaskId) {
            if (TaskId[j] == tasks[i].id) {
              tasks[i].checked = true
              break
            }
          }

          var object
          object = {
            // end_time: tasks[i].attributes.end_time,
            // has_sub: tasks[i].attributes.has_sub,
            is_delete: tasks[i].attributes.is_delete,
            is_finish: tasks[i].attributes.is_finish,
            // list_id: tasks[i].attributes.list_id,
            // timeStatus: tasks[i].attributes.timeStatus,
            title: tasks[i].attributes.title,
            // leaderId: tasks[i].attributes.leader.objectId,
            leaderPic: tasks[i].attributes.leader.userPic,
            objectId: tasks[i].id,
            checked: tasks[i].checked,  // 上一个页面中勾选的关联任务
          }
          tasklists[listIndex].tasks.push(object)
        }
        // console.log("tasklists:", tasklists[listIndex])

        that.setData({
          tasklist: tasklists
        })
        console.log("获取到的 tasklists:", that.data.tasklist)

        // 数据获取完成
        wx.hideLoading()

      },
      error: function (error) {
        console.log("提示用户任务查询失败: " + error.code + " " + error.message);

      }
    })

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this

    // 从缓存中判断是否从详情页进入
    wx.getStorage({
      key: 'isIdeaDetail',
      success: function (res) {
        that.setData({
          isIdeaDetail: res.data
        })
      }
    })

    if(that.data.isIdeaDetail == true) {
      // 详情页
      // 获取本日程的详情
      wx.getStorage({
        key: 'IdeaDetail-ideaDetail',
        success: function(res) {
          that.setData({
            ideaDetail: res.data,
            TaskId: res.data.taskIds
          })
        },
      })

    } else {
      // 创建页
      // 获取关联任务列表里的数据
      wx.getStorage({
        key: 'IdeaTaskList-TaskId',
        success: function(res) {
          that.setData({
            TaskId: res.data
          })
        },
      })
    }

    // 从缓存获取项目信息
    wx.getStorage({
      key: 'Project-detail',
      success: function (res) {

        that.setData({
          projectDetail: res.data
        })

        // 获取项目下任务列表以及任务
        that.getTaskLists(that.data.projectDetail.id)

      },
    })

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

    wx.showLoading({
      title: '正在加载',
      mask: 'true'
    })

    var that = this

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
