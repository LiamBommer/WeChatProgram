
var Bmob = require('../../../../utils/bmob.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalputTitle: true,//弹出标题模态框

    id:"",//公告ID
    title: '公告标题',//标题
    inputTitle:'',//输入的标题
    content: '因为 Mr.Li 也很牛逼balabal ...\n'+
            '我就不说什么了，大家都知道的。\n'+
            '请同学们抓紧时间做完原型图，做完了请大家吃鸡腿',
    note_time: '2018/05/01',
    note_user: '产品经理',
    belonging: '项目名',//项目名

    icon_share: '/img/share.png',
    icon_belonging: '/img/belonging.png',
    icon_close: '/img/close.png',
    icon_more: '/img/more.png',
    
    //未读成员
    noread: [
      {
        id: "",
        icon: '/img/member.png',
        name:"同学A",
      },
      {
        id: "",
        icon: '/img/member.png',
        name: "同学B",
      },
    ],

    //已读成员
    read: [
      // {
      //   id:"",
      //   icon: '',
      //   name: '',
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
    wx.setStorageSync("announcementDetail-content", this.data.content)
    wx.navigateTo({
      url: './Content/Content',
    })
  }, 

  //点击收到
  ClickRead:function(){
    var that = this
    var hasRead = false//判断是否已点过“收到”
    var CurrentMemberId = getApp().globalData.userId//当前用户ID
    var CurrentMemberIcon = getApp().globalData.userPic//当前用户头像
    var CurrentMemberName = getApp().globalData.nickName//当前用户姓名
    that.letMeSee(CurrentMemberId,that.data.id)
    var read = that.data.read
    for(var i in read){
      if (read[i].id == CurrentMemberId)//已点击"收到"
      {
        wx.showToast({
          title: '你上次已经点过啦',
          icon:'none',
        })
        hasRead = true
      }
    }
    if (hasRead == false) {//未点击"收到"
      wx.showToast({
        title: '收到',
        icon: 'success',
      })
    //删除未读成员
      var memberList = wx.getStorageSync("ProjectDetail-memberList")//未读成员列表
      for (var i in memberList ){
        if (memberList[i].id == CurrentMemberId){
          memberList.splice(i,1)
        }
      }
      that.setData({
        noread: memberList
      })
    //增加已读成员
      read.push({
        id: CurrentMemberId,
        icon: CurrentMemberIcon,
        name: CurrentMemberName,
      })
      that.setData({
        read: read
      })
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
          that.deleteAnnouncement(that.data.id)
          wx.navigateBack({
            url: '../../ProjectMore/ProjectMore',
          })
        }
        else{//点击取消

        }
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
  letMeSee:function(userId, announcementId){

    var AnnouncementRead = Bmob.Objcet.extend("annoucement_read")
  var announcementReadQuery = new Bmob.Query(AnnouncementRead)

  //更改某用户的已读状态
  announcementReadQuery.equalTo("annouce_id", announcementId)
  announcementReadQuery.equalTo("user_id", userId)
  announcementReadQuery.save(null, {
      success: function (result) {
        console.log("更改某用户的已读状态成功！")
        result.set("read", true)
        result.save()
      },
      error: function (error) {
        console.log("更改某用户的已读状态失败！", error)
      }
    })

  },

  /**
 *2018-05-19
 *@author mr.li
 @parameter announcementId 公告id
 *
 *删除公告，并删除与此公告有关的已读和未读成员信息
 */
  deleteAnnouncement:function (announcementId){

    var Announcement = Bmob.Object.extend("annoucement")
  var announcementQuery = new Bmob.Query(Announcement)
  var AnnouncementRead = Bmob.Objcet.extend("annoucement_read")
  var announcementReadQuery = new Bmob.Query(AnnouncementRead)

  //删除指定公告
  announcementQuery.equalTo("objectId", announcementId)
  announcementQuery.destroyAll({
      success: function () {
        //删除成功
        console.log("删除公告成功！")
      },
      error: function (err) {
        // 删除失败
        console.log("删除公告失败！", err)
      }
    })

  //删除指定公告的已读和未读成员信息
  announcementReadQuery.equalTo("annouce_id")
  announcementReadQuery.destroyAll({
      success: function () {
        //删除成功
        console.log("删除指定公告的已读和未读成员信息成功")
      },
      error: function (err) {
        // 删除失败
        console.log("删除指定公告的已读和未读成员信息失败", err)
      }
    })
  },

  /**
 *2018-05-19
 *@author mr.li
 @parameter announcementId公告id
 *@return 返回已读和未读成员 object类型，包括object.readUser(已读成员数组), object.unreadUser(未读成员数组)
 *根据公告id获取该公告的所有已读和未读成员
 * 
 */
  getReadAnnounce:function (announcementId){
  var that = this
  var AnnouncementRead = Bmob.Objcet.extend("annoucement_read")
  var announcementReadQuery = new Bmob.Query(AnnouncementRead)
  var User = Bmob.Object.extend("_User")
  var userQuery = new Bmob.Query(User)

  var readObject = {}
  var read = []
  var unread = []
  var readUser= []
  var unreadUser= []

  //根据公告id获取已读和未读成员
  announcementReadQuery.equalTo("annouce_id", announcementId)
  announcementReadQuery.find({
      success: function (results) {
        for (var i = 0; i < results.length; i++) {
          if (results[i].get("read")) {
            read.push(results[i].get("user_id"))
          } else {
            unread.push(results[i].get("user_id"))
          }
        }

        if (read.length > 0) {
          //根据id数组查询用户昵称和头像
          userQuery.containedIn("objectId", userIds)
          userQuery.find({
            success: function (results) {
              for (var i = 0; i < results.length; i++) {
                var result = results[i]
                var object = {}
                object = {
                  name: result.get("nickName"),
                  icon: result.get("userPic")
                }
                readUser.push(object)
              }

              //在这里setdata
              that.setData({
                read: readUser
              })
            }
          })
        }

        if (unread.length > 0) {
          //根据id数组查询用户昵称和头像
          userQuery.containedIn("objectId", userIds)
          userQuery.find({
            success: function (results) {
              for (var i = 0; i < results.length; i++) {
                var result = results[i]
                var object = {}
                object = {
                  name: result.get("nickName"),
                  icon: result.get("userPic")
                }
                unreadUser.push(object)
              }
              //在这里setdata
              that.setData({
                noread: unreadUser
              })
            }
          })
        }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var projectName = wx.getStorageSync("Project-name")
    var Announcement = wx.getStorageSync("AnnouncementDetail")//公告内容
    that.setData({
      id: Announcement.id,
      title: Announcement.title,
      content: Announcement.content,
      note_time: Announcement.time,
      belonging: projectName,
      note_user: Announcement.memberName
    })
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

   var content = wx.getStorageSync("announcementDetail-Content-content")//会议内容
   if(content != "")
   that.setData({
     content: content
   })

   var Announcement = wx.getStorageSync("AnnouncementDetail")//公告内容
   var memberList = that.getReadAnnounce(Announcement.id)
   var memberList = wx.getStorageSync("ProjectDetail-memberList")//未读成员列表
   var read = that.data.read//已读成员列表
   for (var i in memberList) {
     for (var j in read){
       if (memberList[i].id == read[j].id) {
         memberList.splice(i, 1)
       }
     }
     
   }
   that.setData({
     noread: memberList
   })
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
    wx.removeStorageSync("announcementDetail-Content-content")
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
