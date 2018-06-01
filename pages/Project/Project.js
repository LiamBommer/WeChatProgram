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
        icon: "/img/logo.png",
        name: "学长说系列分享活动"
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

  //点击项目
  ClickItem: function(e) {
    var index = e.currentTarget.dataset.index
    wx.setStorageSync("Project-id", this.data.Project[index].id)
    wx.setStorageSync("Project-name", this.data.Project[index].name)
    console.log("点击项目：",this.data.Project[index].name)
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
  showProjectDetail: function() {
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
    if (currentUser) {
      user_id = currentUser.id
    }

    //查询当前用户所在的所有项目id，默认10条
    memberQuery.select("proj_id")
    memberQuery.equalTo("user_id", user_id)
    memberQuery.notEqualTo("is_delete",true)
    memberQuery.find().then(function(results) {
      //返回成功
      console.log("共查询到用户所在项目 " + results.length + " 条记录");
      for (var i = 0; i < results.length; i++) {
        var object = results[i]
        project_id.push(object.get("proj_id").trim())
      }

      //查询当前用户所在的所有项目，默认10条
      projectQuery.containedIn("objectId", project_id)
      projectQuery.find({
        success: function(results) {
          //成功
          console.log("共查询到项目 " + results.length + " 条记录");
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var result = results[i]
            console.log(result)
            var object = {}
            object = {
              icon: result.attributes.img_url,
              name: "学长说系列分享活动",
              id: result.id
            }
            projectArr.push(object)
          }
          console.log("projectArr", projectArr[0])
          //todo: 在这里设置setdata
          // var ProjectList = []
          // for (var id in projectArr){
          //   var obje
          //   ProjectList.push({

          //   })
          //   ProjectList[id].name = projectArr[id].attributes.name

          // }
          // Project: [
          //   {
          //     icon: "/img/logo.png",
          //     name: "鲨鱼不排队",
          //   },
          //   {
          //     icon: "/img/logo.png",
          //     name: "我爱大白鲨",
          //   },
          // ],
          that.setData({Project: projectArr})

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
<<<<<<< HEAD
  onLoad: function(options) {
    
  },
=======
  onLoad: function (options) {
    },
>>>>>>> parent of 0806b78... Revert "静态"

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
