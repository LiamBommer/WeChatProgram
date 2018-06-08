// pages/Notification/Notification.js

var Bmob = require('../../utils/bmob.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //通知列表
    Notification:[
      {
        icon: "/img/me.png",
        title: "我觉得ZHT太牛逼了",
        content: "因为ZHT也很牛逼balabal ...",
        time: "5月1日20:00",
        project: "鲨鱼派对项目",
        isRead:'',
      },
      {
        icon: "/img/me.png",
        title: "我觉得ZHT太牛逼了",
        content: "因为ZHT也很牛逼balabal ...",
        time: "5月1日20:00",
        project: "鲨鱼派对项目",
      },
      {
        icon: "/img/me.png",
        title: "我觉得ZHT太牛逼了",
        content: "因为ZHT也很牛逼balabal ...",
        time: "5月1日20:00",
        project: "鲨鱼派对项目",
      },
    ],
  
  },

  //点击通知
  ClickMessage:function(e){
    var that = this
    var index = e.currentTarget.dataset.index//当前通知下标
    var id = e.currentTarget.id//当前通知id
    var Notification = that.data.Notification//通知

    var _type = Notification[index].type//通知类型
    var requestId = Notification[index].requestId//目标id
    var projName = Notification[index].project//目标项目名
    that.readOneNotification(id) //传入后台

    if (_type == 1)//任务
    {
      Notification[index].isRead = true
      //设置通知已读
      that.setData({
        Notification: Notification
      })
      //设置任务ID缓存
      wx.setStorageSync("Notification-taskId", requestId)
      //设置项目名字缓存
      wx.setStorageSync("Notification-projName", projName)
      wx.navigateTo({
        url: '../Project/Task/TaskDetail/TaskDetail',
      })
    }
    else if (_type == 2)//公告
    {
      Notification[index].isRead = true
      //设置通知已读
      that.setData({
        Notification: Notification
      })
      //设置公告ID缓存
      wx.setStorageSync("Notification-announcementId", requestId)
      wx.navigateTo({
        url: '../Project/Announcement/announcementDetail/announcementDetail?',
      })
    }
    else if (_type == 3)//日程
    {
      Notification[index].isRead = true
      //设置通知已读
      that.setData({
        Notification: Notification
      })
      //设置日程ID缓存
      wx.setStorageSync("Notification-scheduleId", requestId)
      wx.navigateTo({
        url: '../Project/Schedule/scheduleDetail/scheduleDetail',
      })
    }
    else if (_type == 4)//会议
    {
      Notification[index].isRead = true
      //设置通知已读
      that.setData({
        Notification: Notification
      })
      //设置会议ID缓存
      wx.setStorageSync("Notification-meetingId", requestId)
      wx.navigateTo({
        url: '../Project/Meeting/meetingDetail/meetingDetail',
      })
    }
    else if (_type == 5)//墙
    {
      Notification[index].isRead = true
      //设置通知已读
      that.setData({
        Notification: Notification
      })
      //设置墙ID缓存
      wx.setStorageSync("Notification-ideaId", requestId)
      wx.navigateTo({
        url: '../Project/Idea/ideaDetail/ideaDetail',
      })
    }
    
  },

  /**
   * 2018-05-31
   * @parameter userId 当前操作用户的id
   * 将用户的通知全部都修改为已读状态
   */
  readAll:function (userId){
    var that = this
    var Notification = Bmob.Object.extend('notification')
    var notificationQuery = new Bmob.Query(Notification)

    //将用户的通知全部都修改为已读状态
    notificationQuery.equalTo("to_user_id", userId)
    notificationQuery.find().then(function (todos) {
      todos.forEach(function (todo) {
        todo.set('is_read', true);
      });
      return bmob.Object.saveAll(todos);
    }).then(function (todos) {
      // 更新成功


    },
      function (error) {
        // 异常处理
      })
  },

