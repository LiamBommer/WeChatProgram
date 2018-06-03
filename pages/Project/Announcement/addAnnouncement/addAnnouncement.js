//addAnnouncement.js
//获取应用实例
var Bmob = require('../../../../utils/bmob.js')
const app = getApp()

Page({
  data: {
    checked:true//是否显示已读
  },

  //是否显示已读
  switch1Change:function(e){
     this.setData({
       checked: e.detail.value
       })
  },

  //完成
  BuildAnnouncement: function (e) {
    var that = this
    var title = e.detail.value.title//获取公告标题
    var content = e.detail.value.content//获取公告内容
    var ProjectId = wx.getStorageSync("Project-id")//获取项目ID
    var ProjectName = wx.getStorageSync("Project-name")//获取项目名
    var checked = that.data.checked//获取是否显示已读

    if(title == "" || title.length == 0) {
      // 提示标题不可为空
      wx.showToast({
        title: '公告标题不见咯',
        icon: 'none',
        duration: 1500,
      })

      return;
    }

    // submit
    that.createAnnouncement(ProjectId, ProjectName, title, content, checked)
    wx.navigateBack({
      url:"../../ProjectMore/ProjectMore"
    })
  },

  /**
   * @autor mr.li
   * @parameter projId项目id， projName项目名称，title公告标题， content公告内容，is_showmember是否显示已读和未读成员
   * （userId和nickName在函数里面已经获取）
   * 添加公告
   */
  createAnnouncement:function (projId, projName, title, content, is_showmember){
  var that = this
    var Announcement = Bmob.Object.extend("annoucement")  //数据库的名字拼错了，但是现在还是和后台的数据库是一样的
  var announcement = new Announcement()
  var currentUser = Bmob.User.current()  //获取当前用户
  var announceId = "0"  //用来存储创建成功后的公告id
  var user
  if(currentUser) {
      user = Bmob.Object.createWithoutData("_User", currentUser.id);
    }

  //保存公告
  announcement.save({
      title: title,
      content: content,
      is_showmember: is_showmember,
      proj_id: projId,
      proj_name: projName,
      publisher: user,  //发布人信息，与_User表关联
      read_num: 0
    }, {
        success: function (result) {
          // 添加成功
          announceId = result.id
          if (is_showmember) {
            //保存未读成员列表 
            that.saveUnread(projId, announceId)  //调用函数
          }

          //提示用户创建公告成功
          console.log("创建公告成功！", result.id)

          wx.showToast({
            title: '创建公告成功',
            icon: 'success',
            duration: 1000
          })

        },
        error: function (result, error) {
          // 添加失败
          //在这里处理失败的情况
          console.log("创建公告失败！", error)





        }
      })
  },

  /**
 * @autor mr.li
 * @parameter projId项目id，announceId公告id
 * 保存指定公告的未读成员，限制50个成员
 */
  saveUnread:function (projId, announceId){
  var that = this
    var Annoucement_readObjects = new Array()  //构建一个本地的Bmob.Object数组
  var ProjMember = Bmob.Object.extend("proj_member")
  var projMemberQuery = new Bmob.Query(ProjMember)
  var Annoucement_read = Bmob.Object.extend("annoucement_read")


  //查询指定项目的所有成员id,50条
  projMemberQuery.equalTo("proj_id", projId)
  projMemberQuery.limit(50)  
  projMemberQuery.select("user_id")
  projMemberQuery.find().then(function (results) {
      //返回成功
      //console.log("共查询到 " + results.length + " 条记录:",results);
      for (var i = 0; i < results.length; i++) {
        var result = results[i];

        var object = new Annoucement_read()  //未读成员表信息
        var user = Bmob.Object.createWithoutData("_User", result.get('user_id'))
        object.set('annouce_id', announceId)
        object.set('user', user)
        object.set('read', false)
        Annoucement_readObjects.push(object)

      }

      if (Annoucement_readObjects.length > 0) {
        //保存未读成员列表
        Annoucement_read.saveAll(Annoucement_readObjects).then(function (Annoucement_readObjects) {
          // 成功
          console.log("保存未读成员列表成功！")
        },
          function (error) {
            // 异常处理
            console.log("保存未读成员列表失败！", error)
          })
      }

    })



  },

  onLoad: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  //事件处理函数

  // 扫描二维码添加
  QRCode: function () {

  },

  inviteWeChat: function () {

  }
})
