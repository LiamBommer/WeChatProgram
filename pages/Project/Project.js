//index.js
var Bmob = require('../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //星标项目
    StarProject: [],
    // 新增 isClicked 字段，用于动态添加类，显示点击动画

    //普通项目
    Project: [],

    // 涟漪效果
    rippleViewStyle: '',
    rippleStyle: '',

    // Project list animation
    projectAnimationStyle: '',
    starProjectAnimationStyle: '',

  },
  
  //点击星标项目
  ClickStarItem: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.setStorage({
      key: "Project-detail",
      data: that.data.StarProject[index],
    })

    // 点击动画效果
    var path = 'StarProject[' + index + '].isClicked'
    this.setData({
      [path]: 'clicked'
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

    // 点击动画效果
    var path = 'Project[' + index + '].isClicked'
    this.setData({
      [path]: 'clicked'
    })
  },

  //创建项目
  buildProject: function() {
    wx.navigateTo({url: './buildProject/buildProject'})
  },

  //项目详情
  projectmore: function(e) {

    // 点击动画效果延迟
    var that = this
    var index = e.currentTarget.dataset.index
    var starPath = 'StarProject[' + index + '].isClicked'
    var path = 'Project[' + index + '].isClicked'
    setTimeout(function() {
      // 无法判断点击的是否是星标项目
      // 的妥协之策
      that.setData({
        [path]: '',
        [starPath]: ''
      })
      wx.navigateTo({url: './ProjectMore/ProjectMore'})
    }, 120)
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
/**
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

          // 加载完成
          wx.hideLoading()



        },
        error: function(error) {
          //失败
          console.log("查询用户所在的所有项目失败: " + error.code + " " + error.message);
          //失败情况

        }
      })

    })

  },
 */
/**
 * mrli 2018-06-12
 * 获取用户的所有项目，默认10条
 */

getProjectList:function(){
  var that = this
  var Projectmember = Bmob.Object.extend('proj_member')
  var projectmemberQuery = new Bmob.Query(Projectmember)
  var projectArr = []
  var starprojectArr = []
  if (1){
    projectmemberQuery.equalTo('user_id', getApp().globalData.userId/*当前用户的id*/)
    projectmemberQuery.include('project')
    //projectmemberQuery.equalTo('is_delete',false)  //筛选没有被解散的项目

    projectmemberQuery.find({
      success: function (results) {
        //成功
        console.log("getProjectList", results)
        for (var i in results) {
          var result = results[i]
          var object = {}
          var starobject = {}

          if (result.get('project').is_delete != true && result.attributes.is_first == false)//非星标项目
          {
            object = {
              icon: result.attributes.project.img_url,
              name: result.attributes.project.name,
              id: result.attributes.project.objectId,
              checked: false
            }
            projectArr.push(object)
          }
          if (result.get('project').is_delete != true && result.attributes.is_first == true)//星标项目
          {
            starobject = {
              icon: result.attributes.project.img_url,
              name: result.attributes.project.name,
              id: result.attributes.project.objectId,
              checked: true
            }
            starprojectArr.push(starobject)
          }
        }

        console.log("Project", projectArr)
        console.log("StarProject", starprojectArr)
        that.setData({ Project: projectArr })
        that.setData({ StarProject: starprojectArr })
        // 加载完成
        wx.hideLoading()
      },
      error: function (error) {
        //失败
        console.log("查询用户所在的所有项目失败: " + error.code + " " + error.message)
      }
    })
  }

},

  /*
   * 涟漪点击效果
   */
  itemRippleTap: function(e) {
    
    // 获取点击位置
    var x = e.touches[0].pageX - 75
    var y = e.touches[0].pageY - 75
    console.log(e.touches[0], 'x: '+x+',y: '+y)

    // 设置动画形态
    var rippleViewStyle = "top: "+y*2+"rpx; left: "+x*2+"rpx;"
    rippleViewStyle += "-webkit-animation: ripple-view 0.5s ease;"

    var rippleStyle = "top:"+0+"rpx;left:"+0+"rpx;"
    rippleStyle += "-webkit-animation-name: ripple;"
    rippleStyle += "-webkit-animation-duration: 0.5s;"
    rippleStyle += "-webkit-animation-timing-function: ease;"
    rippleStyle += "-webkit-animation-iteration-count: 1;"

    this.setData({
      rippleStyle: '',
      rippleViewStyle: ''
    })
    this.setData({
      rippleStyle: rippleStyle,
      rippleViewStyle: rippleViewStyle
    })

  },

  
  /*
   * 列表加载动效
   */
  projectAnimation: function() {
    var projectAnimationStyle = ''
    projectAnimationStyle += '-webkit-animation-name: projectAnimation;'
    projectAnimationStyle += '-webkit-animation-duration: 0.4s;'
    projectAnimationStyle += "-webkit-animation-timing-function: ease;"
    projectAnimationStyle += "-webkit-animation-iteration-count: 1;"

    this.setData({
      projectAnimationStyle: ''
    })
    this.setData({
      projectAnimationStyle: projectAnimationStyle
    })
  },
  starProjectAnimation: function () {
    var starProjectAnimationStyle = ''
    starProjectAnimationStyle += '-webkit-animation-name: starProjectAnimation;'
    starProjectAnimationStyle += '-webkit-animation-duration: 0.4s;'
    starProjectAnimationStyle += "-webkit-animation-timing-function: ease;"
    starProjectAnimationStyle += "-webkit-animation-iteration-count: 1;"

    this.setData({
      starProjectAnimationStyle: ''
    })
    this.setData({
      starProjectAnimationStyle: starProjectAnimationStyle
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

    // 等待加载完成后消失
    // getProjectList()
    wx.showLoading({
      title: '正在加载',
      mask: 'true'
    })

    var that = this
    that.getProjectList()

    //animation
    // Motion setting
    that.projectAnimation()
    that.starProjectAnimation()
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
