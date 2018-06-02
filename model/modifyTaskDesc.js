var Bmob = require('../utils/bmob.js')

var MODIFY_TASK_DESC = "修改了任务描述"

function modifyTaskDesc(taskId, description, userName) {

  var Task = Bmob.Object.extend('task')
  var taskQuery = new Bmob.Query(Task)

  //添加反馈时间
  taskQuery.get(taskId, {
    success: function (result) {
      //成功情况
      result.set('desc', description)
      result.save()
      //记录操作
      addTaskRecord(taskId, userName, MODIFY_TASK_DESC)

    },
    error: function (object, error) {
      //失败情况
    }
  })
}