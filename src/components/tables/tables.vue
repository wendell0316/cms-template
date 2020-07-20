<template>
    <div>
        <div
            class="search-con search-con-top"
            v-if="searchable"
        >
            <Select
                v-if="!searchConds.length"
                class="search-col"
                v-model="searchKey"
            >
                <Option
                    :key="`search-col-${item.key}`"
                    :value="item.key"
                    v-for="item in selectOptions"
                >{{ item.title }}</Option>
            </Select>
            <Input
                v-if="!searchConds.length"
                @on-change="handleClear"
                class="search-input"
                clearable
                placeholder="输入关键字搜索"
                v-model="searchValue"
            />
            <div
                class="conditions"
                v-if="searchConds.length"
            >
                <span
                    v-for="(condition,index) in searchConds"
                    :key="index"
                >
                    <span>{{condition.desc}}</span>
                    <Select
                        v-if="condition.type==='select'"
                        class="search-col"
                        filterable
                        v-model="condition.value"
                    >
                        <Option
                            :key="`search-col-${item.key}`"
                            :value="item.key"
                            v-for="item in condition.options"
                        >{{ item.title }}</Option>
                    </Select>
                    <Select
                        v-if="condition.type==='multi-select'"
                        multiple
                        class="search-col"
                        filterable
                        v-model="condition.value"
                    >
                        <Option
                            :key="`search-col-${item.key}`"
                            :value="item.key"
                            v-for="item in condition.options"
                        >{{ item.title }}</Option>
                    </Select>
                    <Input
                        v-if="condition.type==='input'"
                        v-model="condition.value"
                    />
                    <DatePicker
                        v-if="condition.type==='dates'"
                        v-model="condition.value"
                        format="yyyy/MM/dd"
                        type="daterange"
                        placement="bottom-start"
                        :placeholder="condition.desc"
                        style="width: 200px"
                    ></DatePicker>
                    <DatePicker
                        v-if="condition.type==='date'"
                        v-model="condition.value"
                        format="yyyy/MM/dd"
                        placement="bottom-start"
                        :placeholder="condition.desc"
                        style="width: 120px"
                        :clearable="false"
                    ></DatePicker>
                </span>
            </div>
            <Button
                @click="handleSearch"
                class="search-btn"
                type="primary"
            >
                <Icon type="search" />&nbsp;&nbsp;搜索
            </Button>
            <Button
                @click="onClickRightBtn"
                class="add-btn"
                type="primary"
                v-if="rightHead"
                :disabled="role==2"
            >
                <Icon type="search" />
                {{rightHead}}
            </Button>
        </div>
        <Table
            class="_c_table"
            :border="border"
            :columns="insideColumns"
            :data="insideTableData"
            :disabled-hover="disabledHover"
            :height="height"
            :highlight-row="highlightRow"
            :loading="loading"
            :no-data-text="noDataText"
            :no-filtered-data-text="noFilteredDataText"
            :row-class-name="rowClassName"
            :show-header="showHeader"
            :size="size"
            :stripe="stripe"
            :width="width"
            :draggable="draggable"
            :span-method="spanMethod"
            @on-drag-drop="onDragDrop"
            @on-current-change="onCurrentChange"
            @on-expand="onExpand"
            @on-filter-change="onFilterChange"
            @on-row-click="onRowClick"
            @on-row-dblclick="onRowDblclick"
            @on-select="onSelect"
            @on-select-all="onSelectAll"
            @on-select-cancel="onSelectCancel"
            @on-selection-change="onSelectionChange"
            @on-sort-change="onSortChange"
            ref="tablesMain"
        >
            <slot
                name="header"
                slot="header"
            ></slot>
            <slot
                name="footer"
                slot="footer"
            ></slot>
            <slot
                name="loading"
                slot="loading"
            ></slot>
        </Table>
        <!-- <div class="search-con search-con-top" v-if="searchable && searchPlace === 'bottom'">
            <Select class="search-col" v-model="searchKey">
                <Option :key="`search-col-${item.key}`" :value="item.key" v-for="item in selectOptions">{{ item.title }}</Option>
            </Select>
            <Input class="search-input" placeholder="输入关键字搜索" v-model="searchValue" />
            <Button class="search-btn" type="primary">
                <Icon type="search" />&nbsp;&nbsp;搜索
            </Button>
            <Button @click="showModel" class="add-btn" type="primary" v-if="rightHead">{{rightHead}}</Button>
        </div>-->
        <a
            id="hrefToExportTable"
            style="display: none;width: 0px;height: 0px;"
        ></a>
        <Page
            class="page"
            :total="totalNum"
            :page-size="pageSize"
            show-total
            show-elevator
            show-sizer
            transfer
            :page-size-opts="[10,20,30,50,80,100]"
            @on-change="changePage($event, 'click')"
            @on-page-size-change="changePageSize"
            :current.sync="pageIndex"
            v-if="showPage"
        />
    </div>
