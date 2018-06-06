//model/communicateModel.js

var Bmob = require('../utils/bmob.js')

//模板共分为3种类型 1 代表 ‘意见’，2 代表’提问‘， 3 代表’点赞‘

/**
 * @parameter userId 用户id ， _type模板类型 1 代表 ‘意见’，2 代表’提问‘， 3 代表’点赞‘
 * 获取到指定类型的模板数组 ，每个元素有（id模板id,content模板内容,type模板类型)
 * 根据用户id和模板类型查询出沟通模板的内容
 */
function getModel(userId,_type){

  var CommunicateMod = Bmob.Object.extend('communicate_mod')
  var communicatemodQuery = new Bmob.Query(CommunicateMod)
  var modelArr = []

  //根据用户id和模板类型查询出沟通模板的内容
  communicatemodQuery.equalTo('user_id',userId)
  communicatemodQuery.equalTo('type',_type)
  communicatemodQuery.find({
    success: function(results){
      //成功
      for(var i in results){
        var modelObject = {}
        modelObject = {
          'id': results[i].id,    //模板id
          'content': results[i].get('content'),  //模板内容
          'type': results.get('type')  //模板类型 ，1 代表 ‘意见’，2 代表’提问‘， 3 代表’点赞‘
        }
        modelArr.push(modelObject)
        //在这里setData
        console.log("沟通模板:", modelArr)
        


      }
    },
    error: function(error){
      //失败
      console.log('沟通模板获取失败：',error)
    }
  })
}

/**
 * @parameter userId用户id， _type模板类型 1 代表 ‘意见’，2 代表’提问‘， 3 代表’点赞‘, modelContent 模板内容
 * 根据用户id 和 模板类型添加模板
 */
function addCommunicateModel(userId, _type, modelContent){

  var CommunicateMod = Bmob.Object.extend('communicate_mod')
  var communicatemod = new CommunicateMod()

  //添加指定类型的沟通模板
  if(modelContent != null && modelContent != ''){
    communicatemod.save({
      user_id: userId,  //用户id
      type: _type,      //模板类型   1 代表 ‘意见’，2 代表’提问‘， 3 代表’点赞‘
      content: modelContent  //模板内容
    }, {
        success: function (result) {
          //成功
          console.log('提示用户添加沟通模板成功过！')



        },
        error: function (result, error) {
          //失败
          console.log('添加指定类型的沟通模板失败:', error)
        }
      })
  }
  
}

/**
 * @parameter userId 用户id ，modelId 模板id
 * 删除一个沟通模板
 */
function deleteOneCommunicateModel(userId,modelId){

  var CommunicateMod = Bmob.Object.extend('communicate_mod')
  var communicatemodQuery = new Bmob.Query(CommunicateMod)

  //删除一个沟通模板
  if(modelId != null && modelId != ''){
    communicatemodQuery.equalTo('user_id',userId)
    communicatemodQuery.equalTo('objectId',modelId)

    communicatemodQuery.destroyAll({
      success: function () {
        //删除成功
        console.log('删除沟通模板成功!')



      },
      error: function (err) {
        // 删除失败
        console.log('删除沟通模板失败!')

      }
    })
  }
}

/**
 * @parameter userId 用户id， modelId模板id ，newModelContent新的模板内容
 * 修改一个沟通模板的内容
 */
function modifyCommunicateModel(userId, modelId, newModelContent){

  var CommunicateMod = Bmob.Object.extend('communicate_mod')
  var communicatemodQuery = new Bmob.Query(CommunicateMod)

  //修改一个沟通模板的内容
  communicatemodQuery.get(modelId,{
    success:function(result){
      //成功
      result.set('content',newModelContent)
      result.save()

      console.log('修改模板内容成功！')
    },
    error: function(error){
      //失败
      console.log('修改模板内容失败！')
    }
  })
}