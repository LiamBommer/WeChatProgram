// model/projectList.js
var Bmob = require('../utils/bmob.js')

/**
 *2018-05-18
 *@author mr.li
 *@return 所有项目的数组类型
 *获取用户的所有项目
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

  //查询当前用户所在的所有项目id
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
  
  //查询当前用户所在的所有项目
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


