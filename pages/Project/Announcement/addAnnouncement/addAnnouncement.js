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
    that.createAnnouncement(ProjectId, ProjectName, title, content,)
    wx.navigateBack({
      url:"../../ProjectMore/ProjectMore"
    })
  },

  /**
 * @autor mr.li
 * @parameter projId项目id， projName项目名称，title公告标题， content公告内容，is_showmember是否显示已读和未读成员
 * 添加公告
 */
  createAnnouncement:function (projId, projName, title, content, is_showmember){

    var Announcement = Bmob.Object.extend("annoucement")  //数据库的名字拼错了，但是现在还是和后台的数据库是一样的
  var announcement = new Announcement()
  var currentUser = Bmob.User.current()  //获取当前用户
  var leaderId = "0"
  var leaderName = "0"

  var announceId = "0"  //用来存储创建成功后的公告id

  if(currentUser) {
      leaderId = currentUser.id
      leaderName = currentUser.get("nickName")
    }

  //保存公告
  announcement.save({
      title: title,
      content: content,
      is_showmember: is_showmember,
      proj_id: projId,
      proj_name: projName,
      leader_id: leaderId,
      leader_nickname: leaderName,
      read_num: 0
    }, {
        success: function (result) {
          // 添加成功
          console.log("创建公告成功！", result.id)
          announceId = result.id

          if (is_showmember) {
            //保存未读成员列表 
            saveUnread(projId, announceId)  //调用函数
          }

          //在这里处理setdata







        },
        error: function (result, error) {
          // 添加失败
          console.log("创建公告失败！", error)
          //在这里处理失败的情况






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
