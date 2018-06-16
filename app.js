//app.js
//初始化bmob SDK
const Bmob = require('./utils/bmob.js')
Bmob.initialize("acb853b88395063829cae5f88c29fb82", "3b85938d52110714c4684edd13de39a4")
var user = new Bmob.User();//实例化


App({

  //登录函数
  // 登录 mr.li 代码是Bmob封装好的接口
  //登录注册集合类，接口默认第一次注册，否则返回用户信息
  userLogin:function(options){
    var that = this
    wx.login({
      success: function (res) {
        user.loginWithWeapp(res.code).then(function (user) {        
          if (user.get("nickName")) {
            // 第二次登录，打印用户之前保存的昵称
            console.log(user.get("nickName"), '不是第一次登录');
            that.globalData.userId = user.id
            that.globalData.nickName = user.get("nickName")
            that.globalData.userPic = user.get("userPic")

            //判断是否被邀请加入某个项目
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
            }else{
              if(!options.query.isShared)         //如果是分享页面，则不做跳转
                wx.reLaunch({
                 url: '/pages/Project/Project',
                })
            } 
          } 
          else {
            // 没有授权，弹出授权页面
            // //判断是否被邀请加入某个项目
            if (options.query.projectid) {
              var projectId = options.query.projectid
              console.log('要加入的项目ID： ' + projectId)
              // 数据存入缓存，再跳转页面
              wx.setStorage({
                key: 'Project-share-id',
                data: projectId,
                success: function () {
                  //成功，这个会在GetUserInfo.js页面处理
                }
              })
            } 
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
    
    // var that = this
    // that.userLogin(options)
    // user.auth()   //这行代码可以替换上面的wx.login

  },

  onShow:function(options){
    var that = this
    that.userLogin(options)
    
  },

  globalData: {
    userInfo: null,
    userId:null,
    nickName:null,
    userPic:null,
  }
})
