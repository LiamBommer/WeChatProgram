//model/taskDetail.js
var Bmob = require('../utils/bmob.js')

//下面的变量是操作记录用的，要全部复制过去 。
//下面的每个函数几乎都用到了 addTaskRecord 函数，用来记录用户的操作记录
var FINISH_TASK = "完成任务"
var REDO_TASK = "重做任务"
var MODIFY_TASK_TITLE = "更改了任务名称"

var ADD_NOTI_TIME = "添加了提醒时间"
var MODIFY_NOTI_TIME = "修改了提醒时间"
var DELETE_NOTI_TIME = "删除了提醒时间"

var ADD_FEEDBACK_MOD = "添加了反馈模板"
var MODIFY_FEEDBACK_MOD = "修改了反馈模板"

var DELETE_FEEDBACK_TIME = "删除了反馈时间"
var ADD_FEEDBACK_TIME = "添加了反馈时间"
var MODIFY_FEEDBACK_TIME = "修改了反馈时间"

var ADD_DESCRIPTION = "添加了任务描述"
var MODIFY_DESCRIPTION = "修改了任务描述"

var ADD_END_TIME = "添加了截止时间"
var MODIFY_END_TIME = "修改了截止时间"
var DELETE_END_TIME = "删除了截止时间"

var ADD_SUB_TASK = "添加了子任务"
var MODIFY_SUB_TASK = "修改了子任务"
var REDO_SUB_TASK = "重做了子任务"
var DELETE_SUB_TASK = "删除了子任务"
var FINISH_SUB_TASK = "完成了子任务"
var MODIFY_SUB_TASK_TITLE = "修改了子任务标题"

/**
 * 2018-05-29
 * @parameter taskId任务id，leaderId任务负责人的id
 * 获取任务成员，成员数组的第一个是任务负责人
 */
function getTaskMember(taskId,leaderId){

  var TaskMember = Bmob.Object.extend('task_member')
  var taskmemberQuery = new Bmob.Query(TaskMember)

  var memberArr = []  //任务成员数组
  //查询任务成员
  taskmemberQuery.equalTo("task_id",taskId)
  taskmemberQuery.include("user_id")
  taskmemberQuery.find({
    success: function(results){
      for(var i=0;i<results.length;i++){
        var result = results[i]
        if (leaderId == result.get("user_id").objectId ){
          memberArr.unshift(result.get("user_id"))
        }else{
          memberArr.push(result.get("user_id"))
        }       
      }
      //在这里设置setData
      console.log("任务成员" ,memberArr)






    },
    error: function(error){

    }
  })
}

/**
 * @parameter taskId任务id，notiTime提醒时间，userName操作人的昵称（用来存在历史操作记录表用）
 * 添加提醒时间
 */
function addNotiTime(taskId,notiTime,userName){

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //添加提醒时间
  taskQuery.get(taskId,{
    success: function(result){
      //成功添加情况
      result.set('noti_time',notiTime)
      result.save()
      //记录操作
      addTaskRecord(taskId,userName,ADD_NOTI_TIME)

    },
    error: function(object,error){
      //失败情况
    }
  })
}

/**
 * @parameter taskId任务id，notiTime提醒时间，userName操作人的昵称（用来存在历史操作记录表用）
 * 修改提醒时间
 */
function modifyNotiTime(taskId,notiTime,userName){

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //修改提醒时间
  taskQuery.get(taskId, {
    success: function (result) {
      //成功添加情况
      result.set('noti_time', notiTime)
      result.save()
      //记录操作
      addTaskRecord(taskId, userName, MODIFY_NOTI_TIME)

    },
    error: function (object, error) {
      //失败情况
    }
  })  
}

/**
 * @parameter taskId任务id，feedBackTime反馈时间，userName操作人的昵称（用来存在历史操作记录表用）
 * 添加反馈时间
 * 
 */
function addFeedbackTime(taskId,feedBackTime,userName){
  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //添加反馈时间
  taskQuery.get(taskId,{
    success: function(result){
      //成功情况
      result.set('feedback_time', feedBackTime)
      result.save()
      //记录操作
      addTaskRecord(taskId, userName, ADD_FEEDBACK_TIME)
    },
    error: function(object,error){
      //失败情况
    }
  })
}

