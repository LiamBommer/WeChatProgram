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
    check:[],//任务勾选
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
        id:'',
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
      {
        month: "2018-05",
      },
      {
        daystart: "18日",
        dayend: "25日",
        title: "撰写策划书",
        task: [
          { id: 1, content: "调研需求 " },
          { id: 2, content: "开会讨论 " },
          { id: 3, content: "策划审核 " },
        ],
      },
      {
        daystart: "26日",
        dayend: "31日",
        title: "物资申请",
        task: [
          { id: 1, content: "填写物资申请单 " },
          { id: 2, content: "审核物资清单" },
          { id: 3, content: "采购物资" },
        ],
      },
      {
        month: "2018-06",
      },
      {
        daystart: "1日",
        dayend: "10日",
        title: "场地申请",
        task: [
          { id: 1, content: "填写场地申请单 " },
          { id: 2, content: "审核场地" },
          { id: 3, content: "到场踩点" },
        ],
      },
      {
        daystart: "11日",
        dayend: "18日",
        title: "活动进行",
        task: [
          { id: 1, content: "邀请嘉宾 " },
          { id: 2, content: "发邀请函" },
          { id: 3, content: "清点物资" },
          { id: 3, content: "审核主持人，PPT" },
        ],
      },

    ],

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
    idea: { img_visible: true, bg_img: '',},
    Idea:[
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
  ClickTask:function(e){
    // var that = this
    // var index = e.currentTarget.dataset.index
    // var tasklist = " tasklist[0].tasks[" + index + "].is_finish"
    // console.log("checkboxChange", that.data.tasklist[0].tasks[index].is_finish)
    // that.setData({
    //   "that.data.tasklist[0].tasks[0].is_finish": !that.data.tasklist[0].tasks[index].is_finish
    // })
    // console.log("checkboxChange", that.data.tasklist[0].tasks[index].is_finish)
  },

  // 勾选任务
  checkboxChange: function (e) {
    // var index = e.detail.value
    // var tasklist = " tasklist[0].tasks[" + index + "].is_finish"
    // console.log("checkboxChange",tasklist)
    // this.setData({
    //   [tasklist]:false
    // })
    // console.log("checkboxChange", this.data.tasklist[0].tasks[index].is_finish)

    
    var that = this
    var userName = getApp().globalData.nickName
    var taskListIndex = that.data.currentItem
    var index = e.detail.value
    // var taskId = wx.getStorageSync("ProjectMore-Task-id") //任务ID
    // var checked = that.data.tasklist[taskListIndex].attributes.tasks[index].is_finish
    // console.log(checked)
    if (index == "")//取消勾选
    {
      // var taskId = that.data.tasklist[taskListIndex].attributes.tasks[index].objectId
      // console.log("taskId", taskId)
      // that.finishTask(taskId, false, userName)

      // console.log("取消勾选", taskId, userName)
    }
    else {//勾选
      var taskId = that.data.tasklist[taskListIndex].attributes.tasks[index].objectId
      var is_finish = "tasklist["+taskListIndex+"].attributes.tasks["+index+"].is_finish"
      that.setData({
        [is_finish]:true,
        })
      console.log("taskId", taskId)
      that.finishTask(taskId, true, userName)
      console.log("勾选", taskId, userName)
    }
 
  },

  // 修改任务列表名
  ListNameInput: function(e){
    var index = this.data.index;
    var newname = 'tasklist[' + index + ']';
    // console.log("ListNameInput-index:", index)
    // console.log("ListNameInput-:", e.detail.value)
    // this.setData({
    //   [newname]: e.detail.value,
    // });
  },

  // 修改任务列表名
  ListNameClick: function (e) {
    console.log(e.currentTarget.dataset.index);
    this.setData({
      index: e.currentTarget.dataset.index,
    });
  },

  // 添加任务列表
  Taskmore: function () {
    var that = this;
    var tasklist = that.data.tasklist;
    var tasks = that.data.tasks;

    wx.showActionSheet({
      itemList: ['添加任务列表','删除该任务列表'],
      success: function (res) {
        //添加任务列表
        if (res.tapIndex == 0){
          var Length = tasklist.length;//数组长度

          tasklist.push("")
          that.setData({
            tasklist: tasklist,
            currentItem: Length,
          });
          var projId = wx.getStorageSync("Project-id")//获取项目ID
          that.createTaskList(projId, "新增")//projId 项目id，title任务看板名称
        }

        //删除该任务列表
        if (res.tapIndex == 1){
          var currentItem = that.data.currentItem;
          console.log(currentItem);
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
  selectAnnouncement:function(){
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
    wx.navigateTo({
      url: '../Task/buildTask/buildTask?list_id='+listId
    })
  },

  /**
   * 打开创建公告页面
   */
  createAnnoun: function() {
    wx.navigateTo({
      url: '../Announcement/addAnnouncement/addAnnouncement'
    });
  },

  /**
   * 打开创建公告页面
   */
  createSchedule: function() {
    wx.navigateTo({
      url: '../Schedule/addSchedule/addSchedule'
    });
  },

  /**
   * 打开创建会议页面
   */
  createMeeting: function() {
    wx.navigateTo({
      url: '../Meeting/addMeeting/addMeeting'
    });
  },

  /**
   * 打开创建点子页面
   */
  createIdea: function() {
    wx.navigateTo({
      url: '../Idea/addIdea/addIdea'
    });
  },
  

  /**
   * 显示任务详情页面
   */
  showTask: function(e) {
    var taskListIndex = this.data.currentItem
    var index = e.currentTarget.dataset.index
    wx.setStorageSync("ProjectMore-Task-id", this.data.tasklist[taskListIndex].attributes.tasks[index].objectId)
    wx.setStorageSync("ProjectMore-LeaderId", this.data.tasklist[taskListIndex].attributes.tasks[index].leader.objectId)//任务负责人id
    wx.navigateTo({
      url: '../Task/TaskDetail/TaskDetail'
    });
  },

  /**
   * 显示会议详情页面
   */
  showMeetingDetail: function() {
    wx.navigateTo({
      url: '../Meeting/meetingDetail/meetingDetail'
    });
  },

  /**
   * 显示会议详情页面
   */
  showAnnouncementDetail: function(e) {
    var index = e.currentTarget.dataset.index
    wx.setStorageSync("AnnouncementDetail", this.data.Announcement[index])
    wx.navigateTo({
      url: '../Announcement/announcementDetail/announcementDetail'
    });
  },

  /**
   * 显示日程详情页面
   */
  showScheduleDetail: function() {
    wx.navigateTo({
      url: '../Schedule/scheduleDetail/scheduleDetail'
    });
  },

  /**
   * 显示点子详情页面
   */
  showIdeaDetail: function() {
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
  getAnnouncements:function (projId){
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
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var result = results[i]
          console.log(result)
          var createdAt = result.createdAt.substring(0,16)
          
          var object = {}
          object = {
            id: result.id,
            title: result.attributes.title,
            content: result.attributes.content,
            read: result.attributes.read_num,
            time: createdAt,
            icon: result.changed.publisher.userPic,
            memberName: result.changed.publisher.nickName,
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
  createTaskList:function (projId, title){
  
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
  getTaskLists: function(projId){

    var that = this
    var TaskList = Bmob.Object.extend('task_list')
    var tasklistQuery = new Bmob.Query(TaskList)

    //查询所有的任务列表
    tasklistQuery.ascending('createdAt')   //最先创建的排序最前面
    tasklistQuery.equalTo('proj_id', projId)
    tasklistQuery.notEqualTo("is_delete", true)

    //第一次默认添加任务看板
    // var taskList = new TaskList()
    console.log("taskList", TaskList)
    // if (taskList)
    // taskList.save({
    //   title: "新增",
    //   proj_id: projId,
    //   is_delete: false
    // },
    tasklistQuery.find({

      success: function(results){
        //这里设置setdata
        console.log('Successfully got task lists: \n  ' + JSON.stringify(results));
        
        console.log("getTaskLists:",results)
        //results的第一个是最早创建的
        var listIndex = 0;
        console.log('results number: ' + results.length)

        if (results.length == 0) {//第一次进入任务列表
          results.length = 1
          // that.setData({
          //   tasklist: tasklists
          // })
        }
        else {
          //获取第一个任务看板的任务
          for (var i = 0; i < results.length; i++) {
            that.getTasks(results[i].id, i, results)
          }
        }
        

      },
      error: function(error){

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
  getTasks: function(listId, listIndex, tasklists){

    console.log('查询任务信息：\nlistId: '+listId+'\nlistIndex: '+listIndex)

    var that = this
    var Task = Bmob.Object.extend("task")
    var taskQuery = new Bmob.Query(Task)

    //查询出对应的任务看板的所有任务
    taskQuery.limit(20)
    taskQuery.equalTo("list_id",listId)
    taskQuery.include("leader")  //可以查询出leader
    taskQuery.ascending("end_time")  //根据截止时间升序（越邻近排序最前面）
    taskQuery.find({
      success: function (tasks) {
        console.log("共查询到任务 " + tasks.length + " 条记录");

        // 改日期格式
        // 添加属性：日期状态
        for(var i=0; i<tasks.length; i++) {
          var timeStatus = that.timeStatus(tasks[i].attributes.end_time)
          tasks[i]['attributes']['timeStatus'] = timeStatus
        }
        console.log('tasks: ')
        console.log(tasks)
        

        // 将任务插入到对应看板列表中
        tasklists[listIndex]['attributes']['tasks'] = []
        for (var i in tasks) {
          tasks[i]['attributes']['is_finish'] = tasks[i].attributes.is_finish
          tasks[i]['attributes']['objectId'] = tasks[i].id
          tasks[i]['attributes']['createdAt'] = tasks[i].createdAt
          tasks[i]['attributes']['updatedAt'] = tasks[i].updatedAt
          tasklists[listIndex]['attributes']['tasks'].push(tasks[i]['attributes'])
        }

        that.setData({
          tasklist: tasklists
        })
        console.log("This's tasklists: ")
        console.log(that.data.tasklist)

      },
      error: function (error) {
        console.log("提示用户任务查询失败: " + error.code + " " + error.message);

      }
    })
  },

  timeStatus: function(end_time) {
    // 比较当前时间与截止时间的差值
    var that = this
    var currentTime = new Date(new Date().toLocaleDateString())
    var endTime = new Date(new Date(end_time.replace(/-/g, "/")))
    
    var days = endTime.getTime() - currentTime.getTime()
    var day = parseInt(days / (1000 * 60 * 60 * 24));  //时间差值
    if(day > 1){
      return 'green'
    }
    else{
      return 'red'
    }

    
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
        that.addTaskRecord(taskId, userName, FINISH_TASK + result.get('title'))

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
  
    var ProjectId = wx.getStorageSync("Project-id")//获取项目ID
    that.getAnnouncements(ProjectId)//获取公告ID
    that.getTaskLists(ProjectId);//获取任务ID
    

    // var taskList = that.data.taskList
    // var taskindex = that.data.currentItem
    //  console.log("onshow", taskindex)
    //  if (taskList != undefined) {
    //    console.log("onshow", taskList)
    //   if (taskList[taskindex] != "") {//当前任务列表有任务时
    //     for (var i in taskList[taskindex]) {

    //     }
    //  }
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
