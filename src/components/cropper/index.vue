<template>
    <div class="cropper-wrapper">
        <div class="img-box">
            <img class="cropper-image" :id="imgId" alt />
        </div>
        <div class="right-con">
            <div v-if="preview" class="preview-box" :id="previewId"></div>
            <div class="button-box">
                <slot>
                    <Upload action="image/upload" :before-upload="beforeUpload">
                        <Button style="width: 150px;" type="primary">选择图片</Button>
                    </Upload>
                </slot>
                <div v-show="insideSrc && !previewSrc">
                    <!-- <Button type="primary" @click="rotate">
                        <Icon type="md-refresh" :size="18" />
                    </Button>-->
                    <Button type="primary" @click="shrink">
                        <Icon type="md-remove" :size="18" />
                    </Button>
                    <Button type="primary" @click="magnify">
                        <Icon type="md-add" :size="18" />
                    </Button>
                    <!-- <Button type="primary" @click="aspectRatio">16:9</Button> -->
                    <!-- <Button type="primary" @click="scale('Y')">
                        <Icon custom="iconfont icon-chuizhifanzhuan" :size="18" />
                    </Button>-->
                    <Button type="primary" @click="move(0, -moveStep)">
                        <Icon type="md-arrow-round-up" :size="18" />
                    </Button>
                    <Button type="primary" @click="move(-moveStep, 0)">
                        <Icon type="md-arrow-round-back" :size="18" />
                    </Button>
                    <Button type="primary" @click="move(0, moveStep)">
                        <Icon type="md-arrow-round-down" :size="18" />
                    </Button>
                    <Button type="primary" @click="move(moveStep, 0)">
                        <Icon type="md-arrow-round-forward" :size="18" />
                    </Button>
                    <Button style="width: 150px;margin-top: 10px;" type="primary" @click="crop" :loading="uploadClick">{{ cropButtonText }}</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Cropper from 'cropperjs'
import './index.less'
import 'cropperjs/dist/cropper.min.css'
export default {
    name: 'Cropper',
    props: {
        src: {
            type: String,
            default: ''
        },
        preview: {
            type: Boolean,
            default: true
        },
        uploadClick: {
            type: Boolean,
            default: false
        },
        moveStep: {
            type: Number,
            default: 4
        },
        cropButtonText: {
            type: String,
            default: '裁剪'
        },
        aspectRatio: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            cropper: null,
            insideSrc: '',
            fileName: '',
            previewSrc: '',
            fileType: 'image/png'
        }
    },
    computed: {
        imgId() {
            return `cropper${this._uid}`
        },
        previewId() {
            return `cropper_preview${this._uid}`
        }
    },
    watch: {
        src(src) {
            this.previewSrc = src;
            this.replaceSrc(src)
        },
        insideSrc(src) {
            this.replaceSrc(src)
        },
        aspectRatio(num) {
            this.setAspectRatio(num);
        }
    },
    methods: {
        beforeUpload(file) {
            const validFile = ['png', 'jpg', 'jpeg'];
            if (validFile.every(x => file.type.indexOf(x) == -1)) {
                this.$Message.error('请输入‘png’,‘jpg’,‘jpeg’格式的图片')
            } else {
                this.fileType = file.type;
                const reader = new FileReader()
                reader.readAsDataURL(file)
                this.fileName = file.name.split('.')[0];
                reader.onload = (event) => {
                    this.insideSrc = event.srcElement.result
                    this.$emit('on-srcChange', '');
                    this.previewSrc = '';
                }
            }
            return false
        },
        replaceSrc(src) {
            this.cropper.replace(src)
            this.insideSrc = src;
        },
        rotate() {
            this.cropper.rotate(90)
        },
        shrink() {
            this.cropper.zoom(-0.1)
        },
        magnify() {
            this.cropper.zoom(0.1)
        },
        setAspectRatio(num) {
            this.cropper.setAspectRatio(num)
        },
        move(...argu) {
            this.cropper.move(...argu)
        },
        crop() {
            const file = this.cropper.getCroppedCanvas().toDataURL(this.fileType, 0.7);
            this.$emit('on-crop', { file, fileName: this.fileName, fileType: this.fileType });
        },
        init() {
            this.$nextTick(() => {
                let dom = document.getElementById(this.imgId)
                this.cropper = new Cropper(dom, {
                    preview: `#${this.previewId}`,
                    checkCrossOrigin: false,
                    autoCropArea: 1,
                    viewMode: 1
                })
                // if (this.src) {
                //     this.replaceSrc(this.src)// this.replace(this.src)
                // }
            })
        }
    },
    mounted() {
        this.init();
    }
}
</script>
