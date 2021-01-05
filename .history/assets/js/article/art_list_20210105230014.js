$(function () {
    var layer = layui.layer;
    let form = layui.form;

    let laypage = layui.laypage;
    // var laypage  分页
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类的 Id
        state: '' //文章的状态，可选值有：已发布、草稿
    }
    initTable()
    // 获取文章列表数据
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        });
    }
    // 定义时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var h = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + ss
    }
    // 时间补零
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }
    initCate()
    // 初始化文章分类
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message)
                }
                let htmlStr = template('tpl_cate', res)
                // console.log(html);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        });
    }
    // 筛选功能
    $('#form_search').submit(function (e) {
        e.preventDefault();
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id;
        q.state = state;
        initTable()
    });
    // 初始化分页  分页功能
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意 bom ID，不用加 # 号
            count: total, //数据总数，从服务端得到res.total
            limit: q.pagesize, //每页的数据条数
            curr: q.pagenum, //默认选中的分页数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 当分页切换时 触发jump回调函数
            // jump函数的触发：1.点击分页  2.调用laypage.render
            jump: function (obj, first) {
                // 可以通过first的值来判断是那种方式触发了jump回调函数
                // 如果是点击触发 值为uf   调用触发 为ture 
                console.log(first);
                //log first第一次触发是被调用 返回值ture 
                // 第二次第三次..触发 是点击分页触发 返回值为unfd
                // console.log(obj.curr);
                //obj.curr 得到当前点击的分页值
                //把当前点击的页码值赋值给q.pagenum 以用于渲染页面
                q.pagenum = obj.curr;
                // 把当前的每页的数据条数赋值给q.pagesize 每页显示多少条数据
                q.pagesize = obj.limit;
                // 如果直接调用initTable函数   会形成死循环
                // 死循环原因:当调用initTable函数时  initTable函数时  调用renderPage renderPage调用initTable形成死循环
                if (!first) {
                    // 注意 调用触发时不会形成死循环 原因 为ture不满足if
                    // 不满足 不调用  为udf时触发 触发后回调 刷新了页面 所以first的值变为ture 所以不会形成死循环
                    //do something
                    initTable()
                }
            }
        });
    }
    //注册编辑事件
    $('body').on('click', ".cont", function () {
        // layer.open({
        //     title: '在线调试'
        //     ,content: $('#cont_msg')
        //   });     
        //   /my/article/list

    })
    // 注册删除事件
    $('body').on('click', ".del", function () {
        let id = $(this).attr('data-id')
        //获取当前页面上剩余的 删除按钮个数 即数据个数
        let len = $('.del').length;
        console.log(len);
        console.log(id);
        layer.confirm('确认删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        layer.msg(res.message)
                    }
                    // 判断 当前页面的删除按钮<=1吗 如果<=1 q.pagename==1或者-1
                    if (len <= 1) {
                        q.pagenum = q.pagenum == 1 ? 1 : q.pagenum - 1
                    }
                    // 重新渲染
                    initTable()
                }
            });
            layer.close(index);
        });
    })
})