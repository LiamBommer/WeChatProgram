
var Bmob = require('../../../../utils/bmob.js')
var ADD_IDEA = "新增加了一个点子"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_task_list: '/img/task_list.png',
    icon_member: '/img/member.png',
    icon_add: '/img/add.png',

    TaskId: -1, // 关联任务的列表id

    projectDetail: '',  // 所在项目信息

    connectTask: {//关联任务

    },

    colors: [
      // 设计文档中的颜色
      '#79bd9a',  // light green
      '#576b95',  // blue
      '#e64340',  // red
      '#ffc952'   // yellow
    ],

  },


  // 关联任务
  connectTask: function (e) {

    // 设置创建页面标志缓存
    wx.setStorage({
      key: 'isIdeaDetail',
      data: false,
      success: function() {
        wx.navigateTo({
          url: '../IdeaTaskList/IdeaTaskList',
        })
      }
    })

  },

  //创建点子
  BuildIdea: function (e) {

    var that = this
    var content = e.detail.value.content.trim()
    var userId = getApp().globalData.userId
    var projectId = that.data.projectDetail.id
    var taskId = that.data.TaskId

    // 生成随机数
    var max = 3
    var min = 0
    var num = Math.floor(Math.random()*(max-min+1)+min);
    var color = that.data.colors[num]

    if(content == "" || content.length == 0) {
      wx.showToast({
        title: '点子内容不见咯',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    console.log('创建点子： \n')
    console.log('内容: ' + content)
    console.log('用户: ' + userId)
    console.log('任务: ' + taskId)
    console.log('项目id：'+ projectId)
    console.log('颜色: ' + color)

    wx.showLoading({
      title: '正在创建',
      mask: 'true'
    })
    // Submit
    that.createIdea(projectId,userId,content,taskId, color)
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
  * @parameter projId 项目id，userId用户id，content 点子内容(不能为空），taskId任务id（一个,并且可以不填）
  * 添加一个点子
  * 内部调用了addProjectNotification
  */
  createIdea: function (projId,userId,content,taskId, color){

    var that = this
    var Idea = Bmob.Object.extend('idea')
    var idea = new Idea()
    var user = Bmob.Object.createWithoutData("_User", userId)
    var project = Bmob.Object.createWithoutData("project", projId)
    if(taskId != -1)
    var task = Bmob.Object.createWithoutData("task", taskId)

    //添加点子的基本信息
    idea.save({
      user: user,      //用户
      project: project,  //项目
      content: content,   //点子内容
      task: task,        //关联的任务
      color: color,
      is_delete: false
    },{
      success: function(result){
        //添加成功
        //通知其他项目成员
        var _type = 5   //通知的类型
        that.addProjectNotification(projId, ADD_IDEA, _type, result.id/*创建的点子id*/)  //通知其他项目成员
        console.log("提示用户添加点子成功！",result)

        // 操作完成 ???
        wx.hideLoading()
        wx.navigateBack({
          url: '../Idea/Idea'
        })
        wx.showToast({
          title: '成功添加点子',
          icon: 'success',
          duration: 1000,
        })

      },
      error: function(object,error){
        //添加失败
        console.log("提示用户添加点子失败！", error)
      }
    })
  },

  /**
 * @parameter projId项目id
 * 创建点子时显示项目的任务
 */
  getTasks: function (projId) {

    var that = this
    var TaskId = that.data.TaskId   // 关联的任务id数组
    var Task = Bmob.Object.extend("task")
    var taskQuery = new Bmob.Query(Task)
    var taskArr = []

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
          if (tasks[i].id == TaskId) {

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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.setStorage({
      key: 'IdeaTaskList-TaskId',
      data: {},
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

    //需要任务列表，通过任务ID取任务名和任务执行者
    var that = this

    // 获取任务数组，根据选中的列表取出名字和头像
    wx.getStorage({
      key: 'Project-detail',
      success: function (res) {

        // 存入数据
        that.setData({
          projectDetail: res.data
        })

        that.getTasks(res.data.id)

      },
    })

    // 从缓存中拿关联的任务列表
    wx.getStorage({
      key: 'IdeaTaskList-TaskId',
      success: function (res) {

        // 选中关联任务数组不为空
        if (JSON.stringify(res.data) != '{}') {

          // console.log('Get        IdeaTaskList-TaskId           storage: ', res.data)
          // console.log('Storages length: ', res.data.length)

          // 关联数组存进数据
          that.setData({
            TaskId: res.data
          })

        } else {  // 选中的关联任务数组为空

          wx.hideLoading()

        }

      },

      fail: function(res) { // 未设置缓存
        console.log('Fail to get storage: ', res)
        wx.hideLoading()
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

    // 清空缓存列表

    // 页面标识
    wx.removeStorage({
      key: 'isIdeaDetail',
    })

    // 选中的任务列表id
    wx.removeStorage({
      key: 'IdeaTaskList-TaskId',
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
