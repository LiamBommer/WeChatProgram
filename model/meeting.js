//model/meeting.js
var Bmob = require('../utils/bmob.js')

//会议的“重复”功能 ， 想不出怎么做耶
//下面的变量是通知项目成员的内容，需要和代码一同赋值
var ADD_MEETING = "添加了新的会议"
var DELETE_MEETING = "删除了会议"

var MODIFY_MEETING_TITLE = "修改了会议标题"
var MODIFY_MEETING_CONTENT = "修改了会议内容"
var MODIFY_MEETING_START = "修改了会议开始时间"
var MODIFY_MEETING_RECORD = "修改了会议记录"
var MODIFY_MEETING_MEMBER = "修改了会议成员"

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
 * @parameter projId 项目id
 * 获取某项目下未删除的所有会议的基本信息（id，title，content，startTime,meetingRecord),如果这些信息为null则用''代替
 * ,按开始时间升序排列（时间越近排序越后）
 * 项目成员在另外一个函数 getMeetingMember
 * 一次最多获取50条
 */
function getMeeting(projId){

  var Meeting = Bmob.Object.extend('meeting')
  var meetingQuery = new Bmob.Query(Meeting)
  var meetingArr = []  //存储获取的会议的数组

  //获取某项目下的所有未删除的会议
  meetingQuery.equalTo('proj_id',projId)
  meetingQuery.equalTo('is_delete',false)
  meetingQuery.ascending('start_time')
  meetingQuery.limit(50)
  meetingQuery.find({
    success: function(results){
      //获取成功
      //取数据
      for(var i in results){
        var id = results[i].id
        var title = results[i].get('title')
        var content = results[i].get('content')
        var startTime = results[i].get('start_time')
        var meetingRecord = results[i].get('meeting_record') //会议记录
        var meeting
        meeting = {
          'id': id || '',
          'title': title || '',
          'content': content || '',
          'startTime': startTime || '',
          'meetingRecord': meetingRecord
        }
        meetingArr.push(meeting)  //存储会议
      }
      if (meetingArr != null && meetingArr.length > 0){
        //在这里setData
        console.log(meetingArr)





      }

    },
    error: function(error){
      //获取失败
      console.log("获取某项目下的所有未删除的会议失败!")
    }
  })
}

/**
 * @parameter projId 项目id，title会议标题，content 会议内容(可以为空）
 * ，start_time开始时间（最好让用户填好,方便后面排序和显示）
 * memberIds 添加的会议成员id 数组（可以为空），没有重复的值（这个功能没想到怎么做）
 * 创建会议
 * 内部调用添加会议成员的函数addCreateMeetingMember
 * 内部调用通知项目成员的函数addProjectNotification
 */
function createMeeting(projId, title, content, startTime, memberIds){

  var that = this
  var Meeting = Bmob.Object.extend('meeting')
  var meeting = new Meeting()
  
  //添加会议
  meeting.save({
    proj_id: projId,
    title: title,
    start_time: startTime,
    content: content,
    is_delete: false

  } ,{
    success: function(result){
      //添加会议成功
      console.log("提示用户添加会议成功！")
      //添加会议成员
      if(memberIds != null && memberIds.length > 0){
        that.addCreateMeetingMember(projId, result.id/*会议id*/, memberIds)
      }
      
      ///通知其他项目成员
      var _type = 4  //通知类型，会议通知
      that.addProjectNotification(projId, ADD_MEETING, _type, result.id/*创建的会议id*/)  //通知其他项目成员


    },
    error: function(result,error){
      //失败
      console.log("提示用户添加会议成功！")
    }
  })
}

/**
 * 这是创建会议时添加会议成员用的，创建会议已经通知了项目其他成员，所以这个添加会议成员函数将不会通知项目成员
 * 添加会议成员，此函数不会调用 通知项目成员的函数。请与addMeetingMember(会调用通知函数)区分开
 */
