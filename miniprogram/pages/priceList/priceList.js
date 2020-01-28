import { fenToYuan } from '../../utils/money.js';

Page({
  data: {
    value: "",
    rawList: [],
    list: [],
    active: "0",
    mapping: {
      "0": "全部",
      "1": "蔬菜",
      "2": "荤菜",
      "3": "菌菇"
    },
    tag: {
      "1": "success",
      "2": "warning",
      "3": "primary"
    }
  },

  onLoad: function (options) {
    this.getList();
  },

  onPullDownRefresh() {
    this.getList();
  },

  format(list) {
    const { mapping, tag } = this.data;
    return list.map((item) => {
      const data = {
        id: item._id,
        name: item.name,
        type: mapping[item.type],
        price: fenToYuan(item.price[0].value),
        tag: tag[item.type],
      }
      return data;
    });
  },

  getList() {
    const db = wx.cloud.database();
    db.collection('foods').where({}).orderBy('date', 'desc').get({
      success: res => {
        const list = this.format(res.data);
        this.setData({ rawList: list.map((item) => item), list });
        wx.stopPullDownRefresh();//停止当前页面下拉刷新。
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        wx.stopPullDownRefresh();//停止当前页面下拉刷新。
      }
    })
  },

  onChange(e) {
    const value = e.detail;
    this.setData({ value });
    
    const result = this.data.rawList.filter((item) => {
      return item.name.indexOf(value) !== -1;
    });

    this.setData({ list: result, active: 0 });
  },

  handleTabClick(e) {
    const { rawList } = this.data;
    if (e.detail.index === 0) {
      this.setData({ list: rawList });
    } else if (e.detail.index === 1) {
      const result = rawList.filter((item) => item.type === '蔬菜');
      this.setData({ list: result });
    } else if (e.detail.index === 2) {
      const result = rawList.filter((item) => item.type === '荤菜');
      this.setData({ list: result });
    } else if (e.detail.index === 3) {
      const result = rawList.filter((item) => item.type === '菌菇');
      this.setData({ list: result });
    }
  },

  handleCellClick(e) {
    const { item } = e.currentTarget.dataset;
    // const db = wx.cloud.database();
    // db.collection('foods').where({ _id: item.id }).get({
    //   success: function (res) {
    //     // 输出 [{ "title": "The Catcher in the Rye", ... }]
    //     console.log(res)
    //   }
    // })
    wx.navigateTo({
      url: '/pages/chart/chart',
      success(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: item })
      }
    })
  }
})