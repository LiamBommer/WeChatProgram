//model/ideawall.js
var Bmob = require('../utils/bmob.js')
var ADD_IDEA = '新添加了点子'
var MODIFY_IDEA_CONTENT = '修改了点子内容'
var MODIFY_RELATED_TASK = '修改了点子的关联任务'

/**
 * @parameter projId 项目id
 * 获取某个项目的所有点子,每个点子的属性有
 'id':  //点子的id
'content': //点子内容
'projectName':  //项目名称
'userName':  //发布人的名字(真正的昵称，而不是其他名字)
'userPic':  //发布人的头像
 */

function getProjectIdea(projId) {

  var Idea = Bmob.Object.extend('idea')
  var ideaQuery = new Bmob.Query(Idea)
  var ideaArr = []

  //获取某个项目的所有点子
  ideaQuery.equalTo('project', projId)
  ideaQuery.include('project')
  ideaQuery.include('user')

  ideaQuery.find({
    success: function (results) {
      //成功
      for (var i in results) {
        var ideaObject = {}
        ideaObject = {
          'id': results[i].id || '',  //点子的id
          'content': results[i].get('content') || '',  //点子内容
          'projectName': results[i].attributes.project.name || '',  //项目名称
          'userName': results[i].attributes.user.nickName || '',   //发布人的名字(真正的昵称，而不是其他名字)
          'userPic': results[i].attributes.user.userPic || ''    //发布人的头像
        }
        ideaArr.push(ideaObject)
      }

      if (ideaArr != null && ideaArr.length > 0) {
        //获取到点子啦
        //在这里setData
        console.log('获取到的点子们', ideaArr)





      }
    },
    error: function (error) {
      //失败
    }
  })
}

/**
 * @parameter projId项目id，ideaId点子id ，newContent
 * 修改点子内容
 */
function modifyIdeaContent(projId,ideaId,newContent){

  var Idea = Bmob.Object.extend('idea')
  var ideaQuery = new Bmob.Query(Idea)
  
  ideaQuery.get(ideaId,{
    success: function(result){
      result.set('content',newContent)
      reuslt.save()
      //修改成功
      //通知其他项目成员
      var _type = 5   //通知的类型
      that.addProjectNotification(projId, MODIFY_IDEA_CONTENT, _type, ideaId)  //通知其他项目成员
      console.log('提示用户修改成功！')

    },
    error: function(error){
      //修改失败
      console.log('提示用户修改失败！')
    }
  })

}

/**
 * @parameter projId 项目id，userId用户id，content 点子内容(不能为空），taskIds任务id数组（可以为空）
 * 添加一个点子
 */
function createIdea(projId,userId,content,taskIds=[]){

  var that = this
  var Idea = Bmob.Object.extend('idea')
  var idea = new Idea()
  var user = Bmob.Object.createWithoutData("_User", userId)
  var project = Bmob.Object.createWithoutData("project", projId)
  //添加点子的基本信息
  idea.save({
    user: user,      //用户
    project: project,  //项目
    content: content,   //点子内容
  },{
    success: function(result){
      //添加成功
      //通知其他项目成员
      var _type = 5   //通知的类型
      that.addProjectNotification(projId, ADD_IDEA, _type, result.id/*创建的点子id*/)  //通知其他项目成员
      console.log("提示用户添加点子成功！")
    },
    error: function(error){
      //添加失败
      console.log("提示用户添加点子失败！")
    }
  }).then(function(idea){
    //添加点子与任务的关联
    if (taskIds != null && taskIds.length > 0) {
      var Ideatask = Bmob.Object.extend('idea_task')
      var objects = new Array()  //本地idea_taskk数组

      for (var i = 0; i < taskIds.length; i++) {
        var taskid = taskIds[i]
        var task = Bmob.Object.createWithoutData("task", taskid)
        var ideataskObject = new Ideatask()
        ideataskObject.set("proj_id", projId)
        ideataskObject.set("task", task)
        ideataskObject.set("idea_id", idea.id/*点子id*/)

        objects.push(ideataskObject)
      }     
      //批量添加
      Bmob.Object.saveAll(objects).then(function (objects) {
        // 成功添加关联任务
        console.log("成功添加关联任务！")
      },
        function (error) {
          // 异常处理
          console.log("添加关联任务失败！")
          
        })
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
              console.log('添加项目成员通知失败',error)
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
 * parameter projId 项目id，ideaId 点子id， oldTaskIds旧的任务id数组, newTaskIds新的任务id数组
 * 修改关联任务，将原先的都删除，然后添加新的关联任务数组
 */
function modifyRelatedTasks(projId, ideaId, oldTaskIds, newTaskIds) {

  var that = this
  var Ideatask = Bmob.Object.extend('idea_task')
  var ideataskQuery = new Bmob.Query(Ideatask)
  var ideataskArr = []

  //将原来关联的任务删除
  if (oldTaskIds != null && oldTaskIds.length > 0){
    ideataskQuery.containedIn('task', oldTaskIds)
    ideataskQuery.equalTo('idea_id', ideaId)

    ideataskQuery.destroyAll({
      success: function () {
        //删除成功
        //然后加入新的关联任务
        if (newTaskIds != null && newTaskIds.length > 0) {
          for (var i in newTaskIds) {
            var ideatask = new Ideatask()
            var task = Bmob.Object.createWithoutData("task", newTaskIds[i])
            ideatask.set('task', task)       //关联的任务
            ideatask.set('idea_id', ideaId)  //点子id
            ideatask.set('proj_id',projId)   //项目id
            ideataskArr.push(ideatask)  //这个数组用来批量添加用
          }
          if (ideataskArr != null && ideataskArr.length > 0) {
            Bmob.Object.saveAll(ideataskArr).then(function (results) {
              // 重新添加关联的任务成功
              var _type = 5  //通知类型
              that.addProjectNotification(projId, MODIFY_RELATED_TASK, _type, ideaId/*点子id*/)  //通知其他项目成员
              console.log('修改关联任务成功！')

            },
              function (error) {
                // 异常处理
                console.log('修改点子关联任务中的重新添加关联任务失败！')

              })
          }
        }

      },
      error: function (err) {
        // 删除失败,即修改关联任务失败
        console.log('修改关联任务失败')
      }
    })
  }

}

/**
 * 
 * 获取某个点子关联的任务
 */
function getIdeaRelatedTask(){
  
}
module.exports.createIdea = createIdea
module.exports.addProjectNotification = addProjectNotification
