// model/projectList.js
var Bmob = require('../utils/bmob.js')

/**
 *2018-05-18
 *@author mr.li
 *@return 所有项目的数组
 *获取用户的所有项目,默认10条
 * 
 */
function getProjectList(){
  var Project = Bmob.Object.extend("project")
  var projectQuery = new Bmob.Query(Project)
  var member = Bmob.Object.extend("proj_member")
  var memberQuery = new Bmob.Query(member)
  var currentUser = Bmob.User.current()

  var user_id = "0"
  var project_id = []  //项目id数组
  var projectArr = []
  if(currentUser)
   user_id = currentUser.id

  //查询当前用户所在的所有项目id，默认10条
  memberQuery.equalTo("user_id", user_id)
  memberQuery.select("proj_id")
  memberQuery.find().then(function(results){
    //返回成功
    console.log("共查询到 " + results.length + " 条记录");
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      project_id.push(object.get("proj_id"))
      console.log("获取项目id",object.get('proj_id'));
    }
  })
  
  //查询当前用户所在的所有项目，默认10条
  projectQuery.containedIn("objectId",project_id)
  projectQuery.find({
    success: function (results) {
      console.log("共查询到项目 " + results.length + " 条记录");
      // 循环处理查询到的数据
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        projectArr.push(object)
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  })

  return projectArr
}

/**
 * 2018-05-18
 * @author mr.li
 * @parameter projId 项目id
 * @return 项目成员数组（nickName,userPic）
 * 先获取所有成员的id，然后获取所有成员的信息（昵称和头像）
 */
function getProjectMembers(projId){
  var ProjectMember = Bmob.Object.extend("proj_member")
  var memberQuery = new Bmob.Query(ProjectMember)
  var User = Bmob.Object.extend("_User")
  var userQuery = new Bmob.Query(User)

  var memberId = [] //项目的所有成员id数组
  var userArr = [] //项目所有成员数组
  
  //获取指定项目的所有成员id，默认10条
  memberQuery.equalTo("proj_id",projId)
  memberQuery.select("user_id")
  memberQuery.find().then(function (results) {
    //返回成功
    console.log("共查询到 " + results.length + " 条记录");
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      console.log("获取项目id", object.get('proj_id'));
      memberId.push(object.get("user_id"))  //将成员id添加到数组
    }
  })

  //获取指定项目的所有成员,默认10条
  userQuery.select("nickName","userPic")  //查询出用户的昵称和头像
  userQuery.containedIn("objectId", userId)
  userQuery.find({
    success: function (results) {
      console.log("共查询到项目 " + results.length + " 条记录");
      // 循环处理查询到的数据
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        userArr.push(object)
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  })

  return userArr
}

module.exports.getProjectList = getProjectList
module.exports.getProjectMembers = getProjectMembers
