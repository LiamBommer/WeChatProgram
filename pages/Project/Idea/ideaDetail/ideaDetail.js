
var Bmob = require('../../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    icon_task_list: '/img/task_list.png',
    icon_member: '/img/member.png',
    icon_add: '/img/add.png',
    icon_close: '/img/close.png',
    icon_share: '/img/share.png',
    icon_project: '/img/project.png',

    // 此条点子的详情
    ideaId: -1,
    content: '',
    userName: '',
    userPic: '',
    projectName: '',
    taskId: -1,
    taskTitle: '',
    createdAt: '',

    projectDetail: ''

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
          that.deleteOneIdea(that.data.projectDetail.id, that.data.ideaId)

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
          key: 'IdeaDetail-taskId',
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
  * @parameter projId项目id，ideaId
  * 删除某个点子
  * 内部调用了addProjectNotification
  */
  deleteOneIdea: function (projId, ideaId){

    var Idea = Bmob.Object.extend('idea')
    var ideaQuery = new Bmob.Query(Idea)

    //删除某个点子
    ideaQuery.equalTo('objectId',ideaId)
    ideaQuery.destroyAll({
      success: function () {
        //删除成功
        //通知项目其他成员
        var _type = 5  //通知类型
        // that.addProjectNotification(projId,DELETE_IDEA , _type, ideaId/*点子id*/)  //通知其他项目成员

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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

   var that = this

    wx.showLoading({
      title: '正在加载',
      mask: 'true'
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

   var that = this

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
    wx.removeStorageSync("ideaDetail-Content-content")
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
