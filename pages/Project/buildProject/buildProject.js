// pages/buildProject/buildProject.js
var Bmob = require('../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //数据分析
    userName: '',
    userId: '',
    title: '',//项目名
    desc:'' ,//项目描述

    btn_disabled: false,
    btn_loading: false,

    submitNum : 0, //点击完成的次数

  },

  //点击创建项目
  BuildProject: function (e) {

    var that = this;
    var submitNum = that.data.submitNum; //点击完成的次数
    if (submitNum == 0) {//点击完成次数限制在一次

      that.setData({//数据分析
        title: e.detail.value.title,//项目名
        desc: e.detail.value.desc,//项目描述
        userName: getApp().globalData.nickName,
        userId: getApp().globalData.userId,
      })

      var title, desc;
      title = e.detail.value.title;
      desc = e.detail.value.desc;

      if (title == "" || title.length == 0) {
        // 提示标题不可为空
        wx.showToast({
          title: '项目名称不见咯',
          icon: 'none',
          duration: 1500,
        })
        return;
      }

      // 按钮设置disabled为真，不可再次点击
      // this.setData({
      //   btn_disabled: true,
      //   btn_loading: true,
      // })

      // 显示loading
      wx.showLoading({
        title: '正在创建...',
      })


      // submit 
      that.buildProject(title, desc);
      
      that.setData({
        submitNum: submitNum + 1
      })

      console.log("1111111111111111", that.data.title, that.data.desc, that.data.userName, that.data.userId,)
      
    }
    
  },

  /**
   * 2018-05-18
   * @author mr.li
   * @paramete title项目名字，desc项目描述
   * 
   * 创建项目，保存数据到数据库。
   * 可以获取到创建项目成功后的项目id
   * 
   * 成功返回创建项目的id， 失败返回"fail"
   * 内部调用 createTaskList ,为用户新创建的项目创建一个默认的任务列表
   */
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
      // console.log("当前用户:", leader_id, leader_name)
    }
    project.save({
      name: title,
      desc: desc,
      leader_id: leader_id,
      leader_name: leader_name,
      is_first:false,
      is_delete:false,
      img_url: "http://bmob-cdn-19251.b0.upaiyun.com/2018/06/15/3c7ae525400a2aa0800a0780b701069c.jpg"  //涛哥找的默认图片
    }, {
        success: function (result) {
          console.log("创建项目成功！", result)
          that.addLeader(result.id, leader_id)  //当用户创建项目时，添加项目成员表，并指定为领导人
          that.createTaskList(result.id/*项目id*/,"未完成"/*默认的任务列表名称*/)  //为用户创建默认的任务列表“未完成”
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
  addLeader:function (projId, userId){
    var ProjectMember = Bmob.Object.extend("proj_member")
    var projMember = new ProjectMember();
    var project = Bmob.Object.createWithoutData('project',projId)

    projMember.set('proj_id',projId)
    projMember.set('user_id',userId)
    projMember.set('is_leader',true)
    projMember.set('is_first',false)
    projMember.set('project',project)
    

    projMember.save(null, {
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
  
  },

  
})