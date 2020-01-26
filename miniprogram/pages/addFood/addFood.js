Page({
  data: {
    array: [
      { id: 1, name: '蔬菜' },
      { id: 2, name: '荤菜' },
      { id: 3, name: '菌菇' },
    ],
    index: -1,
    date: '',
  },

  handleTypeChange(e) {
    this.setData({ index: e.detail.value });
  },

  handleDateChange(e) {
    this.setData({ date: e.detail.value });
  },

  formSubmit: function (e) {
    const { array } = this.data;
    const {
      type,
      price,
      date,
      location,
      ...restProps
    } = e.detail.value;
    const data = {
      ...restProps,
      price: [
        {
          value: parseFloat(price) * 100,
          location: location,
          date: date,
        }
      ],
      type: array[type].id
    }
    const db = wx.cloud.database()
    db.collection('foods').add({
      data,
      success: res => {
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  formReset: function () {
    console.log('form发生了reset事件')
  }
})