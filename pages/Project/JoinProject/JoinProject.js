
const Bmob = require('../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectShareId: -1,
    projectName: '',
    projectImgUrl: '',
    projectLeaderName: '',
    currentUserId: -1,
  },

  /**
   * 点击按钮，确认加入项目
   */
  confirm: function() {

    wx.showLoading({
      title: '正在加入...',
    })
    // submit
    console.log('加入项目id：' + this.data.projectShareId + '\n用户id：' + this.data.currentUserId)
    this.joinProject(this.data.projectShareId, this.data.currentUserId)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 查询项目相关信息
   */
  getProjectInfo: function (projectId) {

    var that = this
    var Project = Bmob.Object.extend("project")
    var projectQuery = new Bmob.Query(Project)

    projectQuery.equalTo("objectId", projectId)
    projectQuery.first({
      success: function (result) {
        // 信息存储
        console.log("Project Info: \n")
        console.log(result)
        that.setData({
          projectName: result.get('name'),
          projectImgUrl: result.get('img_url'),
          projectLeaderName: result.get('leader_name'),
        })
      },
      error: function (error) {
        wx.showToast({
          title: '查询' + result.get('name') + '失败',
        })
      }
    })

  },

  /**
   * 加入项目
   */
  joinProject: function (projectId, userId) {

    var that = this
    var ProjectMember = Bmob.Object.extend('proj_member')
    var projectmember = new ProjectMember()
    var projectmemberQuery = new Bmob.Query(ProjectMember)

    projectmemberQuery.equalTo("proj_id", projectId)
    projectmemberQuery.equalTo("user_id", userId)
    projectmemberQuery.first({
      success: function (result) {
        if (result == null) {

          // 未在项目中，加入项目
          var project = Bmob.Object.createWithoutData('project',projectId)  //与项目关联，可用来优化项目页获取用的项目信息
          projectmember.save({
            proj_id: projectId,
            user_id: userId,
            is_leader: false,
            project: project,
            is_first: false,  // 用来标记每个用户的星标项目 mrli

          }, {
              success: function (result) {
                // 加入成功
                // 反馈
                wx.hideLoading()
                wx.showToast({
                  title: '加入' + that.data.projectName + '成功！',
                  duration: 1000,
                })
                wx.switchTab({
                  url: '../Project',
                })
              },
              error: function (result, error) {
                // 添加失败
              }
            })           
        } else {
          // 已在项目中
          wx.hideLoading()
          wx.showToast({
            title: '你已在项目中！',
            duration: 1000,
          })
          //跳转的项目主页
          wx.switchTab({
            url: '../Project / Project',
          })

        }
      },
      error: function (error) {
          //失败
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

    // 取当前用户id
    var currentUserId = getApp().globalData.userId
    that.setData({
      currentUserId: currentUserId
    })

    // 取项目信息
    wx.getStorage({
      key: 'Project-share-id',
      success: function (res) {
        // 查询项目相关信息
        that.getProjectInfo(res.data)
        that.setData({
          projectShareId: res.data
        })
        console.log("projectShareId", res.data)
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