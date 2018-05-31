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

/**
 * 2018-05-22
 * @anthor mr.li
 * @parameter projId项目id, memberIds 成员id数组
 * 删除成员
 */
function deleteProjectMember(projId, memberIds){

  var Proj_Member = Bmob.Object.extend("proj_member")

  var objects = new Array()
  for(var i=0;i<memberIds.length;i++){
    var proj_member = new Proj_Member()
    proj_member.set("projId",projId)
    proj_member.set("user_id",memberIds[i])
    objects.push(proj_member)
  }
  //若数组非空，则开始删除成员
  if(objects != null && objects.length > 0){
    Bmob.Object.destroyAll(objects).then(function () {
      //成功
      //console.log("删除项目成员成功！")


    }, function (error) {
      //失败



    })
  }

}

/**
 * 2018-05-22
 * @parameter 项目id ,isFirst 是否置顶项目，设置为true
 * 
 * 置顶项目
 */

function makeProjectFirst(projId,isFirst){
  var Project = Bmob.Object.extend("project")
  var projectQuery = new Bmob.Query(Project)

  projectQuery.get(projId,{
    success: function(result){
      result.set("is_first", isFirst)
      result.save()
      //成功的情况
      console.log("设置星标项目成功")

    },
    error: function(object,error){
      //失败的情况
      //console.log(error)




    }
  })
}

/**
 * 2018-05-22
 * @parameter 项目id ,isFirst 是否置顶项目，设置为false
 * 
 * 取消置顶项目
 */
function cancelProjectFirst(projId,isFirst){
  var Project = Bmob.Object.extend("project")
  var projectQuery = new Bmob.Query(Project)

  projectQuery.get(projId, {
    success: function (result) {
      result.set("is_first", isFirst)
      result.save()
      //成功的情况


    },
    error: function (object, error) {
      //失败的情况
      //console.log(error)




    }
  })
}

/**
 * 项目负责人的转让
 * （内部用到函数updateMemberLeader）
 */
function transferProject(projId, newleaderName,newleaderId,oldLeaderId){

  var that = this
  var Project = Bmob.Object.extend("project")
  var projectQuery = new Bmob.Query(Project)

  projectQuery.get(projId,{
    success: function(result){
      result.set("leader_id",newleaderId)
      result.set("leader_name", newleaderName)
      result.save()

      //更改新项目成员中的领导属性
      updateMemberLeader(projId, newleaderId, oldLeaderId)
      //成功情况




    },
    error: function(object,error){
      //失败情况
      //console.log(error)




    }
  }) 
}

/**
 * 更改新项目成员中的领导
 */
function updateMemberLeader(projId, newLeaderId, oldLeaderId){
  var ProjMember = Bmob.Object.extend("proj_member")
  var projmemberQuery = new Bmob.Query(ProjMember)

  var ids = [newLeaderId, oldLeaderId]
  projmemberQuery.equalTo("proj_id", projId)
  projmemberQuery.containedIn("user_id",ids)
  projmemberQuery.find().then(function (todos) {
    todos.forEach(function (todo) {
      if(todo.get("user_id") == newLeaderId){
        todo.set("is_leader",true)
      }else{
        todo.set("is_leader",false)
      }
    })
    return Bmob.Object.saveAll(todos);
  }).then(function (todos) {
    // 更新成功
    //console.log("updateMemberLeader","更改新项目成员中的领导成功!")
   
  },
    function (error) {
      // 异常处理
      console.log("updateMemberLeader", "更改新项目成员中的领导失败!")
    })
}

/**
 * @parameter projId项目id，newName 新的项目名
 * 修改项目名称
 */
function modifyProjectTitle(projId,newName){
  var Project = Bmob.Object.extend('project')
  var projectQuery = new Bmob.Query(Project)

  //修改项目名称
  projectQuery.get(projId, {
    success: function (result) {
      result.set("name", newName)  //修改项目名称
      result.save()
      //console.log("项目标题修改成功")
    },
    error: function (error) {
      //项目删除失败
    }
  })
}

/**
 * @parameter projId项目id，newDescrip 新的项目描述
 * 修改项目描述
 */
function modifyProjectDescrep(projId,newDescrip){
  var Project = Bmob.Object.extend('project')
  var projectQuery = new Bmob.Query(Project)

  //修改项目描述
  projectQuery.get(projId, {
    success: function (result) {
      result.set("desc", newDescrip)  //修改项目描述
      result.save()
      //console.log("项目描述修改成功")
    },
    error: function (error) {
      //项目删除失败
    }
  })
}

/**
 * 修改项目图片
 */
function modifyProjcetImg(projId){

  var Project = Bmob.Object.extend('project')
  var projectQuery = new Bmob.Query(Project)

  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      var tempFilePaths = res.tempFilePaths;
      if (tempFilePaths.length > 0) {
        var name = "1.jpg";//上传的图片的别名，建议可以用日期命名
        var file = new Bmob.File(name, tempFilePaths);
        file.save().then(function (res) {

          //res.url()是上传图片后的 url
          //console.log(res.url());
          //更改项目图片
          projectQuery.get(projId,{
            success: function(result){
              result.set('img_url',res.url())
              result.save() 







            }
          })
        }, function (error) {
          console.log(error);
        })
      }

    }
  })
}
/**
 * @parameter projId项目id 
 * 退出/解散项目
 * 利用了字段is_delete 来判断项目是否被删除。
 * 额，这个函数等我把你们的分支里面的某些project的函数添加了一行代码后
 * ，我告诉你们加的时候再加吧。么么哒。
 * 
 */
function deletePoject(projId){
  
  var Project = Bmob.Object.extend('project')
  var projectQuery = new Bmob.Query(Project)
  
  //将 project 表的 is_delete 字段修改为true
  projectQuery.get(projId,{
    success: function(result){
      result.set("is_delete",true)  //删除项目。不可修复。
      result.save()
      //console.log("项目删除成功")
    },
    error: function(error){
      //项目删除失败
    }
  })
}
module.exports.getProjectDetail = getProjectDetail
module.exports.deleteProjectMember = deleteProjectMember
module.exports.makeProjectFirst = makeProjectFirst
module.exports.cancelProjectFirst = cancelProjectFirst
module.exports.transferProject = transferProject