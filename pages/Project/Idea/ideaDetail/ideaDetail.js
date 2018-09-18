
var Bmob = require('../../../../utils/bmob.js')
var DELETE_IDEA = "删除了一个点子"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //数据分析
    projectName: '',
    ideaContent: '',
    userName: '',
    userId: '',

    icon_task_list: '/img/task_list.png',
    icon_member: '/img/member.png',
    icon_add: '/img/add.png',
    icon_close: '/img/close.png',
    icon_share: '/img/share.png',
    icon_project: '/img/taskdetail-project.png',

    // 此条点子的详情
    ideaId: -1,
    content: '加载中',
    userName: '',
    userPic: '',
    projectName: '加载中',
    taskId: -1,
    taskTitle: '',
    createdAt: '',
    projId:''  ,    //mrli 添加，接受通知跳转传过来的id
    projectDetail: '',

    // 是否从分享页面进入的标识
    isShared: false,  

  },

  //点子内容
  Content:function(){
    wx.setStorageSync("ideaDetail-content", this.data.content)
    wx.navigateTo({
      url: './Content/Content',
    })
  },

  onShareAppMessage: function() {

    var that = this
    var currentUserName = getApp().globalData.nickName

    // 分享
    return {
      title: currentUserName + '给你分享了一个点子',
      path: "pages/Project/Idea/ideaDetail/ideaDetail",
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
        })
      },
    }

  },

  //删除
  Delete: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除此点子吗',
      success: function (res) {
        if (res.confirm) {//点击确定

          wx.showLoading({
            title: '正在删除',
            mask: 'true'
          })
          // Submit
          if(!that.data.isShared){
            that.deleteOneIdea(that.data.projectDetail.id, that.data.ideaId)
          }else{
            //为了防止别人乱删除被分享的点子，所以通知用户到小程序中删除
            wx.showToast({
              title: '不能在分享页面删除哟~',
              icon: 'none'
              //image:''  //可以加图片
            })
          }
          

        }
        else {//点击取消

        }
      }
    })
  },

  // 关联任务
  connectTask: function (e) {

    var that = this

    // 设置标识，进入人物列表后完成即保存
    wx.setStorage({
      key: 'isIdeaDetail',
      data: true,
      success: function () {

        wx.setStorage({
          key: 'IdeaDetail-oriTaskId',
          data: that.data.taskId,
          success: function() {

            wx.navigateTo({
              url: '../IdeaTaskList/IdeaTaskList',
            })

          }
        })

      }

    })
  },


  /**
  * @parameter ideaId
  * 获取与某个点子详情，包括关联的任务
  * {
  *  'id' :  //点子id
  *  'taskId' //任务id
  * 'taskTitle'  //任务名称
  * 'projectName'  //项目名称
  * 'content'  //点子内容
  * 'createdAt'  //点子创建时间
  * 'taskUserPic'  //任务负责人头像
  * }
  */
  getOneIdeaDetail: function (ideaId){

    var that = this
    var Idea = Bmob.Object.extend('idea')
    var ideaQuery = new Bmob.Query(Idea)
    var ideaObject = {}
    //获取某个点子详情，包括关联的任务

    ideaQuery.include('task')
    ideaQuery.include('task.leader')
    ideaQuery.include('project')
    ideaQuery.include('user')
    ideaQuery.get(ideaId,{
      success: function(results){
        console.log('获取的点子：', results)
        //成功

        ideaObject = {
          'id': ideaId,   //点子id
          'projectName': results.get('project').name || '', //项目名称
          'content': results.get('content') || '',  //点子内容
          'userName': results.get('user').nickName || '', //发布人的名字(真正的昵称，而不是其他名字)
          'userPic': results.get('user').userPic || '',//发布人的头像
          'createdAt': results.createdAt || '',  //点子创建时间

          'taskId': -1,
          'taskTitle': '',
          'taskUserPic': '',
        }

        //判断任务是否已删除
        if(results.get('task') != undefined && results.get('task').is_delete != true){
            ideaObject.taskId = results.get('task') != null && results.get('task').is_delete != true ? results.get('task')
            .objectId : ''//关联的任务id

            ideaObject.taskTitle = results.get('task') != null && results.get('task').is_delete != true ? results.get
            ('task').title : ''  //关联的任务名称

          if (results.get('task').leader != null){
            ideaObject['taskUserPic'] = results.get('task').leader.userPic
          }
        }
        //获取的点子详情，ideaObject
        console.log('获取的点子详情:', ideaObject)

        that.setData({
          ideaId: ideaId,
          content: ideaObject.content,
          userName: ideaObject.userName,
          userPic: ideaObject.userPic,
          projectName: ideaObject.projectName,
          taskId: ideaObject.taskId,
          taskTitle: ideaObject.taskTitle,
          taskUserPic: ideaObject.taskUserPic,
          createdAt: ideaObject.createdAt
        })
        wx.hideLoading()

      },

      error: function(error){
        //失败
        console.log('获取某个点子详情失败!')
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
  * @parameter projId项目id，ideaId
  * 删除某个点子
  * 内部调用了addProjectNotification
  */
  deleteOneIdea: function (projId, ideaId){
    var that = this
    var Idea = Bmob.Object.extend('idea')
    var ideaQuery = new Bmob.Query(Idea)

    //删除某个点子
    //ideaQuery.equalTo('objectId',ideaId)
    ideaQuery.get(ideaId,{
      success: function (result) {
        result.set('is_delete',true)
        result.save()
        //删除成功
        //通知项目其他成员
        var _type = 5  //通知类型
        that.addProjectNotification(projId,DELETE_IDEA , _type, ideaId/*点子id*/)  //通知其他项目成员

        console.log('删除某个点子成功!')

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
      error: function (err) {
        // 删除失败
        console.log('删除某个点子失败!')
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
   * 分享页面按钮，回到首页
   */
  showScheduleList: function () {
    wx.switchTab({
      url: '/pages/Project/Project',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 接收页面参数，判断是否从分享进入
    console.log('页面参数', options)
    if (options.isShared) {
      this.setData({
        isShared: options.isShared,
        ideaId: options.ideaId,
      })
    }

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


    //获取【通知】的点子ID
    var requestId = wx.getStorageSync("Notification-ideaId")
    var projId = wx.getStorageSync("Notification-projId")
    //获取分享的标识
    var isShared = this.data.isShared


    //获取【我的】的点子ID
    var MineRequestId = wx.getStorageSync("Mine-ideaId")
    var MineProjId = wx.getStorageSync("Mine-projId")
    
    if (requestId != "" && projId != '') {
    //从【通知】进入
      console.log("获取通知的点子ID", requestId, projId)
      wx.setStorageSync('ProjectMore-ideaDetail-id', requestId)   //点进关联任务 ，要用到这个缓存，所以这里先设置
      that.setData({
        ideaId: requestId,
        projId: projId
      })
      that.getOneIdeaDetail(requestId)
      
    }
    else if (MineRequestId != "" && MineProjId != '') {
      //从【我的】进入
      console.log("获取通知的点子ID", MineRequestId, MineProjId)
      wx.setStorageSync('ProjectMore-ideaDetail-id', MineRequestId)   //点进关联任务 ，要用到这个缓存，所以这里先设置
      that.setData({
        ideaId: MineRequestId,
        projId: MineProjId
      })
      that.getOneIdeaDetail(MineRequestId)
    }
    else if(isShared) {
    //从分享进入
      var ideaId = that.data.ideaId
      that.getOneIdeaDetail(ideaId)
    }
    else{
      // 获取点子id，进行查询
      wx.getStorage({
        key: 'ProjectMore-ideaDetail-id',
        success: function (res) {
          that.setData({
            ideaId: res.data
          })
          // Get idea detail
          that.getOneIdeaDetail(res.data)
        }
      })
    }
    //mr li 注释了下面的代码
    // // 获取项目id，通知用
    // wx.getStorage({
    //   key: 'Project-detail',
    //   success: function (res) {
    //     that.setData({
    //       projectDetail: res.data
    //     })
    //   }
    // })

    

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

    //  点子内容修改
    wx.removeStorageSync("ideaDetail-content")

    // 给关联任务页的标识
    wx.removeStorageSync('isIdeaDetail')

    // 本点子详情缓存
    // wx.removeStorageSync('IdeaDetail-ideaDetail')

    // 本点子id
    wx.removeStorageSync('ProjectMore-ideaDetail-id')

    // 本点子任务的id
    wx.removeStorageSync('IdeaDetail-oriTaskId')
    //清除通知带来的缓存
    wx.removeStorageSync('Notification-ideaId')
    wx.removeStorageSync('Notification-projId')

    
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

    var that = this
    var currentUserName = getApp().globalData.nickName
    var content = that.data.content
    var ideaId = that.data.ideaId

    //数据分析
    var projectName = that.data.projectName
    that.setData({
      projectName: projectName,
      ideaContent: content,
      userName: getApp().globalData.nickName,
      userId: getApp().globalData.userId,
    })

    // 分享
    return {
      title: currentUserName + '分享了点子: ' + content,
      path: "pages/Project/Idea/ideaDetail/ideaDetail?isShared=true&ideaId=" + ideaId,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
        })
      },
    }

  }
})
