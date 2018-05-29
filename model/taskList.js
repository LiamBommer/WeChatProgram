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
      console.log("提示用户添加任务看板成功!")






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
 * 获取对应任务看板的所有任务（20条），数组
 * 每个任务为object类型 
 */
function getTasks(listId){

  var Task = Bmob.Object.extend("task")
  var taskQuery = new Bmob.Query(Task)
  var taskArr = []

  //查询出对应的任务看板的所有任务
  taskQuery.limit(20)
  taskQuery.equalTo("list_id",listId)
  taskQuery.include("leader")  //可以查询出leader
  taskQuery.ascending("end_time")  //根据截止时间升序（越邻近排序最前面）
  taskQuery.find({
    success: function (tasks) {
      console.log("共查询到任务 " + tasks.length + " 条记录");     
      //在这里设置setdata
      console.log("获取到的任务",tasks)  //已限定20个以内






      
    },
    error: function (error) {
      console.log("提示用户任务查询失败: " + error.code + " " + error.message);
      





      
    }
  })
}

// /**
//  * 2018-05-19
//  * @author mr.li
//  * @parameter userId 对应的用户id
//  * 根据id获取某用户的头像
//  */
// function getUserPic(userId){

//   var User = Bmob.Object.extend("_User")
//   var userQuery = new Bmob.Query(User)

//   //查询指定user的头像
//   userQuery.first(userId, {
//     success: function (result) {
//       // 查询成功，调用get方法获取对应属性的值
//     },
//     error: function (object, error) {
//       // 查询失败
      
//     }
//   })
// }

/**
 * 2018-05-24
 * 根据项目id获取所有任务看板的id和标题
 * （函数内还默认会获取第一个看板的所有任务）
 */
function getTaskLists(projId){

  var that = this
  var TaskList = Bmob.Object.extend('task_list')
  var tasklistQuery = new Bmob.Query(TaskList)

  //查询所有的任务列表
  var taskLists = []
  tasklistQuery.ascending('createdAt')   //最先创建的排序最前面
  tasklistQuery.equalTo('proj_id', projId)
  tasklistQuery.find({
    
    success: function(results){
      //这里设置setdata
      console.log(results)
      /**
       * that.setData({
            taskList: 
          })
       */




      //results的第一个是最早创建的
      var taskListId = results[0].id
      getTasks(taskListId)  //获取第一个任务看板的任务

    },
    error: function(error){

    }
  })


}

module.exports.createTaskList = createTaskList
module.exports.getTaskLists = getTaskLists
module.exports.getTasks = getTasks