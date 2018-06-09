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
 * 获取的数组，每个元素包括
 * 'id':   //通知的id
    'fromUserPic':   //通知的来源的人的头像
    'content':  //通知内容
    'type':   //通知类型
    'requestId':   //点击通知时请求的通知详情的对应的 id
    'isRead':  //判断通知是否已读，fasle为 未读
    'projectName':   //对应的项目名
    'createdAt':   //通知创建的时间
 * 
 */
function getNotification(userId){

  var Notification = Bmob.Object.extend('notification')
  var notificationQuery = new Bmob.Query(Notification)
  var notificationArr = []

  //获取用户的所有通知
  notificationQuery.equalTo("to_user_id", userId)
  notificationQuery.include('project')
  notificationQuery.include('from_user')
  notificationQuery.descending("createdAt")
  notificationQuery.find({
    success: function(results){
      //成功
      for(var i in results){
        var notiObject = {}
        notiObject = {
          'id': results[i].id,   //通知的id
          'fromUserPic': results[i].attributes.from_user.userPic,  //通知的来源的人的头像
          'content': results[i].get('content'),  //通知内容
          'type': results[i].get('type'),  //通知类型
          'requestId': results[i].get('request_id'),  //点击通知时请求的通知详情的对应的 id
          'isRead': results[i].get('is_read'),  //判断通知是否已读，fasle为 未读
          'projectName': results[i].attributes.project.name,  //对应的项目名
          'createdAt': results.get('createdAt')  //通知创建的时间
        }

        notificationArr.push(notiObject)  //获取到的通知数组
      }
      if(notificationArr != null && notificationArr.length > 0){
        //获取成功, 在这里setData
        console.log('获取到的通知',notificationArr)
      }




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
      toUserIds.push(results[i].get('user_id').id)
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
          console.log("添加任务成员通知成功！",notificationObjects)


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
 * 用户点开某个通知，已读某一个通知
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

/**
 * 获取项目成员和任务领导人id
 */
function getProjMemberAndTaskleaderId(projId, taskId){
  
  var projmemberArr = []  //项目成员数组
  var taskLeaderId = '0'  //任务负责人id
  //先获取项目成员数组
  var ProjectMember = Bmob.Object.extend("proj_member")
  var memberQuery = new Bmob.Query(ProjectMember)
  var User = Bmob.Object.extend("_User")
  var userQuery = new Bmob.Query(User)

  var leader_id = "0"
  var memberId = [] //项目的所有成员id数组

  //获取指定项目的所有成员id，50条
  memberQuery.equalTo("proj_id", projId)
  memberQuery.select("user_id", "is_leader")
  memberQuery.limit(50)
  memberQuery.find().then(function (results) {
    //返回成功
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      if (object.get("is_leader")) {
        //项目领导，放在数组的第一个
        leader_id = object.get("user_id")
        memberId.unshift(leader_id)

      } else {
        memberId.push(object.get("user_id"))  //将成员id添加到数组
      }
    }
  }).then(function (result) {

    //获取指定项目的所有成员,一次可以获取50条
    userQuery.select("objectId", "nickName", "userPic")  //查询出用户基本信息，id ，昵称和头像
    userQuery.limit(50)
    userQuery.containedIn("objectId", memberId)

    userQuery.find({
      success: function (results) {
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var object
          object = {
            'checked':'',
            'id': results[i].id,
            'nickName': results[i].nickName,
            'userPic': results[i].userPic
          }

          if (object.id == leader_id) {
            //将项目领导放在数组的第一个位置
            projmemberArr.unshift(object)
          } else
            projmemberArr.push(object)
        }
        //然后获取taskLeaderId
        var Task = Bmob.Object.extend('task')
        var taskQuery = new Bmob.Query(Task)

        taskQuery.include('leader')
        taskQuery.get(taskId,{
          success: function(result){
            //获取任务负责人id成功
            taskLeaderId = result.get('leader').objectId
            console.log('获取任务负责人id成功', taskLeaderId,'成员',projmemberArr)










          },
          error: function(error){
            //获取任务负责人id失败

          }
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
        //失败情况





      }
    })

  })
}

/**
 * 根据requestid删除某些通知
 */
function deleteSomeNotification(requestId){
  var Notification = Bmob.Object.extend('notification')
  var notificationQuery = new Bmob.Query(Notification)

  notificationQuery.equalTo('request_id')
  notificationQuery.destroyAll({
    success: function () {
      //删除成功
    },
    error: function (err) {
      // 删除失败
    }
  })
}
module.exports.addProjectNotification = addProjectNotification
module.exports.addTaskNotification = addTaskNotification
module.exports.getProjMemberAndTaskleaderId = getProjMemberAndTaskleaderId


