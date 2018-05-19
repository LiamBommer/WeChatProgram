// model/announcement.js
var Bmob = require('../utils/bmob.js')

/**
 *2018-05-18
 *@author mr.li
 @parameter projId 项目id
 *@return 指定项目的所有公告数组
 *根据项目id获取所有公告，默认10条（根据时间降序排列，即由近到远）
 * 
 */
function getAnnouncements(projId){

  var Annoucement = Bmob.Object.extend("annoucement")
  var annoucementQuery = new Bmob.Query(Annoucement)

  var annoucementArr = []  //所有公告数组

  //查询出此项目中的所有公告，默认10条
  annoucementQuery.equalTo("proj_id",projId)
  annoucementQuery.descending("createdDate")  //根据时间降序排列
  annoucementQuery.find({
    success: function (results) {
      console.log("共查询到公告 " + results.length + " 条记录");
      // 循环处理查询到的数据
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        annoucementArr.push(object)
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  })

  return annoucementArr
}

/**
 * @autor mr.li
 * @parameter projId项目id， projName项目名称，title公告标题， content公告内容，is_showmember是否显示已读和未读成员
 * 添加公告
 */
function createAnnouncement(projId, projName, title, content, is_showmember){

  var Announcement = Bmob.Object.extend("annoucement")  //数据库的名字拼错了，但是现在还是和后台的数据库是一样的
  var announcement = new Announcement()
  var currentUser = Bmob.User.current()  //获取当前用户
  var leaderId = "0"
  var leaderName = "0"

  var announceId = "0"  //用来存储创建成功后的公告id

  if(currentUser){
    leaderId = currentUser.id
    leaderName = currentUser.get("nickName")
  }

  //保存公告
  announcement.save({
    title: title,
    content:content,
    is_showmember: is_showmember,
    proj_id: projId,
    proj_name: projName,
    leader_id: leaderId,
    leader_nickname: leaderName,
    read_num: 0
  }, {
      success: function (result) {
        // 添加成功
        console.log("创建公告成功！",result.id)
        announceId = result.id
        
        if(is_showmember){        
          //保存未读成员列表 //可以开启另外一个线程处理？
          saveUnread(projId,announceId)  //调用函数
        }       
      },
      error: function (result, error) {
        // 添加失败
        console.log("创建公告失败！", error)
      }})     
}

/**
 * @autor mr.li
 * @parameter projId项目id，announceId公告id
 * 保存指定公告的未读成员，限制50个成员
 */
function saveUnread(projId, announceId){
  
  var ProjMember = Bmob.Object.extend("proj_member")
  var projMemberQuery = new Bmob.Query(ProjMember)
  var Annoucement_read = Bmob.Object.extend("annoucement_read")
  var annoucement_read = new Annoucement_read()
  var memberObjects =[]  //构建一个本地的Bmob.Object数组

  //查询指定项目的所有成员id,50条
  projMemberQuery.equalTo("proj_id", projId)
  projMemberQuery.limit(50)  
  projMemberQuery.select("user_id")
  projMemberQuery.find().then(function (results) {
    //返回成功
    console.log("共查询到 " + results.length + " 条记录");
    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      console.log("获取项目id", object.get('proj_id'));
      var object = {}
      object = {
        user_id: result.get("user_id"),
        annouce_id: announceId,
        read: false
      }
      memberObjects.push(object)
    }
  })

  if(memberIdArr.length > 0){
    //保存未读成员列表
    annoucement_read.saveAll(memberObjects).then(function (memberObjects) {
      // 成功
      console.log("保存未读成员列表成功！")
    },
      function (error) {
        // 异常处理
        console.log("保存未读成员列表失败！",error)
      })
  }
  
}
module.exports.getAnnouncements = getAnnouncements
module.exports.createAnnouncement = createAnnouncement
module.exports.saveUnread = saveUnread