/**
 * 2018-05-31
 * @parameter userId 当前操作用户的id
 * 获取用户的所有通知(由近及远排序)
 * 获取的数组，每个元素包括
 * 'id':   //通知的id
    'fromUserPic':   //通知的来源的人的头像
    'content':  //通知内容
    'type':   //通知类型
    'requestId':   //点击通知时请求的通知详情的对应的 id
    'isRead':  //判断通知是否已读，fasle为 未读
    'projectName':   //对应的项目名
    'createdAt':   //通知创建的时间
 * 
 */
getNotification:function (userId) {
    var that = this
    var Notification = Bmob.Object.extend('notification')
    var notificationQuery = new Bmob.Query(Notification)
    var notificationArr = []

    //获取用户的所有通知
    notificationQuery.equalTo("to_user_id", userId)
    notificationQuery.include('project')
    notificationQuery.include('from_user')
    notificationQuery.descending("createdAt")
    notificationQuery.limit(50)
    notificationQuery.find({
      success: function (results) {
        console.log("results", results)
        //成功
        for (var i in results) {
          var notiObject = {}
          notiObject = {
            'id': results[i].id,   //通知的id
            'icon': results[i].attributes.from_user.userPic,  //通知的来源的人的头像
            'content': results[i].get('content'),  //通知内容
            'type': results[i].get('type'),  //通知类型
            'requestId': results[i].get('request_id'),  //点击通知时请求的通知详情的对应的 id
            'isRead': results[i].get('is_read'),  //判断通知是否已读，fasle为 未读
            'project': results[i].attributes.project.name,  //对应的项目名
            'time': results[i].createdAt.substring(0,16),//通知创建的时间
          }
          notificationArr.push(notiObject)  //获取到的通知数组
        }
        if (notificationArr != null && notificationArr.length > 0) {
          //获取成功, 在这里setData
          console.log('获取到的通知', notificationArr)
          that.setData({
            Notification: notificationArr
          })
        }




      },
      error: function (error) {
        //失败

      }
    })
  },

/**
 * 2018-05-31
 * @parameter projId项目id，toUserIds通知的目标用户id数组，_type是通知的类型(我发了关于这个的文档),requestId是通知跳转
 * 页面所有携带的请求数据，比如（taskId，meetingId 等）
 * 存储通知,往往都是批量添加的
 */
// addProjectNotification:function (projId, content, _type, requestId) {
//     var that = this
//     var Projectmember = Bmob.Object.extend('proj_member')
//     var projectkmemberQuery = new Bmob.Query(Projectmember)
//     var Notification = Bmob.Object.extend('notification')
//     var toUserIds = []  //被通知的用户的id数组
//     var notificationObjects = []

//     var project = Bmob.Object.createWithoutData("project", projId)
//     var fromUser = Bmob.Object.createWithoutData("_User", Bmob.User.current().id)

//     //查询项目下的所有成员id
//     projectkmemberQuery.equalTo('proj_id', projId)
//     projectkmemberQuery.find({
//       success: function (results) {
//         //成功
//         for (var i = 0; i < results.length; i++) {
//           toUserIds.push(results[i].get('user_id'))
//         }
//         if (toUserIds != null && toUserIds.length > 0) {
//           for (var i = 0; i < toUserIds.length; i++) {
//             //无需通知操作人本身
//             if (toUserIds[i] != Bmob.User.current().id) {
//               var notification = new Notification()
//               notification.set('to_user_id', toUserIds[i])
//               notification.set('content', content)
//               notification.set('type', _type)
//               notification.set('is_read', false)
//               notification.set('request_id', requestId)
//               notification.set('project', project)
//               notification.set('from_user', fromUser)

//               notificationObjects.push(notification)  //存储本地通知对象
//             }
//           }

//           if (notificationObjects != null && notificationObjects.length > 0) {
//             Bmob.Object.saveAll(notificationObjects).then(function (notificationObjects) {
//               // 通知添加成功
//               console.log("添加项目成员通知成功！")
//             },
//               function (error) {
//                 // 通知添加失败处理
//               })
//           }
//         }

//       },
//       error: function (error) {
//         //项目成员查询失败
//       }
//     })
//   },