/**
 * @parameter taskId任务id，feedBackTime反馈时间，userName操作人的昵称（用来存在历史操作记录表用）
 * 修改反馈时间
 * 
 */
function modifyFeedbackTime(taskId, feedBackTime, userName){

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //添加反馈时间
  taskQuery.get(taskId, {
    success: function (result) {
      //成功情况
      result.set('feedback_time', feedBackTime)
      result.save()
      //记录操作
      addTaskRecord(taskId, userName, MODIFY_FEEDBACK_TIME)

    },
    error: function (object, error) {
      //失败情况
    }
  })
}

/**
 *  @parameter taskId任务id，feedbackMod反馈时间，userName操作人的昵称（用来存在历史操作记录表用）
 * 添加反馈模板
 * 
 */
function addFeedbackMod(taskId,feedbackMod,userName){
  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //添加反馈模板
  taskQuery.get(taskId, {
    success: function (result) {
      //成功情况
      result.set('feedback_mod ', feedbackMod)
      result.save()
      //记录操作
      addTaskRecord(taskId, userName, ADD_FEEDBACK_MOD)
    },
    error: function (object, error) {
      //失败情况
    }
  })
}

/**
 *  @parameter taskId任务id，feedbackMod反馈时间，userName操作人的昵称（用来存在历史操作记录表用）
 * 修改反馈模板
 * 
 */
function modifyFeedbackMod(taskId, feedbackMod, userName) {
  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //添加反馈模板
  taskQuery.get(taskId, {
    success: function (result) {
      //成功情况
      result.set('feedback_mod ', feedbackMod)
      result.save()
      //记录操作
      addTaskRecord(taskId, userName, MODIFY_FEEDBACK_MOD)
    },
    error: function (object, error) {
      //失败情况
    }
  })
}

/**
 * @parameter taskId任务id，feedbackMod反馈时间，userName操作人的昵称（用来存在历史操作记录表用）
 * 增加任务截止时间
 */
function addEndTime(taskId, endTime, userName){

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //添加反馈模板
  taskQuery.get(taskId, {
    success: function (result) {
      //成功情况
      result.set('end_time ', endTime)
      result.save()
      //记录操作
      addTaskRecord(taskId, userName, ADD_END_TIME)
    },
    error: function (object, error) {
      //失败情况
    }
  })
}

/**
 * @parameter taskId任务id，feedbackMod反馈时间，userName操作人的昵称（用来存在历史操作记录表用）
 * 修改任务截止时间
 */
function modifyEndTime(taskId, endTime, userName){

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //添加反馈模板
  taskQuery.get(taskId, {
    success: function (result) {
      //成功情况
      result.set('end_time ', endTime)
      result.save()
      //记录操作
      addTaskRecord(taskId, userName, MODIFY_END_TIME)
    },
    error: function (object, error) {
      //失败情况
    }
  })  
}
/**
 * @parameter taskId 任务id, isFinish 是布尔类型，true表示做完,userName操作人的昵称（用来存在历史操作记录表用）
 * 完成任务
 */
function finishTask(taskId,isFinish,userName){

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //完成任务
  taskQuery.get(taskId, {
    success: function (result) {
      //成功情况
      result.set('is_finish ', isFinish)
      result.save()
      //记录操作
      addTaskRecord(taskId, userName, FINISH_TASK + result.get('title'))

    },
    error: function (object, error) {
      //失败情况
    }
  })
}

/**
 * @parameter taskId 任务id, isFinish 是布尔类型，true表示做完,userName操作人的昵称（用来存在历史操作记录表用）
 * 重做任务（把做完任务的勾又取消了）
 */
function redoTask(taskId, isFinish, userName)
{
  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //完成任务
  taskQuery.get(taskId, {
    success: function (result) {
      //成功情况
      result.set('is_finish ', isFinish)
      result.save()
      //记录操作
      addTaskRecord(taskId, userName, REDO_TASK + result.get('title'))

    },
    error: function (object, error) {
      //失败情况
    }
  })
}

/**
 *添加任务记录
 */
