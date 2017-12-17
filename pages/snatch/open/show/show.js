Page({
  data: {
    res: "",
    id:""
  },
  // 根据魅力值确定moods值
  onLoad: function (r) {
    var res=JSON.parse(r.result);
    this.setData({id:res.id});
    res.sex=res.sex=="male"?"男":"女";
    this.setData({
      res:res,
    })
  },
  onUnload: function () {
    wx.switchTab({
      url: '../snatch',
    })
  },

  look_ranking: function (res) {
    // 传红包关键字   
    wx.navigateTo({
      url: '../../rank/rank?id='+this.data.id
    })
  }
})