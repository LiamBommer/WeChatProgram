// pages/Task/buildTask/buildTask.js
var Bmob = require('../../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deadline: '',//截止时间
    list_id: 0,  // 所属任务看板id
    taskMemberID:[],//任务成员id列表，第一位为任务负责人
    icon: '',//选中任务成员头像
  },

  // 截止时间
  DeadLineChange: function (e) {
    this.setData({
      deadline: e.detail.value
    })
  },

   // 添加成员
  AddMember: function () {
    var that = this
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
    var memberId = that.data.taskMemberID//任务成员ID数组
    console.log("创建任务memberId：", memberId)
    if (name == "" || name.length == 0 || memberId.length == 0) {
      wx.showToast({
        title: '请填写完整',
        icon:"none",
        duration:1500,
      })
      return;
    }
    wx.getStorage({
      key: "Project-detail",
      success: function(res) {
        console.log("BuildTask", res.data.id, that.data.list_id, name, memberId[0], end_time)
        
        that.createTask(res.data.id, that.data.list_id, name, memberId[0], end_time)
      },
    })


  },

  /**
   * 2018-05-19
   * @author mr.li
   * @parameter
   *  projId
      listId任务看板id，
      title任务名称
      memberId任务负责人ID
      endTime截止时间
   * 创建任务，成员id数组里面只需要id，endTime 的数据类型是string
   */
  createTask: function(projId ,listId, title, memberId, endTime){
    var that = this
    var Task = Bmob.Object.extend("task")
    var task = new Task()

    console.log('创建任务信息： \nListId: ' + listId + '\nTitle: ' + title + '\nMemberId: ' + memberId+'\nEndTime: '+endTime)

    var leaderId = memberId  //删除并返回第一个任务负责人的id
    var leader = Bmob.Object.createWithoutData("_User", leaderId)  //负责人,存储到数据库

    //添加任务
    task.save({
      list_id: listId,
      title: title,
      leader: leader,  // 数据库关联，用id可以关联一个user
      end_time: endTime,
      is_finish: false,
      has_sub: false,
      is_delete: false,
      proj_id: projId
    },{
      success: function(result){
        //添加成功
        //添加任务成员信息
        that.addTaskMembers(result.id/*任务id*/, leaderId, [])
        // 提示用户添加成功
        console.log("添加任务成功")
        wx.showToast({
          title: '添加任务成功',
          icon: 'success',
        })
        wx.navigateBack({
          url: "../../ProjectMore/ProjectMore"
        })

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
    //获取任务列表ID
    wx.getStorage({
      key: 'ProjectMore-TaskListId',
      success: function(res) {
        var list_id = res.data
        that.setData({
          list_id: list_id
        })
      },
    })
    //获取任务负责人图标
    var icon = wx.getStorageSync("buildTask-memberList-membericon")
    console.log(icon)
    if (icon == "")
      this.setData({
        icon: "/img/add_solid.png"
      })
    else {
      this.setData({
        icon: icon
      })
    }
    //获取任务成员
    wx.getStorage({
      key: 'buildTask-memberList-memeberId',
      success: function(res) {
        that.setData({
          taskMemberID:res.data
        })
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
