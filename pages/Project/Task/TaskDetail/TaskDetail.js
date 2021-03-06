// pages/Project/Task/TaskDetail/TaskDetail.js

var Bmob = require('../../../../utils/bmob.js')
var FINISH_TASK = "完成任务"
var REDO_TASK = "重做任务"
var MODIFY_TASK_TITLE = "更改了任务名称"

var ADD_NOTI_TIME = "添加了提醒时间"
var MODIFY_NOTI_TIME = "修改了提醒时间"
var DELETE_NOTI_TIME = "删除了提醒时间"

var ADD_FEEDBACK_MOD = "添加了反馈模板"
var MODIFY_FEEDBACK_MOD = "修改了反馈模板"

var DELETE_FEEDBACK_TIME = "删除了反馈时间"
var ADD_FEEDBACK_TIME = "添加了反馈时间"
var MODIFY_FEEDBACK_TIME = "修改了反馈时间"

var ADD_DESCRIPTION = "添加了任务描述"
var MODIFY_DESCRIPTION = "修改了任务描述"

var ADD_END_TIME = "添加了截止时间"
var MODIFY_END_TIME = "修改了截止时间"
var DELETE_END_TIME = "删除了截止时间"

var ADD_SUB_TASK = "添加了子任务"
var MODIFY_SUB_TASK = "修改了子任务"
var REDO_SUB_TASK = "重做了子任务"
var DELETE_SUB_TASK = "删除了子任务"
var FINISH_SUB_TASK = "完成了子任务"
var MODIFY_SUB_TASK_TITLE = "修改了子任务标题"


