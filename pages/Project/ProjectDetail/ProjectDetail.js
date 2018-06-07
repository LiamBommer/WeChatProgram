
var Bmob = require('../../../utils/bmob.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projId:'',//项目ID
    hiddenmodalput: true,//弹出项目描述模态框
    hiddenmodalputTitle: true,//弹出项目名称模态框
    SwitchChecked: "",//是否置顶
    title: "",//输入的项目名称
    content: "",//输入的项目描述
    project_name: '学长说系列分享活动',//项目名称
    project_desc: '邀请优秀的学长回校宣讲',//项目描述
    project_img:"/img/logo.png",
    icon_more: '/img/more.png',
    project_response: '',//项目归属人名

    //成员列表
    member:[
      {
        id:"",
        icon: '/img/member.png',
        name: '',
        checked: "",
      }
    ],
  },

 
  //点击按钮弹出指定的hiddenmodalput弹出框
  modalinputTitle: function () {
    this.setData({
      title: this.data.project_name, 
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
    var that = this
    var projId = that.data.projId
    var title = that.data.title

    if(title == "" || title.length == 0) {
      // 提示标题不可为空
      wx.showToast({
        title: '项目名称不见咯',
        icon: 'none',
        duration: 1500,
      })
      return;
    }

    // 显示loading
    wx.showLoading({
      title: '正在修改...',
    })
    // submit
    that.modifyProjectTitle(projId, title)
    that.setData({
      hiddenmodalputTitle: true,
      project_name: title,
    })
  },

  //项目名称
  ProjectTitle: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

//项目图片
  PictrueSelect: function (e) {
    var that = this
    var projId = that.data.projId
    that.modifyProjcetImg(projId)
  },

  //项目描述
  ProjectContent: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  //点击按钮弹出指定的hiddenmodalput弹出框
  modalinput: function () {
    var proj_desc = this.data.project_desc
    if(proj_desc == '点击添加项目描述') {
      proj_desc = ''
    }
    this.setData({
      content: proj_desc,
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
    var that = this
    var projId = that.data.projId
    var content = that.data.content
    var text_color = ""

    // 描述为空时设置内容与字体
    if (content == "" || content == 0) {
      content = '点击添加项目描述'
      text_color = '#888888'
    } else {
      text_color = 'black'
    }

    // 显示loading
    wx.showLoading({
      title: '正在修改...',
    })

    that.modifyProjectDescrep(projId, content)
    this.setData({
      hiddenmodalput: true,
      project_desc: content,
      text_color: text_color
    })
  },
 
  //项目描述
  ProjectContent: function(e) {
    this.setData({
      content: e.detail.value,
    })
  },

  //项目归属
  ProjectBelong: function () {
    var that = this
    wx.navigateTo({
      url: 'ProjectBelong/ProjectBelong'
    })
  },

  //项目成员
  showMemberList: function () {
    var that = this
    wx.setStorage({
      key: "ProjectDetail-memberList",
      data: that.data.member,
    })
    wx.navigateTo({
      url: 'memberList/memberList'
    })
  },

  //置顶项目
  switchChange:function(e){
    var that = this
    var projId = that.data.projId
    var switchChecked = e.detail.value
    if (switchChecked == true) {
      // 显示loading
      wx.showLoading({
        title: '正在星标...',
      })
      //置顶
      that.makeProjectFirst(projId, true)
    }
    if (switchChecked == false) {
      // 显示loading
      wx.showLoading({
        title: '正在取消星标...',
      })
      //取消置顶
      that.cancelProjectFirst(projId, false)
    }
  },

  //删除/退出项目
  DeleteProject: function () {
    var that = this
    wx.showModal({
      title: '删除项目',
      content: '确定要这么做吗？',
      success:function(res){
        if (res.confirm) {
          var projId = that.data.projId

          // 显示loading
          wx.showLoading({
            title: '正在退出...',
          })
          // submit
          that.deletePoject(projId)
          wx.removeStorageSync("ProjectDetail-memberList")
          wx.removeStorageSync("Project- id")
          
        } else if (res.cancel) {

        }
        
      },
    })
    
  },

  /**
  * @author mr.li
  * @parameter projId 项目id
  * @return 项目详情的object
  * （'project' ->object类型，
  *   'membersPics' ->object数组，每个object有 nickName 和 userPic）
  */
  getProjectDetail: function (projId) {
    var that = this
    var Project = Bmob.Object.extend("project")
    var projectQuery = new Bmob.Query(Project)
    // var Members = Bmob.Object.extend("proj_member")
    // var membersQuery = new Bmob.Query(Members)

    var detailObject = {}  //项目详情页面的所需信息
    //var memberPics = ProjectList.getProjectMembers(projId)   //调用函数获取成员数组（nickName，userPic），数组的第一个为项目领导人
    var memberPics = []

    var ProjectMember = Bmob.Object.extend("proj_member")
    var memberQuery = new Bmob.Query(ProjectMember)
    var User = Bmob.Object.extend("_User")
    var userQuery = new Bmob.Query(User)

    var leader_id = "0"
    var memberId = [] //项目的所有成员id数组
    var userArr = [] //项目所有成员数组

    //获取指定项目的所有成员id，50条
    memberQuery.equalTo("proj_id", projId)
    memberQuery.select("user_id", "is_leader")
    memberQuery.find().then(function (results) {
      //返回成功

      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        if (object.get("is_leader")) {
          //项目领导，放在数组的第一个
          console.log("获取项目领导id", object.get('user_id'));
          leader_id = object.get("user_id")
          memberId.unshift(leader_id)

        } else {
          console.log("获取项目成员id", object.get('user_id'));
          memberId.push(object.get("user_id"))  //将成员id添加到数组
        }
      }
    }).then(function (result) {

      //获取指定项目的所有成员,默认10条
      userQuery.select("nickName", "userPic")  //查询出用户的昵称和头像
      userQuery.limit(50)
      userQuery.containedIn("objectId", memberId)

      // userQuery.matchesKeyInQuery("objectId", "user_id", memberQuery)
      userQuery.find({
        success: function (results) {
          console.log("results", results)
          // 循环处理查询到的数据
          for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var object = {}
            object = {
              id: result.id,
              icon: result.attributes.userPic,
              name: result.attributes.nickName,
              checked: true,
            }
            if (result.id == leader_id) {
              //将项目领导放在数组的第一个位置
              userArr.unshift(object)
            } else
              userArr.push(object)
          }

          //在这里设置setdata
          console.log("项目成员", userArr)
          that.setData({
            member: userArr,
          })
          if (that.data.project_response == null || that.data.project_response == "") {
            that.setData({
              project_response: userArr[0].name,
            })
          }

          // 加载完成
          wx.hideLoading()

          //项目成员
          wx.setStorage({
            key: "ProjectDetail-memberList",
            data: that.data.member,
          })

        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
          //失败情况

        }
      })

    })

    //查询指定项目详情
    projectQuery.equalTo("objectId", projId)
    projectQuery.first({
      success: function (result) {
        detailObject = result
        console.log("项目详情", detailObject)
        //todo：在这里设置setdata
        var proj_desc = detailObject.attributes.desc
        var text_color = ""
        if(proj_desc == "" || proj_desc.length == 0 || proj_desc == '点击添加项目描述') {
          proj_desc = '点击添加项目描述'
          text_color = '#888888'
        }
        that.setData({
           project_img : detailObject.attributes.img_url,
           project_name: detailObject.attributes.name,
           project_desc: proj_desc,
           SwitchChecked: detailObject.attributes.is_first,
           text_color: text_color
        });

      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })

  },

  /**
   * 修改项目图片
   */
  modifyProjcetImg:function (projId){
    var that = this
    var Project = Bmob.Object.extend('project')
    var projectQuery = new Bmob.Query(Project)

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        if (tempFilePaths.length > 0) {
          var name = "1.jpg";//上传的图片的别名，建议可以用日期命名
          var file = new Bmob.File(name, tempFilePaths);
          file.save().then(function (res) {

            //res.url()是上传图片后的 url
            //console.log(res.url());
            //更改项目图片
            projectQuery.get(projId, {
              success: function (result) {
                result.set('img_url', res.url())
                result.save()
                console.log("modifyProjcetImg",result)

                // var tempFilePaths = result.tempFilePaths;
                // var content = tempFilePaths[0];
                that.setData({
                  project_img: result.attributes.img_url,
                });





              }
            })
          }, function (error) {
            console.log(error);
          })
        }

      }
    })
  },

  /**
 * @parameter projId项目id，newName 新的项目名
 * 修改项目名称
 */
  modifyProjectTitle:function (projId, newName){
    var Project = Bmob.Object.extend('project')
    var projectQuery = new Bmob.Query(Project)

  //修改项目名称
  projectQuery.get(projId, {
      success: function (result) {
        result.set("name", newName)  //修改项目名称
        result.save()
        //console.log("项目标题修改成功")
        wx.hideLoading()
        wx.showToast({
          title: '修改名称成功',
          icon: 'success',
          duration: 1000
        })
      },
      error: function (error) {
        //项目删除失败
      }
    })
  },

  /**
 * @parameter projId项目id，newDescrip 新的项目描述
 * 修改项目描述
 */
  modifyProjectDescrep:function (projId, newDescrip){
    var that = this
    var Project = Bmob.Object.extend('project')
    var projectQuery = new Bmob.Query(Project)

    //修改项目描述
    projectQuery.get(projId, {
      success: function (result) {
        result.set("desc", newDescrip)  //修改项目描述
        result.save()
        //console.log("项目描述修改成功")
        wx.hideLoading()
        wx.showToast({
          title: '修改描述成功',
          icon: 'success',
          duration: 1000
        })
      },
      error: function (error) {
        //项目删除失败
      }
    })
  },

  /**
   * 2018-05-22
   * @parameter 项目id ,isFirst 是否置顶项目，设置为true
   * 
   * 置顶项目
   */

  makeProjectFirst:function (projId, isFirst){
    var Project = Bmob.Object.extend("project")
    var projectQuery = new Bmob.Query(Project)

    projectQuery.get(projId, {
      success: function (result) {
        result.set("is_first", isFirst)
        result.save()
        //成功的情况
        console.log("设置成功")
        wx.hideLoading()
        wx.showToast({
          title: '设置成功',
          icon: 'success',
          duration: 1000
        })
      },
      error: function (object, error) {
        //失败的情况
        //console.log(error)
        wx.hideLoading()
        wx.showToast({
          title: '设置失败，请稍后再试',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },

/**
 * 2018-05-22
 * @parameter 项目id ,isFirst 是否置顶项目，设置为false
 * 
 * 取消置顶项目
 */
cancelProjectFirst:function (projId, isFirst) {
    var Project = Bmob.Object.extend("project")
    var projectQuery = new Bmob.Query(Project)

    projectQuery.get(projId, {
      success: function (result) {
        result.set("is_first", isFirst)
        result.save()
        //成功的情况
        wx.hideLoading()
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 1000
        })

      },
      error: function (object, error) {
        //失败的情况
        //console.log(error)
        wx.hideLoading()
        wx.showToast({
          title: '取消失败，请稍后再试',
          icon: 'success',
          duration: 1000
        })



      }
    })
  },
 
  /**
   * @parameter projId项目id 
   * 退出/解散项目
   * 利用了字段is_delete 来判断项目是否被删除。
   * 额，这个函数等我把你们的分支里面的某些project的函数添加了一行代码后
   * ，我告诉你们加的时候再加吧。么么哒。
   * 
   */
  deletePoject:function (projId){
  
    var Project = Bmob.Object.extend('project')
  var projectQuery = new Bmob.Query(Project)

  //将 project 表的 is_delete 字段修改为true
  projectQuery.get(projId, {
      success: function (result) {
        result.set("is_delete", true)  //删除项目。不可修复。
        result.save()
        //console.log("项目删除成功")
        wx.hideLoading()
        wx.navigateBack({
          url: '../Project'
        })
        wx.showToast({
          title: '退出项目成功',
          icon: 'success',
          duration: 1000
        })
      },
      error: function (error) {
        //项目删除失败
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

    // 等待加载完成后消失
    // getProjectDetail()
    wx.showLoading({
      title: '正在加载',
      mask: 'true'
    })

    var that = this
    //项目
    wx.getStorage({
      key: "Project-detail",
      success: function (res) {
        that.setData({
          projId: res.data.id,
        })
        that.getProjectDetail(res.data.id)
      },
    })
    var leaderName = wx.getStorageSync("ProjectBelong-memberName")
    that.setData({
      project_response: leaderName
    })
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
    wx.removeStorageSync("ProjectBelong-memberName")
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
