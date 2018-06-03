
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
    content: '公告内容',
    note_time: '2018/05/01',
    note_user: '产品经理',
    belonging: '项目名',//项目名

    has_read: true,  // 本用户是否已读此公告
    is_read_empty: false, // 已读列表是否为空，下同
    is_noread_empty: false,

    icon_share: '/img/share.png',
    icon_belonging: '/img/belonging.png',
    icon_close: '/img/close.png',
    icon_more: '/img/more.png',
    
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
    wx.setStorageSync("announcementDetail-content", this.data.content)
    wx.navigateTo({
      url: './Content/Content',
    })
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
      console.log("已读成员列表", read)
      console.log("当前成员ID", CurrentMemberId)
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
        console.log("查询失败: " + error.code + " " + error.message);
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
          console.log("修改已读状态成功！")

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
  var that = this
    var Announcement = Bmob.Object.extend("annoucement")
  var announcementQuery = new Bmob.Query(Announcement)
  var AnnouncementRead = Bmob.Object.extend("annoucement_read")
  var announcementReadQuery = new Bmob.Query(AnnouncementRead)

  //删除指定公告
  announcementQuery.equalTo("objectId", announcementId)
  announcementQuery.destroyAll({
      success: function () {
        //删除成功
        console.log("删除公告成功！")

        wx.showToast({
          title: '公告删除成功',
          icon: 'success',
          duration: 1500
        })

      },
      error: function (err) {
        // 删除失败
        console.log("删除公告失败！", err)
      }
    })

  //删除指定公告的已读和未读成员信息
  announcementReadQuery.equalTo("annouce_id", announcementId)
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
      note_user: Announcement.memberName,
      is_showmember: Announcement.is_showmember
    })

    if (Announcement.content == "" || Announcement.content.length == 0) {
      // 公告不为空时显示公告
      that.setData({
        content: '此公告无详情',
        text_color: '#888888'
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

   var content = wx.getStorageSync("announcementDetail-Content-content")//公告内容
   console.log('公告内容：'+content)
   
   if(content != "" || content.length != 0) {
     that.setData({
       content: content
     })
   }

   var Announcement = wx.getStorageSync("AnnouncementDetail")//公告内容
   that.getReadAnnounce(Announcement.id)
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