Page({

  /**
   * 页面的初始数据
   */
  data: {

    startX: 0, //删除开始坐标
    startY: 0,//删除
    delBtnWidth:90,//删除按钮宽度单位（px）
    hiddenmodalputTitle: true,//弹出任务标题模态框
    hiddenmodalputChildTitle: true,//弹出子任务标题模态框
    childIndex:"",//当前子任务下标
    childtaskId:'',//当前子任务ID
    projectName:"",//项目名
    taskId:"",//任务ID
    checked:false,//勾选任务
    childChecked:false,//勾选子任务
    title: '',//任务标题
    childTitle:"",//子任务标题
    inputTitle: '',//输入的标题
    inputChildTitle:'',//输入的子任务标题
    leaderId:'',//任务负责人ID
    member:[],//任务成员
    projectMember:[],//项目成员
    focus:false,//输入框焦点
    show: false,

    deadline: '2018-06-01',//截止时间
    DeadlineisTouchMove: false,//判断滑动截止时间
    DeadlinetxtStyle:"",//截止时间滑动距离

    remindtime: "",//提醒时间
    RemindtimeisTouchMove: false,//判断滑动提醒时间
    RemindtimetxtStyle: "",//提醒时间滑动距离

    feedbacktime: "",//反馈时间
    FeedbackisTouchMove: false,//判断滑动反馈时间
    FeedbacktxtStyle: "",//反馈时间滑动距离

    feedbackMod: "",
    taskDesc: "",
    Inputcontent:'',
    scrollTop: 0,//消息定位
    isInputing: false,  // 输入时将图片换成发送按钮

    // 添加更多内容的显示属性
    showRemindTime: false,
    showFeedbackTime: false,
    showFeedbackModel: false,
    showDescription: false,

    icon_chatperson: '/img/me.png',
    icon_add:'/img/add.png',
    icon_project:'/img/project.png',
    icon_person: '/img/member.png',
    icon_share: '/img/share.png',
    icon_deadline: '/img/deadline.png',
    icon_task_list: '/img/task_list.png',
    icon_add: '/img/add.png',
    icon_member: '/img/member.png',
    icon_close: '/img/close.png',
    icon_create: '/img/create.png',

    //子任务循环列表
    ChildTask:[
      // {
      //    name:'寻找通讯录',
      //    icon:'/img/member.png',
      //    clickChild:0,//勾选子任务次数
      // },
      // {
      //   name: '筛选嘉宾',
      //   icon: '/img/member.png',
      // },
    ],

    //消息循环列表
    taskremind: [
      // {
      //   text: '朱宏涛添加了子任务“寻找通讯录"',
      //   time: '6月1日 20:00',
      // },
      // {
      //   text: '朱宏涛添加了子任务“筛选嘉宾"',
      //   time: '6月1日 20:00',
      // },
    ],

    //他人聊天循环列表
    chat: [
      // {
      //   content: '嘉宾应该邀请哪种类型呢？',
      //   icon: '/img/me.png',
      //   judgepictrue: false,//判断输入的是文字还是图片
      // },
      // {
      //   content: '感觉竞赛类的嘉宾比较有同学喜欢',
      //   icon: '/img/me.png',
      //   judgepictrue: false,//判断输入的是文字还是图片
      // },
      // {
      //   content: '选嘉宾的标准应该是能引起同学们兴趣的',
      //   icon: '/img/me.png',
      //   judgepictrue: false,//判断输入的是文字还是图片
      // },
    ],


  },
  //点击子任务
  checkTest: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index//当前下标
    var childTaskId = e.currentTarget.id//当前子任务ID
    var userName = getApp().globalData.nickName//当前操作用户
    var childTakChecked = !e.currentTarget.dataset.checked//当前子任务是否被选中
    
    that.finishSubTask(that.data.taskId, childTaskId, childTakChecked, userName)

    var ChildTask = "ChildTask[" + index + "].is_finish"
    var ChildTask_isfinish = that.data.ChildTask[index].is_finish
    that.setData({
      [ChildTask]: !ChildTask_isfinish
    })

  },


  //勾选任务
  checkboxChange: function () {
    var that = this
    var userName = getApp().globalData.nickName
    that.finishTask(that.data.taskId, !that.data.checked, userName)
  },

  //任务标题：点击按钮弹出指定的hiddenmodalput弹出框  
  modalinputTitle: function () {
    var that = this
    that.setData({
      inputTitle: that.data.title,
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
  confirmTitle: function (e) {
    var that = this
    var userName = getApp().globalData.nickName
    if (that.data.inputTitle == ""){
      // 提示标题不可为空
      wx.showToast({
        title: '项目名称不见咯',
        icon: 'none',
        duration: 1500,
      })
    } else {
      // 显示loading
      wx.showLoading({
        title: '正在修改...',
      })
      that.modifyTaskTitle(that.data.taskId, that.data.inputTitle, userName)
      this.setData({
        hiddenmodalputTitle: true,
        title: this.data.inputTitle
      })
    }
    
  },
  //任务标题输入
  input: function (e) {
    var inputTitle = e.detail.value
    this.setData({
      inputTitle: inputTitle
    })
  },


  //子任务标题： 点击按钮弹出指定的hiddenmodalput弹出框  
  modalinputChildTitle: function (e) {
    var that = this
    var childtitle = e.currentTarget.dataset.childtitle
    var checked = e.currentTarget.dataset.checked
    var childtaskId = e.currentTarget.dataset.taskid
    var childIndex = e.currentTarget.dataset.index
    if (checked == false){
      that.setData({
        inputChildTitle: childtitle,
        childIndex: childIndex,
        childtaskId:childtaskId,
        hiddenmodalputChildTitle: false
      })
    }
  },
  //取消按钮  
  cancelChildTitle: function () {
    this.setData({
      hiddenmodalputChildTitle: true,
    });
  },

  //确认  
  confirmChildTitle: function (e) {
    var that = this
    var subtaskId = that.data.childtaskId//当前子任务ID
    var index = that.data.childIndex//当前子任务下标
    var userName = getApp().globalData.nickName
    that.modifySubTaskTitle(subtaskId, that.data.inputChildTitle, userName)
    var childTitle = "ChildTask[" + index + "].childTitle"
    this.setData({
      hiddenmodalputChildTitle: true,
      [childTitle]: that.data.inputChildTitle
    })
  },
  //子任务标题输入
  childInput: function (e) {
    var inputChildTitle = e.detail.value
    this.setData({
      inputChildTitle: inputChildTitle
    })
  },

  //添加更多内容
  addMorecontent:function(){
     var that = this;

     wx.showActionSheet({
       itemList: ['提醒时间', '反馈时间', '反馈模板', '任务描述'],
       success: function(res) {
         // 提醒时间
         if(res.tapIndex == 0) {
           if (that.data.showRemindTime == false) {
             that.setData({
               showRemindTime: true
             });
             wx.showToast({
               title: '添加成功',
             })
           }
           else {
             wx.showToast({
               title: '已经添加过啦',
               icon: 'none',
               duration: 1500,
             })
           }
         }

         // 反馈时间
         if(res.tapIndex == 1) {
           if (that.data.showFeedbackTime == false) {
             that.setData({
               showFeedbackTime: true
             });
             wx.showToast({
               title: '添加成功',
             })
           }
           else {
             wx.showToast({
               title: '已经添加过啦',
               icon: 'none',
               duration: 1500,
             })
           }
         }

         // 反馈模板
         if(res.tapIndex == 2) {
           if (that.data.showFeedbackModel == false) {
             that.setData({
               showFeedbackModel: true
             });
             wx.showToast({
               title: '添加成功',
             })
           }
           else {
             wx.showToast({
               title: '已经添加过啦',
               icon: 'none',
               duration: 1500,
             })
           }
         }

         // 任务描述
         if(res.tapIndex == 3) {
           if (that.data.showDescription == false) {
             that.setData({
               showDescription: true
             });
             wx.showToast({
               title: '添加成功',
             })
           }
           else {
             wx.showToast({
               title: '已经添加过啦',
               icon: 'none',
               duration: 1500,
             })
           }
         }
       },
       fail: function(res) {
        console.log(res.errMsg)
       }
     });

  },
  
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.ChildTask.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
      {
        v.isTouchMove = false;
        v.txtStyle = ''
      }
    })
    this.data.DeadlineisTouchMove = false,//判断滑动截止时间
      this.data.DeadlinetxtStyle = "",//截止时间滑动距离
      this.data.RemindtimeisTouchMove = false,//判断滑动提醒时间
      this.data.RemindtimetxtStyle = "",//截止时间滑动距离
      this.data.FeedbackisTouchMove = false,//判断滑动反馈时间
      this.data.FeedbacktxtStyle = "",//截止时间滑动距离

      this.setData({
        startX: e.changedTouches[0].clientX,
        startY: e.changedTouches[0].clientY,
        ChildTask: this.data.ChildTask,
        DeadlineisTouchMove: this.data.DeadlineisTouchMove,
        DeadlinetxtStyle: this.data.DeadlinetxtStyle,
        RemindtimeisTouchMove: this.data.RemindtimeisTouchMove,
        RemindtimetxtStyle: this.data.RemindtimetxtStyle,
        FeedbackisTouchMove: this.data.FeedbackisTouchMove,
        FeedbacktxtStyle: this.data.FeedbacktxtStyle,
      })
  },

  // 成员列表
  MemberList: function(e) {
    var that = this
    console.log("MemberList:", that.data.member)
    console.log("projectMember:", that.data.projectMember)
    //设置任务id缓存
    wx.setStorage({
      key: 'TaskDetail-taskId',
      data: that.data.taskId,
    })
    //设置任务成员缓存
    wx.setStorage({
      key: 'TaskDetail-member',
      data: that.data.member,
    })
    //设置项目成员缓存
    wx.setStorage({
      key: 'TaskDetail-projectMember',
      data: that.data.projectMember,
    })
    wx.navigateTo({
      url: './memberList/memberList',
    })
  },

  // 截止时间
  DeadLineChange: function (e) {
    var that = this
    var userName = getApp().globalData.nickName
    var taskId = that.data.taskId
    var endTime = e.detail.value
    that.modifyEndTime(taskId, endTime, userName)
    this.setData({
      deadline: e.detail.value
    })
  },

  // 提醒时间
  RemindTimeChange: function (e) {
    var that = this
    var userName = getApp().globalData.nickName
    var taskId = that.data.taskId
    var notiTime = e.detail.value
    that.modifyNotiTime(taskId, notiTime, userName)
    that.setData({
      showRemindTime: true,
      remindtime: e.detail.value
    })
  },

  // 反馈时间
  FeedBacktimeChange: function(e) {
    var that = this
    var userName = getApp().globalData.nickName
    var taskId = that.data.taskId
    var feedBackTime = e.detail.value
    that.modifyFeedbackTime(taskId, feedBackTime, userName)
    this.setData({
      showFeedbackTime:true,
      feedbacktime: e.detail.value
    })
  },

  //任务描述
  Describe: function () {
    var that = this
    wx.setStorageSync("TaskDetail-taskId", that.data.taskId)
    wx.setStorageSync("TaskDetail-desc", that.data.taskDesc)
    that.setData({
      showDescription: true,
    })
    wx.navigateTo({
      url: './Describe/Describe',
    })
  },

  //反馈模板
  Feedback: function () {
    var that = this
    wx.setStorageSync("TaskDetail-taskId", that.data.taskId)
    //获取反馈模板
    wx.setStorageSync("TaskDetail-feedbackMod", that.data.feedbackMod)
    that.setData({
      showFeedbackModel: true,
    })
    wx.navigateTo({
      url: './FeedBack/FeedBack',
    })
  },

  //删除任务
  DeleteTask: function () {
    var that = this
    var taskId = that.data.taskId
    wx.showModal({
      title: '提示',
      content: '是否删除该任务',
      success: function (res) {//删除任务
        if (res.confirm) {
          var userName = getApp().globalData.nickName
          that.deleteTask(taskId, userName)
          wx.navigateBack({
            url: '../../ProjectMore/ProjectMore',
          })
        }
        else if (res.cancel) {
        }
      }
    })
  },

  //添加子任务
  AddChildTask: function() {
    var that = this
    wx.setStorage({
      key: 'TaskDetail-taskId',
      data: that.data.taskId,
    })
    wx.setStorage({
      key: 'TaskDetail-member',
      data: that.data.member,
    })
    wx.navigateTo({
      url: '../buildChildTask/buildChildTask',
    })
  },

  //点击沟通模板
  ClickCommModel: function () {
    // 使页面滚动到评论区
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      wx.pageScrollTo({
        scrollTop: rect.height - 200
      })
    }).exec()
    this.setData({
      CommModel: true,
    });
    wx.navigateTo({
      url: './CommModel/CommModel',
    })
  },

  //点击输入框
  ClickInput: function(e) {
    var that = this;
    that.setData({
      isInputing: true
    });
      // 使页面滚动到评论区
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      console.log("rect",rect.height)
      wx.pageScrollTo({
        scrollTop: rect.height - 200 
      })
    }).exec()
  },

  // 输入框失去焦点，发送按钮变回图片
  inputBlur: function() {
    this.setData({
      isInputing: false
    });
  },

  // 点击发送按钮发送消息
  sendMessage: function (e) {
    var that = this
    var content = e.detail.value.review;

    if (content == undefined) {
      // 发送内容为空则不发送
    } else {
      console.log("点击发送")
      var taskId = that.data.taskId
      var publisherId = getApp().globalData.userId
      that.sendTaskComment(taskId, publisherId, content, false)//传后台
      that.setData({
        Inputcontent: "",
      });
    }
  },

  //聊天框按回车发送消息
  ChatInput: function (e) {
    var that = this;
    var content = e.detail.value;

    if(content == undefined) {
      // 发送内容为空则不发送
    } else {
      var taskId = that.data.taskId
      var publisherId = getApp().globalData.userId
      that.sendTaskComment(taskId, publisherId, content,false)//传后台
      that.setData({
        Inputcontent : "",
        focus:false,
      });
    }
    
  },

  //聊天框发送图片
  PictrueSelect:function (e) {
    // 使页面滚动到评论区
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      wx.pageScrollTo({
        scrollTop: rect.height - 200
      })
    }).exec()
    var that = this;
    var taskId = that.data.taskId
    var publisherId = getApp().globalData.userId
    that.sendTaskCommentPicture(taskId, publisherId, true)//传后台
    
  },

  //聊天框预览图片
  previewImage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log(index);
    var chat = that.data.chat;
    console.log(chat[index].content);
    wx.previewImage({
      current: chat[index].content, // 当前显示图片的http链接
      urls: [chat[index].content] // 需要预览的图片http链接列表
    })
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  /**
  * 获取某个任务的基本信息
  */
  getTaskDetail:function (taskId){
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    taskQuery.get(taskId, {
      success: function (result) {
        console.log("任务详情：",result)
        that.setData({
          leaderId:result.attributes.leader.id,
          checked: result.attributes.is_finish,
          projectName: that.data.projectName,
          title: result.attributes.title,
          deadline: result.attributes.end_time,
        })
        //提醒时间
        if (result.attributes.noti_time != null && result.attributes.noti_time!=''){
          that.setData({
            showRemindTime: true,
            remindtime: result.attributes.noti_time,
          })
        }
        //反馈时间
        if (result.attributes.feedback_time != null && result.attributes.feedback_time != '') {
          that.setData({
            showFeedbackTime: true,
            feedbacktime: result.attributes.feedback_time,
          })
        }
        //反馈模板
        if (result.attributes.feedback_mod != null && result.attributes.feedback_mod != '') {
          that.setData({
            showFeedbackModel: true,
            feedback_mod: result.attributes.feedback_mod,
          })
        }
        //任务描述
        if (result.attributes.desc != null && result.attributes.desc != '') {
          that.setData({
            showDescription: true,
            taskDesc: result.attributes.desc,
          })
        }
        // 加载完成
        wx.hideLoading()
      },
      error: function (error) {
        //失败
      }
    })
  },
  
  /**
 *添加任务记录
 */
  addTaskRecord:function (taskId, userName, record){
    var TaskRecord = Bmob.Object.extend('task_record')
    var taskrecord = new TaskRecord()

    //存储任务记录
    taskrecord.save({
      user_name: userName,
      task_id: taskId,
      record: userName + record
    }, {
        success: function (result) {
          //添加成功

        },
        error: function (result, error) {
          //添加失败

        }
      })
  },

  /**
 * 2018-05-29
 * 更改任务标题
 */
  modifyTaskTitle: function (taskId, newTitle, userName) {

    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    //完成任务
    taskQuery.get(taskId, {
      success: function (result) {
        //成功情况
        result.set('title', newTitle)
        result.save()
        //记录操作
        that.addTaskRecord(taskId, userName, MODIFY_TASK_TITLE)
        //成功
        wx.showToast({
          title: '设置成功',
        })
      },
      error: function (object, error) {
        //失败情况
      }
    })
  },

  /**
 * @parameter taskId 任务id, isFinish 是布尔类型，true表示做完,userName操作人的昵称（用来存在历史操作记录表用）
 * 完成任务
 */
  finishTask:function (taskId, isFinish, userName){
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    //完成任务
    taskQuery.get(taskId, {
      success: function (result) {
        //成功情况
        result.set('is_finish', isFinish)
        result.save()
        //记录操作
        if(isFinish == true)
          that.addTaskRecord(taskId, userName, FINISH_TASK + result.get('title'))
        else
          that.addTaskRecord(taskId, userName, REDO_TASK + result.get('title'))

      },
      error: function (object, error) {
        //失败情况
      }
    })
  },

  /**
 * 2018-05-29
 * @parameter taskId任务id，leaderId任务负责人的id
 * 获取任务成员，成员数组的第一个是任务负责人
 */
  getTaskMember:function (taskId, leaderId){
    var that =  this
    var TaskMember = Bmob.Object.extend('task_member')
    var taskmemberQuery = new Bmob.Query(TaskMember)

    var memberArr = []  //任务成员数组
    //查询任务成员
    taskmemberQuery.equalTo("task_id", taskId)
    taskmemberQuery.include("user_id")
    taskmemberQuery.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          var result = results[i]
          if (leaderId == result.get("user_id").objectId) {
            memberArr.unshift(result.get("user_id"))
          } else {
            memberArr.push(result.get("user_id"))
          }
        }
        console.log("任务成员", memberArr)
        //在这里设置setData
        that.setData({
          member: memberArr
        })


        // 加载完成
        wx.hideLoading()


      },
      error: function (error) {
        console.log(error)
      }
    })
  },
  
  
  /**
   * @parameter taskId任务id，feedbackMod反馈时间，userName操作人的昵称（用来存在历史操作记录表用）
   * 修改任务截止时间
   */
  modifyEndTime:function (taskId, endTime, userName){
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    //添加截止时间
    taskQuery.get(taskId, {
      success: function (result) {
        //成功情况
        result.set('end_time', endTime)
        result.save()
        //记录操作
        that.addTaskRecord(taskId, userName, MODIFY_END_TIME)
        //修改截止时间成功
        wx.showToast({
          title: '设置成功',
        })
      },
      error: function (object, error) {
        //失败情况
      }
    })
  },



