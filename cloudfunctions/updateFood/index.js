// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await db.collection('foods')
  .doc(event.current.data.id).update({
    data: {
      price: _.push(event.params)
    },
  });
  return event.params;
}