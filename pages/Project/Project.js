//index.js
var Bmob = require('../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //数据分析
    userName:'',
    userId:'',
    projectName:'',//项目名称
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

    // 按钮旋转动效
    arrow_spin_style: '',

    // 新用户标识，显示新手指引
    // 0 首页欢迎语
    // 1 高亮项目详情
    // 2 项目详情页 高亮成员
    // 3 成员列表 高亮添加成员
    // 4 返回项目首页 高亮项目
    // 5 进入任务页 高亮任务列表名
    // 6 高亮任务
    // 7 进入任务详情 探索
    is_beginner: false,
    guide_step: 0,

    frame_title_0: '欢迎来到一协作',
    frame_desc_0: '下面是基本使用方法！',

    frame_title_1: '邀请成员加入',
    frame_desc_1: '点击右上角的图标可以进入项目详情',

  },

  // 新手指引按钮步骤
  GuideNext: function() {
    var guide_step = this.data.guide_step
    guide_step = guide_step + 1
    this.setData({
      guide_step: guide_step
    })
    wx.setStorageSync('guide_step', guide_step)

    wx.setStorage({
      key: "Project-detail",
      data: this.data.Project[0],
    })

    if(guide_step == 2) {
      wx.navigateTo({url: './ProjectDetail/ProjectDetail'})
    }
  },

  // 项目展开控制
  expandStarProject: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var project_list = that.data.StarProject
    var flag = project_list[index].expand

    // setData路径
    var path = 'StarProject[' + index + '].expand'
    var path_animation = 'StarProject[' + index + '].expandAnimation'


    // 动画尝试
    var animation = wx.createAnimation({
      duration: 200,
    })

    // 展开
    if(flag == true){
      flag = false
      animation.rotate(180).step()
      that.setData({
        [path_animation]: animation.export(),
      })
    } 
    else {  // 未展开
      flag = true
      animation.rotate(0).step()
      that.setData({
        [path_animation]: animation.export(),
      })
    }

    // 设置展开标志
    that.setData({
      [path]: flag,   
    })


  },
  expandProject: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var project_list = that.data.Project
    var flag = project_list[index].expand

    // setData路径
    var path = 'Project[' + index + '].expand'
    var path_animation = 'Project[' + index + '].expandAnimation'

    // 动画尝试
    var animation = wx.createAnimation({
      duration: 200,
    })

    // 展开
    if(flag == true){
      flag = false
      animation.rotate(0).step()
      that.setData({
        [path_animation]: animation.export(),
      })
    } 
    else {  // 未展开
      flag = true
      animation.rotate(-180).step()
      that.setData({
        [path_animation]: animation.export(),
      })
    }

    // 设置展开标志
    that.setData({
      [path]: flag
    })
  },
  
  //点击星标项目
  ClickStarItem: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var projectName = e.currentTarget.dataset.name//项目名
    wx.setStorage({
      key: "Project-detail",
      data: that.data.StarProject[index],
    })

    //数据分析
    that.setData({
      projectName: projectName,
      userName: getApp().globalData.nickName,
      userId: getApp().globalData.userId,
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
    var projectName = e.currentTarget.dataset.name//项目名
    wx.setStorage({
      key: "Project-detail",
      data: that.data.Project[index],
    })

    //数据分析
    that.setData({
      projectName: projectName,
      userName: getApp().globalData.nickName,
      userId: getApp().globalData.userId,
    })

    // 点击动画效果
    var path = 'Project[' + index + '].isClicked'
    this.setData({
      [path]: 'clicked'
    })
  },

  //创建项目
  buildProject: function() {
    var that = this
    that.setData({//数据分析
      userName: getApp().globalData.nickName,
      userId: getApp().globalData.userId,
    })
    
    wx.navigateTo({url: './buildProject/buildProject'})
  },

  //项目详情
  projectmore: function(e) {

    // 点击动画效果延迟
    var that = this
    // var index = e.currentTarget.dataset.index
    // var starPath = 'StarProject[' + index + '].isClicked'
    // var path = 'Project[' + index + '].isClicked'
    wx.navigateTo({ url: './ProjectMore/ProjectMore' })
    // setTimeout(function() {
      
    //   wx.navigateTo({url: './ProjectMore/ProjectMore'})
    //   // 无法判断点击的是否是星标项目
    //   // 的妥协之策
    //   // that.setData({
    //   //   [path]: '',
    //   //   [starPath]: ''
    //   // })
    // }, 50)
  },

  //项目编辑
  showProjectDetail: function (e) {
    var that = this
    var projectName = e.currentTarget.dataset.name//项目名
    //数据分析
    that.setData({
      projectName: projectName,
      userName: getApp().globalData.nickName,
      userId: getApp().globalData.userId,
    })

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
  // getApp().globalData.projects != null && getApp().globalData.projects.length < 1
  if (1){
    // wx.showLoading({
    //   title: '正在加载',
    //   mask: 'true'
    // })
    projectmemberQuery.limit(200)
    projectmemberQuery.equalTo('user_id', getApp().globalData.userId/*当前用户的id*/)
    projectmemberQuery.descending('createdAt')
    projectmemberQuery.include('project')
    

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
              description: result.attributes.project.desc,
              id: result.attributes.project.objectId,
              checked: false,
              expand: false,
              expandAnimation: [],
              meeting: '暂未有会议',
              meeting_start_time: '',
              tasks: [
                {
                  'title': '暂未有将截止的任务'
                }
              ]
            }
            projectArr.push(object)
          }
          if (result.get('project').is_delete != true && result.attributes.is_first == true)//星标项目
          {
            starobject = {
              icon: result.attributes.project.img_url,
              name: result.attributes.project.name,
              description: result.attributes.project.desc,
              id: result.attributes.project.objectId,
              checked: true,
              expand: true,
              expandAnimation: [],
              meeting: '暂未有会议',
              meeting_start_time: '',
              tasks: [
                {
                  'title': '暂未有将截止的任务'
                }
              ]
            }
            starprojectArr.push(starobject)
          }
        }

        var starProjIdArr = []
        var projIdArr = []

        for(var i=0;i<starprojectArr.length;i++){
          starProjIdArr.push(starprojectArr[i].id)
        }

        for(var i=0;i<projectArr.length;i++){
          projIdArr.push(projectArr[i].id)
        }

        // that.getAllTasks(starProjIdArr,projIdArr)

        getApp().globalData.projects.push(projectArr)
        getApp().globalData.projects.push(starprojectArr)  //第一次请求后台，然后便不再请求
        console.log("Project", projectArr)
        console.log("StarProject", starprojectArr)
        that.setData({ Project: projectArr })
        that.setData({ StarProject: starprojectArr })

        // 加载完成
        // wx.hideLoading()

        // 获取每个项目的详细信息
        for(var i=0;i<starProjIdArr.length;i++){
          // @param2 isStarProj
          that.oneProjectDisplay(starProjIdArr[i], true)
        }

        for(var i=0;i<projIdArr.length;i++){
          // @param2 isStarProj
          that.oneProjectDisplay(projIdArr[i], false)
        }

      },
      error: function (error) {
        //失败
        console.log("查询用户所在的所有项目失败: " + error.code + " " + error.message)
      }
    })
  }

},

