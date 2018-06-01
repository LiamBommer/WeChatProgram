// pages/Project/Task/TaskDetail/CommModel/CommModel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选择判断
    exitComment: true,
    exitQuestion: false,
    exitLike: false,
    //当前选择的模板
    ModelIndex:"",
    //意见模板
    ModelComment: [
      { index: 0, value: "我认为你说得很有道理，但我有一个小小的建议" },
      { index: 1, value: "哇，说的很好，但我还想补充一下" },
    ],
    //提问模板
    ModelQuestion: [
      { index: 0, value: "这么布置我觉得很好，但我有一个小小的疑问"},
      { index: 1, value: "不好意思，不是很懂你的意思，可以再说一遍吗？"},
    ], 
    //点赞模板
    ModelLike: [
      { index: 0, value: "哇，说得太好啦，惊呆了" },
      { index: 1, value: "我觉得你说得很对，我表示认同" },
    ],
  },

  // 选择模板
  radioChange: function (e) {
    this.setData({
      ModelIndex: e.detail.value,
    });
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
        content = "提意见：\n" + ModelComment[index].value;
        wx.setStorage({
            key: "CommModel",
            data: content
        })
        that.setData({
          ModelIndex: "",
        });
      }
      if (exitQuestion) {//提问
        content = "提问：\n" + ModelQuestion[index].value;
        wx.setStorage({
            key: "CommModel",
            data: content
        })
        that.setData({
          ModelIndex: "",
        });
      }
      if (exitLike) {//点赞
        content = "点赞：\n" + ModelLike[index].value;
        wx.setStorage({
            key: "CommModel",
            data: content
        })
        that.setData({
          ModelIndex: "",
        });
      }
      wx.navigateTo({
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
    var index = that.data.ModelIndex;
    var ModelComment = that.data.ModelComment;
    var ModelQuestion = that.data.ModelQuestion;
    var ModelLike = that.data.ModelLike;

    var exitComment = that.data.exitComment;
    var exitQuestion = that.data.exitQuestion;
    var exitLike = that.data.exitLike;
    
    if (index) {//选择了模板
      wx.showModal({
        title: '提示',
        content: '是否删除该记录',
        success: function (res) {//删除记录
          if (res.confirm) {
            if (exitComment) {//意见
              ModelComment.splice(index,1);
                that.setData({
                  ModelComment: ModelComment,
                  ModelIndex: "",
                });
            }
            if (exitQuestion) {//提问
              ModelQuestion.splice(index, 1);
              that.setData({
                ModelQuestion: ModelQuestion,
                ModelIndex: "",
              });
            }
            if (exitLike) {//点赞
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
  addModel: function () {
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
    var content = wx.getStorageSync("ModelDetail-content")
    console.log(content)
    // that.setData({
    //   "ModelComment[0].value": content
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