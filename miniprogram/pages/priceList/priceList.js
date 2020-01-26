import data from './data.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    list: data,
    active: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('foods').where({
      // _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          list: res.data
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
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

  onChange(e) {
    const value = e.detail;
    this.setData({ value });
    
    const result = data.filter((item) => {
      return item.name.indexOf(value) !== -1;
    });

    this.setData({ list: result, active: 0 });
  },

  onSearch() {
    if (this.data.value) {
      console.log(this.data.value);
    }
  },

  handleTabClick(e) {
    if (e.detail.index === 0) {
      this.setData({ list: data });
    } else if (e.detail.index === 1) {
      const result = data.filter((item) => item.type === 'meats');
      this.setData({ list: result });
    } else if (e.detail.index === 2) {
      const result = data.filter((item) => item.type === 'vegetables');
      this.setData({ list: result });
    }
  },

  handleCellClick() {
    const db = wx.cloud.database();
    console.dir(db);
    db.collection('food').where({ name: "土豆" }).get({
      success: function (res) {
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        console.log(res)
      }
    })
    // wx.navigateTo({
    //   url: '/pages/chart/chart',
    // })
  }
})