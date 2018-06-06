// pages/test/test.js
//测试model的接口

var test = require('../../model/taskDetail.js')
var testBuild = require('../../model/buildProject.js')

function testbuildProject() {

  var title = "testBuildProject"
  var desc = "测试新建项目"
  var type = 1

  buildProjectModel.buildProject(title, desc, type)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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

     console.log("开始测试")
     //test.deleteProjectMember("05b1b947d7", ["5b2cad79f6"])
    // // var r = test.getProjectList()
    // test.receiveChatContent()
    // // test.chat("789","987","这是内容")
    // wx.request({
    //   url: 'https://ssub1yxe.qcloud.la/weapp/TestMysql/show', //仅为示例，并非真实的接口地址

    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })
   // test.createTaskList("3d3525ec0f","PKtaskList")
    //test.createTask("3cdcdef9cf","晚上加鸡腿",["3976149b70"],"2018-05-27 20:00:00")
    //test.getProjectMembers("463161c767")
    //test.getTaskLists("463161c767")
    //test.getTasks("3cdcdef9cf")
    //test.createAnnouncement("3d3525ec0f","hei","mr.li测试公告题目","mr.li测试公告内容",true)
   // test.getAnnouncements("3d3525ec0f")
    //test.getAnnouncementDetail("5f4eb84956")
    //test.getReadAnnounce("5f4eb84956")
    //test.letMeSee("5b2cad79f6","52037db54b")
    //test.deleteAnnouncement("52037db54b")
    //test.getTaskMember("cf34f6be67","123")
    //test.addNotiTime("cf34f6be67","Mr.Li")
    //test.createSubTask("bcb7155f39", "mrli测试子任务","46afed01fb")
    //test.getSubtasks("bcb7155f39")
   // test.addTaskRecord("bcb7155f39","Mr.Li","mrli在测试record")
    //test.getTaskRecord("bcb7155f39")
    //test.getTaskLists("3d3525ec0f")
     //test.makeProjectFirst("3d3525ec0f",true)
     //test.cancelProjectFirst("3d3525ec0f", false)
     //test.transferProject("05b1b947d7", "Mr.Li", "46afed01fb","5b2cad79f6")   
     //test.addProjectNotification('3d3525ec0f','test',1,'213')
     //test.addTaskNotification('	81c2ae2e31','ecf39929e8','测试')
     //test.createSchedule("3d3525ec0f", "mr.li测试", "2018-06-03", "2018-07-01",["58ec3a7f5e"])
     //test.destroyTaskRecord()
     //test.getSchedules("3d3525ec0f")
     //test.addRelatedTask("3d3525ec0f", "73e8e1b1c0", ["bcb7155f39"])
     //test.getProjectList()
     test.taskMemberDelete("8b90c25951", ["5e2b90f2ce","46afed01fb"],"测试")
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