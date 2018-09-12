
var Bmob = require('../../../../utils/bmob.js')
var DELETE_ANNOUNCEMENT = '删除了项目公告'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalputTitle: true,//弹出标题模态框

    id:"",//公告ID
    title: '加载中',//标题
    inputTitle:'',//输入的标题
    content: '加载中',
    note_time: '',
    note_user: '',
    belonging: '加载中',//项目名

    has_read: true,  // 本用户是否已读此公告
    is_read_empty: false, // 已读列表是否为空，下同
    is_noread_empty: false,

    icon_share: '/img/share.png',
    icon_belonging: '/img/belonging.png',
    icon_close: '/img/close.png',
    icon_more: '/img/more.png',

    isShared: false,  // 是否从分享页面进入的标识
    
    //未读成员
    noread: [
      // {
      //   objectId: "",
      //   userPic: '/img/member.png',
      //   nickName:"同学A",
      // },
    ],

    //已读成员
    read: [
      // {
      // objectId: "",
      // userPic: '/img/member.png',
      // nickName:"同学A",
      // },
    ],
  },


  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinputTitle: function () {
    this.setData({
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
    this.setData({
      hiddenmodalputTitle: true,
      title: this.data.inputTitle
    })
  }, 

  //标题
  input: function (e){
    var inputTitle = e.detail.value
    this.setData({
      inputTitle: inputTitle
    })
  },
  
  //内容
  Content: function (e) {
    // wx.setStorageSync("announcementDetail-content", this.data.content)
    // wx.navigateTo({
    //   url: './Content/Content',
    // })
  }, 

  //点击收到
  ClickRead:function(){
    var that = this
    var hasRead = false//判断是否已点过“收到”
    var hasReadMember = false//判断已读列表是否有当前用户
    var CurrentMemberId = getApp().globalData.userId//当前用户ID
    var CurrentMemberIcon = getApp().globalData.userPic//当前用户头像
    var CurrentMemberName = getApp().globalData.nickName//当前用户姓名

    that.letMeSee(CurrentMemberId,that.data.id)

    var read = that.data.read
    var noread = that.data.noread

    // for(var i in read){
    //   if (read[i].objectId == CurrentMemberId)//已点击"收到"
    //   {
    //     wx.showToast({
    //       title: '你已经点过啦',
    //       icon:'none',
    //     })
    //     hasRead = true
    //   }
    // }

    if (hasRead == false) {//未点击"收到"
      wx.showToast({
        title: '收到',
        icon: 'success',
      })
      // 隐藏按钮
      that.setData({
        has_read: true
      })

      //删除未读成员
      for (var i in noread ){
        if (noread[i].objectId == CurrentMemberId){
          noread.splice(i,1)
        }
      }
      that.setData({
        noread: noread
      })
    //增加已读成员
      // console.log("已读成员列表", read)
      // console.log("当前成员ID", CurrentMemberId)
      for (var i in read) {
        if (read[i].objectId == CurrentMemberId) {
          hasReadMember = true
        }
      }

      if (hasReadMember == false){
        read.push({
          objectId: CurrentMemberId,
          userPic: CurrentMemberIcon,
          nickName: CurrentMemberName,
        })
        that.setData({
          read: read
        })

        var readUser = that.data.read
        var unreadUser = that.data.noread
        // 判断未读列表是否只剩一个
        if (unreadUser.length == 1) {
          that.setData({
            is_noread_empty: true
          })
        }
        if (readUser != "[]" || readUser.length != 0) {
          // 已读列表为空，则设置为假（本人已读）
          that.setData({
            is_read_empty: false
          })
        }

      }
      else{
        wx.showToast({
          title: '你已经点过啦',
          icon: 'none',
        })
      }
    }

    
  },

  //已读成员列表
  readMember: function () {
    wx.setStorageSync("announcementDetail-readMember", this.data.read)
    wx.navigateTo({
      url: './memberList/memberList',
    })
  },

  //删除公告
  Delete: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除此公告吗',
      success:function(res){
        if(res.confirm){//点击确定
          // 显示loading Toast
          wx.showLoading({
            title: '正在删除...',
          })
          // delete
          if (!that.data.isShared)
            that.deleteAnnouncement(wx.getStorageSync('Project-detail').id,that.data.id)
          else{
            //为了防止别人乱删除被分享的公告，所以通知用户到小程序中删除
            wx.showToast({
              title: '不能在分享页面删除哟~',
              icon:'none'
              //image:''  //可以加图片
            })
          }   
          
        }
        else{//点击取消

        }
      }
    })

  },


  /**
   *2018-05-19
   *@author mr.li
   @parameter announcementId公告id
   *获取公告详情object类型
   *获取所需的公告详情
   * 
   */
  getAnnouncementDetail:function (announcementId){
    var that = this
    var Announcement = Bmob.Object.extend("annoucement")
    var announceQuery = new Bmob.Query(Announcement)

    var detailObject = {}

    //获取指定的公告内容
    announceQuery.equalTo("objectId", announcementId)
    announceQuery.include('publisher')
    announceQuery.first({
      success: function (result) {
        // console.log("获取指定的公告内容成功！")
        var announcement = result

        //在这里设置setdata,获取已读和未读成员在函数function getReadAnnounce(announcementId)
        // console.log("获取指定的公告内容成功！", announcement)
        that.setData({
          id: announcement.id,
          title: announcement.attributes.title,
          content: announcement.attributes.content,
          note_time: announcement.createdAt.substring(0,16),
          belonging: announcement.attributes.proj_name,
          note_user: announcement.attributes.publisher.nickName,
          is_showmember: announcement.attributes.is_showmember
        })

        if (announcement.attributes.content == "" || announcement.attributes.content.length == 0) {
          // 公告不为空时显示公告
          that.setData({
            content: '此公告无详情',
            text_color: '#888888'
          })
        }

       wx.hideLoading()


      },
      error: function (error) {
        // console.log("查询失败: " + error.code + " " + error.message);
      }
    })


  },
  /**
 *2018-05-19
 *@author mr.li
 @parameter announcementId公告id
 * 获得两个数组，一个是已读成员数组readUser， 另一个是unreadUser，两个数组的元素是一样的。
 *根据公告id获取该公告的所有已读和未读成员
 * 
 */
  getReadAnnounce:function (announcementId){
  var that = this
    var AnnouncementRead = Bmob.Object.extend("annoucement_read")
  var announcementReadQuery = new Bmob.Query(AnnouncementRead)
  var User = Bmob.Object.extend("_User")
  var userQuery = new Bmob.Query(User)

  var readObject = {}
  var readUser = []
  var unreadUser = []

  //根据公告id获取已读和未读成员
  announcementReadQuery.equalTo("annouce_id", announcementId)
  announcementReadQuery.include("user")
  announcementReadQuery.find({
    success: function (results) {
        for (var i = 0; i < results.length; i++) {
          if (results[i].get("read")) {
            readUser.push(results[i].get("user"))
          } else {
            unreadUser.push(results[i].get("user"))
          }
        }

        //在这里设置setData
        that.setData({
          read: readUser,
          noread: unreadUser
        })

        // 判断已读列表是否为空，以判断是否显示列表
        if(unreadUser == "[]" || unreadUser.length == 0) {
          // 未读列表为空
          that.setData({
            is_noread_empty: true
          })
        }
        if (readUser == "[]" || readUser.length == 0) {
          // 已读列表为空
          that.setData({
            is_read_empty: true
          })
        }
        
        // 判断我是否已读，是则隐藏按钮
        var myId = getApp().globalData.userId
        for(var i=0; i<unreadUser.length; i++) {
          if(unreadUser[i].objectId == myId) {
            // 隐藏按钮
            that.setData({
              has_read: false
            })
            break
          }
        }

      },
      error: function (error) {
        // console.log("查询失败: " + error.code + " " + error.message);
      }
    })

  },

  /**
 *2018-05-19
 *@author mr.li
 @parameter userId用户id, announcementId 公告id
 *
 *修改用户的已读状态
 */
  letMeSee:function (userId, announcementId){

  var AnnouncementRead = Bmob.Object.extend("annoucement_read")
  var announcementReadQuery = new Bmob.Query(AnnouncementRead)

  //更改某用户的已读状态
  announcementReadQuery.equalTo("annouce_id", announcementId)
  announcementReadQuery.equalTo("user", userId)
  announcementReadQuery.find({
      success: function (result) {
        var flag = result[0].get("read")
        if (!flag) {
          result[0].set("read", true)   //更改状态为已读
          result[0].save()
          // console.log("修改已读状态成功！")

          var Announcement = Bmob.Object.extend("annoucement")
          var announcementQuery = new Bmob.Query(Announcement)
          announcementQuery.get(announcementId, {
            success: function (result) {
              //成功
              result.increment("read_num")  //增加公告的已读数量
              result.save()
            },
            error: function (result) {
              //失败
            }
          })

        }

      },
      error: function (error) {
        // console.log("更改某用户的已读状态失败！", error)
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
   *2018-05-19
   *@author mr.li
   @parameter announcementId 公告id
   *
   *删除公告，设置is_delete字段
   */
  deleteAnnouncement:function (projId,announcementId){
  var that = this
  var Announcement = Bmob.Object.extend("annoucement")
  var announcementQuery = new Bmob.Query(Announcement)
  var AnnouncementRead = Bmob.Object.extend("annoucement_read")
  var announcementReadQuery = new Bmob.Query(AnnouncementRead)

  //删除指定公告
  // announcementQuery.equalTo("objectId", announcementId)
  announcementQuery.get(announcementId,{
      success: function (result) {
        //删除成功
        result.set('is_delete',true)
        result.save()
        // console.log("删除公告成功！")
        //通知项目其他成员
        var _type = 2
        that.addProjectNotification(projId,DELETE_ANNOUNCEMENT,_type,announcementId)
        // 隐藏loading弹窗
        wx.hideLoading()

        // 返回上一个页面
        wx.navigateBack({
          url: '../../ProjectMore/ProjectMore',
        })

        // 显示成功反馈
        wx.showToast({
          title: '公告删除成功',
          icon: 'success',
          duration: 1000
        })
      },
      error: function (err) {
        // 删除失败
        // console.log("删除公告失败！", err)
        // 隐藏loading弹窗
        wx.hideLoading()
        // 显示失败反馈
        wx.showToast({
          title: '公告删除失败，请稍后再试',
          icon: 'none',
          duration: 1000
        })
      }
    })

  },


  /**
       * 分享页面按钮，回到首页
       */
  showScheduleList: function () {
    wx.switchTab({
      url: '/pages/Project/Project',
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 接收页面参数，判断是否从分享进入
    // console.log('页面参数', options)
    if(options.isShared) {
      this.setData({
        isShared: options.isShared,
        announcementId: options.announcementId,
      })
    }

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
  //  wx.showLoading({
  //    title: '正在加载',
  //  })

   //获取通知的公告ID
   var requestId = wx.getStorageSync("Notification-announcementId")
   //获取分享的标识
   var isShared = this.data.isShared

   if (requestId != "") {
     that.getAnnouncementDetail(requestId)
     that.getReadAnnounce(requestId)
   }
   else if (isShared) {
     // 从分享的页面进入
     var announcementId = that.data.announcementId
     that.getAnnouncementDetail(announcementId)
     that.getReadAnnounce(announcementId)
   }
   else {
     // 获取公告id，进行查询
     var Announcement = wx.getStorageSync("ProjectMore-AnnouncementDetail")//公告内容
     that.getAnnouncementDetail(Announcement.id)
     that.getReadAnnounce(Announcement.id)
   }

   
   var content = wx.getStorageSync("announcementDetail-Content-content")//公告内容
  //  console.log('公告内容：'+content)
   
   if(content != "" || content.length != 0) {
     that.setData({
       content: content
     })
   }

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
    wx.removeStorageSync("ProjectMore-AnnouncementDetail")
    wx.removeStorageSync("announcementDetail-Content-content")
    wx.removeStorageSync("Notification-announcementId")
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

    var that = this
    var currentUserName = getApp().globalData.nickName
    var title = that.data.title
    var announcementId = that.data.id

    // 分享
    return {
      title: currentUserName + '分享了公告: ' + title,
      path: "pages/Project/Announcement/announcementDetail/announcementDetail?isShared=true&announcementId=" + announcementId,
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
        })
      },
    }

  }
})
