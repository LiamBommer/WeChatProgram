//model/taskDetail.js
var Bmob = require('../utils/bmob.js')

/**
 * 获取任务详情(已废弃)
 */
/** 
function getTaskDetail(taskId){

  var that = this
  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query('Task')
  var TaskMember = Bmob.Object.extend('task_member')
  var taskmemberQuery = new Bmob.Query(TaskMember)
  var User = Bmob.Object.extend('_User')
  var userQuery = new Bmob.Query(User)
  var TaskRecord = Bmob.Object.extend('task_record')
  var taskrecordQuery = new Bmob.Query(TaskRecord)

  var taskMemberIds = []

  taskQuery.equalTo('objectId',taskId)
  taskQuery.first(taskId,{
    success: function(result){
      return result
    },
    error: function(error){

    }
  }).then(function(result){

    //成功
    //查询任务成员
    console.log("任务详情",result.id)
    taskmemberQuery.equalTo('task_id',result.id)
    taskmemberQuery.select('user_id')
    taskmemberQuery.find().then(function(results){
      for(var i=0;i<results.length;i++){
        if(results[i].get('user_id') == result.get('leader_id')){
          taskMemberIds.unshift(results[i].get('user_id'))
        }else{
          taskMemberIds.push(results[i].get('user_id'))
        }
      }

      userQuery.select("nickName", "userPic")  //查询出用户的昵称和头像
      userQuery.limit(50)
      userQuery.containedIn("objectId", taskMemberIds)
      userQuery.find({
        success: function(results){
          //在这里setdata
          //在这里设置任务详情的，和任务成员头像的数据
          //result 和 results






        },
        error: function(error){

        }
      })
    })
  })

  //查询此任务的历史记录
  taskrecordQuery.equalTo('task_id',taskId)
  taskrecordQuery.ascending('createdAt')
  taskrecordQuery.find({
    success: function(results){
      //在这里这是setdata






    },
    error: function(results){
      //查询失败


    }
  })
}
*/

/**
 * 获取任务详情
 * 任务的一些必要信息，已经在taskList那个页面获得，那时候要设置缓存，而这个函数
 * 主要是获取任务成员，评论信息，任务记录，子任务
 */
function getTaskDetail(taskId,leaderId){
  var TaskMember = Bmob.Object.extend('task_member')
  var taskmemberQuery = new Bmob.Query(TaskMember)

  //查询任务成员
}

/**
 * 添加提醒时间
 */
function addNotiTime(taskId,notiTime){
  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //添加提醒时间
  taskQuery.get(taskId,{
    success: function(result){
      //成功添加情况
      result.set('noti_time',notiTime)
      result.save()


    },
    error: function(object,error){
      //失败情况
    }
  })
}
/**
 * 添加反馈时间
 * 
 */
function addFeedbackTime(taskId,feedBackTime){
  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //添加反馈时间
  taskQuery.get(taskId,{
    success: function(result){
      //成功情况
      result.set('feedback_time', feedBackTime)
      result.save()
    },
    error: function(object,error){
      //失败情况
    }
  })
}

/**
 * 添加反馈模板
 * 
 */
function addFeedbackMod(taskId,feedbackMod){
  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //添加反馈模板
  taskQuery.get(taskId, {
    success: function (result) {
      //成功情况
      result.set('feedback_mod ', feedbackMod)
      result.save()
    },
    error: function (object, error) {
      //失败情况
    }
  })
}

/**
 * 完成任务
 * 
 */
function finishTask(taskId,isFinish){
  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //完成任务
  taskQuery.get(taskId, {
    success: function (result) {
      //成功情况
      result.set('is_finish ', isFinish)
      result.save()
    },
    error: function (object, error) {
      //失败情况
    }
  })
}

/**
 *添加任务记录
 */
function addTaskRecord(taskId,record){
  var TaskRecord = Bmob.Object.extend('task_record')
  var taskrecord = new TaskRecord()

  //存储任务记录
  taskrecord.save({
    task_id: taskId,
    record: record
  },{
    success: function(result){
      //添加成功

    },
    error: function(result,error){
      //添加失败

    }
  })
}