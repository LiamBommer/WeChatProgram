//model/notification.js
var Bmob = require('../utils/bmob.js')

/**
 * 2018-05-31
 * @parameter userId 当前操作用户的id
 * 将用户的通知全部都修改为已读状态
 */
function readAll(userId){

  var Notification = Bmob.Object.extend('notification')
  var notificationQuery = new Bmob.Query(Notification)

  //将用户的通知全部都修改为已读状态
  notificationQuery.equalTo("to_user_id",userId)
  notificationQuery.find().then(function (todos) {
    todos.forEach(function (todo) {
      todo.set('is_read', true);
    });
    return bmob.Object.saveAll(todos);
  }).then(function (todos) {
    // 更新成功


  },
    function (error) {
      // 异常处理
    })
}

/**
 * 2018-05-31
 * @parameter userId 当前操作用户的id
 * 获取用户的所有通知(由近及远排序)
 */
function getNotification(userId){

  var Notification = Bmob.Object.extend('notification')
  var notificationQuery = new Bmob.Query(Notification)

  //获取用户的所有通知
  notificationQuery.equalTo("to_user_id", userId)
  notificationQuery.descending("createdAt")
  notificationQuery.find({
    success: function(results){
      //成功,results为返回的所有通知





    },
    error: function(error){
      //失败

    }
  })
}

/**
 * 2018-05-31
 * @parameter projId项目id，toUserIds通知的目标用户id数组，
 * 存储通知,往往都是批量添加的
 */
function addProjectNotification(projId,content,_type,requestId){

  var Projectmember = Bmob.Object.extend('proj_member')
  var projectkmemberQuery = new Bmob.Query(Taskmember)
  var Notification = Bmob.Object.extend('noification')
  var toUserIds = []  //被通知的用户的id数组
  var notificationObjects = []

  var project = Bmob.Object.createWithoutData("project", projId)
  var fromUser = Bmob.Object.createWithoutData("_User", Bmob.user.current().id)

  //查询项目下的所有成员id
  projectkmemberQuery.equalTo('proj_id',projId)
  projectkmemberQuery.find({
    success: function(results){
      //成功
      for(var i=0;i<results.length;i++){
        toUserIds.push(results[i].get('user_id'))
      }
      if(toUserIds != null && toUserIds.length > 0){
        for(var i=0;i<toUserIds.length;i++){
          var notification = new Notification()
          notification.set('to_user_id')
          notification.set('content',content)
          notification.set('type',_type)
          notification.set('is_read',false)
          notification.set('request_id',requestId)
          notification.set('project',project)
          notification.set('from_user',fromUser)

          notificationObjects.push(notification)  //存储本地通知对象
        }

        if(notificationObjects!=null && notificationObjects.length > 0){
          Bmob.Object.saveAll(notificationObjects).then(function (notificationObjects) {
            // 成功
            
          },
            function (error) {
              // 异常处理
            })
        }
      }

    },
    error: function(error){
      //失败
    }
  })
}

function addTaskNotification(taskId, toUserIds, content){

}