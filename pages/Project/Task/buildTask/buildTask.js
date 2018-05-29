// pages/Task/buildTask/buildTask.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon: '',//成员头像
    deadline: '',//截止时间
    list_id: -1,  // 所属任务看板id
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
    var memberIds = {}
    that.createTask(that.list_id, name, memberIds, end_time)

    wx.navigateBack({
      url:"../../ProjectMore/ProjectMore"
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

    var Task = Bmob.Object.extend("task")
    var task = new Task()

    var leaderId = memberIds.shift()  //删除并返回第一个任务负责人的id
    var leader = Bmob.Object.createWithoutData("_User", leaderId)  //负责人,存储到数据库
    //添加任务
    task.save({
      list_id: listId,
      title: title,
      leader: leader,  // 数据库关联，用id可以关联一个user
      end_time: endTime,
      is_finish: false,
      has_sub: false
    },{
      success: function(result){
        //添加成功
        //添加任务成员信息
        // addTaskMembers(result.id/*任务id*/, leaderId, memberIds)
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('List ID: ' + options.list_id)
    this.setData({
      list_id: options.list_id
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
