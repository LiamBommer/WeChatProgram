//model/ideawall.js
var Bmob = require('../utils/bmob.js')

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
          'id': results[i].id,  //点子的id
          'content': results[i].get('content'),  //点子内容
          'projectName': results[i].attributes.project.name,  //项目名称
          'userName': results[i].attributes.user.nickName,  //发布人的名字(真正的昵称，而不是其他名字)
          'userPic': results[i].attributes.user.userPic     //发布人的头像
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
    },
    error: function(error){
      //修改失败
      console.log('提示用户修改失败！')
    }
  })

}