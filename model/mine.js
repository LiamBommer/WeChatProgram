//model/mine.js
var Bmob = require('../utils/bmob.js')

/**
 * 获取我的任务,限制50条
 * 按任务截止时间升序排列
 'id':  //任务id
'taskTitle':   //任务标题
'taskEndTime':  //任务截止时间，只有年月日
'projectName' ://项目名称
projectId      //项目id
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
 * 完成我的任务
 */
function finishMytask(taskId){

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  taskQuery.get(taskId,{
    success:function(result){
      //成功
      result.set('is_finish',true)
      result.save()

      //通知任务其他成员
    }
  })
}
