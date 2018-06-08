Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_task_list: '/img/task_list.png',
    icon_member: '/img/member.png',
    icon_add: '/img/add.png',

    connectTask: [//关联任务

    ],
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
              url: '../IdeaTaskList/IdeaTaskList',
            })
          }
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
