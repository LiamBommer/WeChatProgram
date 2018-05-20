// pages/ProjectMore/ProjectMore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //隐藏判断
    exitTask: true,
    exitAnnouncement: false,
    exitSchedule: false,
    exitMeeting: false,
    exitIdea: false,
    idea: {
      img_visible: true,
      bg_img: '',
      icon_avatar: '/img/member.png',
      icon_share: '/img/share.png',
      username: '绝世产品经理',
      content: '灭霸打了一个响指，所有人都灰飞烟灭了，太可怕了，奇异博士为何不用时间宝石制止一下灭霸？因为there was no other way!',
      task: '关联的任务'
    },

    //任务列表
    tasklist: [
      {
        title:'待处理',
        //任务项
        task: [
          {
            title: '任务一',
            time: '6月1日 18:00',
            timestatus: 'green',
            //任务图标描述
            icon: [
              "/img/me.png",
              "/img/task_list.png",
            ],
          },
          {
            title: '任务二',
            time: '6月1日 18:00',
            timestatus: 'red',
            //任务图标描述
            icon: [
              "/img/me.png",
              "/img/task_list.png",
            ],
          },
        ]
      },
      {
        title: '执行中',
        //任务项
        task: [
          {
            title: '任务一',
            time: '6月1日 18:00',
            timestatus: 'green',
            //任务图标描述
            icon: [
              "/img/me.png",
              "/img/task_list.png",
            ],
          },
          {
            title: '任务二',
            time: '6月1日 18:00',
            timestatus: 'red',
            //任务图标描述
            icon: [
              "/img/me.png",
              "/img/task_list.png",
            ],
          },
        ],
      },
    ],

    //当前任务列表下标
    index:'',
    
  },
  
  // 修改任务列表名
  ListNameInput: function(e){
    var index = this.data.index; 
    var newname = 'tasklist['+index+'].title';
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

    wx.showActionSheet({
      itemList: ['添加任务列表'], 
      success: function (res) {
        tasklist.push({
          title:"新增",
          task:[],
          });
        that.setData({
          tasklist: tasklist,
        });
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
  createTask: function () {
    wx.navigateTo({
      url: '../Task/buildTask/buildTask',
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
  showAnnouncementDetail: function() {
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
   * 显示电子详情页面
   */
  showIdeaDetail: function() {
    wx.navigateTo({
      url: '../Idea/ideaDetail/ideaDetail'
    });
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
