$(function () {
  //点击去注册的链接
  $('#link_reg').on('click', function () {
    $('.login_box').hide()
    $('.res_box').show()
  })
  //点击去登录的链接
  $('#link_login').on('click', function () {
    $('.res_box').hide()
    $('.login_box').show()
  })

  // 从 layui 中获取 form 对象
  var form = layui.form
  var layer = layui.layer
  // 通过 form.verify() 函数自定义校验规则
  form.verify({
    // 自定义了一个叫做 pwd 校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，om且不能出现空格'],
    // 校验两次密码是否一致的规则
    repwd: function (value) {
      // 通过形参拿到的是确认密码框中的内容
      // 还需要拿到密码框中的内容
      // 然后进行一次等于的判断
      // 如果判断失败,则return一个提示消息即可
      var pwd = $('#form_reg [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  //提交注册信息 完成后跳转登录
  $('#form_reg').on('submit', function (e) {

    //阻止表单的默认提交事件
    e.preventDefault();

    var data = {
      username: $('.res_box [name=username]').val(),
      password: $('.res_box [name=password]').val()
    }
    //ajax   提交
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      // if (res.status !== 0) return layer.msg(res.message);
      layer.msg('注册成功，请登录！');
      //跳转登录
      $('#link_login').click()
    })

  })
  //登录功能 完成后跳转登录
  $('#form_login').on('submit', function (e) {
    //阻止表单的默认提交事件
    e.preventDefault();

    $.ajax({
      url: "/api/login",
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！')
        // 将登录成功得到的 token 字符串，保存到 localStorage 中
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = '/index.html'
      }
    })
  })
})