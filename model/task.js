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