/**
 * @parameter taskId 任务id,userName用户昵称（记录操作用）
 * 删除截止时间
 */
deleteEndTime:function (taskId, userName) {
    var that =  this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    //删除截止时间
    taskQuery.get(taskId, {
      success: function (result) {
        result.set('end_time', '')  //设为‘’ 空
        result.save()
        //console.log("删除截止时间成功")
        that.addTaskRecord(taskId, userName, DELETE_END_TIME)
        //成功
        wx.showToast({
          title: '删除成功',
        })
      },
      error: function (error) {
         console.log("error")
      }
    })
  },

//滑动删除截止时间：滑动事件处理
  touchmoveDeadline: function (e) {
  var that = this
  var startX = that.data.startX//开始X坐标
  var startY = that.data.startY//开始Y坐标
  var touchMoveX = e.changedTouches[0].clientX//滑动变化坐标
  var touchMoveY = e.changedTouches[0].clientY//滑动变化坐标
  //获取滑动角度
  var angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
  //获取滑动数据
  var DeadlineisTouchMove = this.data.DeadlineisTouchMove
  var DeadlinetxtStyle = this.data.DeadlinetxtStyle
  DeadlineisTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
      if (touchMoveX > startX) //右滑
      {
        DeadlinetxtStyle = ""
        DeadlineisTouchMove = false
      }
      else //左滑
      {
        DeadlinetxtStyle = "margin-left:-" + 200 + "px";
        DeadlineisTouchMove = true
      }
  //更新列表的状态
  that.setData({
      DeadlineisTouchMove: DeadlineisTouchMove,
      DeadlinetxtStyle: DeadlinetxtStyle,
  });
},
  //删除截止时间
  delDeadline: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除截止时间吗？',
      success: function (res) {
        if (res.confirm) {
          if (that.data.deadline == ""){
            wx.showToast({
              title: '已经没有东西能删啦',
              icon:"none",
              duration:1500,
            })
            that.setData({
              DeadlineisTouchMove: false,
              DeadlinetxtStyle: "",
            })
          }
          else {
            var userName = getApp().globalData.nickName
            var taskId = that.data.taskId
            that.deleteEndTime(taskId, userName)
            that.setData({
              DeadlineisTouchMove: false,
              DeadlinetxtStyle: "",
              deadline: '',
            })
          }
        }
      }
    })
  },


