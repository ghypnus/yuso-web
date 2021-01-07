import React from 'react';
import ReactUeditor from 'ifanrx-react-ueditor'

const config = {
    autoHeightEnabled: false,
    initialFrameHeight: 240,
    initialFrameWidth: '100%',
    toolbars: [
        [
            'source', //源代码
            'undo', //撤销
            'redo', //重做
            // 'template', //模板
            'formatmatch', //格式刷
            'pasteplain', //纯文本粘贴模式
            'removeformat', //清除格式
            'fontfamily', //字体
            'fontsize', //字号
            'paragraph', //段落格式
            'forecolor', //字体颜色
            'bold', //加粗
            'italic', //斜体
            'indent', //首行缩进
            'underline', //下划线
            'justifyleft', //居左对齐
            'justifyright', //居右对齐
            'justifycenter', //居中对齐
            'justifyjustify', //两端对齐
            'lineheight', //行间距
            'link', //超链接
            'insertorderedlist', //有序列表
            'insertunorderedlist', //无序列表
            'inserttable', //插入表格
            'edittable', //表格属性
            'fullscreen', //全屏
            'insertimage', //多图上传
            'insertvideo', //视频
            'attachment', //附件
            'imagenone', //默认
            'imageleft', //左浮动
            'imageright', //右浮动
            'imagecenter', //居中
            'spechars', //特殊字符
            'searchreplace', //查询替换
            'help' //帮助
        ]
    ]
}

const RichEditor = ({ value, onChange, ueditorPath = "/UEditor/" }) => {

    return <ReactUeditor
        value={value}
        config={{
            ...config,
            serverUrl: `${process.env.REACT_APP_PROXY_URL}${ueditorPath}php/controller.php`
        }}
        ueditorPath={ueditorPath}
        onChange={content => {
            if (onChange) {
                onChange(content);
            }
        }} />
}

export default RichEditor;