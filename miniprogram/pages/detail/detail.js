import { formatTime, fixIOSTimestamp } from '../../utils/date.js';
import { fenToYuan } from '../../utils/money.js';
import wxCharts from './wxCharts.js';

Page({
  data: {
    dateShow: false,
    error: {},
    currentDate: new Date().getTime(),
    date: '',
    loading: false,
    current: null
  },

  onReady() {
    let windowWidth = 320;
    try {
      let res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      // do something when get system info failed
    }

    const { current } = this.data;
    const db = wx.cloud.database();
    db.collection('foods').where({
      _id: current.data.id
    }).get({
      success: res => {
        const date = res.data[0].price.map(item => {
          const d = new Date(item.date);
          return `${d.getMonth() + 1}-${d.getDate()}`
        });

        const price = res.data[0].price.map(item => item.value / 100)
        
        new wxCharts({
          canvasId: 'lineCanvas',
          type: 'line',
          categories: date,
          series: [{
            name: '价格',
            data: price,
            format: function (val) {
              return val.toFixed(2) + '元';
            }
          }],
          yAxis: {
            title: '价格(元)',
            format: function (val) {
              return val.toFixed(2);
            },
            min: 0
          },
          width: windowWidth - 20,
          height: 200
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    });
  },

  onLoad: function (options) {
    const that = this;
    const eventChannel = that.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({ current: data })
    })
  },

  handleDateTap() {
    this.setData({ dateShow: true })
  },

  handleDateConfirm(e) {
    this.setData({ date: formatTime(e.detail) });
    this.closeDatePopup();
  },

  handleDateCancel() {
    this.closeDatePopup();
  },

  // 关闭弹框
  closeDatePopup() {
    this.setData({ dateShow: false });
  },

  handleFormSubmit(e) {
    this.setData({ loading: true });
    const data = e.detail.value;

    const valid = Object.keys(data).every((key) => {
      const value = data[key];
      if (!value) {
        this.setData({
          [`error.${key}`]: '此选项不能为空'
        });
        return false;
      } else {
        this.setData({
          [`error.${key}`]: ''
        });
        return true;
      }
    });

    if (valid) {
      const params = {
        value: this.fenToHundred(data.price),
        date: fixIOSTimestamp(data.date),
        location: data.location
      }
      this.create(params);
    } else {
      this.setData({ loading: false });
    }
  },

  handleFormReset() { },

  create(params) {
    const { current } = this.data;

    wx.cloud.callFunction({
      name: 'updateFood',
      data: {
        current,
        params,
      },
      success: res => {
        wx.showToast({ title: '新增价格成功' });
        this.setData({ loading: false });
      },
      fail: err => {
        wx.showToast({ title: '新增价格失败' });
        this.setData({ loading: false });
      }
    })
  },

  // 分转百位
  fenToHundred(value) {
    return Math.round(parseFloat(value) * 100);
  },
})