/**
 * @parameter taskId任务id，notiTime提醒时间，userName操作人的昵称（用来存在历史操作记录表用）
 * 修改提醒时间
 */
  modifyNotiTime: function (taskId, notiTime, userName) {
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    //修改提醒时间
    taskQuery.get(taskId, {
      success: function (result) {
        //成功添加情况
        result.set('noti_time', notiTime)
        result.save()
        //记录操作
        that.addTaskRecord(taskId, userName, MODIFY_NOTI_TIME)
        console.log("modifyNotiTime", result)
        //成功
        wx.showToast({
          title: '设置成功',
        })
      },
      error: function (object, error) {
        //失败情况
      }
    })
  },

  /**
* @parameter taskId 任务id,userName用户昵称（记录操作用）
* 删除提醒时间
*/
  deleteNotiTime: function (taskId, userName) {
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    //删除提醒时间
    taskQuery.get(taskId, {
      success: function (result) {
        result.set('noti_time', '')  //设为‘’ 空
        result.save()
        //console.log("删除提醒时间成功")
        that.addTaskRecord(taskId, userName, DELETE_NOTI_TIME)
        //成功
        wx.showToast({
          title: '删除成功',
        })
      },
      error: function (error) {

        console.log("error")
      }
    })

  },


  //滑动删除提醒时间：滑动事件处理
  touchmoveRemindtime: function (e) {
    var that = this
    var startX = that.data.startX//开始X坐标
    var startY = that.data.startY//开始Y坐标
    var touchMoveX = e.changedTouches[0].clientX//滑动变化坐标
    var touchMoveY = e.changedTouches[0].clientY//滑动变化坐标
    //获取滑动角度
    var angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    //获取滑动数据
    var RemindtimeisTouchMove = this.data.RemindtimeisTouchMove
    var RemindtimetxtStyle = this.data.RemindtimetxtStyle
    RemindtimeisTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if (touchMoveX > startX) //右滑
    {
      RemindtimetxtStyle = ""
      RemindtimeisTouchMove = false
    }
    else //左滑
    {
      RemindtimetxtStyle = "margin-left:-" + 200 + "px";
      RemindtimeisTouchMove = true
    }
    //更新列表的状态
    that.setData({
      RemindtimeisTouchMove: RemindtimeisTouchMove,
      RemindtimetxtStyle: RemindtimetxtStyle,
    });
  },
  //删除提醒时间
  delRemindtime: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除提醒时间吗？',
      success: function (res) {
        if (res.confirm) {
          var userName = getApp().globalData.nickName
          var taskId = that.data.taskId
          that.deleteNotiTime(taskId, userName)
          that.setData({
            RemindtimeisTouchMove: false,
            RemindtimetxtStyle:'' ,
            remindtime:'',
            showRemindTime:false,
          })
        }
      }
    })
  },


  /**
 * @parameter taskId任务id，feedBackTime反馈时间，userName操作人的昵称（用来存在历史操作记录表用）
 * 修改反馈时间
 * 
 */
  modifyFeedbackTime:function (taskId, feedBackTime, userName){
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    //添加反馈时间
    taskQuery.get(taskId, {
      success: function (result) {
        //成功情况
        result.set('feedback_time', feedBackTime)
        result.save()
        //记录操作
        that.addTaskRecord(taskId, userName, MODIFY_FEEDBACK_TIME)

        //成功
        wx.showToast({
          title: '设置成功',
        })
      },
      error: function (object, error) {
        //失败情况
      }
    })
  },

  /**
 * @parameter taskId 任务id,userName用户昵称（记录操作用）
 * 删除反馈时间
 */
  deleteFeedbackTime: function (taskId, userName) {
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    //删除反馈时间
    taskQuery.get(taskId, {
      success: function (result) {
        result.set('feedback_time', '')  //设为‘’ 空
        result.save()
        //console.log("删除反馈时间成功")
        that.addTaskRecord(taskId, userName, DELETE_FEEDBACK_TIME)
        //成功
        wx.showToast({
          title: '删除成功',
        })
      },
      error: function (error) {

        console.log("error")
      }
    })
  },

  
  //滑动删除反馈时间：滑动事件处理
  touchmoveFeedback: function (e) {
    var that = this
    var startX = that.data.startX//开始X坐标
    var startY = that.data.startY//开始Y坐标
    var touchMoveX = e.changedTouches[0].clientX//滑动变化坐标
    var touchMoveY = e.changedTouches[0].clientY//滑动变化坐标
    //获取滑动角度
    var angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    //获取滑动数据
    var FeedbackisTouchMove = this.data.FeedbackisTouchMove
    var FeedbacktxtStyle = this.data.FeedbacktxtStyle
    FeedbackisTouchMove = false
    //滑动超过30度角 return
    if (Math.abs(angle) > 30) return;
    if (touchMoveX > startX) //右滑
    {
      FeedbacktxtStyle = ""
      FeedbackisTouchMove = false
    }
    else //左滑
    {
      FeedbacktxtStyle = "margin-left:-" + 200 + "px";
      FeedbackisTouchMove = true
    }
    //更新列表的状态
    that.setData({
      FeedbackisTouchMove: FeedbackisTouchMove,
      FeedbacktxtStyle: FeedbacktxtStyle,
    });
  },
  //删除反馈时间
  delFeedback: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除反馈时间吗？',
      success: function (res) {
        if (res.confirm) {
          var userName = getApp().globalData.nickName
          var taskId = that.data.taskId
          that.deleteFeedbackTime(taskId, userName)
          that.setData({
            FeedbackisTouchMove: false,
            FeedbacktxtStyle: '',
            feedbacktime:'',
            showFeedbackTime:false,
          })
        }
      }
    })
  },

  /**
 * @parameter taskId 任务id,userName用户昵称（记录操作用）
 * 删除任务
 */
  deleteTask:function (taskId, userName) {
    var that = this
    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    //删除反馈时间
    taskQuery.get(taskId, {
      success: function (result) {
        result.set('is_delete', true)  //设为‘’ 空
        result.save()
        //console.log("删除反馈时间成功")
        //不用记录操作
        wx.showToast({
          title: '删除成功',
          icon:"success"
        })
        wx.removeStorageSync("TaskDetail-taskId")
      },
      error: function (error) {

      }
    })
  },


  
 

  /**
   * 2018-05-29
   * @parameter taskId 为父任务id
   * 获取某一任务下的子任务（默认20个）,最先创建的排在最前面
   */
  getSubtasks:function (taskId){
    var that = this
    var Subtask = Bmob.Object.extend('sub_task')
    var subtaskQuery = new Bmob.Query(Subtask)

    //获取子任务（20个）
    subtaskQuery.equalTo("task_id", taskId)
    subtaskQuery.include("user")
    subtaskQuery.ascending("createdAt")
    subtaskQuery.limit(20)

    subtaskQuery.find({
      success: function (results) {
        //成功,results即为结果数组
        if (results != null) {
          //在这里设置setData
          console.log("getSubtasks:", results)
          var ChildTask = []
          for (var i in results){
            var object = {}
            object = {
              subtask_id: results[i].id,
              is_finish: results[i].attributes.is_finish,
              childTitle: results[i].attributes.title,
              userPic: results[i].attributes.user.userPic,
              clickChild:0,
              isTouchMove:false,
              txtStyle:'',
            }
            ChildTask.push(object)
          }
          that.setData({
            ChildTask: ChildTask
          })
          console.log("ChildTask:", that.data.ChildTask)
        }
        // 加载完成
        wx.hideLoading()
      },
      error: function (error) {

      }
    })
  },