function addTaskRecord(taskId,userName,record){
  var TaskRecord = Bmob.Object.extend('task_record')
  var taskrecord = new TaskRecord()

  //存储任务记录
  taskrecord.save({
    user_name: userName,
    task_id: taskId,
    record: userName+record
  },{
    success: function(result){
      //添加成功

    },
    error: function(result,error){
      //添加失败

    }
  })
}

/**
 * 2018-05-29
 * @parameter taskId父任务的id，title子任务标题，leaderId子任务负责人id（可以为空）
 * 创建子任务
 */
function createSubTask(taskId,title,leaderId){

  var Subtask = Bmob.Object.extend('sub_task')
  var subtask = new Subtask()
  
  subtask.set("task_id",taskId)
  subtask.set("title", title)
  subtask.set("is_finish",false)
  if(leaderId != null){
    subtask.set("user", Bmob.Object.createWithoutData("_User", leaderId))
  }

  //添加子任务
  subtask.save({
    success:function(result){
      //添加成功
      //记录
      addTaskRecord(taskId, userName, ADD_SUB_TASK + title)
      console.log("提示用户添加子任务成功!")







    },
    error: function(result,error){
      //添加失败
      console.log("提示用户添加子任务失败!","失败信息",error)

    }
  })
}

/**
   * 2018-05-29
   * @parameter taskId 为父任务id
   * 获取某一任务下的子任务（默认20个）,最先创建的排在最前面
   */
function getSubtasks(taskId){

  var Subtask = Bmob.Object.extend('sub_task')
  var subtaskQuery = new Bmob.Query(Subtask)

  //获取子任务（20个）
  subtaskQuery.equalTo("task_id",taskId)
  subtaskQuery.include("user")
  subtaskQuery.ascending("createdAt")
  subtaskQuery.find({
    success: function(results){
      //成功,results即为结果数组
      if(results!=null){
        //在这里设置setData
        console.log(results)






        
      }
    },
    error: function(error){

    }
  })
}

/**
 * 2018-05-29
 * @parameter subTaskId 子任务的id，is_finish 为true
 * 完成某个子任务
 */
function finishSubTask(subTaskId,is_finish){

  var Subtask = Bmob.Object.extend('sub_task')
  var subtaskQuery = new Bmob.Query(Subtask)

  //更改子任务为完成状态
  subtaskQuery.get(subTaskId,{
    success: function(result){
      //成功
      result.set("is_finish", is_finish)
      result.save()
      //记录
      addTaskRecord(taskId, userName, FINISH_SUB_TASK+result.get('title'))

    },
    error: function(error){
      //失败

    }
  })
}

/**
 * 2018-05-29
 * @parameter subTaskId 子任务的id，is_finish 为false
 * 重做某个子任务
 */
function redoSubTask(subTaskId,is_finish){

  var Subtask = Bmob.Object.extend('sub_task')
  var subtaskQuery = new Bmob.Query(Subtask)

  //更改子任务为完成状态
  subtaskQuery.get(subTaskId, {
    success: function (result) {
      //成功
      result.set("is_finish", is_finish)
      result.save()
      //记录
      addTaskRecord(taskId, userName, REDO_SUB_TASK + result.get('title'))

    },
    error: function (error) {
      //失败

    }
  })
}

/**
 * 2018-05-29
 * @parameter subTaskId子任务的id ， newTitle 新任务标题
 * 修改子任务标题
 */
function modifySubTaskTitle(subTaskId, newTitle){

  var Subtask = Bmob.Object.extend('sub_task')
  var subtaskQuery = new Bmob.Query(Subtask)

  //更改子任务为完成状态
  subtaskQuery.get(subTaskId, {
    success: function (result) {
      //成功
      result.set("title", newTitle)
      result.save()
      //记录
      addTaskRecord(taskId, userName, MODIFY_SUB_TASK_TITLE)

    },
    error: function (error) {
      //失败

    }
  })
}
/**
 * 2018-05-29
 * 更改任务标题
 */
function modifyTaskTitle(taskId,newTitle){

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //完成任务
  taskQuery.get(taskId, {
    success: function (result) {
      //成功情况
      result.set('title ', newTitle)
      result.save()
      //记录操作
      addTaskRecord(taskId, userName, MODIFY_TASK_TITLE)

    },
    error: function (object, error) {
      //失败情况
    }
  })
}

