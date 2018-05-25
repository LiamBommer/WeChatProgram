//module/schedule.js
var Bmob = require('../utils/bmob.js')

/**
 * 添加日程
 */
function createSchedule(projId,content,startTime,endTime,taskIds){
  var Schedule = Bmob.Object.extend('schedule')
  var schedule = new Schedule()

  //添加日程
  schedule.save({
    proj_id: projId,
    content: content,
    start_time: startTime,
    end_time: endTime
  },{
    success: function(result){
      //添加成功
      
      return result.id


    },error: function(result, error){

    }
  }).then(function(scheduleid){
    //存储日程与任务的关联
    if(taskIds != null){
      var objects = new Array()  //本地schedule_task数组
      for (var i = 0; i < taskIds.length;i++){
        var taskid = taskIds[i]
        var task = Bmob.Object.createWithoutData("task", "taskid")
        var object = {}
        object = {
          schedule_id: scheduleid,
          task: task
        }
        objects.push(object)
      }

      //批量添加
      Bmob.Object.saveAll(objects).then(function (objects) {
        // 成功



      },
        function (error) {
          // 异常处理
        })
    }
    
  })

  
}

/**
 * 获取日程
 */
function getSchedules(projId){

  var Schedule = Bmob.Object.extend('schedule')
  var scheduleQuery = new Bmob.Query(Schedule)
  var ScheduleTask = Bmob.Object.extend('schedule_task')
  var scheduletaskQuery = new Bmob.Query(ScheduleTask)

  //查询日程
  scheduleQuery.equalTo('proj_id',projId)
  scheduleQuery.ascending('start_time')
  
  scheduleQuery.find({
    success: function(results){

      return results
    },
    error: function(error){

    }
  }).then(function(schedules){
    var scheduleIds = []
    for(var i=0;i<results.length;i++){
      scheduleIds.push(results[i].id)
    }

    scheduletaskQuery.include("task")
    scheduletaskQuery.containedIn("schedule_id", scheduleIds)
    scheduletaskQuery.find({
      success: function(results){
        console.log(results)
        var scheduleObjects = []
        for(var i=0;i<schedules.length;i++){
          var scheduleObject = {}
          var tasks = new Array()  //存储每个日程关联的任务
          for(var j=0;j<results.length;j++){
            //todo: 根据输出的结果进行数据的选取





            
          }
        }
      },
      error: function(error){

      }
    })
  })

}