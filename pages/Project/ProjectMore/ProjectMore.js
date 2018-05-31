// pages/ProjectMore/ProjectMore.js
var Bmob = require('../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem: "",//当前swiper滑块的位置
    index: '',//当前任务列表下标
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
      //   task: [
      //     {
      //       title: '任务一',
      //       time: '6月1日 18:00',
      //       timestatus: 'green',
      //       //任务图标描述
      //       icon: [
      //         "/img/me.png",
      //         "/img/task_list.png",
      //       ],
      //     },
      //     {
      //       title: '任务二',
      //       time: '6月1日 18:00',
      //       timestatus: 'red',
      //       //任务图标描述
      //       icon: [
      //         "/img/me.png",
      //         "/img/task_list.png",
      //       ],
      //     },
      //   ]
      // },
      // {
      //   title: '执行中',
      //   //任务项
      //   task: [
      //     {
      //       title: '任务一',
      //       time: '6月1日 18:00',
      //       timestatus: 'green',
      //       //任务图标描述
      //       icon: [
      //         "/img/me.png",
      //         "/img/task_list.png",
      //       ],
      //     },
      //     {
      //       title: '任务二',
      //       time: '6月1日 18:00',
      //       timestatus: 'red',
      //       //任务图标描述
      //       icon: [
      //         "/img/me.png",
      //         "/img/task_list.png",
      //       ],
      //     },
      //   ],
      // },
    ],

    // 任务
    tasks: [


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
        month: "2019年5月",
      },
      {
        daystart: "2日",
        dayend: "3日",
        title: "召开全体大会",
        task: [
          { id: 1, content: "邀请帅涛 " },
          { id: 2, content: "邀请帅涛 " },
          { id: 3, content: "邀请帅涛 " },
        ],
      },
      {
        daystart: "2日",
        dayend: "3日",
        title: "召开全体大会",
        task: [
          { id: 1, content: "邀请帅涛 " },
          { id: 2, content: "邀请帅涛 " },
          { id: 3, content: "邀请帅涛 " },
        ],
      },
      {
        month: "2019年5月",
      },
      {
        daystart: "2日",
        dayend: "3日",
        title: "召开全体大会",
        task: [
          { id: 1, content: "邀请帅涛 " },
          { id: 2, content: "邀请帅涛 " },
          { id: 3, content: "邀请帅涛 " },
        ],
      },

    ],

    //会议列表
    Meeting: [
      {
        month: "2019年5月",
      },
      {
        day: "2日",
        time: "21:00",
        content: "第一次面基",
      },
      {
        day: "2日",
        time: "21:00",
        content: "第一次面基",
      },
      {
        month: "2019年6月",
      },
      {
        day: "2日",
        time: "21:00",
        content: "第一次面基",
      },
    ],

    //墙列表
    idea: { img_visible: true, bg_img: '',},
    Idea:[
      {
        icon_avatar: '/img/member.png',
        icon_share: '/img/share.png',
        username: '绝世产品经理',
        content: '灭霸打了一个响指，所有人都灰飞烟灭了，太可怕了，奇异博士为何不用时间宝石制止一下灭霸？因为there was no other way!',
        task: '关联的任务',
      },
      {
        icon_avatar: '/img/member.png',
        icon_share: '/img/share.png',
        username: '绝世产品经理',
        content: '灭霸打了一个响指，所有人都灰飞烟灭了，太可怕了，奇异博士为何不用时间宝石制止一下灭霸？因为there was no other way!',
        task: '关联的任务',
      },
      {
        icon_avatar: '/img/member.png',
        icon_share: '/img/share.png',
        username: '绝世产品经理',
        content: '灭霸打了一个响指，所有人都灰飞烟灭了，太可怕了，奇异博士为何不用时间宝石制止一下灭霸？因为there was no other way!',
        task: '关联的任务',
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

  // 修改任务列表名
  ListNameInput: function(e){
    var index = this.data.index;
    var newname = 'tasklist['+index+']';
    console.log("ListNameInput:",newname)
    this.setData({
      [newname]: e.detail.value,
    });
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
  showTask: function() {
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
<<<<<<< HEAD
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
    tasklistQuery.find({

      success: function(results){
        //这里设置setdata
        console.log('Successfully got task lists: \n  ' + JSON.stringify(results));

        console.log("getTaskLists:",results)

        //results的第一个是最早创建的
        var listIndex = 0;

        console.log('results number: '+results.length)
        //获取第一个任务看板的任务
        for(var i=0; i<results.length; i++) {
          that.getTasks(results[i].id, i, results)
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
        for(var i in tasks) {
          tasks[i]['attributes']['objectId'] = tasks[i].id
          tasks[i]['attributes']['createdAt'] = tasks[i].createdAt
          tasks[i]['attributes']['updatedAt'] = tasks[i].updatedAt
          tasklists[listIndex]['attributes']['tasks'].push(tasks[i]['attributes'])
        }

        that.setData({
          tasklist: tasklists
        })
        // console.log("This's tasklists: ")
        // console.log(that.data.tasklist)

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
    
    var ProjectId = wx.getStorageSync("Project-id")//获取项目ID
    that.getAnnouncements(ProjectId)//获取公告ID
    console.log('Page task list opened. ');
    that.getTaskLists(ProjectId);//获取任务ID
    wx.startPullDownRefresh()//刷新

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
