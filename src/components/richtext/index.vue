<template>
    <div class="editor">
        <div
            ref="toolbar"
            class="toolbar"
        ></div>
        <div
            ref="editor"
            class="text"
        ></div>
    </div>
</template>

<script>
import E from 'wangeditor';
import config from '@/config';
import { uploadImg } from '@/api/data.js';
let baseUrl = config.baseUrl;
export default {
    name: 'editoritem',
    data() {
        return {
            // uploadPath,
            editor: null,
            info_: null
        };
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    props: {
        value: {
            type: String,
            default: ''
        },
        isClear: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        isClear(val) {
            // 触发清除文本域内容
            if (val) {
                this.editor.txt.clear();
                this.info_ = null;
            }
        },
        value: function(value) {
            if (value !== this.editor.txt.html()) {
                this.editor.txt.html(this.value);
            }
        }
        //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
    },
    mounted() {
        this.seteditor();
        this.editor.txt.html(this.value);
    },
    methods: {
        seteditor() {
            this.editor = new E(this.$refs.toolbar, this.$refs.editor);
            this.editor.customConfig.customUploadImg = (files, insert) => {
                if (files.length > 1) {
                    this.$Message.error('一次只能上传一个图片')
                    return
                }
                const formData = new FormData();
                formData.append('file', files[0]);
                const querys = {
                    imageType: files[0].type,
                    prefix: 'city'
                };
                uploadImg(querys, formData).then(res => {
                    this.$Message.success('图片上传成功');
                    insert(res.data.result);
                });
            };
            // 配置菜单
            this.editor.customConfig.menus = [
                'head', // 标题
                'bold', // 粗体
                'fontSize', // 字号
                'fontName', // 字体
                'italic', // 斜体
                'underline', // 下划线
                'strikeThrough', // 删除线
                'foreColor', // 文字颜色
                'backColor', // 背景颜色
                'link', // 插入链接
                'list', // 列表
                'justify', // 对齐方式
                'quote', // 引用
                'emoticon', // 表情
                'image', // 插入图片
                'table', // 表格
                'video', // 插入视频
                'code', // 插入代码
                'undo', // 撤销
                'redo', // 重复
                'fullscreen' // 全屏
            ];
            this.editor.customConfig.onchange = html => {
                this.info_ = html; // 绑定当前逐渐地值
                this.$emit('change', this.info_); // 将内容同步到父组件中
            };
            // 创建富文本编辑器
            this.editor.create();
        },
        dataURLtoFile(dataurl, filename = 'file') {
            let arr = dataurl.split(',');
            let mime = arr[0].match(/:(.*?);/)[1];
            let suffix = mime.split('/')[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], `${filename}.${suffix}`, {
                type: mime
            });
        },
    }
};
</script>

<style lang="less" scoped>
.editor {
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 0;
}
.toolbar {
    border: 1px solid #ccc;
}
.text {
    border: 1px solid #ccc;
    min-height: 500px;
}
</style>