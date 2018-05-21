Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,//弹出项目描述模态框
    hiddenmodalputTitle: true,//弹出项目描述模态框
    SwitchChecked: true,//是否置顶
    
    icon_more: '/img/more.png',
    icon_member: '/img/member.png',
    project_name: '项目名称',
    project_desc: '鲨鱼派对致力于开发基于微信小程序的团队协作应用。',
    project_type: '社团组织',
    project_response: '大佬涛',
  },

  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinputTitle: function () {
    this.setData({
      hiddenmodalputTitle: false
    })
  },
  //取消按钮  
  cancelTitle: function () {
    this.setData({
      hiddenmodalputTitle: true,
    });
  },
  //确认  
  confirmTitle: function () {
    this.setData({
      hiddenmodalputTitle: true
    })
  }, 

  
  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinput: function () {
    this.setData({
      hiddenmodalput: false
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  }, 

  //项目归属
  ProjectBelong :function() {
    wx.navigateTo({
      url: 'ProjectBelong/ProjectBelong'
    })
  },

  //项目成员
  showMemberList: function() {
    wx.navigateTo({
      url: 'memberList/memberList'
    })
  },

  //删除/退出项目
  DeleteProject: function () {
    wx.navigateBack({
      url: '../Project'
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
