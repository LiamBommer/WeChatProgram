// pages/Project/Task/TaskDetail/TaskDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '任务2',
    show: false,
    deadline: '',
    remindtime: "", 
    feedbacktime: "",
    Inputcontent:'',

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
      {
         name:'任务 A',
         icon:'/img/member.png',
      },
      {
        name: '任务 B',
        icon: '/img/member.png',
      },
    ],

    //消息循环列表
    taskremind: [
      {
        text: '帅涛添加了子任务“个人访谈-金哥"',
        time: '5月2日 20:00',
      },
      {
        text: '帅凯添加了子任务“个人访谈-金哥"',
        time: '5月2日 20:00',
      },
    ],

    //他人聊天循环列表
    chat: [
      {
        content: '帅涛太帅了！',
        icon: '/img/me.png',
        judgemine: false,//其他人发的消息
        judgepictrue:false,//判断输入的是文字还是图片
      },
      {
        content: '我也觉得！',
        icon: '/img/me.png',
        judgemine: true,//我发的消息
        judgepictrue: false,//判断输入的是文字还是图片
      },
    ],

    
  },
  
  //添加更多内容
  addMorecontent:function(){
     var that = this;
     var show = !that.data.show;
     that.setData({
       show: show
     });
  },

  // 成员列表
  MemberList: function(e) {
    wx.navigateTo({
      url: './memberList/memberList',
    })
  },
  
  // 截止时间
  DeadLineChange: function (e) {
    this.setData({
      deadline: e.detail.value
    })
  },

  // 提醒时间
  RemindTimeChange: function (e) {
    this.setData({
      remindtime: e.detail.value
    })
  },

  // 反馈时间
  FeedBacktimeChange: function(e) {
    this.setData({
      feedbacktime: e.detail.value
    })
  },

  //任务描述
  Describe: function () {
    wx.navigateTo({
      url: './Describe/Describe',
    })
  },

  //回馈模板
  Feedback: function () {
    wx.navigateTo({
      url: './FeedBack/FeedBack',
    })
  }, 

  //添加子任务
  AddChildTask: function() {
    wx.navigateTo({
      url: '../buildTask/buildTask',
    })
  },

  //子任务详情
  ChildTaskDetail: function () {
    wx.navigateTo({
      url: './TaskDetail',
    })
  }, 

  //沟通模板
  CommModel: function () {
    wx.navigateTo({
      url: './CommModel/CommModel',
    })
  }, 
  
  //点击聊天框
  ChatClick:function(){
    
  },

  //聊天框按回车
  ChatInput: function(e) {
    var that = this;
    var content = e.detail.value;
    var chat = that.data.chat;
    chat.push({
      content: content, //我发送的内容
      icon: '/img/me.png',//我的头像
      judgemine: true,//我发的消息
    });
    that.setData({
      chat : chat,
      Inputcontent : "",
    });
  },

  //聊天框发送图片
  PictrueSelect: function (e) {
    var that = this;
    var chat = that.data.chat;
    wx.chooseImage({
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var content = tempFilePaths[0];
        chat.push({
          content: content,//我发送的内容
          icon: '/img/me.png',//我的头像
          judgemine: true,//我发的消息
          judgepictrue: true,//判断输入的是文字还是图片
        });
        that.setData({
          chat: chat,
        });

      }
    })
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
