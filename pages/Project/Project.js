//index.js
var Bmob = require('../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //星标项目
    StarProject: [
      {
        id:"",
        icon: "/img/logo.png",
        name: "静态项目"
      }
    ],
    //普通项目
    Project: [
      {
        id: "",
        icon: "",
        name: ""
      },
    ]
  },
  
  //点击星标项目
  ClickStarItem: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.setStorage({
      key: "Project-detail",
      data: that.data.StarProject[index],
    })
  },

  //点击项目
  ClickItem: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.setStorage({
      key: "Project-detail",
      data: that.data.Project[index],
    })
  },

  //创建项目
  buildProject: function() {
    wx.navigateTo({url: './buildProject/buildProject'})
  },

  //项目详情
  projectmore: function() {
    wx.navigateTo({url: './ProjectMore/ProjectMore'})
  },

  //项目编辑
  showProjectDetail: function (e) {
    wx.navigateTo({url: './ProjectDetail/ProjectDetail'})
  },

  /**
 *2018-05-18
 *@author mr.li
 *@return 所有项目的数组
 *获取用户的所有项目 ,默认10条
 *
 */
  getProjectList: function() {
    var that = this

    var Project = Bmob.Object.extend("project")
    var projectQuery = new Bmob.Query(Project)
    var member = Bmob.Object.extend("proj_member")
    var memberQuery = new Bmob.Query(member)
    var currentUser = Bmob.User.current()

    var user_id = "0"
    var project_id = [] //项目id数组
    var projectArr = []
    var starprojectArr = []
    if (currentUser) {
      user_id = currentUser.id
    }

    //查询当前用户所在的所有项目id，默认10条
    memberQuery.select("proj_id")
    memberQuery.equalTo("user_id", user_id)
    
    memberQuery.find().then(function(results) {
      //返回成功
      console.log("共查询到用户所在项目 " + results.length + " 条记录");
      for (var i = 0; i < results.length; i++) {
        var object = results[i]
        project_id.push(object.get("proj_id").trim())
      }

      //查询当前用户所在的所有项目，默认10条
      projectQuery.containedIn("objectId", project_id)
      projectQuery.equalTo('is_delete',false)
      projectQuery.find({
        success: function(results) {
          //成功
          console.log("共查询到项目 " + results.length + " 条记录");
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var result = results[i]
            console.log("getProjectList",result)
            var object = {}
            var starobject = {}
            if (result.attributes.is_first == false)//非星标项目
            {
              object = {
                icon: result.attributes.img_url,
                name: result.attributes.name,
                id: result.id
              }
              projectArr.push(object)
            }
            if (result.attributes.is_first == true)//星标项目
            {
              starobject = {
                icon: result.attributes.img_url,
                name: result.attributes.name,
                id: result.id
              }
              starprojectArr.push(starobject)
            }
          }
          console.log("Project", projectArr)
          console.log("StarProject", starprojectArr)
          that.setData({ Project: projectArr })
          that.setData({ StarProject: starprojectArr })

        },
        error: function(error) {
          //失败
          console.log("查询用户所在的所有项目失败: " + error.code + " " + error.message);
          //失败情况

        }
      })

    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    that.getProjectList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
