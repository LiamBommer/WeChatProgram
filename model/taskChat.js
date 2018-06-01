//model/taskChat.js
var Bmob = require('../utils/bmob.js')
// var BSI = require('../utils/bmobSocketIo.js')
// var BmobSocketIo = new BSI("acb853b88395063829cae5f88c29fb82")
// console.log(BmobSocketIo)
/**
 * 存储聊天内容
 */
function chat(taskId, userId, content){

  var that = this
  var task = Bmob.Object.createWithoutData("task", taskId)
  var user = Bmob.Object.createWithoutData("user", userId)

  var TaskChat = Bmob.Object.extend('task_chat')
  var taskchat = new TaskChat()

  taskchat.set('user',user)
  taskchat.set('task',task)
  taskchat.set('content',content)
  taskchat.save(null,{
    success:function(result){
      //发送成功
    },
    error:function(result,error){
      //发送失败
    }
  })


}

/**
 * 监听聊天表
 */
function receiveChatContent(){

  var that = this
  //初始连接socket.io服务器后，需要监听的事件都写在这个函数内
  BmobSocketIo.onInitListen = function () {
    //订阅Chat表的数据更新事件
    console.log("//订阅Chat表的数据更新事件")
    BmobSocketIo.updateTable("task_chat"); //聊天记录表

    //that.chat("123","12345","这是内容")
  }

  //监听服务器返回的更新表的数据
  BmobSocketIo.onUpdateTable = function (tablename, data) {
    console.log("//监听服务器返回的更新表的数据")
    if (tablename == "task_chat") {
      console.log(data)
    }
  }

   that.chat("123","12345","这是内容")
}

module.exports.receiveChatContent = receiveChatContent
module.exports.chat = chat