//model/mine.js
var Bmob = require('../utils/bmob.js')

/**
 * 获取我的任务,限制50条
 */
// function getMyTasks(userId){

//   var Task = Bmob.Object.extend('task')
//   var taskQuery = new Bmob.Query(Task)
//   var Taskmember = Bmob.Object.extend('task_member')
//   var taskmemberQuery = new Bmob.Query(Taskmember)
//   var taskIds = []  //用户的任务的id数组
//   var taskArr = []  //用户的任务数组,空就是无

//   taskmemberQuery.equalTo('user_id',userId)
//   taskmemberQuery.limit(50)  //限制50条
//   taskmemberQuery.find({
//     success: function(results){
//       //成功
//       for(var i in results){
//         taskIds.push(results[i].get('task_id'))
//       }
//       if(taskIds!=null && taskIds.length > 0){
//         //获取任务
//       }
//     },
//     error: function(error){
//       //失败
//     }
//   })
// }

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