</template>

<script>
import './index.less';
import { addUser, addAdmin } from '@/api/user';
export default {
    name: 'Tables',
    props: {
        spanMethod: {
            default: () => () => {},
            type: Function
        },
        defaultPageSize: {
            default: 20,
            type: Number
        },
        showPage: {
            type: Boolean,
            default: false
        },
        value: {
            type: Array,
            default() {
                return [];
            }
        },
        columns: {
            type: Array,
            default() {
                return [];
            }
        },
        selectOptions: {
            type: Array,
            default() {
                return [];
            }
        },
        /**
         * searchConds: [{
         *      type: ''  // 搜索控件类型：date, select, input
         *      name: ''  // 搜索key
         *      value: null // 搜索值，固定不变，供组件存用户搜索条件
         *      desc: ''    // 中文描述
         * }]
         */
        searchConds: {
            type: Array,
            default() {
                return [];
            }
        },
        webSearch: {
            default: false,
            type: Boolean
        },
        size: String,
        width: {
            type: [Number, String]
        },
        height: {
            type: [Number, String]
        },
        stripe: {
            type: Boolean,
            default: false
        },
        border: {
            type: Boolean,
            default: false
        },
        showHeader: {
            type: Boolean,
            default: true
        },
        highlightRow: {
            type: Boolean,
            default: false
        },
        draggable: {
            type: Boolean,
            default: false
        },
        rowClassName: {
            type: Function,
            default() {
                return '';
            }
        },
        context: {
            type: Object
        },
        noDataText: {
            type: String
        },
        noFilteredDataText: {
            type: String
        },
        disabledHover: {
            type: Boolean
        },
        loading: {
            type: Boolean,
            default: false
        },
        /**
         * @description 全局设置是否可编辑
         */
        editable: {
            type: Boolean,
            default: false
        },
        /**
         * @description 是否可搜索
         */
        searchable: {
            type: Boolean,
            default: false
        },
        /**
         * @description 添加按钮，1：添加用户；2：添加报警
         */
        rightHead: {
            type: String,
            default: ''
        },
        /**
         * @description 用户角色，0：默认角色，不区分用户 1：管理员用户；2：普通用户
         */
        role: {
            type: String,
            default: '0'
        },
        /**
         * @description 用户角色，0：默认角色，不区分用户 1：管理员用户；2：普通用户
         */
        totalCount: {
            type: Number,
            default: 0
        }
    },
    computed: {
        totalNum() {
            if (this.searchConds.length && !this.webSearch) {
                return this.totalCount;
            }
            return this.initValue.length ? this.initValue.length : this.value.length;
        }
    },
    data() {
        return {
            insideColumns: [],
            insideTableData: [],
            edittingCellId: '',
            edittingText: '',
            searchValue: '',
            searchKey: '',
            pageSize: 20,
            pageIndex: 1,
            initValue: [],
            typeForNames: ['说明弹层', '电话弹层']
        };
    },
    methods: {
        changePage(pageIndex, type) {
            console.log(2)

            if (this.searchConds.length) {
                this.insideTableData = this.initValue;
                console.log(3)
                if (type == 'click') {
                    this.chengeQueryCond();
                }
                return;
            }
            let start = (pageIndex - 1) * this.pageSize;
            let end = start + this.pageSize;
            this.$nextTick(() => {
                // if (this.initValue.length) {
                this.insideTableData = this.initValue.slice(start, end).map(x => {
                    x.pageIndex = pageIndex;
                    x.pageSize = this.pageSize;
                    return x;
                });
                // } else {
                //     this.insideTableData = this.value.slice(start, end).map(x => {
                //         x.pageIndex = pageIndex;
                //         x.pageSize = this.pageSize;
                //         return x;
                //     });
                // }
                // if (this.searchable) this.handleSearch()
                this.roleLimit();
            });
        },
        roleLimit() {
            if (this.role != '2') {
                return;
            }
            this.$nextTick(() => {
                [...document.querySelectorAll('._c_table button')].map(dom => {
                    dom.setAttribute('disabled', true);
                });
            });
        },
        changePageSize(pageSize) {
            this.pageSize = pageSize;
            console.log(2)
            if (this.searchConds.length) {
                console.log(2)
                this.chengeQueryCond();
                return;
            }
            this.insideTableData = this.value.slice(0, pageSize);
        },
        handleColumns(columns) {
            this.insideColumns = columns.map((item, index) => {
                let res = item;
                return res;
            });
        },
        setDefaultSearchKey() {
            this.searchKey =
                this.columns[0].title !== '序号'
                    ? this.columns[0].key
                    : this.columns.length > 1
                    ? this.columns[1].key
                    : '';
        },
        handleClear(e) {
            if (this.showPage && e.target.value === '') {
                this.initValue = this.value;
                this.changePage(this.pageIndex);
                return;
            }
            if (e.target.value === '') this.insideTableData = this.value;
        },
        handleSearch() {
            if (this.searchValue) {
                console.log('111qq');
                this.initValue = this.value.filter(item => {
                    if (typeof item[this.searchKey] == 'number') {
                        return (
                            this.typeForNames[item[this.searchKey] - 1].indexOf(this.searchValue) >
                            -1
                        );
                    }
                    return item[this.searchKey].indexOf(this.searchValue) > -1;
                });
            } else if (this.searchConds.length) {
                this.chengeQueryCond();
            } else {
                this.initValue = [];
            }
            this.pageIndex = 1;
            this.changePage(this.pageIndex);
        },
        chengeQueryCond() {
            const params = {};
            for (const item of this.searchConds) {
                if (item.type == 'date') {
                    params[item.name] = new Date(item.value).getTime();
                } else {
                    params[item.name] = item.value;
                }
            }
            if (this.webSearch) {
                this.initValue = this.value.filter(item => {
                    for (const key in params) {
                        const element = params[key];
                        let boolValid =
                            (element == 'true' || element == 'false') &&
                            JSON.parse(element) != item[key];
                        let strValid = typeof item[key] == 'string' && !~item[key].indexOf(element);
                        let numValid = typeof item[key] == 'number' && item[key] != element;
                        if (element && (strValid || numValid || boolValid)) {
                            return false;
                        }
                    }
                    return true;
                });
            } else {
                params.pageNum = this.pageIndex;
                params.pageSize = this.pageSize;
                this.$emit('condSearch', params);
            }
        },
        handleTableData() {
            let temp = [];
            temp = this.value.map((item, index) => {
                let res = item;
                res.initRowIndex = index;
                return res;
            });
            if (this.showPage) {
                this.initValue = this.value;
                this.changePage(this.pageIndex);
            } else {
                this.insideTableData = temp;
                // if (this.searchable) this.handleSearch()
            }

            this.roleLimit();
        },
        exportCsv(params) {
            this.$refs.tablesMain.exportCsv(params);
        },
        clearCurrentRow() {
            this.$refs.talbesMain.clearCurrentRow();
        },
        onCurrentChange(currentRow, oldCurrentRow) {
            this.$emit('on-current-change', currentRow, oldCurrentRow);
        },
        onSelect(selection, row) {
            this.$emit('on-select', selection, row);
        },
        onSelectCancel(selection, row) {
            this.$emit('on-select-cancel', selection, row);
        },
        onSelectAll(selection) {
            this.$emit('on-select-all', selection);
        },
        onSelectionChange(selection) {
            this.$emit('on-selection-change', selection);
        },
        onSortChange(column, key, order) {
            this.$emit('on-sort-change', column, key, order);
        },
        onFilterChange(row) {
            this.$emit('on-filter-change', row);
        },
        onRowClick(row, index) {
            this.$emit('on-row-click', row, index);
        },
        onRowDblclick(row, index) {
            this.$emit('on-row-dblclick', row, index);
        },
        onExpand(row, status) {
            this.$emit('on-expand', row, status);
        },
        onDragDrop(index1, index2) {
            this.$emit('on-drag-drop', index1, index2);
        },
        onClickRightBtn() {
            const params = {};
            for (const item of this.searchConds) {
                if (item.type == 'date') {
                    params[item.name] = new Date(item.value).getTime();
                } else {
                    params[item.name] = item.value;
                }
            }
            this.$emit('onClickRightBtn', params);
        }
    },
    watch: {
        columns(columns) {
            this.handleColumns(columns);
            this.setDefaultSearchKey();
        },
        value(val) {
            this.handleTableData();
            if (this.searchable && this.searchValue) {
                this.handleSearch();
            }
        },
        defaultPageSize: {
            handler(val) {
                this.pageSize = val;
            },
            immediate: true
        }
        // insideTableData(val) {

        // }
    },
    mounted() {
        this.handleColumns(this.columns);
        this.setDefaultSearchKey();
        this.handleTableData();
    }
};
</script>
