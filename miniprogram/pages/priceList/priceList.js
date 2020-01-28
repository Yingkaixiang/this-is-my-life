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
    const that = this;
    const { mapping, tag } = this.data;
    console.dir(list);
    return list.map((item) => {
      const data = {
        id: item._id,
        name: item.name,
        type: mapping[item.type],
        price: fenToYuan(item.price[item.price.length - 1].value),
        tag: tag[item.type],
        color: that.checkPriceChange(item.price),
      }
      console.dir(data);
      return data;
    });
  },

  checkPriceChange(list) {
    const a = list[list.length - 1] ? list[list.length - 1].value : 0;
    const b = list[list.length - 2] ? list[list.length - 2].value : 0;
    if (b === 0) return;
    const res = a - b;
    if (res > 0) {
      return 'red'
    } else if (res < 0) {
      return 'blue'
    }
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
    wx.navigateTo({
      url: '/pages/detail/detail',
      success(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: item })
      }
    })
  },

  handleClick(e) {
    if (e.detail === 'right') {
      const id = e.currentTarget.dataset.item.id;
      const that = this;

      const db = wx.cloud.database();
      db.collection('foods').doc(id).remove({
        success: function (res) {
          wx.showToast({
            title: '删除成功',
          });
          that.getList();
        },
        fail(err) {
          wx.showToast({
            icon: "none",
            title: '不能删除别人的数据哦~',
          })
        }
      })
    } else {
      this.handleCellClick(e);
    }
  }
})