/**
 * 2018-05-29
 * @parameter subTaskId 子任务的id，is_finish 为true
 * 完成某个子任务
 */
  finishSubTask: function (taskId, subTaskId, is_finish ,userName) {
      var that = this
      var Subtask = Bmob.Object.extend('sub_task')
      var subtaskQuery = new Bmob.Query(Subtask)

      //更改子任务为完成状态
      subtaskQuery.get(subTaskId, {
      success: function (result) {
        //成功
        result.set("is_finish", is_finish)
        result.save()
        //记录
        if (is_finish == true)
          that.addTaskRecord(taskId, userName, FINISH_SUB_TASK + result.get('title'))
        else
          that.addTaskRecord(taskId, userName, REDO_SUB_TASK + result.get('title'))

      },
      error: function (error) {
        //失败

      }
    })
  },

/**
 * 2018-05-29
 * @parameter subTaskId 子任务的id，is_finish 为false
 * 重做某个子任务
 */
redoSubTask:function (subTaskId, is_finish) {
    var that = this
    var Subtask = Bmob.Object.extend('sub_task')
    var subtaskQuery = new Bmob.Query(Subtask)

    //更改子任务为完成状态
    subtaskQuery.get(subTaskId, {
      success: function (result) {
        //成功
        result.set("is_finish", is_finish)
        result.save()
        //记录
        addTaskRecord(taskId, userName, REDO_SUB_TASK + result.get('title'))

      },
      error: function (error) {
        //失败

      }
    })
  },

