//addAnnouncement.js
//获取应用实例
var Bmob = require('../../../../utils/bmob.js')
var ADD_ANNOUNCEMENT = '发布了新的公告'

const app = getApp()

Page({
  data: {
    checked: true,//是否显示已读
    submitNum: 0, //点击完成的次数
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
    var submitNum = that.data.submitNum; //点击完成的次数
    if (submitNum == 0) {//点击完成次数限制在一次
    var title = ""//获取公告标题
    var content = e.detail.value.content//获取公告内容
    var checked = that.data.checked//获取是否显示已读
    var formId = e.detail.formId

    wx.getStorage({
      key: "Project-detail",
      success: function (res) { 
        var ProjectId = res.data.id//获取项目ID
        var ProjectName = res.data.name//获取项目名

        if (content == "" || content.length == 0) {
          // 提示标题不可为空
          wx.showToast({
            title: '公告内容不见咯',
            icon: 'none',
            duration: 1500,
          })
          return;
        }

        // 显示loading
        wx.showLoading({
          title: '正在创建...',
        })

        // submit
        that.createAnnouncement(ProjectId, ProjectName, title, content, checked, formId)
        wx.navigateBack({
          url: "../../ProjectMore/ProjectMore"
        })
      },
    })
      that.setData({
        submitNum: submitNum + 1
      })
    }
  },

  /**
   * @autor mr.li
   * @parameter projId项目id， projName项目名称，title公告标题， content公告内容，is_showmember是否显示已读和未读成员, formId 推送公告通知需要用到的表单id
   * （userId和nickName在函数里面已经获取）
   * 添加公告
   */
  createAnnouncement:function (projId, projName, title, content, is_showmember,formId){
  console.log("formId"+formId)
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
      read_num: 0,
      is_delete: false
    }, {
        success: function (result) {
          // 添加成功
          announceId = result.id
          if (is_showmember) {
            //保存未读成员列表 
            that.saveUnread(projId, announceId)  //调用函数
          }
          //通知项目成员
          var _type = 2  //通知类型
          that.addProjectNotification(projId, ADD_ANNOUNCEMENT, _type, result.id/*公告的id*/) 
          //提示用户创建公告成功
          // console.log("创建公告成功！", result.id)

          wx.hideLoading()
          wx.showToast({
            title: '创建公告成功',
            icon: 'success',
            duration: 1000
          })

          //将公告内容推送给项目的其他成员(问题：只能推送一条)
          // var projMemberArr = wx.getStorage({
          //   key:'ProjectMore-projectMember',
          //   success:function(res){
          //     // console.log("开始推送公告"+res.dat)
          //     var result = res.data
          //     var u
          //     for(u=0;u<result.length;u++){
          //       var openid = result[u].openId.trim()
          //       console.log(openid)
          //       var temp = {
          //         "touser": openid,
          //         "template_id": "NEguPFCkfp9aeOG7SVX8igaLJl1uBF19r7qGUrj1M2o", 
          //         "page": "pages/Project/Announcement/announcementDetail/announcementDetail?isShared=true&announcementId=" + announceId,
          //         "form_id": formId,
          //         "data": {
          //           "keyword1": {
          //             "value": "SDK测试内容",
          //             "color": "#173177"
          //           },
          //           "keyword2": {
          //             "value": "199.00"
          //           },
          //           "keyword3": {
          //             "value": "123456789"
          //           },
                    
          //         },
          //         "emphasis_keyword": "keyword2.DATA"
          //       }
          //       Bmob.sendMessage(temp).then(function (obj) {
          //         console.log('发送成功')
          //       },
          //         function (err) {
          //           console.log("公告推送部分：" + err)
          //         })
          //     }
          //   }
          // })

        },
        error: function (result, error) {
          // 添加失败
          //在这里处理失败的情况
          // console.log("创建公告失败！", error)





        }
      })
  },

  /**
   * 2018-05-31
   * @parameter projId项目id，toUserIds通知的目标用户id数组，_type是通知的类型(我发了关于这个的文档),requestId是通知跳转
   * 页面所有携带的请求数据，比如（taskId，meetingId 等）
   * 存储通知,往往都是批量添加的
   */
  addProjectNotification: function (projId, content, _type, requestId) {
    var that = this
    var Projectmember = Bmob.Object.extend('proj_member')
    var projectkmemberQuery = new Bmob.Query(Projectmember)
    var Notification = Bmob.Object.extend('notification')
    var toUserIds = []  //被通知的用户的id数组
    var notificationObjects = []

    var project = Bmob.Object.createWithoutData("project", projId)
    var fromUser = Bmob.Object.createWithoutData("_User", Bmob.User.current().id)

    //查询项目下的所有成员id
    projectkmemberQuery.equalTo('proj_id', projId)
    projectkmemberQuery.find({
      success: function (results) {
        //成功
        for (var i = 0; i < results.length; i++) {
          toUserIds.push(results[i].get('user_id'))
        }
        if (toUserIds != null && toUserIds.length > 0) {
          for (var i = 0; i < toUserIds.length; i++) {
            //无需通知操作人本身
            if (toUserIds[i] != Bmob.User.current().id) {
              var notification = new Notification()
              notification.set('to_user_id', toUserIds[i])
              notification.set('content', content)
              notification.set('type', _type)
              notification.set('is_read', false)
              notification.set('request_id', requestId)
              notification.set('project', project)
              notification.set('from_user', fromUser)

              notificationObjects.push(notification)  //存储本地通知对象
            }
          }

          if (notificationObjects != null && notificationObjects.length > 0) {
            Bmob.Object.saveAll(notificationObjects).then(function (notificationObjects) {
              // 通知添加成功
              // console.log("添加项目成员通知成功！")
            },
              function (error) {
                // 通知添加失败处理
              })
          }
        }

      },
      error: function (error) {
        //项目成员查询失败
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
          // console.log("保存未读成员列表成功！")
        },
          function (error) {
            // 异常处理
            // console.log("保存未读成员列表失败！", error)
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
