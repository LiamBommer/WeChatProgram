// pages/Task/buildTask/buildTask.js
var Bmob = require('../../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: '',//成员头像
    deadline: '',//截止时间
    list_id: 0,  // 所属任务看板id
  },

  // 截止时间
  DeadLineChange: function (e) {
    this.setData({
      deadline: e.detail.value
    })
  },

   // 添加成员
  AddMember: function () {
    var icon = this.data.icon
    wx.setStorageSync("buildTask-membericon", icon)
    wx.navigateTo({
      url: './memberList/memberList',
    })
  },

  //提交表单
  BuildTask:function(e){
    var that = this
    console.log('Form data: ' + JSON.stringify(e.detail.value));
    // data validate
    var name = e.detail.value.name
    var end_time = e.detail.value.time
    if(name == "" || name.length == 0) {
      console.log('Task name CANNOT be NULL')
      return;
    }

    // data submit
    var myId = getApp().globalData.userId
    var memberIds = []
    memberIds.push(myId)
    that.createTask(that.data.list_id, name, memberIds, end_time)

    wx.navigateBack({
      url: "../../ProjectMore/ProjectMore"
    })
    wx.showToast({
      title: '添加任务成功',
      icon: 'success',
    })
  },

  /**
   * 2018-05-19
   * @author mr.li
   * @parameter
      listId任务看板id，
      title任务名称
      memberIds成员id数组，包括创建者自己（第一个）
      endTime截止时间
   * 创建任务，成员id数组里面只需要id，endTime 的数据类型是string
   */
  createTask: function(listId, title, memberIds, endTime){
    var that = this
    var Task = Bmob.Object.extend("task")
    var task = new Task()

    console.log('创建任务信息： \nListId: '+listId+'\nTitle: '+title+'\nMemberIds: '+memberIds+'\nEndTime: '+endTime)

    var leaderId = memberIds.shift()  //删除并返回第一个任务负责人的id
    var leader = Bmob.Object.createWithoutData("_User", leaderId)  //负责人,存储到数据库

    //添加任务
    task.save({
      list_id: listId,
      title: title,
      leader: leader,  // 数据库关联，用id可以关联一个user
      end_time: endTime,
      is_finish: false,
      has_sub: false,
      is_delete: false
    },{
      success: function(result){
        //添加成功
        //添加任务成员信息
        that.addTaskMembers(result.id/*任务id*/, leaderId, memberIds)
        // 提示用户添加成功
        console.log("添加任务成功")
      },
      error: function(result,error){
        //添加失败
        console.log("添加任务失败！",error)
        //提示用户添加失败
      }
    })

  },

  /**
 * 2018-05-19
 * @author mr.li
 * @parameter taskId任务id，leaderId任务负责人id，memberIds除负责人以外的任务成员id数组
 * 为任务添加成员
 */
  addTaskMembers:function (taskId, leaderId, memberIds){
    var that = this
    var TaskMember = Bmob.Object.extend("task_member")

    var leader = Bmob.Object.createWithoutData("_User", leaderId);
      var memberObjects = []
    
    var taskMember = new TaskMember()
    taskMember.set('task_id', taskId)
    taskMember.set('user_id', leader)
    memberObjects.push(taskMember)  //添加任务负责人id

    for(var i= 0;i<memberIds.length;i++){
    var taskMember = new TaskMember()
    var member = Bmob.Object.createWithoutData("_User", memberIds[i]);
    taskMember.set('task_id', taskId)
    taskMember.set('user_id', member)
    memberObjects.push(taskMember)  //添加任务成员
}

//批量添加任务成员
Bmob.Object.saveAll(memberObjects).then(function (memberObjects) {
  // 成功
  console.log("批量添加任务成员成功！")
},
  function (error) {
    // 异常处理
    console.log("批量添加任务成员成功！", error)
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
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
      key: 'ProjectMore-TaskListId',
      success: function(res) {
        var list_id = res.data
        that.setData({
          list_id: list_id
        })
      },
    })

    var icon = wx.getStorageSync("buildTask-memberList-membericon")
    console.log(icon)
    if(icon == "")
    this.setData({
      icon: "/img/add_solid.png"
    })
    else{
      this.setData({
        icon: icon
      })
    }

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
   wx.removeStorageSync("buildTask-memberList-membericon")
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
