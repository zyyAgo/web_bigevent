$(function () {
    var layer = layui.layer;
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        newpwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        repwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })
    //发起提交更改密码请求
    $('.layui-form').on('submit',function(e){
        e.preventDefault();
        $.ajax({
            method:'POST',
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if(res.status !== 0){
                    return layer.msg(res.message)
                 }
                 layer.msg(res.message)
            }
        });
        // 重置表单
        $('.layui-form')[0].reset()
    })

  
})