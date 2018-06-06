// pages/editMemberList/editMemberList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //初始化项目成员
    InitProjectMember:[],
    //项目成员
    ProjectMember: [

    ],

  },



  //点击成员复选框
  clickCheck: function (e) {
    var that = this
    var checked = !e.currentTarget.dataset.checked//当前成员的选中情况
    var id = e.currentTarget.dataset.id//当前成员的id
    var index = e.currentTarget.dataset.index//当前成员下标
    var ProjectMember = that.data.ProjectMember//成员列表

    for (var i in ProjectMember){
         if(i == index)
         {
           ProjectMember[i].checked = !ProjectMember[i].checked
         }
    }

    //获取选中的成员ID
    that.setData({
      ProjectMember: ProjectMember,

    });
  },


  //完成
  save: function () {
    var that = this
    var memberId = that.data.memberId//选中的成员下标
    var ProjectMember = that.data.ProjectMember//项目成员
    var InitProjectMember = that.data.InitProjectMember//项目成员
    var memberIds = []//新添加的任务成员ID数组
    var NomemberIds = []//新删除的任务成员ID数组

    console.log("InitProjectMember", InitProjectMember)
    console.log("ProjectMember", ProjectMember)
    
    for (var i in InitProjectMember){
        if (InitProjectMember[i].checked != ProjectMember[i].checked)//有更改
        {
          //新添加的成员id
          if (ProjectMember[i].checked == true){
            memberIds.push(ProjectMember[i].id)
          }
          //新删除的成员id
          else if (ProjectMember[i].checked == false) {
            NomemberIds.push(ProjectMember[i].id)
          }
        }
    }
    console.log("选中的成员ID", memberIds)
    console.log("未选中的成员ID", NomemberIds)

    //获取任务ID
    wx.getStorage({
      key: 'TaskDetail-memberList-TaskId',
      success: function(res) {
        var userName = getApp().globalData.nickName
        var taskId = res.data
        //  that.taskMemberDelete(taskId, NomemberIds, userName)//删除任务成员
        if (memberIds == "" && NomemberIds == "")//无成员变化
        {
          wx.navigateBack({
            url: "../../memberList/memberList"
          })
        }
        else {
          that.addTaskMember(taskId, memberIds, userName)//添加任务成员
          that.taskMemberDelete(taskId, NomemberIds, userName)//删除任务成员
        }
      },
    })
  },

  /**
 * 2018-06-02
 *  @parameter taskId 任务id,memberIds新删除的任务成员ID数组,userName用户昵称（记录操作用）
 * 删除任务成员
 */
  taskMemberDelete: function (taskId, memberIds, userName) {
    var that = this
    var Taskmember = Bmob.Object.extend('task_member')
    var taskmemberQuery = new Bmob.Query(Taskmember)
    if (memberIds != null && memberIds.length > 0) {
      taskmemberQuery.equalTo('task_id', taskId)
      taskmemberQuery.containedIn('user_id', memberIds)
      //删除任务成员,一次最多删除50条
      taskmemberQuery.destroyAll({
        success: function () {
          //删除成功
          console.log("删除成功！")
          //记录操作
          that.addTaskRecord(taskId, userName, DELETE_TASK_MEMBER)

          console.log("删除任务成员成功！")
          wx.showToast({
            title: '删除成功',
          })
          wx.navigateBack({
            url: "../../memberList/memberList"
          }) 
        },
        error: function (err) {
          // 删除失败
        }
      })
    }
  },
  /**
 * 2018-06-02
 * @parameter taskId 任务id,memberIds新添加的任务成员id数组,userName用户昵称（记录操作用）
 * 额外添加任务成员
 */
  addTaskMember:function (taskId, memberIds, userName){
    console.log("添加的成员",memberIds)
    var that = this
    var Taskmember = Bmob.Object.extend('task_member')
    var memberObjects = []
    
    if(memberIds!=null && memberIds.length > 0) {
      for (var i = 0; i < memberIds.length; i++) {
        var user = Bmob.Object.createWithoutData("_User", memberIds[i])
        var taskmember = new Taskmember()
        taskmember.set('user_id', user)
        taskmember.set('task_id', taskId)
        memberObjects.push(taskmember)
      }
      if (memberObjects != null && memberObjects.length > 0) {
        Bmob.Object.saveAll(memberObjects).then(function (memberObjects) {
          // 成功
          //记录操作
          that.addTaskRecord(taskId, userName, ADD_TASK_MEMBER)
          
          console.log("添加任务成员成功！")
          wx.showToast({
            title: '添加成功',
          })
          wx.navigateBack({
            url: "../../memberList/memberList"
          })

        },
          function (error) {
            // 异常处理
            console.log(error)
          })
      }


    }

    console.log("NomemberId", NomemberId);//未选中的成员ID
    // that.deleteProjectMember(projId, NomemberId)

    wx.navigateBack({
      url: '../ProjectDetail',
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
        var memberList = res.data
        console.log('EditMemberList: ', memberList)
        that.setData({
          InitProjectMember: memberList,
          ProjectMember: memberList,
        });
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
