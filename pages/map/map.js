var kvdata = [];
var app = getApp();
var crls = [];
var size = {};
var islogin;
var map;
var clickcount = 0;
var ismarkerclick = false;
var isone = true;
Page({
  getTime: function (sytime) {
    var days = Math.floor(sytime / (24 * 3600 * 1000));
    return days;
  },
  onLoad: function () {
    app.getUserInfo();
    var _this = this;
    wx.getLocation({
      success: function (res) {
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
        wx.request({
          url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=shop.storelist',
          data: { latitude: res.latitude, longitude: res.longitude },
          success: function (res) {
            var markers = [];
            var lats = [];
            if (res.statusCode == 200) {
              var data = res.data.result;
              console.log(data);
              for (var key in data) {
                if (key !== 'url') {
                  var obj = new Object();
                  var obj1 = new Object();
                  kvdata[data[key].id] = data[key];
                  obj = {
                    iconPath: '../imgs/location.png',
                    id: data[key].id,
                    latitude: data[key].lat,
                    longitude: data[key].lng,
                    width: 40,
                    height: 40,
                    callout: { content: data[key].storename + '(进入导航)', color: '#ffffff', fontSize: 14, borderRadius: 5, bgColor: '#382e2f', padding: 5, display: 'ALWAYS' }
                  }
                  obj1 = {
                    latitude: data[key].lat,
                    longitude: data[key].lng,
                  }
                  markers.push(obj);
                  lats.push(obj1);
                }
              }
              _this.setData({
                marker: markers
              });
              map.includePoints({
                points: lats
              });
            }
          }
        })
      },
    });
    app.getUserInfo();
  },
  onReady: function () {
  },
  navTo: function (url) {
    wx.navigateTo({
      url: url
    })
  },
  //控件触发
  controltap: function (marker) {
    var _id = marker.controlId;
    switch (_id) {
      case 1: this.navTo('../login/login'); break;
      case 2: this.scancode(); break;
      case 3: this.carddetail(); break;
      case 4: this.navTo('../order/order'); break;
      case 5: this.cardlist(); break;
      case 6: map.moveToLocation(); break;
      default: break;
    }
  },
  markertap: function (marker) {
    var _this = this;
    var item = kvdata[marker.markerId];
    clickcount++;
    ismarkerclick = true;
    _this.setData({
      showshop: true,
      maptop: true,
      shop: {
        id: item.id,
        name: item.storename,
        address: item.address,
        phone: item.tel
      }
    });
    return false;
  },
  //跳转会员卡列表
  cardlist: function () {
    wx.navigateTo({
      url: '../card/card'
    })
  },
  //登录
  login: function () {
    wx.navigateTo({
      url: '../login/login'
    })
  },
  carddetail: function () {
    var isHas = this.data.isShowcard;
    if (isHas && islogin) {
      wx.navigateTo({
        url: '../vipdetail/detail'
      })
    } else {
      wx.navigateTo({
        url: '../card/card'
      })
    }
  },
  //点击气泡
  callouttap: function (marker) {
    var item = kvdata[marker.markerId];
    wx.openLocation({
      latitude: Number(item.lat),
      longitude: Number(item.lng),
      name: item.storename,
      address: item.address,
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '打开微信地图失败，请重试!'
        })
      }
    })
  },
  //点击商家信息
  shopitem: function () {
    var id = this.data.shop.id;
    wx.navigateTo({
      url: '../show/show?id=' + id
    })
  },
  //点击外围
  close: function (e) {
    this.setData({
      showshop: false,
      maptop: false
    });
  },
  //扫码回调
  scancode: function () {
    var appData = getApp().globalData;
    var openid = appData.openid, lat = appData.lat, lng = appData.lon;
    wx.scanCode({
      success: function (res) {
        if (res.errMsg === 'scanCode:ok') {
          console.log(res);
          var path = res.result;
          wx.showModal({
            title: '温馨提示',
            content: '确认要使用吗？',
            success: (res) => {
              if (res.confirm) {
                wx.showLoading({
                  title: '请稍后..'
                })
                wx.request({
                  url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.vipcard',
                  data: { openid: openid },
                  success: (res) => {
                    wx.hideLoading();
                    console.log(res.data);
                    if (res.statusCode == 200) {
                      if (res.data.result.length == 0) {
                        wx.showModal({
                          title: '温馨提示',
                          content: '你还没购买会员卡，是否前往购买？',
                          success: function (res) {
                            if (res.confirm) {
                              wx.navigateTo({
                                url: '../card/card'
                              })
                            }
                          }
                        })
                      }
                      else {
                        var fre = res.data.result[0].frequency;
                        var id = res.data.result[0].id;

                        //检查是否被封禁
                        if (res.data.result[0].status==2){
                          wx.showToast({
                            title: '您的会员卡已经封禁'
                          })
                          setTimeout(function () {
                            wx.redirectTo({
                              url: '../map/map'
                            })
                          }, 2000)
                          return; 
                        }


                        if (fre >= 1) {
                          wx.request({
                            url: path,
                            data: { openid: openid, vipcardid: id, lat: lat, lon: lng },
                            success: function (res) {
                              if (res.data.status.status == 1) {
                                wx.navigateTo({
                                  url: '../success/success'
                                })
                              } else {
                                wx.navigateTo({
                                  url: '../fail/fail'
                                })
                              }
                            }
                          })
                        } else {
                          wx.showModal({
                            title: '提示',
                            content: '你的消费次数为0，是否前往购买？',
                            success: function (res) {
                              if (res.confirm) {
                                wx.navigateTo({
                                  url: '../card/card'
                                })
                              }
                            }
                          })
                        }
                      }
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  data: {
    markers: [],
    mapHeight: 0,
    controls: [],
    showshop: false,
    islogin: false,
    isShowCard: false,
    maptop: false
  },
  onReady: function () {

  },
  onShow: function () {
    crls = [];
    var _this = this;

    //初始化大小
    var _this = this;
    map = wx.createMapContext('map');
    islogin = app.globalData.islogin;
    //islogin = true; //测试
    this.setData({
      islogin: islogin
    });

    //1.登录注册  2.扫码消费  3.钱包卡券  4.门店消费  5.广告图
    wx.request({
      url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.vipcard',
      data: { openid: getApp().globalData.openid },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.status == 1) {
            var endtime = res.data.result[0].endtime * 1000;
            var sytime = endtime - new Date() * 1;
            _this.setData({
              isShowcard: true,
              day: _this.getTime(sytime)
            });
          }
        }
      }
    })
    wx.showLoading({
      title: '加载中..',
      mask: true
    })
    var sinfo = wx.getSystemInfo({
      success: function (res) {
        var ww = res.windowWidth;
        var wh = res.windowHeight;
        //放入钱包
        crls.push({
          id: 3,
          iconPath: '../imgs/wallet.png',
          clickable: true,
          position: {
            left: ww - 60,
            top: wh - 80,
            width: 50,
            height: 50
          }
        });
        crls.push({
          id: 6,
          iconPath: '../imgs/my_pos.png',
          clickable: true,
          position: {
            left: 20,
            top: wh - 80,
            width: 50,
            height: 50
          }
        });
        if (islogin) crls.push({
          id: 2,
          iconPath: '../imgs/scancode_btn.png',
          clickable: true,
          position: {
            left: ww / 2 - ww / 2.5 / 2,
            top: wh - 80,
            width: ww / 2.5,
            height: 50
          }
        }); else crls.push({
          id: 1,
          iconPath: '../imgs/login_bg.png',
          clickable: true,
          position: {
            left: ww / 2 - ww / 2.5 / 2,
            top: wh - 80,
            width: ww / 2.5,
            height: 50
          }
        });
        wx.request({
          url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=member.info',
          data: { openid: getApp().globalData.openid },
          success: (res) => {

            var data = res.data;
            if (data.status == 1) {
              if (data.result.manage == 1 && islogin) {
                crls.push({
                  id: 4,
                  iconPath: '../imgs/order_men.png',
                  clickable: true,
                  position: {
                    left: ww - 60,
                    top: wh - 130,
                    width: 50,
                    height: 50
                  }
                });
              }
            }
            //广告图
            wx.request({
              url: 'https://yasi.baimuv.com/app/index.php?i=1&c=entry&m=ewei_shopv2&do=mobile&r=shop.banner',
              success: (res) => {
                wx.hideLoading();
                if (res.statusCode == 200) {
                  var data = res.data.result;
                  if (res.data.status === 1) {
                    //有数据
                    wx.downloadFile({
                      url: data.thumb,
                      success: res => {
                        crls.push({
                          id: 5,
                          iconPath: res.tempFilePath,
                          clickable: true,
                          position: {
                            left: 10,
                            top: 10,
                            width: ww - 20,
                            height: 55
                          }
                        });
                        _this.setData({
                          controls: crls
                        });
                      }
                    });
                  } else {
                    _this.setData({
                      controls: crls
                    });
                  }
                }
              },
              fail: function () {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '获取数据失败'
                })
              }
            })
          }
        })
      }
    })

  }
})