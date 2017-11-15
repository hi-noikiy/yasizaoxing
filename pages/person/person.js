// person.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo;
        var nickName = userInfo.nickName;
        var avatarUrl = userInfo.avatarUrl;
        _this.setData({
          nickName: nickName,
          avatarUrl: avatarUrl
        });
      }
    })
    wx.request({
      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.info',
      data: { openid: app.globalData.openid },
      success: (res)=>{
        console.log(res.data);
        if (res.data.status === 1) {
          _this.setData({
            mobile: res.data.result.mobile
        });
        }
      }
    })
  },

  exit: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录?',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('islogin', false);
          getApp().globalData.islogin = false;
          wx.showToast({
            title: '退出成功'
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../map/map'
            })
          }, 1000)
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