/**
 * 2018-05-29
 * @parameter subTaskId子任务的id ， newTitle 新任务标题
 * 修改子任务标题
 */
  modifySubTaskTitle: function (subTaskId, newTitle, userName) {
    var that = this
    var Subtask = Bmob.Object.extend('sub_task')
    var subtaskQuery = new Bmob.Query(Subtask)

    //更改子任务为完成状态
    subtaskQuery.get(subTaskId, {
      success: function (result) {
        //成功
        result.set("title", newTitle)
        result.save()
        //记录
        that.addTaskRecord(taskId, userName, MODIFY_SUB_TASK_TITLE)
        //成功
        wx.showToast({
          title: '设置成功',
        })
      },
      error: function (error) {
        //失败

      }
    })
  },

/**
 * @parameter subTaskId 子任务id,userName用户昵称（记录操作用）subTaskTitle子任务名称（记录操作用）
 * 删除子任务
 */
deleteSubTask:function (taskId,subTaskId, userName, subTaskTitle) {
    var that = this
    var Subtask = Bmob.Object.extend('sub_task')
    var subtaskQuery = new Bmob.Query(Subtask)

    //删除子任务
    subtaskQuery.equalTo('objectId', subTaskId)
    subtaskQuery.destroyAll({
      success: function () {
        //删除成功
        console.log("删除子任务成功！")
        that.modifySubNum(taskId,-1)
        //记录操作
        that.addTaskRecord(taskId, userName, DELETE_SUB_TASK + subTaskTitle)
        //成功
        wx.showToast({
          title: '删除成功',
        })
      },
      error: function (err) {
        // 删除失败
      }
    })
  },


  /**
   * 修改子任务的数量
   */
  modifySubNum: function (taskId,num) {

    var Task = Bmob.Object.extend('task')
    var taskQuery = new Bmob.Query(Task)

    taskQuery.get(taskId, {
      success: function (result) {
        //成功
        result.increment('sub_num',num)
        result.save()
      },
      error: function (error) {
        //失败
        console.log("修改子任务的数量失败:", error)
      }
    })
  },
  //滑动删除子任务：滑动事件处理
  touchmove: function (e) {
     var that = this
     var index = e.currentTarget.dataset.index//当前索引
     var startX = that.data.startX//开始X坐标
     var startY = that.data.startY//开始Y坐标
      var touchMoveX = e.changedTouches[0].clientX//滑动变化坐标
      var touchMoveY = e.changedTouches[0].clientY//滑动变化坐标
      //获取滑动角度
      var angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
      var ChildTask = that.data.ChildTask
      ChildTask.forEach(function (v, i) {
       v.isTouchMove = false
        //滑动超过30度角 return
        if (Math.abs(angle) > 30) return;
        if (i == index) {
           if (touchMoveX > startX) //右滑
           {
              v.txtStyle = ""
              v.isTouchMove = false
           }
           else //左滑
           {
             v.txtStyle = "margin-left:-" + 200 + "px";
             v.isTouchMove = true
           }
        }
   })
    //更新列表的状态
    that.setData({
      ChildTask: ChildTask
    });
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
     var _X = end.X - start.X,
      _Y = end.Y - start.Y
     //返回角度 /Math.atan()返回数字的反正切值
     return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  
},
  //删除子任务
  del: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除子任务吗？',
      success:function(res){
       if(res.confirm){
         that.data.ChildTask.splice(e.currentTarget.dataset.index, 1)
         var subTaskId = e.currentTarget.dataset.id
         var taskId = that.data.taskId
         var subTaskTitle = e.currentTarget.dataset.childTitle
         var userName = getApp().globalData.nickName
         that.deleteSubTask(taskId,subTaskId, userName, subTaskTitle)
         that.setData({
           ChildTask: that.data.ChildTask
         })
       }
      }
    })
    
  
},

  /**
   * 2018-05-29
   * @parameter taskId 任务id
   * 获取任务记录 , 一次50条,时间越久远的排在越后面
   */
  getTaskRecord:function (taskId){
    var that = this
    var TaskRecord = Bmob.Object.extend('task_record')
    var taskrecordQuery = new Bmob.Query(TaskRecord)

    //查询任务记录
    taskrecordQuery.select("record")
    taskrecordQuery.equalTo("task_id", taskId)
    taskrecordQuery.descending("createdAt")
    taskrecordQuery.limit(50)
    taskrecordQuery.find({
      success: function (results) {
        //成功
        //在这里设置setData
        // console.log("获取的任务记录", results)
        var taskremind = []
        for (var i in results){
          var object = {
            text: results[i].attributes.record,
            time: results[i].createdAt.substring(0,16)
          }
          taskremind.push(object)
        }
        console.log("获取的任务记录", taskremind)
        that.setData({
          taskremind: taskremind
        })
        // 加载完成
        wx.hideLoading()
      },
      error: function (error) {
        //失败
        console.log("获取任务记录失败！", error)
      }
    })


  },

  /**
 * 获取某个任务的评论（50条）,按时间由近到远排序
 */
  getTaskComment:function (taskId){
    var that = this
    var Taskcommment = Bmob.Object.extend('task_comment')
    var taskcommentQuery = new Bmob.Query(Taskcommment)
    var commentList = new Array()  //获取的评论列表

    //获取评论
    taskcommentQuery.equalTo('task_id', taskId)
    taskcommentQuery.descending('createdAt')
    taskcommentQuery.include('publisher')  //获取发布人的信息
    taskcommentQuery.limit(50)
    taskcommentQuery.find({
      success: function (results) {
        //成功返回results     
        for (var i in results) {
          var commentId = results[i].id;  //评论id
          var userPic = results[i].get('publisher').userPic  //发布评论的人的头像
          var content = results[i].get('content')  //评论内容
          var createdAt = results[i].createdAt  //评论时间
          var isImg = results[i].get('is_img')
          var comment;
          comment = {
            "content": content,
            'icon': userPic,
            'judgepictrue': isImg,
            "commentId": commentId,
            "time": createdAt.substring(0,16)
          }
          commentList.push(comment)
        }
        //在这里setData
        console.log("获取评论成功!", commentList)
        that.setData({
          chat: commentList
          })
        // 加载完成
        wx.hideLoading()
      },
      error: function (error) {
        //获取评论失败
        console.log("获取评论失败!", error)
      }

    })
  },

