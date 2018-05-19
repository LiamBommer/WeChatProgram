//module/announcementDetail.js
var Bmob = require('../utils/bmob.js')

/**
 *2018-05-19
 *@author mr.li
 @parameter announcementId公告id
 *@return 公告详情object类型，此object包含 object.announcement(公告内容），object.readObjcet 已读和未读成员
 *获取所需的公告详情，包括公告内容和已读未读成员
 * 
 */
function getAnnouncementDetail(announcementId){

  var Announcement = Bmob.Object.extend("annoucement")
  var announceQuery = new Bmob.Query(Announcement)

  var detailObject = {}

  //获取指定的公告内容
  announceQuery.equalTo("objectId", announcementId)
  announceQuery.first({
    success: function (result) {
      console.log("获取指定的公告内容成功！")
      var announcement = result
      var readObject = getReadAnnounce(announcementId)
      
      detailObject = {
        announcement: announcement,
        readObject: readObject
      }
      
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  })

  return detailObject
}

/**
 *2018-05-19
 *@author mr.li
 @parameter announcementId公告id
 *@return 返回已读和未读成员 object类型，包括object.readUser(已读成员数组), object.unreadUser(未读成员数组)
 *根据公告id获取该公告的所有已读和未读成员
 * 
 */
function getReadAnnounce(announcementId){

  var AnnouncementRead = Bmob.Objcet.extend("annoucement_read")
  var announcementReadQuery = new Bmob.Query(AnnouncementRead)

  var readObject = {}
  var read = []
  var unread = []
  var readUser=[]
  var unreadUser=[]

  //根据公告id获取已读和未读成员
  announcementReadQuery.equalTo("annouce_id",announcementId)
  announcementReadQuery.find({
    success: function (results) {
      for(var i=0;i<results.length;i++){
        if(results[i].get("read")){
          read.push(results[i].get("user_id"))
        }else{
          unread.push(results[i].get("user_id"))
        }
      }

      if(read.length > 0){
        readUser = getUser(read) 
      }
      if(unread.length > 0){
        unreadUser = getUser(unread)
      }

      readObject = {
        readUser: readUser,
        unreadUser: unreadUser
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  })

  return readObject
}

/**
 *2018-05-19
 *@author mr.li
 @parameter userIds 用户id数组
 *@return 用户信息数组（nickName, userPic)
 *根据用户id数组 获取用户信息数组，每个元素都是要给object，每个object包括object.nickName, object.userPic
 * 
 */
function getUser(userIds){

  var User = Bmob.Object.extend("_User")
  var userQuery = new Bmob.Query(User)

  var userObjects = []

  //根据id数组查询用户昵称和头像
  userQuery.containedIn("objectId",userIds)
  userQuery.find({
    success: function (results) {
      for(var i=0;i<results.length;i++){
        var result = results[i]
        var object = {}
        object = {
          nickName: result.get("nickName"),
          userPic: result.get("userPic")
        }
        userObjects.push(object)
      }      
    }    
  })

  return userObjects
}

/**
 *2018-05-19
 *@author mr.li
 @parameter userId用户id, announcementId 公告id
 *
 *修改用户的已读状态
 */
function letMeSee(userId, announcementId){

  var AnnouncementRead = Bmob.Objcet.extend("annoucement_read")
  var announcementReadQuery = new Bmob.Query(AnnouncementRead)

  //更改某用户的已读状态
  announcementReadQuery.equalTo("annouce_id",announcementId)
  announcementReadQuery.equalTo("user_id",userId)
  announcementReadQuery.save(null,{
    success: function(result){
      console.log("更改某用户的已读状态成功！")
      result.set("read",true)
      result.save()
    },
    error:function(error){
      console.log("更改某用户的已读状态失败！",error)
    }
  })

}

/**
 *2018-05-19
 *@author mr.li
 @parameter announcementId 公告id
 *
 *删除公告，并删除与此公告有关的已读和未读成员信息
 */
function deleteAnnouncement(announcementId){

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
}