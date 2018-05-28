//module/announcementDetail.js
var Bmob = require('../utils/bmob.js')


/**
 *2018-05-19
 *@author mr.li
 @parameter announcementId公告id
 *获取公告详情object类型
 *获取所需的公告详情
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
      
      //在这里设置setdata,获取已读和未读成员在函数function getReadAnnounce(announcementId)
      console.log("获取指定的公告内容成功！",announcement)





      
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  })


}

/**
 *2018-05-19
 *@author mr.li
 @parameter announcementId公告id
 * 获得两个数组，一个是已读成员数组readUser， 另一个是unreadUser，两个数组的元素是一样的。
 *根据公告id获取该公告的所有已读和未读成员
 * 
 */
function getReadAnnounce(announcementId){

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
      for(var i=0;i<results.length;i++){
        if(results[i].get("read")){
          readUser.push(results[i].get("user"))
        }else{
          unreadUser.push(results[i].get("user"))
        }
      }
      //在这里设置setData
      console.log("已读成员",readUser,"未读成员",unreadUser)







    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  })

}

/**
 *2018-05-19
 *@author mr.li
 @parameter userId用户id, announcementId 公告id
 *
 *修改用户的已读状态
 */
function letMeSee(userId, announcementId){

  var AnnouncementRead = Bmob.Object.extend("annoucement_read")
  var announcementReadQuery = new Bmob.Query(AnnouncementRead)

  //更改某用户的已读状态
  announcementReadQuery.equalTo("annouce_id",announcementId)
  announcementReadQuery.equalTo("user",userId)
  announcementReadQuery.find({
    success: function(result){
      var flag = result[0].get("read")
      if (!flag){
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
  var AnnouncementRead = Bmob.Object.extend("annoucement_read")
  var announcementReadQuery = new Bmob.Query(AnnouncementRead)

  //删除指定公告
  announcementQuery.equalTo("objectId", announcementId)
  announcementQuery.destroyAll({
    success: function () {
      //删除成功
      console.log("提示用户删除公告成功！")






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
}

// /**
//  *2018-05-19   已废弃
//  *@author mr.li 
//  @parameter userIds 用户id数组
//  *@return 用户信息数组（nickName, userPic)
//  *根据用户id数组 获取用户信息数组，每个元素都是要给object，每个object包括object.nickName, object.userPic
//  * 
//  */ 已废弃
// function getUser(userIds){

//   var User = Bmob.Object.extend("_User")
//   var userQuery = new Bmob.Query(User)

//   var userObjects = []

//   //根据id数组查询用户昵称和头像
//   userQuery.containedIn("objectId",userIds)
//   userQuery.find({
//     success: function (results) {
//       for(var i=0;i<results.length;i++){
//         var result = results[i]
//         var object = {}
//         object = {
//           nickName: result.get("nickName"),
//           userPic: result.get("userPic")
//         }
//         userObjects.push(object)
//       }      
//     }    
//   })

// }
module.exports.getAnnouncementDetail = getAnnouncementDetail
module.exports.getReadAnnounce = getReadAnnounce
module.exports.letMeSee = letMeSee
module.exports.deleteAnnouncement = deleteAnnouncement