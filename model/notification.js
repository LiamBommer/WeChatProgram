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
 * @parameter projId项目id，toUserIds通知的目标用户id数组，_type是通知的类型(我发了关于这个的文档),requestId是通知跳转
 * 页面所有携带的请求数据，比如（taskId，meetingId 等）
 * 存储通知,往往都是批量添加的
 */
function addProjectNotification(projId,content,_type,requestId){

  var Projectmember = Bmob.Object.extend('proj_member')
  var projectkmemberQuery = new Bmob.Query(Projectmember)
  var Notification = Bmob.Object.extend('notification')
  var toUserIds = []  //被通知的用户的id数组
  var notificationObjects = []

  var project = Bmob.Object.createWithoutData("project", projId)
  var fromUser = Bmob.Object.createWithoutData("_User", Bmob.User.current().id)

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
          //无需通知操作人本身
          if (toUserIds[i] != Bmob.User.current().id){
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

        if(notificationObjects!=null && notificationObjects.length > 0){
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
    error: function(error){
      //项目成员查询失败
    }
  })
}

/**
 * 2018-05-31
 * @parameter projId 项目id, taskId任务id，content 通知内容
 * (request_id 为tskId)
 * 存储通知,往往都是批量添加的
 */
function addTaskNotification(projId,taskId,  content){

  var _type = 1;  //任务是通知的第一种类型
  var Taskmember = Bmob.Object.extend('task_member')
  var taskmemberQuery = new Bmob.Query(Taskmember)
  var toUserIds = []  //需要通知到的任务成员id数组
  var Notification = Bmob.Object.extend('notification')
  var notificationObjects = []

  //查询任务成员
  taskmemberQuery.equalTo('task_id',taskId)
  taskmemberQuery.select("user_id");
  taskmemberQuery.find().then(function (results) {
    // 返回成功
    for(var i=0;i<results.length;i++){
      toUserIds.push(results[i].id)
    }
    
    if (toUserIds != null && toUserIds.length > 0){
      var fromUser = Bmob.Object.createWithoutData("_User", Bmob.User.current().id)
      var project = Bmob.Object.createWithoutData("project", projId)

      for (var i = 0; i < toUserIds.length; i++) {
        //无需通知操作人本身
        if (toUserIds[i] != Bmob.User.current().id){
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
          console.log("添加任务成员通知成功！")


        },
          function (error) {
            // 异常处理
            console.log("添加任务成员通知失败!",error)

          })
      }
    }
  })

}

/**
 * 2018-06-02
 * @parameter notificationId通知id
 * 已读某一个通知
 */
function readOneNotification(notificationId){

  var Notification = Bmob.Object.extend('notification')
  var notificationQuery = new Bmob.Query(Notification)

  //更改通知的已读状态
  notificationQuery.get(notificationId,{
    success: function(result){
      //成功
      result.set('is_read',true)
      result.save()
    },
    error: function(error){
      //失败
    }
  })
}

/**
 * 2018-06-02
 * @parameter userId 用户id
 * 删除某位用户的所有通知
 */
function deleteUserNotification(userId){

  var Notification = Bmob.Object.extend('notification')
  var notificationQuery = new Bmob.Query(Notification)

  //删除某位用户的所有通知
  if(userId != null){
    notificationQuery.equalTo('to_user_id', userId)
    notificationQuery.destroyAll({
      success: function () {
        //删除成功
        console.log("提示用户删除所有通知成功!")
      },
      error: function (err) {
        // 删除失败
        console.log("提示用户删除所有通知失败!")
      }
    })
  }
  
}

/**
 * 2018-06-02
 * @parameter notificationId通知id
 * 删除某一条通知
 */
function deleteOneNotification(notificationId){

  var Notification = Bmob.Object.extend('notification')
  var notificationQuery = new Bmob.Query(Notification)

  //删除某位用户的所有通知
  if (notificationId != null) {
    notificationQuery.equalTo('objectId', notificationId)
    notificationQuery.destroyAll({
      success: function () {
        //删除成功
        console.log("提示用户删除通知成功!")
      },
      error: function (err) {
        // 删除失败
        console.log("提示用户删除通知失败!")
      }
    })
  }
}
module.exports.addProjectNotification = addProjectNotification
module.exports.addTaskNotification = addTaskNotification
