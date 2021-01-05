$(function () {
    var layer = layui.layer
    var form = layui.form
    //页面加载获取 数据 并展示至页面
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                var htmlStr = template('tpl_table', res);
                $('#tb').html(htmlStr)
            }
        });
    }

    var indexAdd = null;
    // 点击按钮 弹出添加分类的弹出层
    $('#addList').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章类别',
            area: ['500px', '250px'],
            content: $('#alt_add').html()
        });
    })
    //通过代理的形式给 添加类别 的弹出框绑定submit事件
    $('body').on("submit", '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                initArtCateList()
                // 添加成功后自动关闭弹出层 功能
                layer.close(indexAdd)
            }
        });
    })
    var indexedit = null
    //通过代理的形式给编辑按钮   弹出编辑功能的弹出层
    $('#tb').on('click', '#edit', function () {
        indexedit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#alt_edit').html()
        });
        var id = $(this).attr('data-id')
        // 获得该id 对应的值 并赋值给输入框
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('fm_edit', res.data)
            }
        });
    })

    //通过代理的形式给编辑按钮   弹出编辑功能的弹出层
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                layer.close(indexedit)
                initArtCateList()
            }
        });
    })

    //删除功能
    $('#tb').on('click', '.del', function () {
        let id = $(this).attr('data-id')
        //提示框  是否确认删除
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, 
        function (index) {
            //发起删除请求
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList()
                }
            });
            layer.close(index);
        });
        
    })

})