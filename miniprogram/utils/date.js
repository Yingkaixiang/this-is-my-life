const formatTime = date => {
  var date = new Date(date);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':')
}

function fixIOSTimestamp(time) {
  var iosTime = time.replace(/-/g, '/');//解决ios端无法识别
  return Date.parse(iosTime);
}

module.exports = {
  formatTime: formatTime,
  fixIOSTimestamp
}