/**
 * 2018-05-31
 * @parameter projId 项目id, taskId任务id，content 通知内容
 * (request_id 为tskId)
 * 存储通知,往往都是批量添加的
 */
// addTaskNotification:function (projId, taskId, content) {
//     var that = this
//     var _type = 1;  //任务是通知的第一种类型
//     var Taskmember = Bmob.Object.extend('task_member')
//     var taskmemberQuery = new Bmob.Query(Taskmember)
//     var toUserIds = []  //需要通知到的任务成员id数组
//     var Notification = Bmob.Object.extend('notification')
//     var notificationObjects = []

//     //查询任务成员
//     taskmemberQuery.equalTo('task_id', taskId)
//     taskmemberQuery.select("user_id");
//     taskmemberQuery.find().then(function (results) {
//       // 返回成功
//       for (var i = 0; i < results.length; i++) {
//         toUserIds.push(results[i].id)
//       }

//       if (toUserIds != null && toUserIds.length > 0) {
//         var fromUser = Bmob.Object.createWithoutData("_User", Bmob.User.current().id)
//         var project = Bmob.Object.createWithoutData("project", projId)

//         for (var i = 0; i < toUserIds.length; i++) {
//           //无需通知操作人本身
//           if (toUserIds[i] != Bmob.User.current().id) {
//             var notification = new Notification()
//             notification.set('to_user_id', toUserIds[i])
//             notification.set('content', content)
//             notification.set('type', _type)
//             notification.set('is_read', false)
//             notification.set('request_id', taskId)
//             notification.set('project', project)
//             notification.set('from_user', fromUser)

//             notificationObjects.push(notification)  //存储本地通知对象
//           }
//         }
//         if (notificationObjects != null && notificationObjects.length > 0) {
//           //在数据库添加通知
//           Bmob.Object.saveAll(notificationObjects).then(function (notificationObjects) {
//             // 成功
//             console.log("添加任务成员通知成功！")


//           },
//             function (error) {
//               // 异常处理
//               console.log("添加任务成员通知失败!", error)

//             })
//         }
//       }
//     })

//   },

/**
 * 2018-06-02
 * @parameter notificationId通知id
 * 用户点开某个通知，已读某一个通知
 */
readOneNotification:function (notificationId) {
    var that = this
    var Notification = Bmob.Object.extend('notification')
    var notificationQuery = new Bmob.Query(Notification)

    //更改通知的已读状态
    notificationQuery.get(notificationId, {
      success: function (result) {
        //成功
        result.set('is_read', true)
        result.save()

      },
      error: function (error) {
        //失败
      }
    })
  },

/**
 * 2018-06-02
 * @parameter userId 用户id
 * 删除某位用户的所有通知
 */
deleteUserNotification:function (userId) {
    var that = this
    var Notification = Bmob.Object.extend('notification')
    var notificationQuery = new Bmob.Query(Notification)

    //删除某位用户的所有通知
    if (userId != null) {
      notificationQuery.equalTo('to_user_id', userId)
      notificationQuery.destroyAll({
        success: function () {
          //删除成功
          console.log("提示用户删除所有通知成功!")
        },
        error: function (err) {
          // 删除失败
          console.log("提示用户删除所有通知失败!")
        }
      })
    }

  },

/**
 * 2018-06-02
 * @parameter notificationId通知id
 * 删除某一条通知
 */
deleteOneNotification:function (notificationId) {
    var that = this
    var Notification = Bmob.Object.extend('notification')
    var notificationQuery = new Bmob.Query(Notification)

    //删除某位用户的所有通知
    if (notificationId != null) {
      notificationQuery.equalTo('objectId', notificationId)
      notificationQuery.destroyAll({
        success: function () {
          //删除成功
          console.log("提示用户删除通知成功!")
        },
        error: function (err) {
          // 删除失败
          console.log("提示用户删除通知失败!")
        }
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
    var userId = getApp().globalData.userId
    that.getNotification(userId) 
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