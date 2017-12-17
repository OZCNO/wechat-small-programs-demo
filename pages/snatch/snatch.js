var app = getApp();
Page({
  data: {
    postList: "",
    currentId: ""
  },
  onPullDownRefresh: function () {
    this.http();
  },

  onShow: function () {
    this.http();
  },

  //抢红包
  open: function (e) {
    var id = e.target.dataset.postId == undefined ? e.currentTarget.dataset.postId : e.target.dataset.postId
    id = this.data.postList[id].packID
    this.setData({
      currentId: id,
    })
    var that = this;
    // 向服务器传递参数，判断是否还可以抢红包
    wx.request({
      url: "https://demo.lynnjy.cn/receive/get",
      header: {
        "Content-Type": "application/json"
      },
      data: {
        nickname: app.globalData.userInfo.nickName,
        imgUrl: app.globalData.userInfo.avatarUrl,
        id: this.data.currentId,
        grabMoney: null,
        happy: null,
        beauty: null
      },
      method: "POST",
      success: function (r) {
        //红包已经没有 或者 抢过
        if (r.data.errcode == 500) {
          that.pity(r.data.errmsg);
          return false;
        }
        //还有红包，进入open.js页面,并且传送id值
        if (r.data.errcode == 200) {
          wx.navigateTo({
            url: 'open/open?id=' + that.data.currentId,
          })
        }
      }
    })
  },

  http: function () {
    var that = this;
    wx.request({
      url: "https://demo.lynnjy.cn/packList",
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success: function (r) {
        if (r.data.errcode == 200) {
          wx.stopPullDownRefresh();
          that.setData({
            postList: r.data.result
          })
        }
        if (r.data.errcode == 500) {
          //没有红包
          wx.stopPullDownRefresh();
          that.setData({
            postList: ""
          })
          wx.showModal({
            title: '提示',
            content: r.data.errmsg,
            success:function(r){
              if(r.confirm){
                wx.switchTab({
                  url: '../give/give',
                })
              }
            }
          })
        }
      },
      fail: function () {
        wx.stopPullDownRefresh();
        wx.showToast({
          title: '网络连接失败',
          icon: "loading",
          duration: 3000
        })
      }
    })
  },

  pity: function (r) {
    var that = this;
    if (r == 501) {
      wx.showModal({
        title: '提示',
        content: '这个红包你已经抢过啦',
        confirmText: "看看结果",
        cancelText: "继续抢",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: 'rank/rank?id=' + that.data.currentId,
            })
          }
          else {
            that.http();
          }
        }
      })
    }
    if (r == 502) {
      wx.showModal({
        title: '提示',
        content: '这个红包已经抢光啦！',
        confirmText: "看看结果",
        cancelText: "继续抢",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: 'rank/rank?id=' + that.data.currentId,
            })
          }
          else {
            that.http();
          }
        }
      })

    }
  }
})