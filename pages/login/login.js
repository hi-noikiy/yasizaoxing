// login.js
var app, phpcode;
Page({
  /**
   * 所有的事件列表
   */
  show: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    });
  },
  isMobile: function (value) {
    return value != null && /^1[34578]\d{9}$/.test(value);
  },
  isEmpty: function (value) {
    return value != null && value === '';
  },
  getCode: function (e) {
    var count = 60;
    var mobile = this.data.mobileValue;
    var that = this;
    //判断手机号是否为空或者不合法
    if (this.isEmpty(mobile)) {
      this.show('手机号码不能为空!');
      return;
    }
    if (!this.isMobile(mobile)) {
      this.show('手机号码格式不正确!');
      return;
    }
    wx.request({
      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=shop.sms',
      data: { mobile: mobile },
      success: function(res) {
        if (res.statusCode == 200) {
          if (res.data.status === 1) {
            that.show('短信发送成功!');
            console.log(res);
            phpcode = res.data.result.code;
            that.setData({
              buttonText: '已发送（' + count + '）',
              isDisabled: true
            });
            var time = setInterval(function () {
              count--;
              if (count <= 0) {
                clearInterval(time);
                this.setData({
                  buttonText: '获取验证码',
                  isDisabled: false
                });
              } else {
                this.setData({
                  buttonText: '已发送（' + count + '）',
                  isDisabled: true
                });
              }
            }.bind(that), 1000);
          }else {
            that.show('短信发送失败!');
          }
        }
      }
    })
  },
  mobileInput: function (e) {
    this.setData({
      mobileValue: e.detail.value
    });
  },
  codeInput: function (e) {
    this.setData({
      codeValue: e.detail.value
    });
  },
  /**
   * 登录按钮回调
   */
  login: function (e) {
    var _this = this;
    if (this.isEmpty(this.data.mobileValue)) {
      this.show('手机号码不能为空!');
      return;
    }
    if (this.isEmpty(this.data.codeValue)) {
      this.show('验证码不能为空!');
      return;
    }
    if (!this.isMobile(this.data.mobileValue)) {
      this.show('手机号码格式不正确!');
      return;
    }
    wx.showLoading({
      title: '登录中..'
    })
    var mobile = this.data.mobileValue;
    var code = this.data.codeValue;
    wx.request({
      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.login',
      data: { openid: app.globalData.openid, mobile: mobile },
      success: (res)=>{
        wx.hideLoading();
        if (res.statusCode == 200) {
          var data = res.data.result;
          console.log(phpcode);
          if (res.data.status === 1 && code === phpcode) {
            wx.showToast({
              title: '登录成功'
            })
            wx.setStorageSync('islogin', true);
            getApp().globalData.islogin = true;
            setTimeout(function() {
              wx.redirectTo({
                url: '../map/map'
              })
            }, 1000)
          }else {
            var msg = data.message ?data.message:'验证码不正确';
            _this.show(msg);
          }
        }
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    buttonText: '获取验证码',
    isDisabled: false,
    mobileValue: '',
    codeValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app = getApp();
    app.getUserInfo();
    wx.getStorage({
      key: 'codedown',
      success: function(res) {
        var c = res.data;
        var time = setInterval(function (){
          c--;
        }, 1000);
        if (res.data<0) {
          clearInterval(time);
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})