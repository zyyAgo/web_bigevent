$(function(){
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname:function(value){
            if(value.length>8){
                return '那么多烦人不烦人啊'
            }
        }
    })
    initUserInfo()
// 初始化用户的基本信息
    function initUserInfo(){
        $.ajax({
            method:'GET',
            url: "/my/userinfo",
            success: function (res) {
                if(res.status!==0){
                    layer.msg(res.message)
                }
                console.log(res);
                //快速给表单赋值
                form.val('userInfo',res.data)
            }
            
           
        });
    }
   
    //重置表单信息
    $('#userReset').on('click',function(e){
        e.preventDefault();
        // $('.layui-form')[0].reset()
    initUserInfo()

    })
    //提交修改信息  给表单注册
    $('.layui-form').on('submit',function(e){
        e.preventDefault();

        $.ajax({
            method:'POST',
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                   return layer.msg(res.message)
                }
                layer.msg(res.message)
            }
        });
    })
   
})