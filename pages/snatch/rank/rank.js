
Page({

  data: {
    rank_list:"" ,
    id:""
  },

  onPullDownRefresh: function () {
    this.http();
  },
  onLoad: function (r) {
    this.setData({
      id:r.id
    })
    this.http();
  },

  http: function () {
    var that = this;
    wx.request({
      url: "https://demo.lynnjy.cn/list",
      data: {
        id: that.data.id
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success: function (r) {
        wx.stopPullDownRefresh();
        if (r.data.errcode == 200) {
          that.setData({
            rank_list: r.data.grabsList,
            size:r.data.size,
            grabbedSize: r.data.grabbedSize,
            sender:r.data.sender,
            money:r.data.money
          })
        }
      },
      fail: function () {
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '出意外啦',
        })
      }
    })
  },
  // onUnload: function () {
  //   wx.switchTab({
  //     url: '/pages/snatch/snatch',
  //   })
  // },


})