
var Bmob = require('../../../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: '',
    ideaId: -1,
    projectId: -1,
  },

  save: function(e){

    var that = this
    var record = e.detail.value.record
    var ideaId = that.data.ideaId
    var projectId = that.data.projectId

    if(record == this.data.record) {
      // 未做改动

      wx.navigateBack({
        url:'../ideaDetail/ideaDetail'
      })
      return;

    } else {

      wx.showLoading({
        title: '正在修改...',
        mask: 'true'
      })

      // Submit
      that.modifyIdeaContent(projectId, ideaId, record)

    }

  },


  /**
  * @parameter projId项目id，ideaId点子id ，newContent
  * 修改点子内容,内部调用了addProjectNotification
  */
  modifyIdeaContent: function (projId,ideaId,newContent){

    var that = this
    var Idea = Bmob.Object.extend('idea')
    var ideaQuery = new Bmob.Query(Idea)

    ideaQuery.get(ideaId,{
      success: function(result){
        result.set('content',newContent)
        result.save()
        //修改成功
        //通知其他项目成员
        var _type = 5   //通知的类型
        // that.addProjectNotification(projId, MODIFY_IDEA_CONTENT, _type, ideaId)  //通知其他项目成员
        console.log('提示用户修改成功！')

        wx.hideLoading()
        wx.navigateBack({
          url:'../ideaDetail/ideaDetail'
        })
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        })

      },
      error: function(error){
        //修改失败
        console.log('提示用户修改失败！', error)

        wx.hideLoading()
        wx.showToast({
          title: '修改失败',
          duration: 1000
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

    // 点子内容
    wx.getStorage({
      key: 'ideaDetail-content',
      success: function(res) {
        that.setData({
          record: res.data
        })
      }
    })

    // 点子id
    wx.getStorage({
      key: 'ProjectMore-ideaDetail-id',
      success: function(res) {
        that.setData({
          ideaId: res.data
        })
      }
    })

    // 项目id
    wx.getStorage({
      key: 'Project-detail',
      success: function(res) {
        that.setData({
          projectId: res.data.id
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
    wx.removeStorageSync("ideaDetail-content")
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
