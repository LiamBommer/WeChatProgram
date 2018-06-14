
const Bmob = require('../../utils/bmob.js')
var communicate_sample_model1 = '你可以在任务评论里发送沟通模板'
var user = new Bmob.User();//实例化
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 点击按钮，确认获取信息
   */
  confirm: function (res) {
    var that = this
    var userInfo = res.detail.userInfo
    
    var nickName = userInfo.nickName
    var avatarUrl = userInfo.avatarUrl
    var userId = getApp().globalData.userId
    console.log('userInfo', userInfo,'userId',userId)
    getApp().globalData.nickName = nickName
    getApp().globalData.userPic = avatarUrl

    // 存进数据库
    var u = Bmob.Object.extend("_User");
    var query = new Bmob.Query(u);
    // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
    query.get(userId, {
      success: function (result) {
        // 自动绑定之前的账号
        result.set("nickName", nickName);
        result.set("userPic", avatarUrl);
        //result.set("gender",gender);  //再添加数据就不能正常初始化了
        result.save();
        //为用户添加空的项目“我的项目”
        that.buildProject('我的项目','空项目')
        //为用户添加实例沟通模板
        that.addCommunicateModel(userId,1,communicate_sample_model1)
        
        //跳转到项目主页
        console.log(wx.getStorageSync('Project-share-id'))
        if (wx.getStorageSync('Project-share-id') == ''|| wx.getStorageSync('Project-share-id') == undefined) {
          wx.reLaunch({
            url: '../Project/Project',
          })
        } else {
          console.log('跳转到joinproject')
          wx.redirectTo({
            url: '../Project/JoinProject/JoinProject',
          })
        }

      }
    })

  },
  //创建项目
  buildProject: function (title, desc) {
    var that = this;
    var Project = Bmob.Object.extend("project")
    var project = new Project()
    var currentUser = Bmob.User.current()
    var leader_id = "0"
    var leader_name = "0"

    if (currentUser) {
      leader_id = currentUser.id
      leader_name = getApp().globalData.nickName
      console.log("当前用户:", leader_id, leader_name)
    }
    console.log(title)
    console.log(desc)
    project.save({
      name: title,
      desc: desc,
      leader_id: leader_id,
      leader_name: leader_name,
      is_first: false,
      is_delete: false,
      img_url: "http://bmob-cdn-19251.b0.upaiyun.com/2018/05/18/ff3371c040fe5b6380011eb3cb1770a4.png"  //涛哥找的默认图片
    }, {
        success: function (result) {
          console.log("创建项目成功！", result)
          that.addLeader(result.id, leader_id)  //当用户创建项目时，添加项目成员表，并指定为领导人
          that.createTaskList(result.id/*项目id*/, "未完成"/*默认的任务列表名称*/)  //为用户创建默认的任务列表“未完成”
        },
        error: function (result, error) {
          console.log("创建项目失败！", error)
          //失败情况

        }
      })

  },
  /**
* 2018-05-19
* @author mr.li
* @parameter projId 项目id，title任务看板名称
* 创建任务看板
*内部调用了创建任务
*/
  createTaskList: function (projId, title) {
    var that = this
    var TaskList = Bmob.Object.extend("task_list")
    var taskList = new TaskList()

    //添加任务看板
    taskList.save({
      title: title,
      proj_id: projId,
      is_delete: false
    }, {
        success: function (result) {
          //添加任务看板成功
          return result
        },
        error: function (result, error) {
          //添加任务看板失败
          console.log("添加任务看板失败!")
        }
      })
  },
  /**
 * @author mr.li
 * @parameter projId项目id，userId用户id
 * 当用户创建项目时，添加项目成员表，并指定为领导人
 */
  addLeader: function (projId, userId) {
    var ProjectMember = Bmob.Object.extend("proj_member")
    var projMember = new ProjectMember();
    var project = Bmob.Object.createWithoutData('project', projId)

    projMember.save({
      proj_id: projId,
      user_id: userId,
      is_leader: true,
      project:project,
      is_first:false
    }, {
        success: function (result) {
          //添加成功
          console.log("保存项目领导成功！")
        },
        error: function (result, error) {
          //添加失败
          console.log("保存项目领导失败！", error)
        }
      })
  },
  /**
  * @parameter userId用户id， _type模板类型 1 代表 ‘意见’，2 代表’提问‘， 3 代表’点赞‘, modelContent 模板内容
  * 根据用户id 和 模板类型添加模板
  */
  addCommunicateModel: function (userId, _type, modelContent) {
    var that = this
    var CommunicateMod = Bmob.Object.extend('communicate_mod')
    var communicatemod = new CommunicateMod()

    //添加指定类型的沟通模板
    if (modelContent != null && modelContent != '') {
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

  },
  /**
     * 2018-05-19
     * @author mr.li
     * @parameter
     *  projId
        listId任务看板id，
        title任务名称
        memberId任务负责人ID
        endTime截止时间
     * 创建任务，成员id数组里面只需要id，endTime 的数据类型是string
     */
  createTask: function (projId, listId, title, memberId, endTime) {
    var that = this
    var Task = Bmob.Object.extend("task")
    var task = new Task()

    var leaderId = memberId  //删除并返回第一个任务负责人的id
    var leader = Bmob.Object.createWithoutData("_User", leaderId)  //负责人,存储到数据库

    //添加任务
    task.save({
      list_id: listId,
      title: title,
      leader: leader,  // 数据库关联，用id可以关联一个user
      end_time: endTime,
      is_finish: false,
      has_sub: false,
      is_delete: false,
      sub_num: 0,
      proj_id: projId
    }, {
        success: function (result) {
          //添加成功
          //添加任务成员信息
          that.addTaskMembers(projId, result.id/*任务id*/, leaderId, [])
        },
        error: function (result, error) {
          //添加失败
          console.log("添加任务失败！", error)
          //提示用户添加失败
        }
      })

  },

  /**
* 2018-05-19
* @author mr.li
* @parameter taskId任务id，leaderId任务负责人id，memberIds除负责人以外的任务成员id数组
* 为任务添加成员
*/
  addTaskMembers: function (projId, taskId, leaderId, memberIds) {
    var that = this
    var TaskMember = Bmob.Object.extend("task_member")

    var leader = Bmob.Object.createWithoutData("_User", leaderId)
    var task = Bmob.Object.createWithoutData("task", taskId)
    var project = Bmob.Object.createWithoutData("project", projId)
    var memberObjects = []

    var taskMember = new TaskMember()
    taskMember.set('task_id', taskId)
    taskMember.set('user_id', leader)
    taskMember.set('task', task)
    taskMember.set('project', project)
    memberObjects.push(taskMember)  //添加任务负责人id

    for (var i = 0; i < memberIds.length; i++) {
      var taskMember = new TaskMember()
      var member = Bmob.Object.createWithoutData("_User", memberIds[i])
      var task = Bmob.Object.createWithoutData("task", taskId)
      taskMember.set('task_id', taskId)
      taskMember.set('user_id', member)
      taskMember.set('task', task)
      taskMember.set('project', project)
      memberObjects.push(taskMember)  //添加任务成员
    }

    //批量添加任务成员
    Bmob.Object.saveAll(memberObjects).then(function (memberObjects) {
      // 成功
    },
      function (error) {
        // 异常处理
        console.log("批量添加任务成员失败！", error)
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // // 取当前用户id
    // var currentUserId = Bmob.User.current().id
    // this.setData({
    //   currentUserId: currentUserId
    // })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})