function addCreateMeetingMember(projId,meetingId, memberIds){

  var that = this
  var Meetingmember = Bmob.Object.extend('meeting_member')
  var meetingmemberArr = []

  if (memberIds != null && memberIds.length > 0) {
    for (var i in memberIds) {
      var memberId = memberIds[i]
      var user = Bmob.Object.createWithoutData("_User", memberId)
      var meetingmember = new Meetingmember()
      meetingmember.set('meeting_id', meetingId)
      meetingmember.set('user', user)
      meetingmemberArr.push(meetingmember)
    }

    if (meetingmemberArr != null && meetingmemberArr.length > 0) {
      Bmob.Object.saveAll(meetingmemberArr).then(function (meetingmemberArr) {
        //批量增加会议成员成功
        console.log("创建会议时增加会议成员成功!");

      },
        function (error) {
          // 异常处理
          console.log("创建会议时增加会议成员成功失败！", error);
        })
    }
  }
}
/**
 * @parameter meetingId会议id
 * 获取会议成员, 有userId ，userPic，nickName
 */
function getMeetingMember(meetingId){

  var Meetingmember = Bmob.Object.extend('meeting_member')
  var meetingmemberQuery = new Bmob.Query(Meetingmember)
  var meetingmemberArr = []


  //获取会议成员
  meetingmemberQuery.equalTo('meeting_id',meetingId)
  meetingmemberQuery.include('user')
  meetingmemberQuery.find({
    success: function(results){
      //成功
      for(var i in results){
        var member
        member = {
          'userId': results[i].attributes.user.objectId,
          'userPic': results[i].attributes.user.userPic,
          'nickName': results[i].attributes.user.nickName
        }
        meetingmemberArr.push(member)
      }

      if (meetingmemberArr != null && meetingmemberArr.length > 0){
        //在这里setData
        //meetingmemberArr 即是获取到的成员数据
        console.log('会议成员', meetingmemberArr)





      }
    },
    error: function(error){
      //失败
      console.log("获取会议成员失败！")
    }
  })
}
/**
 * @parameter projId项目id, meetingId 会议id, meetingRecord 新的会议记录
 * 修改会议记录，第一次添加会议记录也用这个函数。 
 * 没有一键删除会议记录的函数,如果要删除的话就等于清空记录内容。
 * 内部调用通知项目成员的函数addProjectNotification
 */
function modifyMeetingRecord(projId, meetingId, meetingRecord){

  var that = this
  var Meeting = Bmob.Object.extend('meeting')
  var meetingQuery = new Bmob.Query(Meeting)

  //修改会议记录
  meetingQuery.get(meetingId,{
    success: function(result){
      //成功
      result.set('meeting_record',meetingRecord)
      result.save()
      console.log("修改会议记录成功！")
      //添加记录操作
      var _type = 4  //通知类型，会议通知
      that.addProjectNotification(projId, MODIFY_MEETING_RECORD, _type, result.id/*创建的会议id*/)  //通知其他项目成员



    },
    error: function(error){
      //失败
      console.log("修改会议记录失败！")
    }
  })
}

/**
 * @parameter projId项目id,meetingId会议id,newStartTime新的会议开始时间
 * 修改会议开始时间
 * 内部调用通知项目成员的函数addProjectNotification
 */
function modifyMeetingStartTime(projId,meetingId,newStartTime){

  var that = this
  var Meeting = Bmob.Object.extend('meeting')
  var meetingQuery = new Bmob.Query(Meeting)

  //修改会议开始时间
  meetingQuery.get(meetingId, {
    success: function (result) {
      //成功
      result.set('start_time', newStartTime)
      result.save()
      console.log("修改会议开始时间成功！")
      //添加记录操作
      var _type = 4  //通知类型，会议通知
      that.addProjectNotification(projId, MODIFY_MEETING_START, _type, result.id/*创建的会议id*/)  //通知其他项目成员

    },
    error: function (error) {
      //失败
      console.log("修改会议开始时间失败！")
    }
  })
}