// getAllTasks: function(starProjIdArr, projIdArr){

//   var that = this
//   var starLen = starProjIdArr.length
//   var len = projIdArr.length
//   var projIds = starProjIdArr.concat(projIdArr)
  
//   var Task = Bmob.Object.extend("task")
//   var taskQuery = new Bmob.Query(Task)
  
//   //预先设置一个以项目id为键的字典，方便后面用来接收对应项目的任务
//   var taskObject = {}
//   for (var i = 0; i < projIds.length; i++) {
//     taskObject[projIds[i]] = []
//   }

//   taskQuery.limit(100)    //返回最多100条数据
//   taskQuery.equalTo('is_delete',false)  //获取未删除
//   taskQuery.equalTo('is_finish',false)  //获取未完成
//   taskQuery.select('title', 'end_time', 'proj_id')
//   taskQuery.containedIn("proj_id", projIds)

// var taskArr = []
// taskQuery.find({
//   success: function (results) {
//     for (var i = 0; i < results.length; i++) {
//       var object = {
//         title: results[i].attributes.title,
//         endTime: results[i].attributes.end_time,
//         projId: results[i].attributes.proj_id,
//         color:'green'  //用来对任务的紧急程度设置颜色,默认绿色
//       }

//       taskArr.push(object)
//     }

//     for (var i = 0; i < taskArr.length; i++) {
//       taskObject[taskArr[i].projId].push(taskArr[i])
//     }

//     //排序,按已有的endTime从小到大排序
//     for (var i = 0; i < projIds.length; i++) {
//       taskObject[projIds[i]].sort(that.sortTasks)
//     }

//     //取出前三个任务
//     for (var i = 0; i < projIds.length; i++) {
//       taskObject[projIds[i]] = taskObject[projIds[i]].slice(0,3)
//     }
    
//     console.log("taskObject",taskObject)  //获取到的任务
    


