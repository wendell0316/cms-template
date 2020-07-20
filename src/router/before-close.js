import { Modal } from 'view-design';

const beforeClose = {
    before_close_normal_change: (resolve) => {
        Modal.confirm({
            title: '您本页内容有更改，确定要关闭这一页吗',
            onOk: () => {
                resolve(true);
            },
            onCancel: () => {
                resolve(false);
            },
        });
    },
    before_close_normal_publish: (resolve) => {
        Modal.confirm({
            title: '您本页内容未发布，确定要关闭这一页吗',
            onOk: () => {
                resolve(true);
            },
            onCancel: () => {
                resolve(false);
            },
        });
    },
};

export default beforeClose;