/**
 * @parameter projId项目id,meetingId会议id,newTitle新的会议标题
 * 修改会议标题
 * 内部调用通知项目成员的函数addProjectNotification
 */
function modifyMeetingTitle(projId, meetingId, newTitle) {

  var that = this
  var Meeting = Bmob.Object.extend('meeting')
  var meetingQuery = new Bmob.Query(Meeting)

  //修改会议标题
  meetingQuery.get(meetingId, {
    success: function (result) {
      //成功
      result.set('title', newTitle)
      result.save()
      console.log("修改会议标题成功！")
      //添加记录操作
      var _type = 4  //通知类型，会议通知
      that.addProjectNotification(projId, MODIFY_MEETING_TITLE, _type, result.id/*创建的会议id*/)  //通知其他项目成员

    },
    error: function (error) {
      //失败
      console.log("修改会议标题失败！")
    }
  })
}

/**
 * @parameter projId项目id,meetingId会议id,newContent 新的会议内容
 * 修改会议内容
 * 内部调用通知项目成员的函数addProjectNotification
 */
function modifyMeetingContent(projId, meetingId, newContent) {

  var that = this
  var Meeting = Bmob.Object.extend('meeting')
  var meetingQuery = new Bmob.Query(Meeting)

  //修改会议标题
  meetingQuery.get(meetingId, {
    success: function (result) {
      //成功
      result.set('content', newContent)
      result.save()
      console.log("修改会议内容成功！")
      //添加记录操作
      var _type = 4  //通知类型，会议通知
      that.addProjectNotification(projId, MODIFY_MEETING_CONTENT, _type, result.id/*创建的会议id*/)  //通知其他项目成员

    },
    error: function (error) {
      //失败
      console.log("修改会议内容失败！")
    }
  })
}

/**
 * parameter projId项目的id ，meetingId 会议id, memberIds 新添加的成员id数组
 * 非创建会议时添加会议成员，请与addCreateMeetingMember 区分开
 * 内部调用通知项目成员的函数addProjectNotification
 */
function addMeetingMember(projId, meetingId,memberIds){

  var that = this
  var Meetingmember = Bmob.Object.extend('meeting_member')
  var meetingmemberArr = []

  if(memberIds !=null && memberIds.length > 0){
    for(var i in memberIds){
      var memberId = memberIds[i]
      var user = Bmob.Object.createWithoutData("_User", memberId)
      var meetingmember = new Meetingmember()
      meetingmember.set('meeting_id',meetingId)
      meetingmember.set('user', user)
      meetingmemberArr.push(meetingmember)
    }

    if (meetingmemberArr != null && meetingmemberArr.length > 0){
      Bmob.Object.saveAll(meetingmemberArr).then(function (meetingmemberArr) {
        //批量增加会议成员成功
        console.log("批量增加会议成员成功!");
        //记录操作
        var _type = 4  //通知类型，会议通知
        that.addProjectNotification(projId, MODIFY_MEETING_MEMBER, _type, meetingId/*创建的会议id*/)  //通知其他项目成员

      },
        function (error) {
          // 异常处理
          console.log("批量增加会议成员成功失败！",error);
        })
    }
  }

}

/**
 * @parameter projId 项目id
 * 获取项目成员，用来添加会议成员用
 * 项目领导排在第一个
 */
