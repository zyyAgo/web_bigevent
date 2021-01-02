// 注意：每次调用$.get() $.post() ajax()时
//先调用ajaxPrefilter函数
//再这个函数中 拿到配置的我们给Ajax提供的配置对象ul
$.ajaxPrefilter(function(options){
    //再发起真正额Ajax之前统一拼接根路径
    options.url = 'http://ajax.frontend.itheima.net'+options.url;

    if(options.url.indexOf(/my/)!==-1){
        options.headers={
            Authorization:localStorage.getItem('token'||'')
        }
    }
    // 全局统一挂载 complete 回调函数
  options.complete = function(res) {
    // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
    //如果身份认证失败 强制跳转到登录页面
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1. 强制清空 token
      localStorage.removeItem('token')
      // 2. 强制跳转到登录页面
      location.href = '/login.html'
    }
  }
})
