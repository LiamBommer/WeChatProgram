//module/task.js
var Bmob = require('../utils/bmob.js')

/**
 * 2018-05-19
 * @author mr.li
 * @parameter listId任务看板id，title任务名称，memberIds成员id数组，包括创建者自己（第一个），endTime截止时间
 * 创建任务，成员id数组里面只需要id，endTime 的数据类型是string
 */
function createTask(listId, title, memberIds, endTime){
  
  var Task = Bmob.Object.extend("task")
  var task = new Task()

  var leaderId = memberIds.shift()  //删除并返回第一个任务负责人的id
  var leader = Bmob.Object.createWithoutData("_User", leaderId)  //负责人,存储到数据库
  //添加任务
  task.save({
    list_id: listId,
    title: title,
    leader: leader,  // 数据库关联，用id可以关联一个user
    end_time: endTime,
    is_finish: false,
    has_sub: false
  },{
    success: function(result){
      //添加成功
      //添加任务成员信息
       addTaskMembers(result.id/*任务id*/, leaderId, memberIds)
      // 提示用户添加成功

      console.log("提示用户添加任务成功")





    },
    error: function(result,error){
      //添加失败
      console.log("添加任务失败！",error)
      //提示用户添加失败






    }   
  })

}

/**
 * 2018-05-19
 * @author mr.li
 * @parameter taskId任务id，leaderId任务负责人id，memberIds除负责人以外的任务成员id数组
 * 为任务添加成员
 */
function addTaskMembers(taskId, leaderId, memberIds){

  var TaskMember = Bmob.Object.extend("task_member")

  var leader = Bmob.Object.createWithoutData("_User", leaderId);
  var memberObjects = []
  
  var taskMember = new TaskMember()
  taskMember.set('task_id',taskId)
  taskMember.set('user_id', leader)
  memberObjects.push(taskMember)  //添加任务负责人id

  for(var i=0;i<memberIds.length;i++){
    var taskMember = new TaskMember()
    var member = Bmob.Object.createWithoutData("_User", memberIds[i]);
    taskMember.set('task_id', taskId)
    taskMember.set('user_id', member)
    memberObjects.push(taskMember)  //添加任务成员
  }

  //批量添加任务成员
  Bmob.Object.saveAll(memberObjects).then(function (memberObjects) {
    // 成功
    console.log("批量添加任务成员成功！")
  },
    function (error) {
      // 异常处理
      console.log("批量添加任务成员成功！",error)
    })
}


/**
 * 2018-05-18
 * @author mr.li
 * @parameter projId 项目id
 * 创建任务时从项目成员中选任务成员
 */
function getProjectMembers(projId) {
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
    //userQuery.select("nickName", "userPic")  //查询出用户的昵称和头像
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






      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
        //失败情况





      }
    })

  })
}

module.exports.createTask = createTask
module.exports.getProjectMembers = getProjectMembers