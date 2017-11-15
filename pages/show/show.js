// show.js
var WxParse = require('../wxParse/wxParse.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_name: '',
    shop_content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserInfo();
    var _this = this;
    wx.request({
      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=shop.store',
      data: { id: options.id },
      success: function (res) {
        var data = res.data.result;
        console.log(data);
        if (res.statusCode == 200) {
          console.log(res);
          if (res.data.status === 1) {
            _this.setData({
              shop_name: data.storename,
              shop_content: WxParse.wxParse('article_content', 'html', data.desc, _this, 5)
            });
          }
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