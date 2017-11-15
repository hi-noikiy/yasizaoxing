// history.js
var cardlist = [], userlist = [], page1 = 1, page2 = 1, islodding=false, iscom = false;
var app = getApp();
Page({
  historyTap: function (e) {
    var _id = e.currentTarget.dataset.id;
    this.setData({
      selected: _id
    });
  },
  /**
   * 页面的初始数据
   */
  data: {
    selected: 0
  },
  /**
			 * 将日期格式化成指定格式的字符串
			 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
			 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
			 * @returns 返回格式化后的日期字符串
			 */
  formatDate: function (date, fmt) {
    date = date == undefined ? new Date() : date;
    date = typeof date == 'number' ? new Date(date) : date;
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
    var obj = {
      'y': date.getFullYear(), // 年份，注意必须用getFullYear
      'M': date.getMonth() + 1, // 月份，注意是从0-11
      'd': date.getDate(), // 日期
      'q': Math.floor((date.getMonth() + 3) / 3), // 季度
      'w': date.getDay(), // 星期，注意是0-6
      'H': date.getHours(), // 24小时制
      'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
      'm': date.getMinutes(), // 分钟
      's': date.getSeconds(), // 秒
      'S': date.getMilliseconds() // 毫秒
    };
    var week = ['天', '一', '二', '三', '四', '五', '六'];
    for (var i in obj) {
      fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
        var val = obj[i] + '';
        if (i == 'w') return (m.length > 2 ? '星期' : '周') + week[val];
        for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
        return m.length == 1 ? val : val.substring(val.length - m.length);
      });
    }
    return fmt;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserInfo();
    userlist = [];
    page2 = 1;
    cardlist = [];
    page1 = 1;
  },
  scroll: function() {
    console.log(this.data.selected);
    if (!islodding) {
      islodding = true;
      if (this.data.selected === 0){
        this.getBuylist();
      }else {
        this.getUserlist();
      }
    }
    
    else this.getUserlist();
  },

  getBuylist: function() {
    
    var _this = this;
    var openid = getApp().globalData.openid;
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=order.pay.pay1',
      data: { openid: openid, page: page1 },
      success: (res) => {
        wx.hideLoading();
        page1++;
        islodding = false;
        if (res.statusCode == 200) {
          var data = res.data.result;
          for (var key in data) {
            if (key !== 'url') {
              let time = parseInt(data[key].createtime);
              data[key].createtime = _this.formatDate(new Date(time * 1000), 'yyyy-MM-dd HH:mm');
              cardlist.push(data[key]);
            }
          }
          _this.setData({
            hisList: cardlist
          });
        }
      }
    })
  },

  getUserlist: function() {
    var openid = getApp().globalData.openid;
    var _this = this;
    wx.showLoading({
      title: '加载中'
    })
    console.log(page2);
    wx.request({
      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.purchasehistory',
      data: { openid: openid, page: page2 },
      success: (res) => {
        wx.hideLoading();
        islodding = false;
        page2++;
        if (res.statusCode == 200) {
          var data = res.data.result;
          for (var key in data) {
            if (key !== 'url') {
              let time = parseInt(data[key].addtime);
              data[key].addtime = _this.formatDate(new Date(time * 1000), 'yyyy-MM-dd HH:mm');
              userlist.push(data[key]);
            }
          }
          _this.setData({
            payHisList: userlist
          });
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
    this.getBuylist();
    this.getUserlist();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    cardlist = [];userlist = []; page1 = 1; page2 = 1; islodding = false; iscom = false;
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