// model/projectList.js
var Bmob = require('../utils/bmob.js')
var FAIL = "fail"

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
  if(currentUser){
    user_id = currentUser.id
  }

  //查询当前用户所在的所有项目id，默认10条
  memberQuery.select("proj_id")
  memberQuery.equalTo("user_id", user_id)
  memberQuery.find().then(function(results){
    //返回成功
    console.log("共查询到用户所在项目 " + results.length + " 条记录");
    for (var i = 0; i < results.length; i++) {
      var object = results[i]
      project_id.push(object.get("proj_id").trim())
    }

    //查询当前用户所在的所有项目，默认10条
    projectQuery.containedIn("objectId", project_id)
    projectQuery.find({
      success: function (results) {
        //成功
        console.log("共查询到项目 " + results.length + " 条记录");
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var object = results[i]
          console.log(object)
          projectArr.push(object)
        }
        console.log("projectArr", projectArr[0])
        //todo: 在这里设置setdata





      },
      error: function (error) {
        //失败
        console.log("查询用户所在的所有项目失败: " + error.code + " " + error.message);
        //失败情况





      }
    }
    
    )

  })
  return projectArr
}
  
  

/**
 * 2018-05-18
 * @author mr.li
 * @parameter projId 项目id
 * @return 项目成员数组（nickName,userPic）
 * 先获取所有成员的id，然后获取所有成员的信息（昵称和头像），而且第一条是项目领导
 */
function getProjectMembers(projId){
  var ProjectMember = Bmob.Object.extend("proj_member")
  var memberQuery = new Bmob.Query(ProjectMember)
  var User = Bmob.Object.extend("_User")
  var userQuery = new Bmob.Query(User)

  var leader_id = "0"
  var memberId = [] //项目的所有成员id数组
  var userArr = [] //项目所有成员数组
  
  //获取指定项目的所有成员id，50条
  memberQuery.equalTo("proj_id",projId)
  memberQuery.select("user_id","is_leader")
  memberQuery.find().then(function (results) {
    //返回成功
    console.log("共查询到 " + results.length + " 条记录");
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      if(object.get("is_leader")){
        //项目领导，放在数组的第一个
        console.log("获取项目领导id", object.get('user_id'));
        leader_id = object.get("user_id")
        memberId.unshift(leader_id)

      }else{
        console.log("获取项目成员id", object.get('user_id'));
        memberId.push(object.get("user_id"))  //将成员id添加到数组
      }     
    }
  }).then(function(result){

    //获取指定项目的所有成员,默认10条
    userQuery.select("nickName", "userPic")  //查询出用户的昵称和头像
    userQuery.limit(50)
    userQuery.containedIn("objectId", memberId)

    // userQuery.matchesKeyInQuery("objectId", "user_id", memberQuery)
    userQuery.find({
      success: function (results) {
        console.log("共查询到项目成员 " + results.length + " 条记录");
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var object = results[i];

          if (object.id == leader_id) {
            //将项目领导放在数组的第一个位置
            userArr.unshift(object)
          } else
            userArr.push(object)
        }

        //在这里设置setdata
        //console.log(userArr)




      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
        //失败情况





      }
    })

  })

  

}

module.exports.getProjectList = getProjectList
module.exports.getProjectMembers = getProjectMembers
