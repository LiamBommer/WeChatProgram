
var Bmob = require('../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,//弹出项目描述模态框
    hiddenmodalputTitle: true,//弹出项目描述模态框
    SwitchChecked: true,//是否置顶

    project_img:"",
    icon_more: '/img/more.png',
    project_name: '',
    project_desc: '',
    project_response: '',

    //成员列表
    member:[
      {
        id:"",
        icon: '/img/member.png',
        name: '',
        checked: "",
      }
    ],
  },

  /**
 * @author mr.li
 * @parameter projId 项目id
 * @return 项目详情的object
 * （'project' ->object类型，
 *   'membersPics' ->object数组，每个object有 nickName 和 userPic）
 */
  getProjectDetail:function (projId){
  var that = this
    var Project = Bmob.Object.extend("project")
  var projectQuery = new Bmob.Query(Project)
  // var Members = Bmob.Object.extend("proj_member")
  // var membersQuery = new Bmob.Query(Members)

  var detailObject = {}  //项目详情页面的所需信息
  //var memberPics = ProjectList.getProjectMembers(projId)   //调用函数获取成员数组（nickName，userPic），数组的第一个为项目领导人
  var memberPics = []

  var ProjectMember = Bmob.Object.extend("proj_member")
  var memberQuery = new Bmob.Query(ProjectMember)
  var User = Bmob.Object.extend("_User")
  var userQuery = new Bmob.Query(User)

  var leader_id = "0"
  var memberId = [] //项目的所有成员id数组
  var userArr = [] //项目所有成员数组

  //获取指定项目的所有成员id，50条
  memberQuery.equalTo("proj_id", projId)
  memberQuery.select("user_id", "is_leader")
  memberQuery.find().then(function (results) {
      //返回成功
      
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        if (object.get("is_leader")) {
          //项目领导，放在数组的第一个
          console.log("获取项目领导id", object.get('user_id'));
          leader_id = object.get("user_id")
          memberId.unshift(leader_id)

        } else {
          console.log("获取项目成员id", object.get('user_id'));
          memberId.push(object.get("user_id"))  //将成员id添加到数组
        }
      }
    }).then(function (result) {

      //获取指定项目的所有成员,默认10条
      userQuery.select("nickName", "userPic")  //查询出用户的昵称和头像
      userQuery.limit(50)
      userQuery.containedIn("objectId", memberId)

      // userQuery.matchesKeyInQuery("objectId", "user_id", memberQuery)
      userQuery.find({
        success: function (results) {
          
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var object = {}
            object = {
              id: result.id,
              icon: result.attributes.userPic,
              name: result.attributes.nickName,
              checked: true,
            }
            if (result.id == leader_id) {
              //将项目领导放在数组的第一个位置
              userArr.unshift(object)
            } else
              userArr.push(object)
          }

          //在这里设置setdata
          console.log("项目成员",userArr)
          that.setData({
            project_response: userArr[0].name,
            member: userArr,
          });
          //项目成员
          wx.setStorageSync("ProjectDetail-memberList", that.data.member)

        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
          //失败情况





        }
      })

    })
  //查询指定项目详情
  projectQuery.equalTo("objectId", projId)
  projectQuery.first({
      success: function (result) {
        detailObject = result
        console.log("项目详情", detailObject)
        //todo：在这里设置setdata
        that.setData({
         project_img : detailObject.attributes.img_url,
         project_name: detailObject.attributes.name,
         project_desc: detailObject.attributes.desc,
          });

      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })

  },

  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinputTitle: function () {
    this.setData({
      hiddenmodalputTitle: false
    })
  },
  //取消按钮  
  cancelTitle: function () {
    this.setData({
      hiddenmodalputTitle: true,
    });
  },
  //确认  
  confirmTitle: function () {
    this.setData({
      hiddenmodalputTitle: true
    })
  }, 

  
  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinput: function () {
    this.setData({
      hiddenmodalput: false
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  }, 

  //项目归属
  ProjectBelong: function () {
    var that = this
    wx.setStorageSync("ProjectDetail-memberList", that.data.member)
    wx.navigateTo({
      url: 'ProjectBelong/ProjectBelong'
    })
  },

  //项目成员
  showMemberList: function () {
    var that = this
    wx.setStorageSync("ProjectDetail-memberList", that.data.member)
    wx.navigateTo({
      url: 'memberList/memberList'
    })
  },

  //删除/退出项目
  DeleteProject: function () {
    wx.removeStorageSync("ProjectDetail-memberList")
    wx.removeStorageSync("Project- id")
    wx.navigateBack({
      url: '../Project'
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
    var id = wx.getStorageSync("Project-id") 
    that.getProjectDetail(id)
    console.log(that.data.member);
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
