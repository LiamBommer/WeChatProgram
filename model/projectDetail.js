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
  var memberPics = ProjectList.getProjectMembers(projId)   //调用函数获取成员数组（nickName，userPic），数组的第一个为项目领导人
 
  //查询指定项目详情
  projectQuery.equalTo("objectId",projId)
  projectQuery.first({
    success: function (results) {
      console.log("共查询到项目 " + results.length + " 条记录");
      // 循环处理查询到的数据
      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var object = {}
        object = {
          project: result,
          memberPics: memberPics
        }
      }

      detailObject = object
      return detailObject  //返回一个定制对象
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  })

}