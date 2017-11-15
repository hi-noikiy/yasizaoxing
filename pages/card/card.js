// card.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardlist: [],
    dindex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    app.getUserInfo();
    wx.request({
      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.vipcardlist',
      success: (res) => {
        var data = res.data.result;
        var list = [];
        if (res.statusCode == 200) {
          for (var key in data) {
            if (key !== 'url') {
              var obj = {
                id: data[key].id,
                cardname: data[key].cardname,
                days: data[key].days,
                frequency: data[key].frequency,
                costprice: data[key].costprice,
                marketprice: data[key].marketprice
              };
              list.push(obj);
            }
          }
          _this.setData({
            cardlist: list
          });
        }
      }
    })
  },
  //选择会员卡
  choose: function (e) {
    var index = e.target.dataset.index;
    this.setData({
      dindex: index
    });
  },
  //点击微信支付
  wxpay: function (e) {
    var _this = this;
    var _openid = app.globalData.openid;
    var loginb = getApp().globalData.islogin;
    console.log(loginb);
    if (loginb) {
      var dindex = _this.data.dindex;
      var _id = _this.data.cardlist[dindex].id;
      var _name = _this.data.cardlist[dindex].cardname;
      var _price = _this.data.cardlist[dindex].marketprice;
      //openid = 123 & goodsid=66 & price=777 & goodsname=商品名称
      //openid: parama._openid, goodsid: parama._id, price: parama._price, goodsname: parama._name
      var params = {
        openid: _openid,
        goodsid: _id,
        price: _price,
        goodsname: _name,
        lat: app.globalData.lat,
        lon: app.globalData.lon
      };
      console.log(params);
      wx.showLoading({
        title: '请稍后..'
      })
      wx.request({
        url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.vipcard.vipcardisexists',
        data: { openid: _openid, id: _id },
        success: (res) => {
          wx.hideLoading();
          if (res.data.status === 1) {
            wx.showModal({
              title: '温馨提示',
              content: '你已拥有该卡，将以续费形式进行充值?',//2017、7.14  13.54
              success: function (res) {
                if (res.confirm) {
                  _this.requstOrder(params);
                }
              }
            })
            return;
          }
          _this.requstOrder(params);
        }
      })
    } else {
      wx.navigateTo({
        url: '../login/login'
      })
    }
  },
  requstOrder: function (parama) {
    wx.request({
      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=order.index',
      data: parama,
      success: function (res) {
        if (res.data.status == 1) {
          var p = res.data.result.params;
          console.log(p);
          wx.requestPayment({
            timeStamp: p.timeStamp,
            nonceStr: p.nonceStr,
            package: p.package,
            signType: p.signType,
            paySign: p.paySign,
            success: function (res) {
              wx.request({
                url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=order.index.notify',
                data: { ordersn: p.ordersn, openid: app.globalData.openid },
                success: (res) => {
                  if (res.data.status === 1) {
                    wx.showToast({
                      title: res.data.result.message
                    })
                    setTimeout(function () {
                      wx.navigateTo({
                        url: '../vipdetail/detail'
                      })
                    }, 1000);
                  }
                }
              })
            }
          })
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