$(function () {
    
    getUserInfo()

//退出功能
    var layer = layui.layer;
    $('#out').on('click', function () {

        layer.confirm('请确认是否退出?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            //清空缓存
            localStorage.removeItem('token')
            //跳转登录页面
            location.href = '/login.html'

            layer.close(index);
        });
    })
})
// 获取用户的基本信息
function getUserInfo(user) {
$.ajax({
    method:"GET",
    url: "/my/userinfo",
    success: function (res) {
        if(res.status!==0){
            return layer.msg(res.message)
        }
        //调用头像
        console.log(res.data);
        renderAvatar(res.data);
    }
});
}
//渲染用户头像
function renderAvatar(user){
    //设置了昵称时 用昵称来渲染头像  没有昵称就用用户名
    let name =user.nickname||user.username;
    //欢迎           
    $('#welcom').html(name+'牛掰')
    //渲染头像
   if(user.user_pic!==null){
       //当接收到用户有头像时 就用用户的头像
       $('.layui-nav-img').attr('src',user_pic.pic).show();
       //文本头像隐藏
       $('.taxt-avatar').hide()
   }else{
       //头像隐藏 文本头像显示
    $('.layui-nav-img').hide()
    $('.taxt-avatar').html(name[0].toUpperCase()).show()
   }

}