//   },
//   error: function (error) {
//       //失败
//       console.log("错误信息"+error)
//   }
// })

// },
// sortTasks: function (a, b) {
//     if(a.endTime == "" || a.endTime == null) {
//       return 1
//     }

//     // if (a.endTime > b.endTime)
//     //   return -1

//     // return 1
//     var that = this
//     var currentTime = new Date(new Date().toLocaleDateString())
//     var endTimeA = new Date(new Date(a.endTime.replace(/-/g, "/")))
//     var endTimeB = new Date(new Date(b.endTime.replace(/-/g, "/")))

//     var daysA = endTimeA.getTime() - currentTime.getTime()
//     var daysB = endTimeB.getTime() - currentTime.getTime()
    
//     var dayA = parseInt(daysA / (1000 * 60 * 60 * 24))  //时间差值
//     var dayB = parseInt(daysB / (1000 * 60 * 60 * 24))
    
//     if(dayA <= 1) a["color"] = 'red'
//     if(dayA > dayB)
//       return 1
//     return -1;
// },

/**
 * !!!!!!!!!!!!!!!! 单个项目的  信息 !!!!!!!!!!!!!!!!!!!!
 * 获取项目的展示的任务、日程与会议
 */
oneProjectDisplay: function(projId, isStarProj){

  var that = this
  this.getTasks(projId, isStarProj)
  // this.getMeeting(projId, isStarProj)

},

/**
 * 获取三个任务
 */
getTasks:function (projId, isStarProj){

  var that = this
  var isStarProj = isStarProj
  var Task = Bmob.Object.extend("task")
  var taskQuery = new Bmob.Query(Task)

  taskQuery.limit(50)    //返回最多50条数据
  // taskQuery.descending('createdAt')    //根据创建时间降序排列
  taskQuery.equalTo('is_delete', false)  //获取未删除
  taskQuery.equalTo('is_finish', false)  //获取未完成
  taskQuery.equalTo("proj_id", projId)
  taskQuery.notEqualTo("end_time","")  
  taskQuery.select('title', 'end_time', 'proj_id','createdAt')

  var taskArr = []  
  taskQuery.find({
    success:function(results){
      for (var i = 0; i < results.length; i++) {
        var object = {
          title: results[i].attributes.title,
          endTime: results[i].attributes.end_time,
          projId: results[i].attributes.proj_id,
          color: that.colorTasks(results[i].attributes.end_time)  //用来对任务的紧急程度设置颜色,默认绿色
        }

        taskArr.push(object)
      }

      //排序,按已有的endTime从小到大排序
      taskArr.sort(that.sortTasks)
      //取出前三个数据
      taskArr = taskArr.slice(0, 3)

      console.log("taskArr", taskArr)  //获取到的任务

      // 存进对应的项目中
      if(taskArr.length != 0) {

        if(isStarProj) {
          var StarProject = that.data.StarProject
          for(var i=0; i<StarProject.length; i++) {
            // 找到对应项目，存储
            if(StarProject[i].id == projId) {
              var path = 'StarProject[' + i + '].tasks'
              that.setData({
                [path]: taskArr
              })
            }
          }

        } else {
          var Project = that.data.Project
          for(var i=0; i<Project.length; i++) {
            // 找到对应项目，存储
            if(Project[i].id == projId) {
              var path = 'Project[' + i + '].tasks'
              that.setData({
                [path]: taskArr
              })
            }
          }
        }

      }

    },
    error: function(error){
      //失败
      console.log('项目展示获取任务失败' + error)
    }
  })
},

//近期任务颜色选取
colorTasks: function (a) {
    var that = this
    var currentTime = new Date(new Date().toLocaleDateString())
    var endTimeA = new Date(new Date(a.replace(/-/g, "/")))
    var daysA = endTimeA.getTime() - currentTime.getTime()
    var dayA = parseInt(daysA / (1000 * 60 * 60 * 24))  //时间差值
    if (dayA <= 1) return 'red'
    else return 'green'
},

sortTasks: function (a, b) {
  if (a.endTime == "" || a.endTime == null) {
    return 1
  }

  var that = this
  var currentTime = new Date(new Date().toLocaleDateString())
  var endTimeA = new Date(new Date(a.endTime.replace(/-/g, "/")))
  var endTimeB = new Date(new Date(b.endTime.replace(/-/g, "/")))

  var daysA = endTimeA.getTime() - currentTime.getTime()
  var daysB = endTimeB.getTime() - currentTime.getTime()

  var dayA = parseInt(daysA / (1000 * 60 * 60 * 24))  //时间差值
  var dayB = parseInt(daysB / (1000 * 60 * 60 * 24))

  if (dayA > dayB)
    return 1
  return -1;
},