/**
 * 2018-05-29
 * @parameter taskId 任务id
 * 获取任务记录 , 一次20条,时间越久远的排在越后面
 */
function getTaskRecord(taskId){

  var TaskRecord = Bmob.Object.extend('task_record')
  var taskrecordQuery = new Bmob.Query(TaskRecord)

  //查询任务记录
  taskrecordQuery.select("record")
  taskrecordQuery.equalTo("task_id",taskId)
  taskrecordQuery.descending("createdAt")
  taskrecordQuery.find({
    success: function(results){
      //成功
      //在这里设置setData
      console.log("获取的任务记录",results)






    },
    error: function(error){
      //失败
      console.log("获取任务记录失败！",error)
    }
  })

  
}

/**
 * @parameter taskId 任务id,userName用户昵称（记录操作用）
 * 删除提醒时间
 */
function deleteNotiTime(taskId,userName){

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //删除提醒时间
  taskQuery.get(taskId,{
    success: function(result){
      result.set('noti_time','')  //设为‘’ 空
      result.save()
      //console.log("删除提醒时间成功")
      addTaskRecord(taskId,userName,DELETE_NOTI_TIME)
    },
    error: function(error){

    }
  })

}

/**
 * @parameter taskId 任务id,userName用户昵称（记录操作用）
 * 删除截止时间
 */
function deleteEndTime(taskId, userName) {

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //删除截止时间
  taskQuery.get(taskId, {
    success: function (result) {
      result.set('end_time', '')  //设为‘’ 空
      result.save()
      //console.log("删除截止时间成功")
      addTaskRecord(taskId, userName, DELETE_END_TIME)
    },
    error: function (error) {

    }
  })
}

/**
 * @parameter taskId 任务id,userName用户昵称（记录操作用）
 * 删除截止时间
 */
function deleteFeedbackTime(taskId, userName) {

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //删除反馈时间
  taskQuery.get(taskId, {
    success: function (result) {
      result.set('feedback_time', '')  //设为‘’ 空
      result.save()
      //console.log("删除反馈时间成功")
      addTaskRecord(taskId, userName, DELETE_FEEDBACK_TIME)
    },
    error: function (error) {

    }
  })
}

/**
 * @parameter taskId 任务id,userName用户昵称（记录操作用）
 * 删除任务
 */
function deleteTask(taskId, userName) {

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //删除反馈时间
  taskQuery.get(taskId, {
    success: function (result) {
      result.set('is_delete',true)  //设为‘’ 空
      result.save()
      //console.log("删除反馈时间成功")
      //不用记录操作

    },
    error: function (error) {

    }
  })
}

/**
 * @parameter subTaskId 子任务id,userName用户昵称（记录操作用）subTaskTitle子任务名称（记录操作用）
 * 删除子任务
 */
function deleteSubTask(subTaskId, userName, subTaskTitle) {

  var Subtask = Bmob.Object.extend('sub_task')
  var subtaskQuery = new Bmob.Query(Subtask)

  //删除子任务
  subtaskQuery.equalTo('objectId',subTaskId)
  subtaskQuery.destroyAll({
    success: function () {
      //删除成功
      console.log("删除子任务成功！")
      //记录操作
      addTaskRecord(taskId, userName, DELETE_SUB_TASK + subTaskTitle)
    },
    error: function (err) {
      // 删除失败
    }
  })
}
/**
 * 获取某个任务的基本信息
 */
function getTaskDetail(taskId){

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  taskQuery.get(taskId,{
    success: function(result){
      //成功
    },
    error: function(error){
      //失败
    }
  })
}
//下面是发布函数用的，你们不用复制
module.exports.getTaskMember = getTaskMember
module.exports.addNotiTime = addNotiTime
module.exports.addFeedbackTime = addFeedbackTime
module.exports.addFeedbackMod = addFeedbackMod
module.exports.finishTask = finishTask
module.exports.createSubTask = createSubTask
module.exports.getSubtasks = getSubtasks
module.exports.getTaskRecord = getTaskRecord
module.exports.addTaskRecord = addTaskRecord
 