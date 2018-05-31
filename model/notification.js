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
function addNotification(projId,toUserIds,content,_type,requesId){

}