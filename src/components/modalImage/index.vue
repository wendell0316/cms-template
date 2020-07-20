<template>
    <Modal
        v-model="showCropper"
        title="图片裁剪"
        width="700"
    >
        <cropper
            :src="imgUrl"
            :uploadClick="uploadClick"
            :aspectRatio="aspectRatio"
            crop-button-text="确认提交"
            @on-crop="handleCroped"
        ></cropper>
        <div slot="footer">
            <Button
                type="primary"
                @click="showCropper = false"
            >取消</Button>
        </div>
    </Modal>
</template>

<script>
import cropper from '../cropper/index.vue';
import { uploadImg } from '@/api/data.js';
export default {
    data() {
        return {
            showCropper: false,
            uploadClick: false
        };
    },
    props: {
        value: {
            default: false,
            type: Boolean
        },
        imgUrl: {
            default: '',
            type: String
        },
        aspectRatio: {
            default: 0,
            type: Number
        },
        prefix: {
            default: '',
            type: String
        }
    },
    watch: {
        value(val) {
            this.showCropper = val;
        },
        showCropper(val) {
            if (!val) {
                this.$emit('input', false);
            }
        }
    },
    components: {
        cropper
    },
    mounted() {},
    methods: {
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
        // 裁剪
        handleCroped(file) {
            this.uploadClick = true;
            const data = this.dataURLtoFile(file.file, file.fileName);
            const formData = new FormData();
            formData.append('file', data);
            const querys = {
                imageType: file.fileType,
                prefix: this.prefix
            };
            uploadImg(querys, formData).then(res => {
                this.uploadClick = false;
                this.$Message.success('图片上传成功');
                this.uploadSuccess(res.data.result);
            });
        },

        uploadSuccess(resUrl) {
            this.$emit('input', false);
            this.$emit('getImageUrl', resUrl);
        }
    }
};
</script>

<style scoped lang="less">
</style>
