// pages/ProjectMore/ProjectMore.js
var Bmob = require('../../../utils/bmob.js')
var FINISH_TASK = "完成任务"
var REDO_TASK = "重做任务"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem: 0,//当前swiper滑块的位置
    index: '',//当前任务列表下标
    check: [],//任务勾选
    hiddenmodalputTitle: true,//弹出任务列表标题模态框
    inputTitle: '',//输入任务列表标题
    listId: '',//当前任务列表Id
    currentProjId: "",//当前项目ID
    currentProjName: "",//当前项目名


    //隐藏判断
    exitTask: true,
    exitAnnouncement: false,
    exitSchedule: false,
    exitMeeting: false,
    exitIdea: false,

    //任务列表
    tasklist: [

      "",//任务列表标题
      // {
      //   title:'待处理',
      //   //任务项
      //   tasks: [
      //     {
      //       is_finish: false,
      //       title: '寻找嘉宾',
      //       has_sub:'true',
      //       end_time: '2018-06-01',
      //       timeStatus: 'red',
      //     },
      //     {
      //       is_finish: false,
      //       title: '发送邀请函',
      //       has_sub: 'true',
      //       end_time: '2018-06-02',
      //       timeStatus: 'red',
      //     },
      //     {
      //       is_finish: false,
      //       title: '物资申请与采购',
      //       has_sub: 'true',
      //       end_time: '2018-06-03',
      //       timeStatus: 'green',
      //     },
      //     {
      //       is_finish: false,
      //       title: '场地申请与摆摊',
      //       has_sub: 'true',
      //       end_time: '2018-06-05',
      //       timeStatus: 'green',
      //     },
      //     {
      //       is_finish: false,
      //       title: '活动执行',
      //       has_sub: 'true',
      //       end_time: '2018-06-10',
      //       timeStatus: 'green',
      //     },
      //   ]
      // },

      // {
      //   title: '已完成',
      //   //任务项
      //   tasks: [
      //     {
      //       is_finish: 'true',
      //       title: '调研同学们需求',
      //       has_sub: 'true',
      //       end_time: '2018-05-01',
      //       timeStatus: 'green',
      //     },
      //     {
      //       is_finish: 'true',
      //       title: '撰写策划书',
      //       has_sub: 'true',
      //       end_time: '2018-05-07',
      //       timeStatus: 'green',
      //     },
      //     {
      //       is_finish: 'true',
      //       title: '完成策划书审核',
      //       has_sub: 'true',
      //       end_time: '2018-05-10',
      //       timeStatus: 'green',
      //     },
      //   ]
      // },
    ],

    //公告列表
    Announcement: [
      {
        id: '',
        icon: "/img/me.png",
        title: "我觉得ZHT太牛逼了",
        content: "因为ZHT也很牛逼balabal ...",
        time: "5月1日20:00",
        read: "0人已读",
        memberName: '',
      },
      {
        id: '',
        icon: "/img/me.png",
        title: "我觉得ZHT太牛逼了",
        content: "因为ZHT也很牛逼balabal ...",
        time: "5月1日20:00",
        read: "0人已读",
        memberName: '',
      },
    ],

    //日程列表
    Schedule: [
      // {
      //   month: "2018-05",
      // },
      // {
      //   daystart: "18日",
      //   dayend: "25日",
      //   title: "撰写策划书",
      //   task: [
      //     { id: 1, content: "调研需求 " },
      //     { id: 2, content: "开会讨论 " },
      //     { id: 3, content: "策划审核 " },
      //   ],
      // },
      // {
      //   daystart: "26日",
      //   dayend: "31日",
      //   title: "物资申请",
      //   task: [
      //     { id: 1, content: "填写物资申请单 " },
      //     { id: 2, content: "审核物资清单" },
      //     { id: 3, content: "采购物资" },
      //   ],
      // },
      // {
      //   month: "2018-06",
      // },
      // {
      //   daystart: "1日",
      //   dayend: "10日",
      //   title: "场地申请",
      //   task: [
      //     { id: 1, content: "填写场地申请单 " },
      //     { id: 2, content: "审核场地" },
      //     { id: 3, content: "到场踩点" },
      //   ],
      // },
      // {
      //   daystart: "11日",
      //   dayend: "18日",
      //   title: "活动进行",
      //   task: [
      //     { id: 1, content: "邀请嘉宾 " },
      //     { id: 2, content: "发邀请函" },
      //     { id: 3, content: "清点物资" },
      //     { id: 3, content: "审核主持人，PPT" },
      //   ],
      // },

    ],
    ScheduleYear: [],

    //会议列表
    Meeting: [
      {
        month: "2019年5月",
      },
      {
        day: "22日",
        time: "21:00",
        content: "策划讨论",
      },
      {
        day: "28日",
        time: "22:30",
        content: "讨论嘉宾人选",
      },
      {
        month: "2019年6月",
      },
      {
        day: "1日",
        time: "21:00",
        content: "讨论活动备案",
      },
    ],

    //墙列表
    idea: { img_visible: true, bg_img: '', },
    Idea: [
      {
        icon_avatar: '/img/member.png',
        icon_share: '/img/share.png',
        username: '点子狂想者',
        content: '学长说可以做明星专场！通过学校，老师，新媒体各种渠道去寻找。',
        task: '邀请嘉宾',
      },
      {
        icon_avatar: '/img/member.png',
        icon_share: '/img/share.png',
        username: '我不是蚂蚁',
        content: '希望学长说能设计很好看的宣传品，从而一直流传下去',
        task: '设计宣传品',
      },
      {
        icon_avatar: '/img/member.png',
        icon_share: '/img/share.png',
        username: '组织大佬',
        content: '这次预热活动就不要搞那么多花里胡哨的东西啦',
        task: '预热活动',
      },
      {
        icon_avatar: '/img/member.png',
        icon_share: '/img/share.png',
        username: '患者',
        content: '宣传品应该加一些复仇者联盟的元素',
        task: '设计宣传品',
      },
      {
        icon_avatar: '/img/member.png',
        icon_share: '/img/share.png',
        username: '策划大师',
        content: '策划的时候应该把握好方向，不能随意乱跑',
        task: '策划活动',
      },
      {
        icon_avatar: '/img/member.png',
        icon_share: '/img/share.png',
        username: '钢铁侠',
        content: '可以借拖车搬物资',
        task: '活动当天',
      },
      {
        icon_avatar: '/img/member.png',
        icon_share: '/img/share.png',
        username: '灭霸',
        content: 'ppt可以考虑加入灭霸的元素',
        task: '活动当天',
      },
    ],

  },

  //获取当前swiper页的下标
  onSlideChangeEnd: function (e) {
    var that = this;
    that.setData({
      currentItem: e.detail.current
    })
    console.log(e.detail.current);
  },

  //点击任务项
  ClickTask: function (e) {
    var that = this
    var currentItem = that.data.currentItem//当前任务列表下标
    var index = e.currentTarget.dataset.index//当前任务下标
    var taskId = e.currentTarget.id//当前任务ID
    var userName = getApp().globalData.nickName//当前操作用户
    var TakChecked = !e.currentTarget.dataset.checked//当前任务是否被选中
    that.finishTask(taskId, TakChecked, userName)

    var taskList = that.data.tasklist//任务列表
    var task = taskList[currentItem].tasks//任务
    for (var i in task) {
      if (i == index) {
        task[i].is_finish = !task[i].is_finish
      }
    }
    that.setData({
      tasklist: taskList
    })
  },


  //任务列表标题：点击按钮弹出指定的hiddenmodalput弹出框  
  modalinputTitle: function (e) {
    var that = this
    var title = e.currentTarget.dataset.title//当前任务列表标题
    var listId = e.currentTarget.dataset.id//当前任务列表id
    that.setData({
      listId: listId,
      inputTitle: title,
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
    var listId = that.data.listId//当前任务列表id
    // var index = that.data.currentItem//当前任务列表下标
    // var taskList = "taskList["+index+"].title"
    that.modifyTaskListTitle(listId, that.data.inputTitle)
    that.setData({
      hiddenmodalputTitle: true,
    })
  },
  //任务列表标题输入
  input: function (e) {
    var that = this
    var inputTitle = e.detail.value
    that.setData({
      inputTitle: inputTitle
    })
  },

  // 添加，删除任务列表
  Taskmore: function (e) {
    var that = this;
    var tasklist = that.data.tasklist;
    var tasks = that.data.tasks;
    var listId = e.currentTarget.dataset.id;

    wx.showActionSheet({
      itemList: ['添加任务列表', '删除该任务列表'],
      success: function (res) {
        //添加任务列表
        if (res.tapIndex == 0) {
          wx.getStorage({
            key: "Project-detail",
            success: function (res) {
              var Length = tasklist.length;//数组长度
              tasklist.push({
                title: '新增'
              })
              that.setData({
                tasklist: tasklist,
                currentItem: Length,
              });
              var projId = res.data.id
              that.createTaskList(projId, "新增")//projId 项目id，title任务看板名称
            },
          })

        }

        //删除该任务列表
        if (res.tapIndex == 1) {
          that.deleteTaskList(listId)
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  // 导航栏选择任务
  selectTask: function () {
    var that = this;
    that.setData({
      exitTask: true,
      exitAnnouncement: false,
      exitSchedule: false,
      exitMeeting: false,
      exitIdea: false,
    });
  },

  // 导航栏选择公告
  selectAnnouncement: function () {
    var that = this;
    that.setData({
      exitTask: false,
      exitAnnouncement: true,
      exitSchedule: false,
      exitMeeting: false,
      exitIdea: false,
    });
  },

  // 导航栏选择日程
  selectSchedule: function () {
    var that = this;
    that.setData({
      exitTask: false,
      exitAnnouncement: false,
      exitSchedule: true,
      exitMeeting: false,
      exitIdea: false,
    });
  },

  // 导航栏选择会议
  selectMeeting: function () {
    var that = this;
    that.setData({
      exitTask: false,
      exitAnnouncement: false,
      exitSchedule: false,
      exitMeeting: true,
      exitIdea: false,
    });
  },

  // 导航栏选择墙
  selectIdea: function () {
    var that = this;
    that.setData({
      exitTask: false,
      exitAnnouncement: false,
      exitSchedule: false,
      exitMeeting: false,
      exitIdea: true,
    });
  },

  /**
   * 打开创建任务页面
   */
  createTask: function (event) {
    var listId = event.currentTarget.dataset.listId
    wx.setStorage({
      key: 'ProjectMore-TaskListId',
      data: listId,
    })
    wx.navigateTo({
      url: '../Task/buildTask/buildTask?list_id=' + listId
    })
  },

  /**
   * 打开创建公告页面
   */
  createAnnoun: function () {
    wx.navigateTo({
      url: '../Announcement/addAnnouncement/addAnnouncement'
    });
  },

  /**
   * 打开创建公告页面
   */
  createSchedule: function () {
    wx.navigateTo({
      url: '../Schedule/addSchedule/addSchedule'
    });
  },

  /**
   * 打开创建会议页面
   */
  createMeeting: function () {
    wx.navigateTo({
      url: '../Meeting/addMeeting/addMeeting'
    });
  },

  /**
   * 打开创建点子页面
   */
  createIdea: function () {
    wx.navigateTo({
      url: '../Idea/addIdea/addIdea'
    });
  },


  /**
   * 显示任务详情页面
   */
  showTask: function (e) {
    var that = this
    var taskListIndex = that.data.currentItem
    var projName = that.data.currentProjName
    var index = e.currentTarget.dataset.index
    console.log("显示任务详情:", that.data.tasklist[taskListIndex].tasks[index])
    wx.setStorage({
      key: "ProjectMore-Task",
      data: that.data.tasklist[taskListIndex].tasks[index],
    })
    console.log("显示任务详情:", projName)
    wx.setStorage({
      key: "ProjectMore-projName",
      data: projName,
    })
    wx.navigateTo({
      url: '../Task/TaskDetail/TaskDetail'
    });
  },

  /**
   * 显示会议详情页面
   */
  showMeetingDetail: function () {
    wx.navigateTo({
      url: '../Meeting/meetingDetail/meetingDetail'
    });
  },

  /**
   * 显示会议详情页面
   */
  showAnnouncementDetail: function (e) {
    var index = e.currentTarget.dataset.index
    wx.setStorageSync("AnnouncementDetail", this.data.Announcement[index])
    wx.navigateTo({
      url: '../Announcement/announcementDetail/announcementDetail'
    });
  },

  /**
   * 显示日程详情页面
   */
  showScheduleDetail: function () {
    wx.navigateTo({
      url: '../Schedule/scheduleDetail/scheduleDetail'
    });
  },

  /**
   * 显示点子详情页面
   */
  showIdeaDetail: function () {
    wx.navigateTo({
      url: '../Idea/ideaDetail/ideaDetail'
    });
  },

  /**
   *2018-05-18
   *@author mr.li
   @parameter projId 项目id
   *@return 指定项目的所有公告数组
   *根据项目id获取所有公告，默认10条（根据时间降序排列，即由近到远）
   * 
   */
  getAnnouncements: function (projId) {
    var that = this
    var Annoucement = Bmob.Object.extend("annoucement")
    var annoucementQuery = new Bmob.Query(Annoucement)

    var annoucementArr = []  //所有公告数组

    //查询出此项目中的所有公告，默认10条
    annoucementQuery.equalTo("proj_id", projId)
    annoucementQuery.include("publisher")
    annoucementQuery.descending("createdDate")  //根据时间降序排列
    annoucementQuery.find({
      success: function (results) {
        //console.log("共查询到公告 " + results.length + " 条记录");
        console.log('Announcements: \n')
        console.log(results)
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var result = results[i]
          console.log(result)
          var createdAt = result.createdAt.substring(0, 16)

          var object = {}
          object = {
            id: result.id,
            title: result.attributes.title,
            content: result.attributes.content,
            read: result.attributes.read_num,
            time: createdAt,
            icon: result.changed.publisher.userPic,
            memberName: result.changed.publisher.nickName,
            is_showmember: result.attributes.is_showmember,
          }
          annoucementArr.push(object)
        }

        //在这里setdata
        console.log("查询到的公告数组", annoucementArr)
        that.setData({
          Announcement: annoucementArr
        })




      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })

  },
  /**
 * 2018-05-19
 * @author mr.li
 * @parameter projId 项目id，title任务看板名称
 * 创建任务看板
 */
  createTaskList: function (projId, title) {
    var that = this
    var TaskList = Bmob.Object.extend("task_list")
    var taskList = new TaskList()

    //添加任务看板
    taskList.save({
      title: title,
      proj_id: projId,
      is_delete: false
    }, {
        success: function (result) {
          //添加任务看板成功
          console.log("提示用户添加任务看板成功!")


          that.getTaskLists(projId)




        },
        error: function (result, error) {
          //添加任务看板失败
          console.log("添加任务看板失败!")
        }
      })
  },

  /**
  * 获取任务列表
  * 2018-05-24
  * 根据项目id获取所有任务看板的id和标题
  * （函数内还默认会获取第一个看板的所有任务）
  */
  getTaskLists: function (projId) {

    var that = this
    var TaskList = Bmob.Object.extend('task_list')
    var tasklistQuery = new Bmob.Query(TaskList)

    //查询所有的任务列表
    tasklistQuery.ascending('createdAt')   //最先创建的排序最前面
    tasklistQuery.equalTo('proj_id', projId)
    tasklistQuery.notEqualTo("is_delete", true)

    //第一次默认添加任务看板
    console.log("taskList", TaskList)
    tasklistQuery.find({

      success: function (results) {
        //这里设置setdata
        console.log('Successfully got task lists: \n  ' + JSON.stringify(results));

        console.log("getTaskLists:", results)
        //results的第一个是最早创建的
        var listIndex = 0;
        console.log('results number: ' + results.length)

        var taskList = []
        //获取第一个任务看板的任务
        for (var i = 0; i < results.length; i++) {
          var object
          var task = new Array()
          object = {
            title: results[i].attributes.title,
            is_delete: results[i].attributes.is_delete,
            listId: results[i].id,
            tasks: task,
          }
          taskList.push(object)
          that.getTasks(results[i].id, i, taskList)
        }


      },
      error: function (error) {

      }
    })

  },

  /**
   * 2018-05-19
   * @author mr.li
   * @parameter
      listId 任务看板对应的id
      listIndex 任务看板所在数组下标
      tasklists 任务看板列表
   * 获取对应任务看板的所有任务（20条），数组
   * 每个任务为object类型
   */
  getTasks: function (listId, listIndex, tasklists) {

    console.log('查询任务信息：\nlistId: ' + listId + '\nlistIndex: ' + listIndex)

    var that = this
    var Task = Bmob.Object.extend("task")
    var taskQuery = new Bmob.Query(Task)

    //查询出对应的任务看板的所有任务
    taskQuery.limit(20)
    taskQuery.equalTo("list_id", listId)
    taskQuery.notEqualTo("is_delete", true)
    taskQuery.include("leader")  //可以查询出leader
    taskQuery.ascending("end_time")  //根据截止时间升序（越邻近排序最前面）
    taskQuery.find({
      success: function (tasks) {
        console.log("共查询到任务 " + tasks.length + " 条记录");

        // 改日期格式
        // 添加属性：日期状态
        for (var i = 0; i < tasks.length; i++) {
          var timeStatus = that.timeStatus(tasks[i].attributes.end_time)
          tasks[i]['attributes']['timeStatus'] = timeStatus
        }
        console.log('tasks: ')
        console.log(tasks)
        console.log('tasklists: ')
        console.log(tasklists)


        // 将任务插入到对应看板列表中
        for (var i in tasks) {
          var object
          object = {
            end_time: tasks[i].attributes.end_time,
            has_sub: tasks[i].attributes.has_sub,
            is_delete: tasks[i].attributes.is_delete,
            is_finish: tasks[i].attributes.is_finish,
            list_id: tasks[i].attributes.list_id,
            timeStatus: tasks[i].attributes.timeStatus,
            title: tasks[i].attributes.title,
            leaderId: tasks[i].attributes.leader.objectId,
            objectId: tasks[i].id,
          }
          tasklists[listIndex].tasks.push(object)
        }
        console.log("tasklists:", tasklists[listIndex])

        that.setData({
          tasklist: tasklists
        })
        console.log("tasklists:", that.data.tasklist)

      },
      error: function (error) {
        console.log("提示用户任务查询失败: " + error.code + " " + error.message);

      }
    })
  },

  timeStatus: function (end_time) {
    // 比较当前时间与截止时间的差值
    var that = this
    var currentTime = new Date(new Date().toLocaleDateString())
    var endTime = new Date(new Date(end_time.replace(/-/g, "/")))

    console.log('Original end time: '+end_time)
    console.log('Data: '+endTime.getDate())
    console.log('Time: ' + endTime.getTime())

    var days = endTime.getTime() - currentTime.getTime()
    var day = parseInt(days / (1000 * 60 * 60 * 24));  //时间差值
    if (day > 1) {
      return 'green'
    }
    else {
      return 'red'
    }


  },

  /**
   * 创建任务时，从项目成员中选一个负责人
   */
  getProjectMember: function (projId) {

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
      console.log("共查询到 " + results.length + " 条记录");
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
          console.log("共查询到项目成员 " + results.length + " 条记录");
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var object = results[i];
            var user
            user = {
              "id": object.id,
              "userPic": object.get("userPic"),
              "nickName": object.get("nickName"),
              "checked": ''
            }
            if (user.id == leader_id) {
              //将项目领导放在数组的第一个位置
              userArr.unshift(user)
            } else
              userArr.push(user)
          }
          //在这里设置setdata
          console.log("成员数组", userArr)
          wx.setStorage({
            key: 'ProjectMore-projectMember',
            data: userArr,
          })




        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
          //失败情况


        }
      })

    })
  },


  /**
* @parameter taskId 任务id, isFinish 是布尔类型，true表示做完,userName操作人的昵称（用来存在历史操作记录表用）
* 完成任务
*/
  finishTask: function (taskId, isFinish, userName) {
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
        if (isFinish == true)
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
 *添加任务记录
 */
  addTaskRecord: function (taskId, userName, record) {
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
 * 更改任务列表名
 */
  modifyTaskListTitle: function (listId, newTitle) {
    var that = this
    var Tasklist = Bmob.Object.extend('task_list')
    var tasklistQuery = new Bmob.Query(Tasklist)

    //更改任务列表名
    tasklistQuery.get(listId, {
      success: function (result) {
        result.set('title', newTitle)
        result.save()
        console.log("更改任务列表名成功")

        var index = that.data.currentItem//当前任务列表下标
        var taskList = that.data.tasklist
        console.log(taskList)
        for (var i in taskList) {
          console.log(index)
          if (i == index) {
            console.log(taskList[i].title)
            taskList[i].title = result.get('title')
          }
        }
        that.setData({
          tasklist: taskList
        })
      },
      error: function (error) {
        //失败
        console.log("更改任务列表名失败", error)
      }
    })
  },
  /**
 * 删除任务列表
 */
  deleteTaskList: function (listId) {

    var Tasklist = Bmob.Object.extend('task_list')
    var tasklistQuery = new Bmob.Query(Tasklist)

    if (listId != null) {
      tasklistQuery.equalTo('objectId', listId)
      tasklistQuery.destroyAll({
        success: function () {
          //删除成功
          console.log("提示用户任务列表删除成功!")
          wx.showToast({
            title: '删除成功',
          })


        },
        error: function (err) {
          // 删除失败
          console("提示用户删除任务列表成功")
        }
      })
    }

  },

  /**
 * @parameter projId 项目id
 * 获取日程
 */
  getSchedules: function (projId) {

    var that = this
    var Schedule = Bmob.Object.extend('schedule')
    var scheduleQuery = new Bmob.Query(Schedule)
    var ScheduleTask = Bmob.Object.extend('schedule_task')
    var scheduletaskQuery = new Bmob.Query(ScheduleTask)

    //查询日程
    scheduleQuery.equalTo('proj_id', projId)
    scheduleQuery.notEqualTo('is_delete', true)
    scheduleQuery.ascending('start_time')

    scheduleQuery.find({
      success: function (schedules) {
        var scheduleIds = []
        for (var i = 0; i < schedules.length; i++) {
          scheduleIds.push(schedules[i].id)
        }
        //获取日程关联的任务
        scheduletaskQuery.containedIn("schedule_id", scheduleIds)
        scheduletaskQuery.include("task")
        scheduletaskQuery.include("task.leader")
        scheduletaskQuery.find({
          success: function (results) {
            var scheduleObjectArr = []
            for (var i = 0; i < schedules.length; i++) {

              // 处理开始时间，整理出年月日
              var startTimeDate = new Date(new Date(schedules[i].get('start_time').replace(/-/g, "/")))
              var startYear = startTimeDate.getFullYear()   // 开始时间年月日
              var startMonth = startTimeDate.getMonth()
              var startDate = startTimeDate.getDate()

              var endTimeDate = new Date(new Date(schedules[i].get('end_time').replace(/-/g, "/")))
              var endMonth = endTimeDate.getMonth()   // 截至时间月日
              var endDate = endTimeDate.getDate()

              var scheduleObject = {}
              scheduleObject = {
                "objectId": '0',     //日程关联任务的id ，不是日程，也不是任务，而是两个的关联的id ，hh后面会设置
                "scheduleId": schedules[i].id,  //日程id
                "scheduleContent": schedules[i].get('content'),
                "startTime": schedules[i].get('start_time'),
                "startYear": startYear,
                "startMonth": startMonth,
                "startDate": startDate,
                "endMonth": endMonth,
                "endDate": endDate,

                "endTime": schedules[i].get('end_time'),
                "expanded": false,  // 判断是否有点击隐藏
                "tasks": []  //关联的任务数组
              }
              //注意下面的for循环是 j ，不是 i 
              for (var j = 0; j < results.length; j++) {
                if (results[j].get("schedule_id") == scheduleObject.scheduleId) {
                  scheduleObject.objectId = results[j].id  //日程关联任务的id
                  var taskObject = {
                    "task_id": results[j].get("task").objectId,
                    "task_title": results[j].get("task").title,
                    "task_userPic": results[j].get("task").leader.userPic
                  }
                  scheduleObject.tasks.push(taskObject)
                }
              }
              scheduleObjectArr.push(scheduleObject)
            }
            //scheduleObjectArr才是最终要获取的日程数组，每个日程下面包括有关联的任务的数据
            //在这里setData
            console.log('日程列表：\n')
            console.log(scheduleObjectArr)

            // 对日程按年进行排序并分组
            var currentYear = new Date().getFullYear()
            var scheduleYear = [
              {
                'id': 0,
                'year': currentYear,
                'schedules': [],
              }
            ]
            
            for (var i in scheduleObjectArr) {
              for (var j in scheduleYear) {
                // 若此日程在本年份中
                if(scheduleObjectArr[i].startYear == scheduleYear[j].year) {
                  // 将此日程加入本年份的日程列表中
                  scheduleYear[j].schedules.push(scheduleObjectArr[i])
                  // 跳出循环
                  break

                } else if(j == (scheduleYear.length-1)) {
                  // 已到本年份最后一个日程
                  // 新建一个年份的日程列表
                  var yearObject = {
                    'id': parseInt(j)+1,
                    'year': scheduleObjectArr[i].startYear,
                    'schedules': [scheduleObjectArr[i]]
                  }
                  scheduleYear.push(yearObject)
                  break
                }
              }
            }

            that.setData({
              Schedule: scheduleObjectArr,
              ScheduleYear: scheduleYear
            })


          },
          error: function (error) {
            //获取日程关联的任务失败
            wx.showToast({
              title: '查询日程关联的任务失败，请稍后再试',
              icon: 'none',
              duration: 1000
            })
          }
        })
      },
      error: function (error) {
        //查询日程失败
        wx.showToast({
          title: '查询日程失败，请稍后再试',
          icon: 'none',
          duration: 1000
        })
      }
    })

  },

  /**
   * 
   * 显示/隐藏日程
   */
  expandSchedule: function(e) {

    var that = this
    console.log('点击数组信息：', e)

    var yearIndex = parseInt(e.currentTarget.dataset.yearIndex)
    var scheduleIndex = parseInt(e.currentTarget.dataset.scheduleIndex)

    console.log('yearIndex: '+yearIndex+'\nScheIndex: '+scheduleIndex)
    var flag = that.data.ScheduleYear[yearIndex].schedules[scheduleIndex].expanded
    console.log("flag: "+flag)
    // ScheduleYear[yearIndex].schedules[scheduleIndex].expaned
    var path = 'ScheduleYear['+yearIndex+'].schedules['+scheduleIndex+'].expanded'

    if(flag) {
      that.setData({
        [path]: false
      })
    } else {
      that.setData({
        [path]: true
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
    wx.startPullDownRefresh()//刷新
    wx.getStorage({
      key: "Project-detail",
      success: function (res) {
        console.log("onshow:project", res.data)
        var ProjectId = res.data.id//获取项目ID
        var ProjectName = res.data.name//获取项目名
        that.setData({
          currentProjId: ProjectId,
          currentProjName: ProjectName
        })

        that.getAnnouncements(ProjectId)  // 获取公告ID
        that.getTaskLists(ProjectId);     // 获取任务ID
        that.getProjectMember(ProjectId); // 获取项目成员
        that.getSchedules(ProjectId)      // 获取日程列表

      },
    })
    // if (that.data.exitTask == true)//只刷新任务页
    // {
    //   var currentProjId = that.data.currentProjId
    //   console.log("当前项目ID", currentProjId)
    //   that.getTaskLists(currentProjId);//获取任务ID
    //   that.getProjectMember(currentProjId);//获取项目成员
    // }


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
