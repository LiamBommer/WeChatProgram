//model/taskComment.js
var Bmob = require('../utils/bmob.js')

/**
 * 获取某个任务的评论（50条）,按时间由近到远排序
 */
function getTaskComment(taskId){

  var Taskcommment = Bmob.Object.extend('task_comment')
  var taskcommentQuery = new Bmob.Query(Taskcommment)
  var commentList = new Array()  //获取的评论列表

  //获取评论
  taskcommentQuery.equalTo('task_id',taskId)
  taskcommentQuery.descending(createdAt)
  taskcommentQuery.include('publisher')  //获取发布人的信息
  taskcommentQuery.limit(50)
  taskcommentQuery.find({
    success: function(results){
      //成功返回results     
      for(var i in results){
        var commentId = results[i].id;  //评论id
        var userPic = results[i].get('publisher').userPic  //发布评论的人的头像
        var content = results[i].get('content')  //评论内容
        var createdAt = results[i].get('createdAt')  //评论时间

        var comment;
        comment = {
          "commentId": commentId,
          "userPic": userPic,
          "content": content,
          "createdAt": createdAt
        }
        commentList.push(comment)
      }
      //在这里setData
      console.log("获取评论成功!",commentList)





    },
    error: function(error){
      //获取评论失败
      console.log("获取评论失败!",error)
    }
    
  })
}

/**
 * 2018-06-02
 * @parameter taskId任务id, publisherId评论人的id, content评论内容
 * 发布评论，沟通模板也可以用这个函数，沟通模板的内容就是content
 */
function sendTaskComment(taskId,publisherId,content){

  var Taskcommment = Bmob.Object.extend('task_comment')
  var taskcomment = new Taskcommment()
  
  var publisher = Bmob.Object.createWithoutData("_User", publisherId)  //发布人的信息
  //添加任务评论
  taskcomment.save({
    publisher: publisher,
    content: content,  //评论内容
    task_id:taskId  //任务id
  }, {
      success: function (result) {
        // 添加成功
        console.log("提示用户评论成功!")
      },
      error: function (result, error) {
        // 添加失败
        console.log("提示用户评论失败!")
      }
    })
}

/**
 * 2018-06-02
 * 发图片，发布任务评论的图片
 * 内部调用了函数sendTaskComment
 */
function sendTaskCommentPicture(taskId, publisherId){

  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      var tempFilePaths = res.tempFilePaths;
      if (tempFilePaths.length > 0) {
        var name = "1.jpg";//上传的图片的别名，建议可以用日期命名
        var file = new Bmob.File(name, tempFilePaths);
        file.save().then(function (res) {

          //res.url()是上传图片后的 url
          //console.log(res.url());
          sendTaskComment(taskId, publisherId,res.url()) //存储图片路径url
          
        }, function (error) {
          console.log(error);
        })
      }

    }
  })
}