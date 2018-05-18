// model/buildProject.js
var Bmob = require('../utils/bmob.js')

/**
 * 2018-05-18
 * @author mr.li
 * @paramete title项目名字，desc项目描述，type项目类型
 * 创建项目，保存数据到数据库。
 * 可以获取到创建项目成功后的项目id
 */
function buildProject(title,desc,type){
  var Project = Bmob.Object.extend("project")
  var project = new Project()
  var currentUser = Bmob.User.current()
  var leader_id = "0"
  var leader_name = "0"

  if(currentUser){
    leader_id = currentUser.id
    leader_name = currentUser.get("nickName")
    console.log("当前用户:",leader_id,leader_name)
  }
  project.save({
    name: title,
    desc: desc,
    type: type,
    leader_id: leader_id,
    leader_name: leader_name,
    is_first: 0,
    img_url: "http://bmob-cdn-19251.b0.upaiyun.com/2018/05/18/ff3371c040fe5b6380011eb3cb1770a4.png"  //涛哥找的默认图片
  }, {
      success: function (result) {
        console("创建项目成功！",result.id)
      },
      error: function (result, error) {
        console("创建项目失败！", error)
      }
    })
}

module.exports.buildProject = buildProject