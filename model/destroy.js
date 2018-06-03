var Bmob = require('../utils/bmob.js')

function destroyTaskRecord(){
  var Taskrecord = Bmob.Object.extend('task_record')
  var taskrecordQuery = new Bmob.Query(Taskrecord)
  var taskrecord = new Taskrecord()
  taskrecordQuery.equalTo("user_name", "朱宏涛");
  taskrecordQuery.find().then(function (todos) {
    return Bmob.Object.destroyAll(todos);
  }).then(function (todos) {
    console.log("删除成功");
    // 删除成功
  }, function (error) {
    // 异常处理
  })
}

module.exports.destroyTaskRecord = destroyTaskRecord