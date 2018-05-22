//model/taskList.js
var Bmob = require('../utils/bmob.js')

/**
 * 2018-05-19
 * @author mr.li
 * @parameter projId 项目id，title任务看板名称
 * 创建任务看板
 */
function createTaskList(projId, title){
  
  var TaskList = Bmob.Object.extend("task_list")
  var taskList = new TaskList()

  //添加任务看板
  taskList.save({
    title: title,
    proj_id: projId
  },{
    success: function(result){
      //添加任务看板成功
      console.log("添加任务看板成功!")






    },
    error: function(result,error){
      //添加任务看板失败
      console.log("添加任务看板失败!")
    }
  })
}

/**
 * 2018-05-19
 * @author mr.li
 * @parameter listId 任务看板对应的id
 * 获取对应任务看板的所有任务（20条）
 * 每个任务为object类型 （object.task 也是一个object, object.leaderPic 是头像url）
 */
function getTasks(listId){

  var Task = Bmob.Object.extend("task")
  var taskQuery = new Bmob.Query(Task)
  var taskArr = []

  //查询出对应的任务看板的所有任务
  taskQuery.limit(20)
  taskQuery.equalTo("list_id",listId)
  taskQuery.find({
    success: function (results) {
      console.log("共查询到任务 " + results.length + " 条记录");
      // 循环处理查询到的数据
      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var userPic = getUserPic(result.get("leader_id"))  //根据任务负责人的id获取其头像
        var object = {}
        object = {
          task: result,
          leaderPic: userPic
        }
        taskArr.push(object)
      }




      return taskArr
    },
    error: function (error) {
      console.log("任务查询失败: " + error.code + " " + error.message);






      
    }
  })
}

/**
 * 2018-05-19
 * @author mr.li
 * @parameter userId 对应的用户id
 * 根据id获取某用户的头像
 */
function getUserPic(userId){

  var User = Bmob.Object.extend("_User")
  var userQuery = new Bmob.Query(User)

  //查询指定user的头像
  userQuery.get(userId, {
    success: function (result) {
      // 查询成功，调用get方法获取对应属性的值
      return result.userPic
    },
    error: function (object, error) {
      // 查询失败
      return null
    }
  })

}