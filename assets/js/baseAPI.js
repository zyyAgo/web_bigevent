// 注意：每次调用$.get() $.post() ajax()时
//先调用ajaxPrefilter函数
//再这个函数中 拿到配置的我们给Ajax提供的配置对象ul
$.ajaxPrefilter(function(options){
    //再发起真正额Ajax之前统一拼接根路径
    options.url = 'http://ajax.frontend.itheima.net'+options.url
})