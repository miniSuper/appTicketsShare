require(['jquery', 'layer', 'vue', 'js-cookie'], function ($, layer, Vue, Cookies) {
  var host = GetDomainName() === '.com' ? 'http://app.api.epweike.com' : 'http://app.api.epweike.net';
  var baseUrl = GetDomainName() === '.com' ? 'http://m.epwk.com' : 'http://m.epwk.ai';
  getTicketlist();
  // Cookies.set('access_token', 'abcdefghijklmn')
  Cookies.remove('access_token')
  var ticketList = [];
  var coupon_ids = '990,991,992,993,994';
  var from_uid = '';
  var time = Date.parse(new Date()) / 1000;
  $(document).on('click', '.btn-open', function (params) {
    $(this)
      .parent('.fold')
      .siblings('.open')
      .slideToggle()
    $(this).toggleClass('active')
  })
  $(document).on('click', '.btn-get', function (params) {
    var token = Cookies.get('access_token');
    if (token) {
      console.log(token)
    } else {
      var content = $('.layer-free').html()
      layer.open({
        title: false,
        closeBtn: 1,
        type: 1,
        content: content,
        success: function () {
          $(document).on('click', '.layer-free-content .icon-close', function () {
            layer.closeAll();
          })
        }
      })
    }
  })
  $(document).on('click', '.btn-login', function (params) {
    var username = $(this)
      .siblings('.username')
      .val();
    var password = $(this)
      .siblings('.password')
      .val();
    login(username, password);
  })
  $(document).on('click', '.layer-free-content .tips', function () {
    layer.closeAll()
    var content = $('.layer-register').html()
    layer.open({
      title: false,
      closeBtn: 1,
      type: 1,
      content: content,
      success: function () {
        $(document).on(
          'click',
          '.layer-register-content .icon-close',
          function () {
            layer.closeAll('page')
          }
        )
      }
    })
  })
  $(document).on('click', '.btn-register', function (params) {
    var mobile = $(this)
      .siblings('.mobile')
      .val()
    var code = $(this)
      .siblings('.form-row')
      .find('.code')
      .val()
    console.log(mobile, code)
    register(mobile, code)
  })
  $(document).on('click', '.btn-authCode', function (params) {
    console.log('click')
    var mobile = $(this)
      .closest('.form-box')
      .find('.mobile')
      .val()
    getAuthCode(mobile)
  })

  function login(account, password) {
    var url = baseUrl + '/member/login';
    var params = {
      do: 'login',
      txt_account: account,
      pwd_password: password,
      coupon_ids: coupon_ids,
      type: 'get_coupon',
      time: time
    };
    var callback = function (res) {
      console.log(res)
      if (res.status === 1) {
        layer.closeAll();
        var content = $('.layer-success').html()
        layer.open({
          title: false,
          closeBtn: 1,
          type: 1,
          content: content,
          success: function () {
            $(document).on('click', '.layer-success-content .icon-close', function () {
              layer.closeAll();
            })
          }
        })
      }
    };
    ajaxServer(url, params, callback);
  }

  function register(mobile, code) {
    var url = 'http://m.epwk.ai/member/register'
    var params = {
      mobile: mobile,
      code: code,
      type: 'get_coupon',
      coupon_ids: 990
    }
    var callback = function (params) {
      console.log(params)
    }
    ajaxServer(url, params, callback)
  }

  function getAuthCode(mobile, callback) {
    var url = baseUrl + '/member/sendcode'
    var params = {
      mobile: mobile,
      type: 'get_coupon'
    }
    var callback = function (params) {
      $('.hasCode').html('验证码已发生至您的手机')
    }
    ajaxServer(url, params, callback)
  }

  function registerAndGetTicket() {

  }

  function getTicketWhenLogined(params) {

  }

  function getTicketlist() {
    var url = host + '/wap.php';
    var params = {
      do: 'coupon',
      view: 'share_list',
      coupon_ids: '100,200,300,400,990,991,992,993'
      // from_uid: from_uid,
      // time: time
    };
    var callback = function (res) {
      console.log(res.data)
      if (res.status === 1) {
        var vm = new Vue({
          el: '.ticket-box',
          data: {
            ticketList: res.data
          }
        });
      }
    }
    ajaxServer(url, params, callback);
  }

  function ajaxServer(url, params, callback) {
    $.ajax({
      url: url,
      data: params,
      type: 'POST',
      // dataType: 'jsonp',
      // jsonp: 'callback',
      success: function (res) {
        res = JSON.parse(res)
        callback(res)
        // if (res.status == 1) {
        //   callback(res)
        //   layer.open({
        //     skin: 'msg',
        //     time: 2,
        //     content: res.msg.r
        //   })
        // } else {
        //   layer.open({
        //     skin: 'msg',
        //     time: 2,
        //     content: res.msg.r
        //   })
        // }
      },
      error: function (res) {
        layer.open({
          content: '网络繁忙，请稍后重试',
          skin: 'msg',
          time: 2 //2秒后自动关闭
        })
      }
    })
  }

  function GetDomainName() { //获取域名后缀
    var url = window.location.host;
    url = url.substring(url.lastIndexOf('.'));
    return url;
  };
})