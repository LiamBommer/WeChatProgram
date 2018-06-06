// pages/changePrincepal/changePrincepal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    selectedMemberId: "",
    //任务成员
    TaskMemember: [
      // {
      //   index: 0,
      //   icon:"/img/me.png",
      //   name: '帅涛' ,
      //   checked: true,
      // },
      // {
      //   index: 1 ,
      //   icon: "/img/me.png",
      //   name: '美国队长',
      //   checked: false,
      // },
      // {
      //   index: 2,
      //   icon: "/img/me.png",
      //   name: '灭霸',
      //   checked: false,
      // },
    ],

  },

  //选择任务成员
  radioChange: function (e) {
    console.log("radioChange",e.detail.value)
    this.setData({
      selectedMemberId: e.detail.value,
    });
  },

  // 更改完成
  save: function() {
    var that = this
    
    var newLeaderId = that.data.selectedMemberId// 获取新选中的负责人Id
    var userName = getApp().globalData.nickName// 获取当前操作者名字

    //获取任务ID
    wx.getStorage({
      key: 'TaskDetail-memberList-TaskId',
      success: function (res) {
        var taskId = res.data
        console.log("transferTaskLeader", taskId, newLeaderId)
        // 传送后台确认更改，返回
        that.transferTaskLeader(taskId, newLeaderId,userName)
      },
    })
  },

  /**
 * 2018-06-02
 * 变更任务负责人 userName当前操作者名字
 */
  transferTaskLeader: function (taskId, newLeaderId, userName) {
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)
    var user = Bmob.Object.createWithoutData("_User", newLeaderId)

    //变更任务负责人
    taskQuery.get(taskId, {
      success: function (result) {
        //成功
        result.set('leader',user)
        result.save()
        //记录操作
        that.addTaskRecord(taskId, userName, MODIFY_TASK_LEADER)

        console.log("变更任务负责人成功！")
        wx.showToast({
          title: '变更任务负责人成功',
        })
        wx.navigateBack();
      },
      error: function (error) {
        //失败
        console.log("变更任务负责人失败！")
      }
    })
  },


  /**
  *添加任务记录
  */
  addTaskRecord: function (taskId, userName, record) {
    var that = this
    var TaskRecord = Bmob.Object.extend('task_record')
    var taskrecord = new TaskRecord()

    //存储任务记录
    taskrecord.save({
      user_name: userName,
      task_id: taskId,
      record: userName + record
    }, {
        success: function (result) {
          //添加成功

        },
        error: function (result, error) {
          //添加失败

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
    wx.getStorage({
      key: 'TaskDetail-member',
      success: function (res) {
        console.log(res.data)
        that.setData({
          TaskMemember: res.data
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
