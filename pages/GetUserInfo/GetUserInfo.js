
const Bmob = require('../../utils/bmob.js')
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
    // wx.login({
    //    success: function (res) {
    //      user.loginWithWeapp(res.code).then(function (user) {
    //         var openid = user.get("authData").weapp.openid;
    //         // 查看是否授权
            
    //      })
    //    }
    // })
    var userInfo = res.detail.userInfo
    var nickName = userInfo.nickName
    var avatarUrl = userInfo.avatarUrl
    var userId = getApp().globalData.userId
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
        //that.buildProject('我的项目','空项目')
        //为用户添加实例沟通模板
        //that.addCommunicateModel(user.id,1,communicate_sample_model1)

        //跳转到项目主页
        console.log(wx.getStorageSync('Project-share-id'))
        if (wx.getStorageSync('Project-share-id') == '') {
          wx.switchTab({
            url: '../Project/Project',
          })
        } else {
          wx.redirectTo({
            url: '../Project/JoinProject/JoinProject',
          })
        }

      }
    })
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //           success: function (res) {
    //           console.log('获取用户信息成功', res.userInfo)
              

    //           // wx.navigateBack({
    //           //   delta: 1
    //           // })
    //         }
    //       })
    //     }
    //   }

    // })

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
      leader_name = currentUser.get("nickName")
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
          wx.hideLoading()
          wx.showToast({
            title: '成功创建项目',
            icon: 'success',
            duration: 1000
          });
          wx.switchTab({
            url: '../Project',
          })
        },
        error: function (result, error) {
          wx.showToast({
            title: '失败',
            icon: 'none',
          });
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
      is_leader: true
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
            wx.showToast({
              title: '添加模板成功',
            })
            wx.navigateBack()


          },
          error: function (result, error) {
            //失败
            console.log('添加指定类型的沟通模板失败:', error)
          }
        })
    }

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