getMeeting:function(projId, isStarProj){

  var that = this
  var Meeting = Bmob.Object.extend('meeting')
  var meetingQuery = new Bmob.Query(Meeting)
  var meetingArr = []

  meetingQuery.limit(50)
  meetingQuery.equalTo('is_delete', false)
  meetingQuery.equalTo('proj_id', projId)
  meetingQuery.select('title', 'start_time', 'proj_id')
  meetingQuery.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          var ob = {
            title: results[i].attributes.title,
            startTime: results[i].attributes.start_time,
            projId: results[i].attributes.proj_id
          }
          meetingArr.push(ob)

        }

        //排序
        meetingArr.sort(that.sortMeetings)
        //选取最近的一个
        meetingArr = meetingArr.slice(0, 1)

        if(meetingArr.length != 0) {

          if(isStarProj) {
            var StarProject = that.data.StarProject
            for(var i=0; i<StarProject.length; i++) {
              // 找到对应项目，存储
              if(StarProject[i].id == projId) {
                var path = 'StarProject[' + i + '].meeting'
                var path_2 = 'StarProject[' + i + '].meeting_start_time'
                var time = meetingArr[0].startTime
                time = time.substr(time.length - 4)
                that.setData({
                  [path]: meetingArr[0].title,
                  // [path_2]: meetingArr[0].startTime
                  [path_2]: time
                })
              }
            }

          } else {
            var Project = that.data.Project
            for(var i=0; i<Project.length; i++) {
              // 找到对应项目，存储
              if(Project[i].id == projId) {
                var path = 'Project[' + i + '].meeting'
                var path_2 = 'Project[' + i + '].meeting_start_time'
                that.setData({
                  [path]: meetingArr[0].title,
                  [path_2]: meetingArr[0].startTime
                })
              }
            }
          }

        }

        console.log("项目首页展示的会议", meetingArr)
      },
      error: function (error) {
        //失败
        console.log("获取会议" + error)
      }
    })
},
/**
 * 对会议排序
 */
sortMeetings: function(a, b){

  if(a.startTime == "" || a.startTime == null) {
    return 1
  }

  var that = this
  var currentTime = new Date(new Date().toLocaleDateString())
  var startTimeA = new Date(new Date(a.startTime.replace(/-/g, "/")))
  var startTimeB = new Date(new Date(b.startTime.replace(/-/g, "/")))

  var daysA = startTimeA.getTime() - currentTime.getTime()
  var daysB = startTimeB.getTime() - currentTime.getTime()

  var dayA = parseInt(daysA / (1000 * 60 * 60 * 24))  //时间差值
  var dayB = parseInt(daysB / (1000 * 60 * 60 * 24))

  if (dayA > dayB)
    return 1
  return -1;
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
    projectAnimationStyle += '-webkit-animation-duration: 0.5s;'
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
    starProjectAnimationStyle += '-webkit-animation-duration: 0.5;'
    starProjectAnimationStyle += "-webkit-animation-timing-function: ease;"
    starProjectAnimationStyle += "-webkit-animation-iteration-count: 1;"

    this.setData({
      starProjectAnimationStyle: ''
    })
    this.setData({
      starProjectAnimationStyle: starProjectAnimationStyle
    })
  },

  /*
   * 箭头旋转动效
   */
  arrowSpinAnimation: function () {
    var arrow_spin_style = ''
    arrow_spin_style += '-webkit-animation-name: arrowSpinAnimation;'
    arrow_spin_style += '-webkit-animation-duration: 0.5;'
    arrow_spin_style += "-webkit-animation-timing-function: linear;"
    arrow_spin_style += "-webkit-animation-iteration-count: 1;"

    this.setData({
      arrow_spin_style: ''
    })
    this.setData({
      arrow_spin_style: arrow_spin_style 
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.projectAnimation()
    // this.starProjectAnimation()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    // 获取新用户标识，显示新手指引
    var is_beginner = wx.getStorageSync('is_beginner')
    var guide_step = wx.getStorageSync('guide_step')
    if(is_beginner != true) is_beginner = false;    // 排除获取不到出错的情况
    if(!guide_step) guide_step = 0;
    this.setData({
      is_beginner: is_beginner,
      guide_step: guide_step
    })

    // 等待加载完成后消失
    // getProjectList()
    

    var that = this
    that.getProjectList()
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    getApp().globalData.projects = Array()
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    getApp().globalData.projects = Array()
    
  },

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