/**
 * 2018-06-02
 * @parameter taskId任务id, publisherId评论人的id, content评论内容
 * 发布评论，沟通模板也可以用这个函数，沟通模板的内容就是content
 */
sendTaskComment:function (taskId, publisherId, content,isImg) {
    var that= this
    var Taskcommment = Bmob.Object.extend('task_comment')
    var taskcomment = new Taskcommment()

    var publisher = Bmob.Object.createWithoutData("_User", publisherId)  //发布人的信息
    //添加任务评论
    taskcomment.save({
      publisher: publisher,
      content: content,  //评论内容
      task_id: taskId,  //任务id
      is_img: isImg     //内容不是图片
    }, {
        success: function (result) {
          // 添加成功
          console.log("提示用户评论成功!")
          wx.showToast({
            title: '评论成功',
          })
          that.getTaskComment(taskId)
        },
        error: function (result, error) {
          // 添加失败
          console.log("提示用户评论失败!")
        }
      })
  },

/**
 * 2018-06-02
 * 发图片，发布任务评论的图片
 * 内部调用了函数sendTaskComment
 */
sendTaskCommentPicture:function (taskId, publisherId) {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 0) {
          var name = "1.jpg";//上传的图片的别名，建议可以用日期命名
          var file = new Bmob.File(name, tempFilePaths);
          file.save().then(function (res) {

            //res.url()是上传图片后的 url
            //console.log(res.url());
            that.sendTaskComment(taskId, publisherId, res.url(),true) //存储图片路径url
             
          }, function (error) {
            console.log(error);
          })
        }

      }
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
    wx.showLoading({
      title: '正在加载',
      mask: 'true'
    })
    var that = this;
    //任务
    wx.getStorage({
      key: 'ProjectMore-Task',
      success: function(res) {
        console.log("In ProjectMore-Task", res.data)
        var taskId = res.data.objectId//任务id
        var leaderId = res.data.leaderId//任务负责人id
        that.setData({
          taskId: taskId,
          leaderId: leaderId
        })
        that.getTaskDetail(taskId);//获取任务详情
        that.getTaskMember(taskId, leaderId)//获取任务成员
        that.getSubtasks(taskId);//获取子任务列表
        that.getTaskRecord(taskId)//获取任务记录
        that.getTaskComment(taskId)//获取评论
      },
    })
    //获取项目数据
    wx.getStorage({
      key: "ProjectMore-projName",
      success: function (res) {
        console.log("In Project-detail", res.data)
        that.setData({
          projectName: res.data
        })
      },
    })
    //更改任务负责人时刷新后台
    var leaderId = wx.getStorageSync('changePrincipal-newLeaderId')//任务负责人ID
    var taskId = that.data.taskId
    if (taskId != "" && leaderId != "") {
      console.log("新负责人：刷新后台！", taskId, leaderId)
      wx.showLoading({
        title: '正在加载',
        mask: 'true'
      })
      that.setData({
        leaderId: leaderId
      })
      that.getTaskMember(taskId, leaderId)//获取任务成员
      that.getSubtasks(taskId);//获取子任务列表
    }
    else{
      //返回时刷新后台
      that.getTaskMember(taskId, that.data.leaderId)//获取任务成员
      that.getSubtasks(taskId);//获取子任务列表
    }
    // console.log("taskId", taskId)
    // console.log("leaderId", leaderId)
    // that.getTaskDetail(taskId);//获取任务详情
    

    //项目成员
    wx.getStorage({
      key: 'ProjectMore-projectMember',
      success: function (res) {
        var memberList = res.data
        console.log('ProjectMore-projectMember', memberList)
        that.setData({
          projectMember: memberList
        })
      },
    })

    //发送沟通模板
      var currentT = new Date().toLocaleString()//获取当前时间
      var currentTime = currentT.substring(9, 15)
      var scrollTop = that.data.scrollTop;
      scrollTop += 200;
      var chat = that.data.chat;
      wx.getStorage({
        key: 'CommModel',
        success: function (res) {
          var content = res.data;
          console.log("沟通模板！",content);
          var taskId = that.data.taskId//当前任务ID
          var publisherId = getApp().globalData.userId//当前操作用户ID
          var userPic = getApp().globalData.userPic//当前操作用户头像
          that.sendTaskComment(taskId, publisherId, content)//传后台
          chat.push({
            content: content, //我发送的内容
            icon: userPic,//我的头像
            time: currentTime,//时间
          });
          that.setData({
            chat: chat,
            Inputcontent: "",
            scrollTop: scrollTop,
          });
        }
      })
      wx.clearStorage();

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
    //  wx.removeStorageSync("FeedBack-content")
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
  onShareAppMessage: function (res) {

  }
})
