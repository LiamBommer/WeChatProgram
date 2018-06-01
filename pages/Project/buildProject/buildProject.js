// pages/buildProject/buildProject.js
var Bmob = require('../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  //获取项目名称，项目描述
  BuildProject: function (e) {
    var that = this;
    var title, desc;
    title = e.detail.value.title;
    desc = e.detail.value.desc;
    that.buildProject(title, desc);
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
      is_first:false,
      is_delete:false,
      img_url: "http://bmob-cdn-19251.b0.upaiyun.com/2018/05/18/ff3371c040fe5b6380011eb3cb1770a4.png"  //涛哥找的默认图片
    }, {
        success: function (result) {
          console.log("创建项目成功！", result)
          that.addLeader(result.id, leader_id)  //当用户创建项目时，添加项目成员表，并指定为领导人


          wx.showToast({
            title: '成功',
            icon: 'success',
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
 * @author mr.li
 * @parameter projId项目id，userId用户id
 * 当用户创建项目时，添加项目成员表，并指定为领导人
 */
  addLeader:function (projId, userId){
    var ProjectMember = Bmob.Object.extend("proj_member")
  var projMember = new ProjectMember();

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