var app = getApp();
Page({
  data: {
    id: "",
    newUrl: ""
  },

  // 获取该红包的关键字
  onLoad: function (ref) {
    this.setData({
      id: ref.id
    })
    wx.showModal({
      title: '提示',
      content: '恭喜你已经抢到红包，只要上传一张照片，就可以拆开红包啦！听说爱笑的人运气都不会太差哦~'      
    })
  },
  

  //上传图片   
  chooseimage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // 获取文件路径
        var filePath = res.tempFilePaths[0];
        var index = filePath.lastIndexOf(".");
        var type = filePath.substring(index);
        // 获取文件名
        var fileName = "" + parseInt(Math.random() * Math.pow(2, 32)) + type;
        // 文件上传cos
        that.upload(filePath, fileName)
      }
    })
  },

  upload: function (filePath, fileName) {
    var that = this;
    // 签名
    var signature = "+trgRLSGHaM48mTMYYVPkEOQSu1hPTEyNTU0Nzg4NDQmaz1BS0lEU3M2OTFqV3VJVmFVQ3BtZnQwd2dGZHc3N3dhM3JRTDYmZT0xNTIwODQxOTIyJnQ9MTUxMzA2NTkyMiZyPTE2NjE4MjE3OTAmZj0vMTI1NTQ3ODg0NC9waWN0dXJlJmI9cGljdHVyZQ==";
    var DIR_NAME = '/img/'
    var cosUrl = "https://gz.file.myqcloud.com/files/v2/1255478844/picture" + DIR_NAME
    // 头部带上签名，上传文件至COS

    wx.showLoading({
      title: '正在获取照片',
      mask: true,
    })
    wx.uploadFile({
      url: cosUrl + fileName,
      filePath: filePath,
      header: {
        'Authorization': signature
      },
      name: 'filecontent',
      formData: {
        op: 'upload'
      },
      success: function (uploadRes) {
        var url = JSON.parse(uploadRes.data).data.source_url;
        
        wx.hideLoading();

        wx.showToast({
          title: '读取成功',
          duration: 2000
        })
        that.setData({
          newUrl: url
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '读取失败',
          duration:2000,
          icon:"loading"
        })
        console.log('e:', e)
      },
      complete:function(){
      }
    })
  },

  submit: function () {
    var that=this;
    if(this.data.newUrl==""){
      wx.showModal({
        title: '提示',
        content: '请先上传一张你的照片',
      })
      return false;
    }
    // 向服务器发送图片地址和红包关键字
    wx.showLoading({
      title: '拆红包中',
      mask: true,
    })
    wx.request({
      url: "https://demo.lynnjy.cn/receive/open",
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      data: {
        nickname: app.globalData.userInfo.nickName,
        imgUrl: app.globalData.userInfo.avatarUrl,
        picUrl: this.data.newUrl,
        grabMoney: null,
        id: this.data.id,
        happy: null,
        beauty: null
      },
      success: function (r) {
        if (r.data.errcode == 200) {
          //先将对象转换为json字符串然后到下个页面将json字符串，再转化为对象
          r.data.result.id=that.data.id;
          var str=JSON.stringify(r.data.result);
          wx.hideLoading();
          wx.navigateTo({
            url:"show/show?result="+str
          })
        }
        if (r.data.errcode == 500) {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '无法识别你的照片，重新上传一张吧'
          })

        }
      },
      fail: function (e) {
        wx.showToast({
          title: "出意外啦",
          icon:"loading"
        })
        console.log(e);
      }
    })
  }


})