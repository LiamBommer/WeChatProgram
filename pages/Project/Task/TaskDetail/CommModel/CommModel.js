// pages/Project/Task/TaskDetail/CommModel/CommModel.js
var Bmob = require('../../../../../utils/bmob.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选择判断
    exitComment: true,
    exitQuestion: false,
    exitLike: false,
    
    ModelIndex: "",//当前选择的模板
    //意见模板
    ModelComment: [
      // { index: 0, content: "模板1 - 微信设计中心已推出了一套网页标准控件库" },
      // { index: 1, content: "模板2 - 微信设计中心已推出了一套网页标准控件库" },
    ],
    //提问模板
    ModelQuestion: [
      // { index: 0, content: "模板1 - 微信设计中心已推出了一套网页标准控件库，包括 sketch设计控件库"},
      // { index: 1, content: "模板2 - 微信设计中心已推出了一套网页标准控件库，包括 sketch设计控件库"},
    ], 
    //点赞模板
    ModelLike: [
      // { index: 0, content: "模板1 - 微信设计中心已推出了一套网页标准控件库" },
      // { index: 1, content: "模板2 - 微信设计中心已推出了一套网页标准控件库" },
    ],
  },

  // 选择模板
  radioChange: function (e) {
    console.log("radioChange", e.detail.value)
    this.setData({
      ModelIndex: e.detail.value,
    });
  },

  //编辑模板
  ClickModel:function(e){
    var that = this
    var id = e.currentTarget.dataset.id//当前模板ID
    var index = e.currentTarget.dataset.index//当前模板下标
    var _type = e.currentTarget.dataset.type//当前模板的type
    wx.setStorageSync('CommModel-id', id)//设置沟通模板ID缓存
    if (_type == 1)//点击意见模板
    {
      wx.setStorageSync('CommModel-content', that.data.ModelComment[index].content)//设置模板内容缓存
    }
    if (_type == 2)//点击提问模板
    {
      wx.setStorageSync('CommModel-content', that.data.ModelQuestion[index].content)//设置模板内容缓存
    }
    if (_type == 3)//点击点赞模板
    {
      wx.setStorageSync('CommModel-content', that.data.ModelLike[index].content)//设置模板内容缓存
    }
  },

  // 发送模板
  SendModel: function () {
    var that = this;
    var index = that.data.ModelIndex;
    var content;

    var ModelComment = that.data.ModelComment;
    var ModelQuestion = that.data.ModelQuestion;
    var ModelLike = that.data.ModelLike;

    var exitComment = that.data.exitComment;
    var exitQuestion = that.data.exitQuestion;
    var exitLike = that.data.exitLike;
    
    if(index){//选择了模板
      if (exitComment) {//意见
        content = "提意见：\n" + ModelComment[index].content;
        wx.setStorage({
            key: "CommModel",
            data: content
        })
        that.setData({
          ModelIndex: "",
        });
      }
      if (exitQuestion) {//提问
        content = "提问：\n" + ModelQuestion[index].content;
        wx.setStorage({
            key: "CommModel",
            data: content
        })
        that.setData({
          ModelIndex: "",
        });
      }
      if (exitLike) {//点赞
        content = "点赞：\n" + ModelLike[index].content;
        wx.setStorage({
            key: "CommModel",
            data: content
        })
        that.setData({
          ModelIndex: "",
        });
      }
      wx.navigateBack({
        url: '../TaskDetail',
      })
    }
    else{//没有选择模板
      wx.showToast({
        title: '请选择一个模板',
        icon: 'none',
        duration: 1000,
      })
    }
  },

  // 删除模板
  DeleteModel: function () {
    var that = this;
    var userId = getApp().globalData.userId
    var index = that.data.ModelIndex;
    var ModelComment = that.data.ModelComment;
    var ModelQuestion = that.data.ModelQuestion;
    var ModelLike = that.data.ModelLike;

    var exitComment = that.data.exitComment;
    var exitQuestion = that.data.exitQuestion;
    var exitLike = that.data.exitLike;
    
    if (index != '') {//选择了模板
      wx.showModal({
        title: '提示',
        content: '是否删除该记录',
        success: function (res) {//删除记录
          if (res.confirm) {
            if (exitComment) {//意见
                that.deleteOneCommunicateModel(userId, ModelComment[index].id)
                ModelComment.splice(index, 1);
                that.setData({
                  ModelComment: ModelComment,
                  ModelIndex: "",
                });
            }
            if (exitQuestion) {//提问
              that.deleteOneCommunicateModel(userId, ModelQuestion[index].id)
              ModelQuestion.splice(index, 1);
              that.setData({
                ModelQuestion: ModelQuestion,
                ModelIndex: "",
              });
            }
            if (exitLike) {//点赞
              that.deleteOneCommunicateModel(userId, ModelLike[index].id)
                ModelLike.splice(index, 1);
                that.setData({
                  ModelLike: ModelLike,
                  ModelIndex: "",
                });
              }
          } 
          else if (res.cancel) {
          }
        }
      })
    }
    else {//没有选择模板
      wx.showToast({
        title: '请选择一个模板',
        icon: 'none',
        duration: 1000,
      })
    }

  },

  // 导航栏选择意见
  selectComment: function () {
    var that = this;
    that.setData({
      exitComment: true,
      exitQuestion: false,
      exitLike: false,
    });
  },

  // 导航栏选择提问
  selectQuestion: function () {
    var that = this;
    that.setData({
      exitComment: false,
      exitQuestion: true,
      exitLike: false,
    });
  },

  // 导航栏选择点赞
  selectLike: function () {
    var that = this;
    that.setData({
      exitComment: false,
      exitQuestion: false,
      exitLike: true,
    });
  },
  
  // 添加模板
  addModel: function (e) {
    var _type = parseInt(e.currentTarget.dataset.type);
    wx.setStorageSync("CommModelType", _type)
    wx.navigateTo({
      url: './addModel/addModel',
    })
  }, 

  // 编辑模板
  ModelDetail: function() {
    wx.navigateTo({
      url: './ModelDetail/ModelDetail',
    })
  },

  /**
   * @parameter userId 用户id ， _type模板类型 1 代表 ‘意见’，2 代表’提问‘， 3 代表’点赞‘
   * 获取到指定类型的模板数组 ，每个元素有（id模板id,content模板内容,type模板类型)
   * 根据用户id和模板类型查询出沟通模板的内容
   */
  getModel:function (userId, _type){
    var that = this
    var CommunicateMod = Bmob.Object.extend('communicate_mod')
    var communicatemodQuery = new Bmob.Query(CommunicateMod)
    var modelArr = []

    //根据用户id和模板类型查询出沟通模板的内容
    communicatemodQuery.equalTo('user_id', userId)
    communicatemodQuery.equalTo('type', _type)
    communicatemodQuery.find({
        success: function (results) {
          console.log("results", results)
        //成功
        for (var i in results) {
          var modelObject = {}
          modelObject = {
            'id': results[i].id,    //模板id
            'content': results[i].get('content'),  //模板内容
            'type': results[i].get('type')  //模板类型 ，1 代表 ‘意见’，2 代表’提问‘， 3 代表’点赞‘
          }
            modelArr.push(modelObject)
          }
        console.log("modelArr", modelArr)
          //在这里setData
        if (modelArr != ""){
          if (modelArr[0].type == 1)//意见沟通模板
            that.setData({
              ModelComment: modelArr,
            })
          if (modelArr[0].type == 2)//提问沟通模板
            that.setData({
              ModelQuestion: modelArr,
            })
          if (modelArr[0].type == 3)//点赞沟通模板
            that.setData({
              ModelLike: modelArr,
            })
        }
        wx.hideLoading()
        console.log("沟通模板:")
        console.log("ModelComment", that.data.ModelComment)
        console.log("ModelQuestion", that.data.ModelQuestion)
        console.log("ModelLike", that.data.ModelLike)
         
      },
      error: function (error) {
        //失败
        console.log('沟通模板获取失败：', error)
      }
    })
  },

  /**
 * @parameter userId 用户id ，modelId 模板id
 * 删除一个沟通模板
 */
  deleteOneCommunicateModel:function (userId, modelId){
    var that = this
    var CommunicateMod = Bmob.Object.extend('communicate_mod')
    var communicatemodQuery = new Bmob.Query(CommunicateMod)

    //删除一个沟通模板
    if(modelId != null && modelId != '') {
        communicatemodQuery.equalTo('user_id', userId)
        communicatemodQuery.equalTo('objectId', modelId)

      communicatemodQuery.destroyAll({
        success: function () {
          //删除成功
          console.log('删除沟通模板成功!')
        wx.showToast({
          title: '删除成功',
        })


        },
        error: function (err) {
          // 删除失败
          console.log('删除沟通模板失败!')

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
    var that = this
    var userId = getApp().globalData.userId//当前操作者ID
    console.log("onshow",userId)
    wx.showLoading({
      title: '正在加载',
    })
    that.getModel(userId, 1)//获取意见模板
    that.getModel(userId, 2)//获取提问模板
    that.getModel(userId, 3)//获取点赞模板
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