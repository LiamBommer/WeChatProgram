
/**
 * 
 */
function getProjectList() {
  var that = this
  var Projectmember = Bmob.Object.extend('proj_member')
  var projectmemberQuery = new Bmob.Query(Projectmember)
  var projectArr = []
  var starprojectArr = []

  var projIds = []

  // getApp().globalData.projects != null && getApp().globalData.projects.length < 1

  if (1) {
    wx.showLoading({
      title: '正在加载',
      mask: 'true'
    })
    projectmemberQuery.equalTo('user_id', getApp().globalData.userId/*当前用户的id*/)
    projectmemberQuery.include('project')
    //projectmemberQuery.equalTo('is_delete',false)  //筛选没有被解散的项目

    projectmemberQuery.find({
      success: function (results) {
        //成功
        console.log("getProjectList", results)
        for (var i in results) {
          var result = results[i]
          var object = {}
          var starobject = {}

          if (result.get('project').is_delete != true && result.attributes.is_first == false)//非星标项目
          {
            object = {
              icon: result.attributes.project.img_url,
              name: result.attributes.project.name,
              id: result.attributes.project.objectId,
              checked: false,
              task:[]
            }
            projectArr.push(object)
            projId.push(object.id)
          }
          if (result.get('project').is_delete != true && result.attributes.is_first == true)//星标项目
          {
            starobject = {
              icon: result.attributes.project.img_url,
              name: result.attributes.project.name,
              id: result.attributes.project.objectId,
              checked: true
            }
            starprojectArr.push(starobject)
            projId.push(starobject.id)
          }
        }
        

        //获取离今日最近的三个任务
        // for (var i = 0; i < starprojectArr.length; i++) {
        //   var pivot = i
        //   var projId = starprojectArr[i].id
        //   var Task = Bmob.Object.extend("task")
        //   var taskQuery = new Bmob.Query(Task)

        //   taskQuery.limit(50)
        //   taskQuery.notEqualTo("is_delete", true)
        //   taskQuery.equalTo("proj_id", projId)
        //   taskQuery.equalTo("is_finish", false)
        //   taskQuery.select("title", "end_time")
        //   taskQuery.ascending("end_time")
        //   taskQuery.find({
        //     success: function (results) {
        //       //查询任务成功
        //       // console.log("查询任务成功！")
        //       results.sort(that.sortTasks)
        //       var len = 3 > results.length ? results.length : 3

        //       for (var j = 0; j < len; j++) {
        //         starprojectArr[pivot].task.push(results[j])
        //         // console.log("star",starprojectArr[pivot])
        //       }


        //       getApp().globalData.projects.push(projectArr)
        //       getApp().globalData.projects.push(starprojectArr)  //第一次请求后台，然后便不再请求
        //       console.log("Project", projectArr)
        //       console.log("StarProject", starprojectArr)
        //       that.setData({ Project: projectArr })
        //       that.setData({ StarProject: starprojectArr })

        //     },
        //     error: function (error) {
        //       //查询任务失败
        //     }
        //   })

        // }
        // 加载完成
        wx.hideLoading()
      },
      error: function (error) {
        //失败
        console.log("查询用户所在的所有项目失败: " + error.code + " " + error.message)
      }
    })
  }

}

function sort(a,b){
  // 比较当前时间与截止时间的差值
  if (a.end_time == '' || a.end_time == null) {
    return 1
  }

  var currentTime = new Date(new Date().toLocaleDateString())
  var endTime1 = new Date(new Date(a.end_time.replace(/-/g, "/")))
  var endTime2 = new Date(new Date(b.end_time.replace(/-/g, "/")))

  var days1 = endTime1.getTime() - currentTime.getTime()
  var days2 = endTime2.getTime() - currentTime.getTime()

  if(days1 > days2){
    return 1
  }
  return -1

  // var day = parseInt(days / (1000 * 60 * 60 * 24));  //时间差值
  // if (day > 1) {
  //   return 'green'
  // }
  // else {
  //   return 'red'
  // }
}
function sortTasks(a, b) {
  if (a.endTime == '' || b.endTime == null) {
    return 1
  }

  if (a.endTime > b.endTime)
    return 1

  return -1
}
/**
 * 
 */
function getAllTasks(starProjIdArr, projIdArr){

  var that = this
  var starLen = starProjIdArr.length
  var len = projIdArr.length
  var projIds = starProjIdArr.concat(projIdArr)

  var Task = Bmob.object.extend("task")
  var taskQuery = new Bmob.Query(Task)
  
  taskQuery.limit(100)
  taskQuery.containedIn("proj_id", projIds)
  taskQuery.select('title','end_time','proj_id')

  var taskObject={}
  for(var i = 0;i<starLen;i++){
    object[starProjIdArr[i]] = []

  }

  for(var i = 0;i<len;i++){
    object[projIdArr[i]] = []
  }

  var taskArr = []
  taskQuery.find({
    success:function(results){
      for(var i=0;i<results.length;i++){
        var object = {
          title: results[i].attributes.title,
          endTime: results[i].attributes.end_time,
          projId: results[i].attributes.proj_id
        }

        taskArr.push(object)
      }

      for(var i=0;i<taskArr.length;i++){
        taskObject[taskArr[i].projId].push(taskArr[i])
      }

      //排序
      for(var i=0;i<results.length;i++){
        taskObject[results[i].attributes.proj_id].sort(sortTasks)
      }

      console.log(taskObject)
      //
      
      
    },
    error:function(error){

    }
  })
  



}