// pages/Notification/Notification.js

var Bmob = require('../../utils/bmob.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startX: '',
    startY: '',

    // 动画
    notificationAnimationStyle: '',

    //通知列表
    Notification: [
      // {
      //   icon: "/img/me.png",
      //   title: "我觉得ZHT太牛逼了",
      //   content: "因为ZHT也很牛逼balabal ...",
      //   time: "5月1日20:00",
      //   project: "鲨鱼派对项目",
      //   isRead:'',
      //   NotificationisTouchMove:'',
      //   NotificationtxtStyle:'',
      // },
      // {
      //   icon: "/img/me.png",
      //   title: "我觉得ZHT太牛逼了",
      //   content: "因为ZHT也很牛逼balabal ...",
      //   time: "5月1日20:00",
      //   project: "鲨鱼派对项目",
      // },
      // {
      //   icon: "/img/me.png",
      //   title: "我觉得ZHT太牛逼了",
      //   content: "因为ZHT也很牛逼balabal ...",
      //   time: "5月1日20:00",
      //   project: "鲨鱼派对项目",
      // },
    ],

  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.Notification.forEach(function (v, i) {
      if (v.NotificationisTouchMove)//只操作为true的
      {
        v.NotificationisTouchMove = false;
        v.NotificationtxtStyle = ''
      }
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      Notification: this.data.Notification,
    })
  },
  //滑动删除通知：滑动事件处理
  touchmoveNotification: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index//当前索引
    var startX = that.data.startX//开始X坐标
    var startY = that.data.startY//开始Y坐标
    var touchMoveX = e.changedTouches[0].clientX//滑动变化坐标
    var touchMoveY = e.changedTouches[0].clientY//滑动变化坐标
    //获取滑动角度
    var angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    var Notification = that.data.Notification
    Notification.forEach(function (v, i) {
      v.NotificationisTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
        {
          v.NotificationtxtStyle = ""
          v.NotificationisTouchMove = false
        }
        else //左滑
        {
          v.NotificationtxtStyle = "margin-left:-" + 800 + "rpx";
          v.NotificationisTouchMove = true
        }
      }
    })
    //更新列表的状态
    that.setData({
      Notification: Notification
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
  //删除通知
  delNotification: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除通知吗？',
      success: function (res) {
        if (res.confirm) {
          that.data.Notification.splice(e.currentTarget.dataset.index, 1)
          var id = e.currentTarget.id
          that.deleteOneNotification(id)
          that.setData({
            Notification: that.data.Notification
          })
        }
      }
    })


  },

  //标为已读
  readNotification: function (e) {
    var that = this
    var id = e.currentTarget.id//当前通知id
    var index = e.currentTarget.dataset.index//当前通知下标
    var Notification = that.data.Notification//通知
    Notification[index].isRead = true
    //设置通知已读
    that.setData({
      Notification: Notification
    })
    that.readOneNotification(id) //传入后台
  },

  //点击通知
  ClickMessage: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index//当前通知下标
    var id = e.currentTarget.id//当前通知id
    var Notification = that.data.Notification//通知

    var _type = Notification[index].type//通知类型
    var requestId = Notification[index].requestId//目标id
    var projId = Notification[index].projectId//目标id
    var projName = Notification[index].projectName//目标项目名
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
      //设置项目成员,任务负责人ID缓存
      that.getProjMemberAndTaskleaderId(projId, requestId)
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
      //设置项目ID缓存
      wx.setStorageSync("Notification-projId", projId)
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
      wx.setStorageSync("Notification-projId", projId)
      wx.navigateTo({
        url: '../Project/Idea/ideaDetail/ideaDetail',
      })
    }

  },

  /**
 * 获取项目成员和任务领导人id
 */
  getProjMemberAndTaskleaderId: function (projId, taskId) {
    var that = this
    var projmemberArr = []  //项目成员数组
    var taskLeaderId = '0'  //任务负责人id
    //先获取项目成员数组
    var ProjectMember = Bmob.Object.extend("proj_member")
    var memberQuery = new Bmob.Query(ProjectMember)
    var User = Bmob.Object.extend("_User")
    var userQuery = new Bmob.Query(User)

    var leader_id = "0"
    var memberId = [] //项目的所有成员id数组

    //获取指定项目的所有成员id，50条
    memberQuery.equalTo("proj_id", projId)
    memberQuery.select("user_id", "is_leader")
    memberQuery.limit(50)
    memberQuery.find().then(function (results) {
      //返回成功
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        if (object.get("is_leader")) {
          //项目领导，放在数组的第一个
          leader_id = object.get("user_id")
          memberId.unshift(leader_id)

        } else {
          memberId.push(object.get("user_id"))  //将成员id添加到数组
        }
      }
    }).then(function (result) {

      //获取指定项目的所有成员,一次可以获取50条
      userQuery.select("objectId", "nickName", "userPic")  //查询出用户基本信息，id ，昵称和头像
      userQuery.limit(50)
      userQuery.containedIn("objectId", memberId)

      userQuery.find({
        success: function (results) {
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var object
            object = {
              'checked': '',
              'id': results[i].id,
              'nickName': results[i].get('nickName'),
              'userPic': results[i].get('userPic')
            }

            if (object.id == leader_id) {
              //将项目领导放在数组的第一个位置
              projmemberArr.unshift(object)
            } else
              projmemberArr.push(object)
          }
          //然后获取taskLeaderId
          var Task = Bmob.Object.extend('task')
          var taskQuery = new Bmob.Query(Task)

          taskQuery.include('leader')
          taskQuery.get(taskId, {
            success: function (result) {
              //获取任务负责人id成功
              taskLeaderId = result.get('leader').objectId
              console.log('获取任务负责人id成功', taskLeaderId, '成员', projmemberArr)
              //设置缓存
              wx.setStorageSync("Notification-projmemberArr", projmemberArr)
              wx.setStorageSync("Notification-taskLeaderId", taskLeaderId)
              wx.navigateTo({
                url: '../Project/Task/TaskDetail/TaskDetail',
              })


            },
            error: function (error) {
              //获取任务负责人id失败

            }
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
   * 2018-05-31
   * @parameter userId 当前操作用户的id
   * 将用户的通知全部都修改为已读状态
   */
  readAll: function (userId) {
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
  getNotification: function (userId) {
    var that = this
    var Notification = Bmob.Object.extend('notification')
    var notificationQuery = new Bmob.Query(Notification)
    var notificationArr = []

    //获取用户的所有通知
    notificationQuery.limit(50)
    notificationQuery.equalTo("to_user_id", userId)
    notificationQuery.include('project')
    notificationQuery.include('from_user')
    notificationQuery.descending("createdAt")
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
            'projectName': results[i].attributes.project.name,  //对应的项目名
            'time': results[i].createdAt.substring(0, 16),//通知创建的时间
            'projectId': results[i].attributes.project.objectId,
            NotificationisTouchMove: false,
            NotificationtxtStyle: '',
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


    //    wx.hideLoading()

      },
      error: function (error) {
        //失败

      }
    })
  },



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
  readOneNotification: function (notificationId) {
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
  deleteUserNotification: function (userId) {
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
  deleteOneNotification: function (notificationId) {
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
 * 2018-06-02
 * @parameter userId 用户id
 * 删除某位用户的所有已读通知
 */
  deleteUserNotification: function () {

    var that = this
    var userId = getApp().globalData.userId
    var Notification = Bmob.Object.extend('notification')
    var notificationQuery = new Bmob.Query(Notification)

    // 弹出模态框提示确认删除
    wx.showModal({
      title: '确定要删除所有已读通知吗？',
      success: function (res) {

        // 确认删除
        if(res.confirm) {

          // 先在前端修改，减少卡顿时间
          var notesLength = that.data.Notification.length
          var newNotification = that.data.Notification
          console.log(newNotification)
          for (var i = 0; i < notesLength; i++) {
            if(newNotification[i]['isRead'] == true) {
              // 已读的信息
              newNotification.splice(i, 1)    // 移除从i开始的1个元素
              notesLength--;
              i--;
            }
          }
          that.setData({
            Notification: newNotification
          })

          //删除某位用户的所有已读通知
          if (userId != null) {
            notificationQuery.limit(50)            
            notificationQuery.equalTo('to_user_id', userId)
            notificationQuery.equalTo('is_read', true)
            notificationQuery.destroyAll({
              success: function () {
                //删除成功
                console.log("提示用户删除所有通知成功!")
                // wx.showToast({
                //   title: '删除通知成功',
                //   icon: 'success',
                //   duration: 1000
                // })
                
              },
              error: function (err) {
                // 删除失败
                console.log("提示用户删除所有通知失败!")
                console.log(err)
                wx.showToast({
                  title: '删除通知失败，请重试',
                  icon: 'none',
                  duration: 1500
                })
              }
            })

            
          }

        } else if(res.cancel) {
          // 取消删除
        }

      }
    })


  },

  /**
   * 2018-05-31
   * @parameter userId 当前操作用户的id
   * 将用户的通知全部都修改为已读状态
   */
  readAll: function () {

    var that = this
    var userId = getApp().globalData.userId
    var Notification = Bmob.Object.extend('notification')
    var notificationQuery = new Bmob.Query(Notification)

    // 先在前端修改，减少卡顿时间
    var notesLength = that.data.Notification.length
    for(var i=0; i<notesLength; i++) {
      var path = 'Notification[' + i + '].isRead'
      that.setData({
        [path]: true
      })
    }

    //将用户的通知全部都修改为已读状态
    notificationQuery.equalTo("to_user_id", userId)
    notificationQuery.find().then(function (todos) {
      todos.forEach(function (todo) {
        todo.set('is_read', true);
      });
      return Bmob.Object.saveAll(todos);
    }).then(function (todos) {
      //更新成功
      // wx.showToast({
      //   title: '全部已读',
      //   icon: 'success',
      //   duration: 1000
      // })

    },
      function (error) {
        // 异常处理
        wx.showToast({
          title: '设置已读失败，请重试',
          icon: 'none',
          duration: 1500
        })
      }
    )
  },


  /*
      * 列表加载动效
      */
  notificationAnimation: function () {
    var notificationAnimationStyle = ''
    notificationAnimationStyle += '-webkit-animation-name: notificationAnimation;'
    notificationAnimationStyle += '-webkit-animation-duration: 0.4s;'
    notificationAnimationStyle += "-webkit-animation-timing-function: ease;"
    notificationAnimationStyle += "-webkit-animation-iteration-count: 1;"

    this.setData({
      notificationAnimationStyle: ''
    })
    this.setData({
      notificationAnimationStyle: notificationAnimationStyle
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 加载动画
    this.notificationAnimation()
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
    // wx.showLoading({
    //   title: '正在加载',
    // })
    var that = this
    var userId = getApp().globalData.userId
    console.log("userId", userId)

    

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