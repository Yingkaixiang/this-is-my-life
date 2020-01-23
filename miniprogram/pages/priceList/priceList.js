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