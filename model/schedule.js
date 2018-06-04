//module/schedule.js
var Bmob = require('../utils/bmob.js')

var ADD_SCHEDULE = "添加了新的日程"
var DELETE_SCHEDULE = "删除了日程"
var MODIFY_SCHEDULE_START = "修改了日程开始时间"
var MODIFY_SCHEDULE_END = "修改了日程截止时间"
var MODIFY_SCHEDULE_TITLE = "修改了日程标题"
var ADD_SCHEDULE_TASK = "添加了日程关联的任务"

/**
 * @parameter projId 项目id，content内容，
 * startTime开始时间(最好不能为空），endTime结束时间（最好不能为空），taskIds任务数组（可以为空）
 * 添加日程
 * 内部添加了调用通知项目成员的函数
 */
function createSchedule(projId,content,startTime,endTime,taskIds){
  
  var that = this
  var Schedule = Bmob.Object.extend('schedule')
  var Scheduletask = Bmob.Object.extend('schedule_task')
  var schedule = new Schedule()

  //添加日程
  schedule.save({
    proj_id: projId,
    content: content,
    start_time: startTime,
    end_time: endTime,
    is_delete: false  //表示未删除
  },{
    success: function(result){
      //添加成功
      //通知其他项目成员
      var _type = 3  //通知类型
      that.addProjectNotification(projId, ADD_SCHEDULE, _type, result.id/*创建的日程id*/)  //通知其他项目成员
      console.log("提示用户添加日程成功！")

    },error: function(result, error){

    }
  }).then(function(schedule){
    //存储日程与任务的关联
    if(taskIds != null && taskIds.length > 0){
      var objects = new Array()  //本地schedule_task数组
      for (var i = 0; i < taskIds.length;i++){
        var taskid = taskIds[i]

        console.log("taskID",taskid)

        var task = Bmob.Object.createWithoutData("task", taskid)
        var cheduletaskObject = new Scheduletask()
        cheduletaskObject.set("schedule_id", schedule.id/*日程id*/)
        cheduletaskObject.set("task", task)
        objects.push(cheduletaskObject)
      }
      //批量添加
      Bmob.Object.saveAll(objects).then(function (objects) {
        // 成功添加关联任务
        console.log("成功添加关联任务！")
      },
        function (error) {
          // 异常处理
        })
    }
    
  })
}

/**
 * @parameter projId 项目id
 * 获取日程
 */
function getSchedules(projId){

  var Schedule = Bmob.Object.extend('schedule')
  var scheduleQuery = new Bmob.Query(Schedule)
  var ScheduleTask = Bmob.Object.extend('schedule_task')
  var scheduletaskQuery = new Bmob.Query(ScheduleTask)

  //查询日程
  scheduleQuery.equalTo('proj_id',projId)
  scheduleQuery.notEqualTo('is_delete',true)
  scheduleQuery.ascending('start_time')
  
  scheduleQuery.find({
    success: function(schedules){
      var scheduleIds = []
      for (var i = 0; i < schedules.length; i++) {
        scheduleIds.push(schedules[i].id)
      }
      //获取日程关联的任务
      scheduletaskQuery.containedIn("schedule_id", scheduleIds)
      scheduletaskQuery.include("task")
      scheduletaskQuery.include("task.leader")
      scheduletaskQuery.find({
        success: function (results) {
          var scheduleObjectArr = []
          for (var i = 0; i < schedules.length; i++) {
            var scheduleObject = {}
            scheduleObject={
              "objectId":'0',     //日程关联任务的id ，不是日程，也不是任务，而是两个的关联的id ，hh后面会设置
              "scheduleId": schedules[i].id,  //日程id
              "scheduleContent":schedules[i].get('content'),
              "startTime": schedules[i].get('start_time'),
              "endTime": schedules[i].get('end_time'),
              "tasks": []  //关联的任务数组
            }
            //注意下面的for循环是 j ，不是 i 
            for (var j = 0; j < results.length; j++) {
              if (results[j].get("schedule_id") == scheduleObject.scheduleId){
                scheduleObject.objectId = results[j].id  //日程关联任务的id
                var taskObject = {                 
                  "task_id": results[j].get("task").objectId,
                  "task_title": results[j].get("task").title,
                  "task_userPic": results[j].get("task").leader.userPic
                }
                scheduleObject.tasks.push(taskObject)
              }
            }
            scheduleObjectArr.push(scheduleObject)
          }
          //scheduleObjectArr才是最终要获取的日程数组，每个日程下面包括有关联的任务的数据
          //在这里setData
          console.log(scheduleObjectArr)





        },
        error: function (error) {
          //获取日程关联的任务失败
        }
      })
    },
    error: function(error){
        //查询日程失败
    }
  })

}

