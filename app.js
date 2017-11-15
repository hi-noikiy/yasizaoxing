//app.js
App({
  globalData: {
    appid: 'wxa8230fdcbe5ac8d0',
    secret: '25e5cb45985585deb075c590e47864f0',
    islogin: false
  },
  data: {
    nickName: '',
    avatarUrl: '',
    openid: ''
  },
  //获取登录状态公共方法
  getLogin: function () {
    var that = this;
    var islogin = this.globalData.islogin;
    if (!islogin) {
      return;
    }
    console.log(that.globalData.openid);
    wx.request({
      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.info',
      data: { openid: that.globalData.openid },
      success: function (res) {
        if (res.data.status == 1 && res.data.result.mobile !== '') {
          that.globalData.islogin = true;
        }
      }
    })
  },
  getUserInfo: function () {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (info) {
          wx.getUserInfo({
            success: function (res) {
              var data = JSON.parse(res.rawData);
              that.globalData.nickName = data.nickName;
              that.globalData.avatarUrl = data.avatarUrl;
              if (info.code) {
                console.log(info.code);
                var d = that.globalData;
                var l = 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.openid';
                wx.request({
                  url: l,
                  data: {
                    code: info.code
                  },
                  success: function (res) {
                    that.globalData.openid = res.data.result.openid;
                    console.log(res.data.result.openid);
                    that.getLogin();
                    var params = {
                      openid: that.globalData.openid,
                      nickname: that.globalData.nickName,
                      avatar: that.globalData.avatarUrl,
                      lat: that.globalData.lat,
                      lon: that.globalData.lon
                    }
                    wx.request({
                      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.insert',
                      data: params
                    })
                  }
                });
              }
            }
          })
        }
      });
    }
  },
  onLaunch: function () {
    var that = this;
    wx.getLocation({
      success: function (res) {
        that.globalData.lat = res.latitude;
        that.globalData.lon = res.longitude;
        that.getUserInfo();
      }
    })
  },
})