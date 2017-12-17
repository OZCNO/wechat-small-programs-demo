const app = getApp();
Page({
  data: {
    money: "",
    number: "",
    msg: "",
    showMoney: "￥0.00",
    tip: "",
    money_check: false,
    number_check: false,
    check: false
  },
  http: function () {
    var that = this;
    wx.showLoading({
      title: '发红包中',
      mask: true,
    })
    wx.request({
      url: "https://demo.lynnjy.cn/send",
      header: {
        "Content-Type": "application/json"
      },
      method: "POST",
      data: {
        money: this.data.money,
        size: this.data.number,
        wishes: this.data.msg,
        sender: app.globalData.userInfo.nickName,
        imgUrl: app.globalData.userInfo.avatarUrl
      },
      // 200
      success: function (res) {
        //发红包成功
        //errmsg,errcode,result
        
        if (res.data.errcode == 200) {
          wx.hideLoading();
          wx.showToast({
            title: "发送成功",
            icon: 'success',
            duration: 500
          })
          //置空
          that.setData({
            money: "",
            number: "",
            msg: "",
            showMoney: "￥0.00"
          })
          wx.switchTab({
            url: '../snatch/snatch',
          })
        }
        //发送失败
        else {
          wx.showToast({
            title: "发送失败",
            icon: 'loading',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: "网络连接失败",
          icon: 'loading',
          duration: 1000
        })

      }
    })
  },

  //验证并且处理总金额
  checkMoney: function (e) {
    //四舍五入保留小数后2位
    var money = parseFloat(e.detail.value).toFixed(2);
    //空
    if (e.detail.value == "") {
      this.setData({
        tip: "总金额不能为空",
        money: "",
        showMoney: "￥0.00",
        money_check: false,
      })
    }
    //NAN时
    else if (isNaN(money)) {
      this.setData({
        tip: "总金额输入不正确，请重新输入",
        money: "",
        showMoney: "￥0.00",
        money_check: false,
      })
    }
    else if (money * 100 == 0) {
      this.setData({
        tip: "总金额不能为0，请重新输入",
        money: "",
        showMoney: "￥0.00",
        money_check: false,
      })
    }
    else {      
      //小于0时
      if (money < 0) money *= (-1);
      if(money>100000){
        money = 100000;
      }
      this.setData({
        money: money,
        tip: "",
        showMoney: "￥" + money,
        money_check: true,
      })
    }
  },

  //验证并且处理红包个数
  checkNumber: function (e) {
    //取整
    var number = parseInt(e.detail.value);
    //空
    if (e.detail.value == "") {
      this.setData({
        tip: "红包个数不能为空",
        number:"",
        money_check: false,
      })      
    }
    //NAN时
    else if (isNaN(number)) {
      this.setData({
        tip: "红包个数输入不正确，请重新输入",
        number: "",
        number_check: false,
      })
    }
    else {
      //小于0时
      if (number < 0) number *= (-1);
      if(number==0) number=1;
      if(number>1000){
        number=1000;
      }
      this.setData({
        tip: "",
        number: number,
        number_check: true,
      })
    }
  },

  //计算每个红包的数额是否满足要求
  checkAverage: function (money, number, that) {
    // if (money / number > 200) {
    //   that.setData({
    //     tip: "单个红包不能超过200元",
    //     check: false
    //   })
    // }
    // else 
    if (money / number < 0.01) {
      that.setData({
        tip: "单个红包不能小于0.01元",
        check: false
      })
    }
    else {
      that.setData({
        tip: "",
        check: true
      })
    }
  },

  //表单提交
  formSubmit: function (e) {
    //独立数据不符合时
    if (!this.data.money_check) {
      this.setData({
        tip: "总金额不能为空"
      })
      return false
    }
    else if (!this.data.number_check) {
      this.setData({
        tip: "红包个数不能为空"
      })
      return false
    }
    else {
      //每个红包的数额是否满足要求
      this.checkAverage(this.data.money, this.data.number, this)
      if (!this.data.check) return false;

      var val = e.detail.value;
      var that = this;
      wx.showModal({
        title: '确认信息',
        content: '您将发出' + val.number + "个开心红包,总金额为" + val.t_money,
        success: function (r) {
          //确定发送红包
          if (r.confirm) {
            if (val.msg == "") {
              that.setData({
                msg : "爱笑的人运气都不会太差"
              })
            }
            else {
              that.setData({
                msg:val.msg
              })
            }
            // form表单向服务器传递数据
            that.http();
          }
        },
        // 未弹出框
        fail: function () {
          wx.showModal({
            title: '提示',
            content: '发红包失败，再发一次吧',
            showCancel: false,
            confirmText: "知道了",
          })
        }
      })
    }
  }
})