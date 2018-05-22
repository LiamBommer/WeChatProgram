//app.js
App({

  onLaunch: function () {

    //初始化bmob SDK
    const Bmob = require('./utils/bmob.js')
    Bmob.initialize("acb853b88395063829cae5f88c29fb82", "3b85938d52110714c4684edd13de39a4")

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录 mr.li 代码是Bmob封装好的接口
    //登录注册集合类，接口默认第一次注册，否则返回用户信息
    var user = new Bmob.User();//实例化
    wx.login({

      success: function (res) {
        user.loginWithWeapp(res.code).then(function (user) {
          var openid = user.get("authData").weapp.openid;
          //console.log(user, 'user', user.id, res);
          if (user.get("nickName")) {

            // 第二次登录，打印用户之前保存的昵称
            console.log(user.get("nickName"), '不是第一次登录');

            //更新openid
            wx.setStorageSync('openid', openid)
          } else {//注册成功的情况

            var u = Bmob.Object.extend("_User");
            var query = new Bmob.Query(u); 
            query.get(user.id, {
              success: function (result) {
                wx.setStorageSync('own', result.get("uid"));
              },
              error: function (result, error) {
                console.log("查询失败");
              }
            });


            //保存用户其他信息，比如昵称头像之类的
            wx.getUserInfo({
              success: function (result) {

                var userInfo = result.userInfo;
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;
                var gender = userInfo.gender;

                var u = Bmob.Object.extend("_User");
                var query = new Bmob.Query(u);
                // 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
                query.get(user.id, {
                  success: function (result) {
                    // 自动绑定之前的账号
                    result.set("nickName", nickName);
                    result.set("userPic", avatarUrl);
                    result.set("openid", openid);
                    //result.set("gender",gender);  //再添加数据就不能正常初始化了
                    result.save();

                  }
                });


              }
            });


          }

        }, function (err) {
          console.log(err, 'errr');
        });

      }
    });
    // user.auth()   //这行代码可以替换上面的wx.login

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

  },

  globalData: {
    userInfo: null,
    projectId:null
  }
})