function getProjectMember(projId){

  var ProjectMember = Bmob.Object.extend("proj_member")
  var memberQuery = new Bmob.Query(ProjectMember)
  var User = Bmob.Object.extend("_User")
  var userQuery = new Bmob.Query(User)

  var leader_id = "0"
  var memberId = [] //项目的所有成员id数组
  var userArr = [] //项目所有成员数组

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
    userQuery.select("objectId","nickName", "userPic")  //查询出用户基本信息，id ，昵称和头像
    userQuery.limit(50)
    userQuery.containedIn("objectId", memberId)

    userQuery.find({
      success: function (results) {
        console.log("共查询到项目成员 " + results.length + " 条记录");
        // 循环处理查询到的数据
        for (var i = 0; i < results.length; i++) {
          var object
          object = {
            'id':results[i].id,
            'nickName': results[i].nickName,
            'userPic': results[i].userPic
          }

          if (object.id == leader_id) {
            //将项目领导放在数组的第一个位置
            userArr.unshift(object)
          } else
            userArr.push(object)
        }
        //在这里设置setdata
        console.log(userArr)




      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
        //失败情况





      }
    })

  })
}

/**
 * @parameter projId 项目id，meetingId 会议的id
 * 删除某个会议
 * 内部调用通知项目成员的函数addProjectNotification
 */
function deleteOneMeeting(projId, meetingId){

  var that = this
  var Meeting = Bmob.Object.extend('meeting')
  var meetingQuery = new Bmob.Query(Meeting)

  //删除某个会议
  meetingQuery.get(meetingId,{
    success: function(result){
      result.set('is_delete',true)
      result.save()
      console.log("删除某个会议成功!")
      //添加记录
      var _type = 4  //通知类型，会议通知
      that.addProjectNotification(projId, DELETE_MEETING, _type, result.id/*创建的会议id*/)  //通知其他项目成员

    },
    error: function(error){
      //删除失败
      console.log("删除某个会议失败!",error)
    }
  })
}


/**
 * parameter projId项目的id ， memberIds 需要删除的成员id数组
 * 删除成员，目前提供的是删除多个成员的接口
 * 内部调用通知项目成员的函数addProjectNotification
 */
function deleteMeetingMember(projId, meetingId, memberIds) {

  var that = this
  var Meetingmember = Bmob.Object.extend('meeting_member')
  var meetingmemberQuery = new Bmob.Query(Meetingmember)

  if (memberIds != null && memberIds.length > 0) {
    meetingmemberQuery.containedIn('user',memberIds)
    //将查询出的全部删除
    meetingmemberQuery.destroyAll({
      success: function () {
        //删除成功
        console.log('删除会议成员成功！')
        //记录操作
        var _type = 4  //通知类型，会议通知
        that.addProjectNotification(projId, MODIFY_MEETING_MEMBER, _type, meetingId/*创建的会议id*/)  //通知其他项目成员
      },
      error: function (err) {
        // 删除失败
        console.log('删除会议成员失败！',err)
      }
    })
  }

}

/**
 * 获取某个会议的详情
 * meeting =
'id': result.id || '', //会议id
'title': result.get('title') || '',  //会议标题
'start_time': result.get('start_time') || '',  //会议开始时间
'content': result.get('content') || '',  //会议内容
'meetingRecord': result.get('meeting_record') || '' ,  //会议记录

 */
function getOneMeeting(meetingId){

  var Meeting = Bmob.Object.extend('meeting')
  var meetingQuery = new Bmob.Query(Meeting)

  //获取某个会议的详情
  meetingQuery.get(meetingId,{
    success: function(result){
      //成功
      var meeting
      meeting = {
        'id': result.id || '', //会议id
        'title': result.get('title') || '',  //会议标题
        'start_time': result.get('start_time') || '',  //会议开始时间
        'content': result.get('content') || '',  //会议内容
        'meetingRecord': result.get('meeting_record') || '' ,  //会议记录
      }
      //获取到的会议 meeting
      console.log(meeting)



    },
    error: function(error){
      //失败
      console.log('获取会议失败')

    }
  })
}
module.exports.createMeeting = createMeeting
module.exports.addProjectNotification = addProjectNotification
module.exports.getMeeting = getMeeting
module.exports.addCreateMeetingMember = addCreateMeetingMember
module.exports.getMeetingMember = getMeetingMember