/**
 * @parameter projId项目id
 * 创建日程时显示项目的任务
 */
function getTasks(projId){

  var Task = Bmob.Object.extend("task")
  var taskQuery = new Bmob.Query(Task)
  var taskArr = []

  //查询出对应的任务看板的所有任务
  taskQuery.limit(20)
  taskQuery.equalTo("proj_id", projId)
  taskQuery.include("leader")  //可以查询出leader
  taskQuery.ascending("end_time")  //根据截止时间升序（越邻近排序最前面）
  taskQuery.find({
    success: function (tasks) {
      //在这里设置setdata
      console.log("获取到的任务", tasks)  //已限定20个以内
      for(var i in tasks){
        var taskObject = {}
        taskObject = {
          "task_id": tasks[i].id,  //任务id
          "task_title":tasks[i].get('title'),  //任务标题
          "userPic":tasks[i].get('leader').userPic || ''  //负责人头像
        }
        taskArr.push(taskObject)

      }
      //setData
      console.log(taskArr)

    },
    error: function (error) {
      console.log("提示用户任务查询失败: " + error.code + " " + error.message);

    }
  })
}

/**
 * 2018-05-31
 * @parameter projId项目id，toUserIds通知的目标用户id数组，_type是通知的类型(我发了关于这个的文档),requestId是通知跳转
 * 页面所有携带的请求数据，比如（taskId，meetingId 等）
 * 存储通知,往往都是批量添加的
 */
function addProjectNotification(projId, content, _type, requestId) {

  var Projectmember = Bmob.Object.extend('proj_member')
  var projectkmemberQuery = new Bmob.Query(Projectmember)
  var Notification = Bmob.Object.extend('notification')
  var toUserIds = []  //被通知的用户的id数组
  var notificationObjects = []

  var project = Bmob.Object.createWithoutData("project", projId)
  var fromUser = Bmob.Object.createWithoutData("_User", Bmob.User.current().id)

  //查询项目下的所有成员id
  projectkmemberQuery.equalTo('proj_id', projId)
  projectkmemberQuery.find({
    success: function (results) {
      //成功
      for (var i = 0; i < results.length; i++) {
        toUserIds.push(results[i].get('user_id'))
      }
      if (toUserIds != null && toUserIds.length > 0) {
        for (var i = 0; i < toUserIds.length; i++) {
          //无需通知操作人本身
          if (toUserIds[i] != Bmob.User.current().id) {
            var notification = new Notification()
            notification.set('to_user_id', toUserIds[i])
            notification.set('content', content)
            notification.set('type', _type)
            notification.set('is_read', false)
            notification.set('request_id', requestId)
            notification.set('project', project)
            notification.set('from_user', fromUser)

            notificationObjects.push(notification)  //存储本地通知对象
          }
        }

        if (notificationObjects != null && notificationObjects.length > 0) {
          Bmob.Object.saveAll(notificationObjects).then(function (notificationObjects) {
            // 通知添加成功
            console.log("添加项目成员通知成功！")
          },
            function (error) {
              // 通知添加失败处理
            })
        }
      }

    },
    error: function (error) {
      //项目成员查询失败
    }
  })
}

/**
 * @parameter projId 项目id, scheduleId日程id
 * 删除日程
 *  内部调用了addProjectNotification
 */
function deleteSchedule(projId,scheduleId){

  var Schedule = Bmob.Object.extend('shcedule')
  var scheduleQuery = new Bmob.Query(Schedule)
  //删除日程
  scheduleQuery.get(scheduleId,{
    success: function(result){
      result.set('is_delete',true)
      result.save()
      console.log("提示用户删除日程成功！")

      var _type = 3  //通知类型
      that.addProjectNotification(projId, DELETE_SCHEDULE, _type, scheduleId/*日程id*/)  //通知其他项目成员
    },
    error: function(error){
      console.log("提示用户删除日程失败！")
    }
  })
}

