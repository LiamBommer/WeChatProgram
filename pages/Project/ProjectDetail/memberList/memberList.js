// pages/memberList/memberList.js
var Bmob = require('../../../../utils/bmob.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否选中
    memberId: "",
    //项目成员
    ProjectMemember: [
      {
        id:"",
        icon: "/img/me.png",
        name: '帅涛',
        checked: true
      },
    ],
  },

  //选择项目成员
  ProjectMememberChange: function (e) {
    var memberId = e.detail.value
    this.setData({
      memberId: memberId,
    });
  },

  //添加新成员
  Addmember: function () {
    wx.navigateTo({
      url: './addMember/addMember',
    })
  },

  //完成
  Finish: function () {
    var that = this;
    var memberId = that.data.memberId;
    var memberIdLength = memberId.length;
    var NomemberId = []
    var NomemberIdLength = 0
    var ProjectMemember = that.data.ProjectMemember;
    var projId = wx.getStorageSync("Project-id")

    if (memberIdLength == 0) {//全部未选
      for (var id in ProjectMemember)
        NomemberId.push(ProjectMemember[id].id)
    }
    else {//个别未选
      for (var id in ProjectMemember) {

        for (var i in memberId) {
          if (ProjectMemember[id].id != memberId[i])
            NomemberIdLength++

          if (NomemberIdLength == memberIdLength)
            NomemberId.push(ProjectMemember[id].id)//未选中的成员ID
           
        }
        NomemberIdLength = 0

      }
    }

    console.log(NomemberId);//未选中的成员ID
    that.deleteProjectMember(projId, NomemberId)

    wx.navigateBack({
      url: '../ProjectDetail',
    })
  },

  /**
 * 2018-05-22
 * @anthor mr.li
 * @parameter projId项目id, memberIds 成员id数组
 * 删除成员
 */
  deleteProjectMember:function (projId, memberIds){

    var Proj_Member = Bmob.Object.extend("proj_member")

    var objects = new Array()
    for(var i= 0;i<memberIds.length;i++){
    var proj_member = new Proj_Member()
    proj_member.set("projId", projId)
    proj_member.set("user_id", memberIds[i])
    objects.push(proj_member)
     }
    //若数组非空，则开始删除成员
    if (objects != null && objects.length > 0) {
      Bmob.Object.destroyAll(objects).then(function () {
      //成功
      //console.log("删除项目成员成功！")

        console.log("success", success)

    }, function (error) {
      //失败

      console.log("error",error)

    })
}

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
    var memberList = wx.getStorageSync("ProjectDetail-memberList")
    that.setData({
      ProjectMemember: memberList,
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
