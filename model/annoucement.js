// model/annoucement.js
var Bmob = require('../utils/bmob.js')

/**
 *2018-05-18
 *@author mr.li
 *@return 所有项目的数组
 *获取用户的所有项目,默认10条
 * 
 */
function getAnnoucements(projId){
  var Annoucement = Bmob.Object.extend("annoucement")
  var annoucementQuery = new Bmob.Query(Annoucement)

  var annoucementArr = []  //所有公告数组

  //查询出此项目中的所有公告，默认10条
  annoucementQuery.equalTo("proj_id",projId)
  annoucementQuery.find({
    success: function (results) {
      console.log("共查询到公告 " + results.length + " 条记录");
      // 循环处理查询到的数据
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        annoucementArr.push(object)
      }
    },
    error: function (error) {
      console.log("查询失败: " + error.code + " " + error.message);
    }
  })

  return annoucementArr
}

module.exports.getAnnoucements = getAnnoucements