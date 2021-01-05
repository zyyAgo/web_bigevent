$(function () {
    const layer = layui.layer;
    const form = layui.form;

    initCate()

    function initCate() {
        $.ajax({
            type: "GET",
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message)
                }
                let htmlStr = template('tpl_cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 重新渲染 动态添加的内容
                form.render()
            }
        });
    }

    initEditor() // 调用富文本的渲染
    // 图片裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 图片裁剪区域结束  图片裁剪JS开始
    // 点击封面按钮 上传文件自动点击
    $('#beeface').on('click', function () {
        $('#pub_file').click()
    })

    // 绑定上传文件change事件
    $('#pub_file').on('change', function (e) {
        // var file = e.target.files;
        var file = e.target.files[0];
        if (file.length === 0) {
            return layer.msg("请选择图片")
        }
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    //  通过点击按钮  区分已发布、草稿状态  
    let art_state = "已发布";
    $('#pub2').on('click', function () {
        art_state = "草稿"
    })
    
    
    // 为表单绑定 submit 提交事件
    $('#form_pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
        // // 遍历FormData中的对象
        // fd.forEach(function (v, k) {
        //     console.log(k, v);
        // })

    })
    // ajax 数据请求  添加
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd, 
            //ajax发送formdata数据时 必须加以下两个参数
            contentType: false, // 不设置内容类型
            processData: false, // 不处理数据
            success: function (res) {
                if(res.status!==0){
                    layer.msg("hsibi")
                }
                layer.msg("发表成功")
            }
            
        });
    }

})