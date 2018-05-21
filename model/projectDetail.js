// model/projectDetail.js
var Bmob = require('../utils/bmob.js')
var ProjectList = require('projectList')

/**
 * @author mr.li
 * @parameter projId 项目id
 * @return 项目详情的object
 * （'project' ->object类型，
 *   'membersPics' ->object数组，每个object有 nickName 和 userPic）
 */
function getProjectDetail(projId){

  var Project = Bmob.Object.extend("project")
  var projectQuery = new Bmob.Query(Project)
  // var Members = Bmob.Object.extend("proj_member")
  // var membersQuery = new Bmob.Query(Members)

  var detailObject = {}  //项目详情页面的所需信息
  //var memberPics = ProjectList.getProjectMembers(projId)   //调用函数获取成员数组（nickName，userPic），数组的第一个为项目领导人
  var memberPics = []

  var ProjectMember = Bmob.Object.extend("proj_member")
  var memberQuery = new Bmob.Query(ProjectMember)
  var User = Bmob.Object.extend("_User")
  var userQuery = new Bmob.Query(User)

  var leader_id = "0"
  var memberId = [] //项目的所有成员id数组
  var userArr = [] //项目所有成员数组

  //获取指定项目的所有成员id，50条
  memberQuery.equalTo("proj_id", projId)
  memberQuery.select("user_id", "is_leader")
  memberQuery.find().then(function (results) {
    //返回成功
    console.log("共查询到 " + results.length + " 条记录");
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      if (object.get("is_leader")) {
        //项目领导，放在数组的第一个
        console.log("获取项目领导id", object.get('user_id'));
        leader_id = object.get("user_id")
        memberId.unshift(leader_id)

      } else {
        console.log("获取项目成员id", object.get('user_id'));
        memberId.push(object.get("user_id"))  //将成员id添加到数组
      }
    }
  }).then(function (result) {

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
        console.log(userArr)
        memberPics = userArr




      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
        //失败情况





      }
    })

  })
  //查询指定项目详情
  projectQuery.equalTo("objectId",projId)
  projectQuery.first({
    success: function (result) {
      detailObject = {
          project: result,
          memberPics: memberPics
      }

      console.log("detailObject", detailObject)
      //todo：在这里设置setdata




    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  })

}

module.exports.getProjectDetail = getProjectDetail