import { formatTime, fixIOSTimestamp } from '../../utils/date.js';

Page({
  data: {
    name: '',
    type: -1,
    show: false,
    dateShow: false,
    columns: [
      { text: "蔬菜", id: "1" },
      { text: "荤菜", id: "2" },
      { text: "菌菇", id: "3" },
    ],
    error: {},
    currentDate: new Date().getTime(),
    date: '',
    loading: false,
  },

  handleNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  handleTypeTap() {
    this.setData({ show: true });
  },

  handleTypeConfirm(e) {
    this.setData({
      type: e.detail.index,
      show: false
    });
    this.closePopup();
  },

  handleTypeCancel() {
    this.closePopup();
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
  closePopup() {
    this.setData({ show: false });
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
      const { type, columns } = this.data;
      const params = {
        name: data.name,
        type: columns[type].id,
        price: [
          {
            value: this.fenToHundred(data.price),
            date: fixIOSTimestamp(data.date),
            location: data.location
          }
        ],
      }
      
      this.create(params);
    } else {
      this.setData({ loading: false });
    }
  },

  handleFormReset() { },

  create(data) {
    console.dir(data);
    const db = wx.cloud.database()
    db.collection('foods').add({
      data,
      success: res => {
        wx.showToast({ title: '新增记录成功' });
        this.setData({ loading: false });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        });
        this.setData({ loading: false });
      },
    });
  },

  // 分转百位
  fenToHundred(value) {
    return Math.round(parseFloat(value) * 100);
  },
})