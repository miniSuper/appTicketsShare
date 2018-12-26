require(['jquery', 'layer', 'vue', 'js-cookie'], function(
  $,
  layer,
  Vue,
  Cookies
) {
  var host =
    GetDomainName() === '.com'
      ? 'http://app.api.epweike.com'
      : 'http://app.api.epweike.net';
  var baseUrl =
    GetDomainName() === '.com' ? 'http://m.epwk.com' : 'http://m.epwk.ai';
  // Cookies.set(
  //   'access_token',
  //   '0f809ZAecy7uNisdhOX8wG2E%2FbZTgTadvsjG9Yulgw4vTe7OhQoNG0kqb%2FVUzOhsVXrii53Kih5Pwu4'
  // );
  Cookies.remove('access_token');
  var ticketList = [];
  var coupon_ids = '990,991,992,993,994'; //全部的优惠券id
  var current_ids = ''; //当前要获取的优惠券id
  var from_uid = '12914914';
  var time = '1294658974';
  var token = Cookies.get('access_token');

  getTicketlist(); //页面一开始  获取优惠券列表

  $(document).on('click', '.btn-open', function(params) {
    $(this)
      .parent('.fold')
      .siblings('.open')
      .slideToggle();
    $(this).toggleClass('active');
  });
  // 点击某个优惠券 右下角的 【立即领取】
  $(document).on('click', '.btn-get', function(params) {
    current_ids = $(this).data('id');
    if (token) {
      getTicketLogined();
    } else {
      var content = $('.layer-free').html();
      layer.open({
        title: false,
        closeBtn: 1,
        type: 1,
        content: content,
        success: function() {
          $(document).on(
            'click',
            '.layer-free-content .icon-close',
            function() {
              layer.closeAll();
            }
          );
        }
      });
    }
  });
  // 点击页面底部的 【一键领取】
  $(document).on('click', '.btn-getAll', function(params) {
    current_ids = coupon_ids;
    if (token) {
      getTicketLogined();
    } else {
      var content = $('.layer-free').html();
      layer.open({
        title: false,
        closeBtn: 1,
        type: 1,
        content: content,
        success: function() {
          $(document).on(
            'click',
            '.layer-free-content .icon-close',
            function() {
              layer.closeAll();
            }
          );
        }
      });
    }
  });
  $(document).on('click', '.btn-login', function(params) {
    var username = $(this)
      .siblings('.username')
      .val();
    var password = $(this)
      .siblings('.password')
      .val();
    login(username, password);
  });
  $(document).on('click', '.layer-free-content .tips', function() {
    layer.closeAll();
    var content = $('.layer-register').html();
    layer.open({
      title: false,
      closeBtn: 1,
      type: 1,
      content: content,
      success: function() {
        $(document).on(
          'click',
          '.layer-register-content .icon-close',
          function() {
            layer.closeAll('page');
          }
        );
      }
    });
  });
  $(document).on('click', '.btn-register', function(params) {
    var mobile = $(this)
      .siblings('.mobile')
      .val();
    var code = $(this)
      .siblings('.form-row')
      .find('.code')
      .val();
    register(mobile, code);
  });
  $(document).on('click', '.btn-authCode', function(params) {
    var mobile = $(this)
      .closest('.form-box')
      .find('.mobile')
      .val();
    if (regTool(mobile)) {
      getAuthCode(mobile);
    }
  });

  function login(account, password) {
    var url = baseUrl + '/member/login';
    var params = {
      do: 'login',
      txt_account: account,
      pwd_password: password,
      coupon_ids: current_ids,
      type: 'get_coupon',
      time: time
    };
    var callback = function(res) {
      if (res.status === 1) {
        layer.closeAll();
        var content = $('.layer-success').html();
        layer.open({
          title: false,
          closeBtn: 1,
          type: 1,
          content: content,
          success: function() {
            $(document).on(
              'click',
              '.layer-success-content .icon-close',
              function() {
                layer.closeAll();
              }
            );
          }
        });
      } else {
        layer.open({
          skin: 'msg',
          time: 2,
          content: res.msg.r
        });
      }
    };
    ajaxServer(url, params, callback);
  }
  function loginAndGetAllTicket(account, password) {
    current_ids = coupon_ids;
    login(account, password);
  }
  function register(mobile, code) {
    var url = baseUrl + '/member/register';
    var params = {
      mobile: mobile,
      code: code,
      type: 'get_coupon',
      coupon_ids: current_ids,
      time: time
    };
    var callback = function(res) {
      if (res.status === 1) {
        layer.closeAll();
        var content = $('.layer-success').html();
        layer.open({
          title: false,
          closeBtn: 1,
          type: 1,
          content: content,
          success: function() {
            $(document).on(
              'click',
              '.layer-success-content .icon-close',
              function() {
                layer.closeAll();
              }
            );
          }
        });
      } else {
        layer.open({
          skin: 'msg',
          time: 2,
          content: res.msg.r
        });
      }
    };
    ajaxServer(url, params, callback);
  }

  function getAuthCode(mobile, callback) {
    var url = baseUrl + '/member/sendcode';
    var params = {
      mobile: mobile,
      type: 'get_coupon'
    };
    var callback = function(res) {
      if (res.status === 1) {
        layer.open({
          skin: 'msg',
          time: 2,
          content: '验证码已发送'
        });
        setTimeout(function() {
          $('.hasCode').html('验证码已发送');
        }, 2000);
      } else {
        layer.open({
          skin: 'msg',
          time: 2,
          content: res.msg.r
        });
      }
    };
    ajaxServer(url, params, callback);
  }

  // 输入账号 密码  登录并领取优惠券
  function registerAndGetTicket() {}

  // 已经登录（有token）  领取单个优惠券
  function getTicketLogined(params) {
    var url = host + '/wap.php';
    var params = {
      do: 'coupon',
      view: 'send',
      time: time,
      coupon_ids: current_ids,
      access_token: token
    };
    var callback = function(res) {
      if (res.status === 1) {
        layer.closeAll();
        var content = $('.layer-success').html();
        layer.open({
          title: false,
          closeBtn: 1,
          type: 1,
          content: content,
          success: function() {
            $(document).on(
              'click',
              '.layer-success-content .icon-close',
              function() {
                layer.closeAll();
              }
            );
          }
        });
      } else {
        layer.open({
          skin: 'msg',
          time: 2,
          content: res.msg.r
        });
      }
    };
    ajaxServer(url, params, callback);
  }

  //已经登录(有token)  领取全部的优惠券
  function getAllTicketLogined() {
    current_ids = coupon_ids;
    getTicketLogined();
  }

  //获取优惠券列表
  function getTicketlist(params) {
    var url = host + '/wap.php';
    var params = {
      do: 'coupon',
      view: 'share_list',
      coupon_ids: coupon_ids
    };
    // from_uid: from_uid,
    // time: time
    var callback = function(res) {
      if (res.status === 1) {
        var vm = new Vue({
          el: '.ticket-box',
          data: {
            ticketList: res.data
          }
        });
      } else {
        layer.open({
          skin: 'msg',
          time: 2,
          content: res.msg.r
        });
      }
    };
    ajaxServer(url, params, callback);
  }

  function ajaxServer(url, params, callback) {
    $.ajax({
      url: url,
      data: params,
      type: 'POST',
      // dataType: 'jsonp',
      // jsonp: 'callback',
      success: function(res) {
        res = JSON.parse(res);
        callback(res);
      },
      error: function(res) {
        layer.open({
          content: '网络繁忙，请稍后重试',
          skin: 'msg',
          time: 2 //2秒后自动关闭
        });
      }
    });
  }

  function GetDomainName() {
    //获取域名后缀
    var url = window.location.host;
    url = url.substring(url.lastIndexOf('.'));
    return url;
  }

  function regTool(mobile) {
    if (!mobile) {
      layer.open({
        skin: 'msg',
        time: 2,
        // title: '信息',
        content: '请输入您的手机号码'
      });
      return false;
    }
    if (!/^1[3456789]{1}\d{9}$/.test(mobile)) {
      layer.open({
        skin: 'msg',
        time: 2,
        // title: '信息',
        content: '请输入正确的手机号码！'
      });
      return false;
    }
    return true;
  }
});
