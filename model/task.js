//module/task.js
var Bmob = require('../utils/bmob.js')

/**
 * 2018-05-19
 * @author mr.li
 * @parameter listId任务看板id，title任务名称，memberIds成员id数组，包括创建者自己，endTime截止时间
 * 创建任务，成员id数组里面只需要id，endTime 的数据类型还没决定是string 还是date好(目前是string)
 */
function createTask(listId, title, memberIds, endTime){
  
  var Task = Bmob.Object.extend("task")
  var task = new Task()

  var leaderId = memberIds.shift()  //删除并返回第一个任务负责人的id
  var taskMembers = []  //存储任务成员相关数据，类型object

  task.save({
    list_id: listId,
    title: title,
    leader_id: leaderId,
    end_time: endTime,
    is_finish: false,
    has_sub: false
  },{
    success: function(result){
      //添加成功
      console.log("添加任务成功！")
      //添加任务成员信息
      addTaskMembers(result.id, leaderId, memberIds)








    },
    error: function(result,error){
      //添加失败
      console.log("添加任务成功！",error)







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
  var taskMember = new TaskMember()

  var memberObjects = []
  var object = {}
  objcet = {
    user_id: leaderId,
    task_id: taskId
  }
  memberObjects.push(object)  //添加任务负责人id

  for(var i=0;i<memberIds.length;i++){
    object = {}
    object = {
      user_id: membersIds[i],
      task_id: taskId
    }
    memberObjects.push(object)
  }

  //批量添加任务成员
  taskMember.aveAll(memberObjects).then(function (memberObjects) {
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
 * @return 项目成员数组（nickName,userPic）
 * 创建任务时选任务成员,前端做判断，不显示创建任务人自己，因为自己是默认的任务负责人
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