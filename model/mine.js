//model/mine.js
var Bmob = require('../utils/bmob.js')
var FINISH_TASK = '完成了任务'
var REDO_TASK = '重做了任务'

/**
 * 获取我的任务,限制50条
 * 按任务截止时间升序排列
 'id':  //任务id
'taskTitle':   //任务标题
'taskEndTime':  //任务截止时间，只有年月日
'projectName' ://项目名称
projectId      //项目id，用来通知任务其他成员
 */
function getMyTasks(userId){

  var Taskmember = Bmob.Object.extend('task_member')
  var taskmemberQuery = new Bmob.Query(Taskmember)
  var taskArr = []  //用户的任务数组,空就是无

  taskmemberQuery.equalTo('user_id',userId)
  taskmemberQuery.include('task')
  taskmemberQuery.include('project')
  taskmemberQuery.ascending('task.end_time')
  taskmemberQuery.limit(50)  //限制50条
  taskmemberQuery.find({
    success: function(results){
      //成功
      for(var i in results){
        if(results.get('task').is_delete != true){
          var taskObject = {}
          taskObject = {
            'id': results.get('task').objectId,   //任务id
            'taskTitle': results.get('task').title,   //任务标题
            'taskEndTime': results.get('task').end_time, //任务截止时间，只有年月日
            'projectName': results.get('project').name,  //项目名称
            'projectId': results.get('project').objectId  //项目id
          }
          taskArr.push(taskObject)
        }
        if (taskArr != null && taskArr.length > 0){
          //在这里setData
          console.log('我的任务',taskArr)








        }
      }

    },
    error: function(error){
      //失败
    }
  })
}

/**
 * 获取我的点子,最多50条
 * 'id':     //点子id
    'content':  //点子内容
    'createdAt':  //点子发表时间
    'projectName':   //项目名字
 */
function getMyidea(userId){

  var Idea = Bmob.Object.extend('idea')
  var ideaQuery = new Bmob.Query(Idea)
  var ideaArr = []  //获取的点子数组

  ideaQuery.equalTo('user',userId)
  ideaQuery.include('project')
  ideaQuery.find({
    success: function(results){
      //成功
      for(var i in results){
        var ideaObject = {}
        ideaObject = {
          'id': results[i].id,    //点子id
          'content': results[i].get('content'),  //点子内容
          'createdAt': results[i].createdAt,   //点子发表时间
          'projectName': results[i].get('project').name  //项目名字
        }
        ideaArr.push(ideaObject)
      }
      if (ideaArr != null && ideaArr.length > 0){
        //在这里setData
        console.log('获取点子列表成功',ideaArr)
      }
    },
    error: function(error){
      //失败
      console.log('获取点子列表失败!',error)
    }
  })

}

/**
 * 获取我的未删除的会议，最多50条
'id':  //会议id
'startTime': //会议的年月日
'time': //会议的时分秒
'title':  //会议名称
 */
function getMyMeeting(userId){
  var Meetingmember = Bmob.Object.extend('meeting_member')
  var meetingmemberQuery = Bmob.Object.extend(Meetingmember) 
  var meetingArr = []   //获取的用户的会议数组，没有则为空

  meetingmemberQuery.equalTo('user',userId)
  meetingmemberQuery.include('meeting')
  meetingmemberQuery.find({
    success: function(results){
      //成功
      for(var i in results){
        if (results[i].get('meeting').is_delete != true)
        var meetingObject = {}
        meetingObject = {
          'id': results[i].get('meeting').objectId, //会议id
          'startTime': results[i].get('meeting').startTime, //会议的年月日
          'time': results[i].get('meeting').time,  //会议的时分秒
          'title': results[i].get('meeting').title,  //会议名称
        }
        meetingArr.push(meetingObject)
      }
      if (meetingArr != null && meetingArr.length > 0){
        //在这里setData
        console.log('获取用户的会议',meetingArr)

      }
    },
    error: function(error){
      //失败
    }

  })
}

/**
 * @parameter projId 项目id ，taskId 任务id ,isFinish 是否完成（true表示完成，false表示重做任务）
 * 完成/重做我的任务
 */
function finishMytask(projId,taskId,isFinish){

  var that = this
  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  taskQuery.get(taskId,{
    success:function(result){
      //成功
      result.set('is_finish',true)
      result.save()

      //通知任务其他成员
      if(isFinish)
        that.addTaskNotification(projId, taskId,FINISH_TASK + result.get('title'))
      else
        that.addTaskNotification(projId, taskId, REDO_TASK + result.get('title'))
    }
  })
}

/**
   * 2018-05-31
   * @parameter projId 项目id, taskId任务id，content 通知内容
   * (request_id 为tskId)
   * 存储通知,往往都是批量添加的
   */
function addTaskNotification(projId, taskId, content) {
  var that = this
  var _type = 1;  //任务是通知的第一种类型
  var Taskmember = Bmob.Object.extend('task_member')
  var taskmemberQuery = new Bmob.Query(Taskmember)
  var toUserIds = []  //需要通知到的任务成员id数组
  var Notification = Bmob.Object.extend('notification')
  var notificationObjects = []

  //查询任务成员
  taskmemberQuery.equalTo('task_id', taskId)
  taskmemberQuery.select("user_id");
  taskmemberQuery.find().then(function (results) {
    // 返回成功
    for (var i = 0; i < results.length; i++) {
      toUserIds.push(results[i].get('user_id').id)
    }

    if (toUserIds != null && toUserIds.length > 0) {
      var fromUser = Bmob.Object.createWithoutData("_User", Bmob.User.current().id)
      var project = Bmob.Object.createWithoutData("project", projId)

      for (var i = 0; i < toUserIds.length; i++) {
        //无需通知操作人本身
        if (toUserIds[i] != Bmob.User.current().id) {
          var notification = new Notification()
          notification.set('to_user_id', toUserIds[i])
          notification.set('content', content)
          notification.set('type', _type)
          notification.set('is_read', false)
          notification.set('request_id', taskId)
          notification.set('project', project)
          notification.set('from_user', fromUser)

          notificationObjects.push(notification)  //存储本地通知对象
        }
      }
      if (notificationObjects != null && notificationObjects.length > 0) {
        //在数据库添加通知
        Bmob.Object.saveAll(notificationObjects).then(function (notificationObjects) {
          // 成功
          console.log("添加任务成员通知成功！", notificationObjects)


        },
          function (error) {
            // 异常处理
            console.log("添加任务成员通知失败!", error)

          })
      }
    }
  })

}

/**
 * @parameter userId 用户id，label 用户写的标签
 * 增加/修改标签(逗号分隔，提示用户)
 */
function modifyUserLabel(userId,label){

  var user = Bmob.Object.extend('_User')
  var userQuery = new Bmob.Query(user)

  userQuery.get(userId,{
    success: function(result){
      //成功
      result.set('label',label)
      result.save()
      console.log('修改用户标签成功！')
    },
    error: function(error){
      //失败
      console.log('修改用户标签失败！',error)
    }
  })
}

/**
 * 获取用户标签
 */
function getUserLabel(userId){
  var user = Bmob.Object.extend('_User')
  var userQuery = new Bmob.Query(user)
  var labelArr = []  //标签数组
  userQuery.get(userId,{
    success: function(result){
      //成功
      var label = result.get('label')
      if(label != null ){
        console.log('获取用户标签成功')
        labelArr = label.split(',')  //根据 , 分割用户标签
        console.log('labelArr', labelArr)
        
      }else{
        //用户没有标签，labelArr为空
        
      }
    }
  })
}