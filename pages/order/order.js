// order.js
var page=1;
var payHisList=[];
var islodding=false;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
  scroll: function() {
    if (!islodding) {
      islodding = true;
      page++;
      wx.showLoading({
        title: '加载中'
      })
      this.getList();
    }
  },
  onLoad: function (options) {
    app.getUserInfo();
    page = 1;
    payHisList = [];
    islodding = false;
  },

  getList: function() {
    var _this = this;
    wx.request({
      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.managelist',
      data: { openid: getApp().globalData.openid, page: page },
      success: (res) => {
        wx.hideLoading();
        islodding = false;
        if (res.statusCode == 200) {
          var data = res.data.result;
          for (var key in data) {
            if (key !== 'url') {
              let time = parseInt(data[key].addtime);
              data[key].addtime = _this.formatDate(new Date(time * 1000), 'yyyy-MM-dd HH:mm');
              payHisList.push(data[key]);
            }
          }
          _this.setData({
            payHisList: payHisList
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
    var _this = this;
    this.getList();
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('已经隐藏');
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