/**
 * @parameter projId项目id, scheduleId日程id, newTitle新标题
 * 修改日程标题
 *  内部调用了addProjectNotification
 */
function modifyScheduleTitle(projId, scheduleId, newTitle){
  
  var that = this
  var Schedule = Bmob.Object.extend('shcedule')
  var scheduleQuery = new Bmob.Query(Schedule)
  //删除日程
  scheduleQuery.get(scheduleId, {
    success: function (result) {
      result.set('title', newTitle)
      result.save()

      var _type = 3  //通知类型
      that.addProjectNotification(projId, MODIFY_SCHEDULE_TITLE , _type, scheduleId/*日程id*/)  //通知其他项目成员
    },
    error: function (error) {
      
    }
  })
}

/**
 * @parameter projId项目id, scheduleId日程id, newStartTime新的开始时间
 * 修改日程开始时间
 *  内部调用了addProjectNotification
 */
function modifyScheduleStartTime(projId, scheduleId, newStartTime) {

  var that = this
  var Schedule = Bmob.Object.extend('shcedule')
  var scheduleQuery = new Bmob.Query(Schedule)
  //删除日程
  scheduleQuery.get(scheduleId, {
    success: function (result) {
      result.set('start_time', newStartTime)
      result.save()

      var _type = 3  //通知类型
      that.addProjectNotification(projId, MODIFY_SCHEDULE_START, _type, scheduleId/*日程id*/)  //通知其他项目成员
    },
    error: function (error) {

    }
  })
}

/**
 * @parameter projId项目id, scheduleId日程id, newTitle新标题
 * 修改日程结束时间
 *  内部调用了addProjectNotification
 */
function modifyScheduleEndtime(projId, scheduleId, newEndTime) {

  var that = this
  var Schedule = Bmob.Object.extend('shcedule')
  var scheduleQuery = new Bmob.Query(Schedule)
  //删除日程
  scheduleQuery.get(scheduleId, {
    success: function (result) {
      result.set('end_time', newEndTime)
      result.save()

      var _type = 3  //通知类型
      that.addProjectNotification(projId, MODIFY_SCHEDULE_END, _type, scheduleId/*日程id*/)  //通知其他项目成员
    },
    error: function (error) {

    }
  })
}

/**
 * @parameter projId项目id,scheduleId日程id,taskIds任务id数组
 * 为日程添加关联任务
 * 内部调用了addProjectNotification
 */
function addRelatedTask(projId,scheduleId,taskIds){

  var that = this
  var Scheduletask = Bmob.Object.extend('schedule_task')
  var scheduletaskArr = []  //日程关联任务的数组

  //批量添加与日程关联的任务
  if (taskIds != null && taskIds.length > 0){
    for(var i in taskIds){
      var scheduletask = new Scheduletask()
      var task = Bmob.Object.createWithoutData('task', taskIds[i])  //关联的任务信息
      scheduletask.set("schedule_id", scheduleId)
      scheduletask.set("task",task)
      scheduletaskArr.push(scheduletask)
    }
    //批量保存新关联的任务
    Bmob.Object.saveAll(scheduletaskArr).then(function (scheduletaskArr) {
      // 成功
      var _type = 3  //通知类型
      that.addProjectNotification(projId, ADD_SCHEDULE_TASK, _type, scheduleId/*日程id*/)  //通知其他项目成员
      console.log("提示用户关联任务成功！")


    },
      function (error) {
        // 异常处理
        console.log("提示用户关联任务失败！")
      })
  }
}

/**
 * @parameter scheduleTaskId "日程关联任务的id"
 * 删除单个任务关联，我想的是让用户左滑删除。所以是单个
 */
function deleteOneScheduleTask(scheduleTaskId){

  var Scheduletask = Bmob.Object.extend('schedule_task')
  var scheduletaskQuery = new Bmob.Query(Scheduletask)

  //删除单个程序关联的任务
  scheduletaskQuery.equalTo('objectId', scheduleTaskId)
  scheduletaskQuery.destroyAll({
    success: function () {
      //删除成功
      console.log("提示用户删除成功！")
    },
    error: function (err) {
      // 删除失败
      console.log("提示用户删除失败！")
    }
  })
}
module.exports.createSchedule = createSchedule
module.exports.addProjectNotification = addProjectNotification
module.exports.getSchedules = getSchedules
module.exports.addRelatedTask = addRelatedTask
