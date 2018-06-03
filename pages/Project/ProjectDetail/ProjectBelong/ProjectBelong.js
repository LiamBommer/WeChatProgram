// pages/Project/ProjectDetail/ProjectBelong/ProjectBelong.js

var Bmob = require('../../../../utils/bmob.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    memberIndex:'',//选中的成员
    //项目成员
    ProjectMemember: [
      {
        id: 0,
        icon: "/img/me.png",
        name: '帅涛',
        checked: true,
      },
      {
        id: 1,
        icon: "/img/me.png",
        name: '钢铁侠',
        checked: false
      },
      {
        id: 2,
        icon: "/img/me.png",
        name: '美国队长',
        checked: false,
      },
      {
        id: 3,
        icon: "/img/me.png",
        name: '灭霸',
        checked: false,
      },
    ],
  },

  //选择项目成员
  ProjectMememberChange: function (e) {
    var that = this
    that.setData({
      memberIndex: e.detail.value,//选中的项目成员iD
    });
  },

  //添加成员
  Finish:function () {
    var that = this
    var projId = wx.getStorageSync("Project-id")
    var ProjectMemember = wx.getStorageSync("ProjectDetail-memberList")
    var newIndex = that.data.memberIndex
    var newleaderName = ProjectMemember[newIndex].name
    var newleaderId = ProjectMemember[newIndex].id
    var oldLeaderId = ProjectMemember[0].id
    that.transferProject(projId, newleaderName, newleaderId, oldLeaderId)

    wx.setStorageSync("ProjectBelong-memberName", newleaderName)//选中的成员名字
    wx.navigateBack({
      url: '../ProjectDetail',
    })
  },

  /**
* 项目负责人的转让
* （内部用到函数updateMemberLeader）
*/
  transferProject: function (projId, newleaderName, newleaderId, oldLeaderId) {

    var that = this
    var Project = Bmob.Object.extend("project")
    var projectQuery = new Bmob.Query(Project)

    projectQuery.get(projId, {
      success: function (result) {
        result.set("leader_id", newleaderId)
        result.set("leader_name", newleaderName)
        result.save()

        //更改新项目成员中的领导属性
        that.updateMemberLeader(projId, newleaderId, oldLeaderId)
        //成功情况




      },
      error: function (object, error) {
        //失败情况
        //console.log(error)




      }
    })
  },

  /**
   * 更改新项目成员中的领导
   */
  updateMemberLeader: function (projId, newLeaderId, oldLeaderId) {
    var that = this
    var ProjMember = Bmob.Object.extend("proj_member")
    var projmemberQuery = new Bmob.Query(ProjMember)

    var ids = [newLeaderId, oldLeaderId]
    projmemberQuery.equalTo("proj_id", projId)
    projmemberQuery.containedIn("user_id", ids)
    projmemberQuery.find().then(function (todos) {
      todos.forEach(function (todo) {
        if (todo.get("user_id") == newLeaderId) {
          todo.set("is_leader", true)
        } else {
          todo.set("is_leader", false)
        }
      })
      return Bmob.Object.saveAll(todos);
    }).then(function (todos) {
      // 更新成功
      //console.log("updateMemberLeader","更改新项目成员中的领导成功!")

    },
      function (error) {
        // 异常处理
        console.log("updateMemberLeader", "更改新项目成员中的领导失败!")
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var ProjectMemember = wx.getStorageSync("ProjectDetail-memberList")
    this.setData({
      ProjectMemember: ProjectMemember
    });
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
    var ProjectMemember = wx.getStorageSync("ProjectDetail-memberList")
    for (var i in ProjectMemember){
      if(i != 0)
        ProjectMemember[i].checked = false
    }
    this.setData({
      ProjectMemember: ProjectMemember
    });
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