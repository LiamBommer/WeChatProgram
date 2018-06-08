
var Bmob = require('../../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_task_list: '/img/task_list.png',
    icon_member: '/img/member.png',
    icon_add: '/img/add.png',

    TaskId: {},   // 关联任务的列表id

    projectDetail: '',  // 所在项目信息

    connectTask: [//关联任务

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
    var content = e.detail.value.content
    console.log(content)

    wx.showLoading({
      title: '正在创建',
      mask: 'true'
    })
    // Submit
    // createIdea: function (projId,userId,content,taskIds=[])
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
  * @parameter projId 项目id，userId用户id，content 点子内容(不能为空），taskIds任务id数组（可以为空）
  * 添加一个点子
  */
  createIdea: function (projId,userId,content,taskIds=[]) {

    var that = this
    var Idea = Bmob.Object.extend('idea')
    var idea = new Idea()
    var user = Bmob.Object.createWithoutData("_User", userId)
    var project = Bmob.Object.createWithoutData("project", projId)
    //添加点子的基本信息
    idea.save({
      user: user,      //用户
      project: project,  //项目
      content: content,   //点子内容
    },{
      success: function(result){
        //添加成功
        //通知其他项目成员
        var _type = 5   //通知的类型
        that.addProjectNotification(projId, ADD_IDEA, _type, result.id/*创建的点子id*/)  //通知其他项目成员
        console.log("提示用户添加点子成功！")
      },
      error: function(error){
        //添加失败
        console.log("提示用户添加点子失败！")
        wx.hideLoading()
        wx.showToast({
          title: '创建失败，请稍后再试',
          duration: 1000
        })
        console.log(error)
      }
    }).then(function(idea){
      //添加点子与任务的关联
      if (taskIds != null && taskIds.length > 0) {
        var Ideatask = Bmob.Object.extend('idea_task')
        var objects = new Array()  //本地idea_taskk数组

        for (var i = 0; i < taskIds.length; i++) {
          var taskid = taskIds[i]
          var task = Bmob.Object.createWithoutData("task", taskid)
          var ideataskObject = new Ideatask()
          ideataskObject.set("proj_id", projId)
          ideataskObject.set("task", task)
          ideataskObject.set("idea_id", idea.id/*点子id*/)

          objects.push(ideataskObject)
        }
        //批量添加
        Bmob.Object.saveAll(objects).then(function (objects) {
          // 成功添加关联任务
          console.log("成功添加关联任务！")

          // success
          wx.hideLoading()
          wx.navigateBack({
            url: '../Idea/Idea'
          })
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 1000
          })

        },
        function (error) {
          // 异常处理
          console.log("添加关联任务失败！")

          wx.hideLoading()
          wx.showToast({
            title: '创建失败，请稍后再试',
            duration: 1000
          })
          console.log(error)

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

    wx.showLoading({
      title: '正在加载',
      mask: 'true'
    })

    //需要任务列表，通过任务ID取任务名和任务执行者
    var that = this

    // 从缓存中拿关联的任务列表
    wx.getStorage({
      key: 'IdeaTaskList-TaskId',
      success: function (res) {

        // 选中关联任务数组不为空
        if (JSON.stringify(res.data) != '{}') {

          // console.log('Get storage: ', res.data)
          // console.log('Storages length: ', res.data.length)

          // 关联数组存进数据
          that.setData({
            TaskId: res.data
          })

          // 获取任务数组，根据选中的列表取出名字和头像
          wx.getStorage({
            key: 'Project-detail',
            success: function (res) {

              that.getTasks(res.data.id)

              // 存入数据
              that.setData({
                projectDetail: res.data
              })

            },
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
    wx.setStorage({
      key: 'IdeaTaskList-TaskId',
      data: {},
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
