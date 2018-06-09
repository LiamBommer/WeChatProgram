// pages/Mine/Idea/Idea.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 获取我的点子,最多50条
   * 'id':     //点子id
      'content':  //点子内容
      'createdAt':  //点子发表时间
      'projectName':   //项目名字
   */
  getMyidea: function (userId){

    var Idea = Bmob.Object.extend('idea')
    var ideaQuery = new Bmob.Query(Idea)
    var ideaArr = []  //获取的点子数组

    ideaQuery.equalTo('user',userId)
    ideaQuery.include('project')
    ideaQuery.find({
      success: function(results){
        //成功
        for(var i in results){
          var ideaObject = {}
          ideaObject = {
            'id': results[i].id,    //点子id
            'content': results[i].get('content'),  //点子内容
            'createdAt': results[i].createdAt,   //点子发表时间
            'projectName': results[i].get('project').name  //项目名字
          }
          ideaArr.push(ideaObject)
        }
        if (ideaArr != null && ideaArr.length > 0){
          //在这里setData
          console.log('获取点子列表成功',ideaArr)
        }
      },
      error: function(error){
        //失败
        console.log('获取点子列表失败!',error)
      }
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
