//app.js
//初始化bmob SDK
const Bmob = require('./utils/bmob.js')
Bmob.initialize("acb853b88395063829cae5f88c29fb82", "3b85938d52110714c4684edd13de39a4")
var user = new Bmob.User();//实例化
var communicate_sample_model1= '你可以在任务评论里发送沟通模板'

App({

  //登录函数
  // 登录 mr.li 代码是Bmob封装好的接口
  //登录注册集合类，接口默认第一次注册，否则返回用户信息
  userLogin:function(options){
    var that = this
    wx.login({
      success: function (res) {
        user.loginWithWeapp(res.code).then(function (user) {
          var openid = user.get("authData").weapp.openid;
          
          if (user.get("nickName")) {

            // 第二次登录，打印用户之前保存的昵称
            console.log(user.get("nickName"), '不是第一次登录');

            that.globalData.userId = user.id
            that.globalData.nickName = user.get("nickName")
            that.globalData.userPic = user.get("userPic")
            if (options.query.projectid) {
              var projectId = options.query.projectid
              console.log('要加入的项目ID： ' + projectId)
              // 数据存入缓存，再跳转页面
              wx.showLoading({
                title: '正在处理...',
                mask: 'true'
              })
              wx.setStorage({
                key: 'Project-share-id',
                data: projectId,
                success: function () {
                  wx.hideLoading()
                  // 跳转页面
                  wx.navigateTo({
                    url: '/pages/Project/JoinProject/JoinProject',
                  })
                }
              })
            } 
          } 
          else {
            // 没有授权，弹出授权页面
            that.globalData.userId = user.id
            
            wx.redirectTo({
              url: '../GetUserInfo/GetUserInfo',
            })

          }

          // else {

          //   //注册成功的情况
          //   var u = Bmob.Object.extend("_User");
          //   var query = new Bmob.Query(u);
          //   query.get(user.id, {
          //     success: function (result) {
          //       wx.setStorageSync('own', result.get("uid"));
          //       //将userId，存储到缓存中
          //       wx.setStorageSync('userId', user.id)
          //     },
          //     error: function (result, error) {
          //       console.log("查询失败");
          //     }
          //   });


          //   //保存用户其他信息，比如昵称头像之类的
          //   wx.getSetting({
          //     success: res => {
          //       if (res.authSetting['scope.userInfo']) {
          //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          //         wx.getUserInfo({
          //           success: res => {
          //             var userInfo = res.userInfo;
          //             var nickName = userInfo.nickName;
          //             var avatarUrl = userInfo.avatarUrl;
          //             var gender = userInfo.gender;
          //             that.globalData.userId = user.id
          //             that.globalData.nickName = user.get("nickName")
          //             that.globalData.userPic = user.get("userPic")
          //             console.log(that.globalData.userId)

          //             var u = Bmob.Object.extend("_User");
          //             var query = new Bmob.Query(u);
          //             // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
          //             query.get(user.id, {
          //               success: function (result) {
          //                 // 自动绑定之前的账号
          //                 result.set("nickName", nickName);
          //                 result.set("userPic", avatarUrl);
          //                 result.set("openid", openid);
          //                 //result.set("gender",gender);  //再添加数据就不能正常初始化了
          //                 result.save();

          //               }
          //             })
          //             //为用户添加空的项目“我的项目”
          //             //that.buildProject('我的项目','空项目')
          //             //为用户添加实例沟通模板
          //             //that.addCommunicateModel(user.id,1,communicate_sample_model1)
                      
          //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //             // 所以此处加入 callback 以防止这种情况
          //             if (that.userInfoReadyCallback) {
          //               that.userInfoReadyCallback(res)
          //             }
          //           }
          //         })
          //       }
                
          //     }
              
          //   })
          // }

        }, function (err) {
          console.log(err, 'errr');
        });
      }
    });
  },

  onLaunch: function (options) {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var that = this
    that.userLogin(options)

    // user.auth()   //这行代码可以替换上面的wx.login

  },

  onShow:function(options){
    console.log(options)
    if (options.query.projectid) {
      console.log("判断是否是被邀请加入项目。", Bmob.User.current().id)
      var projectId = options.query.projectid
      console.log('要加入的项目ID： ' + projectId)

      // 数据存入缓存，再跳转页面
      wx.showLoading({
        title: '正在处理...',
        mask: 'true'
      })
      wx.setStorage({
        key: 'Project-share-id',
        data: projectId,
        success: function () {
          wx.hideLoading()
          // 跳转页面
          wx.navigateTo({
            url: '/pages/Project/JoinProject/JoinProject',
          })
        }
      })

    } 
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
    var project = Bmob.Object.createWithoutData('project',projId)

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

  globalData: {
    userInfo: null,
    userId:null,
    nickName:null,
    userPic:null,
  }
})
