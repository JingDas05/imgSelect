/**
 * @author wusi
 */
var imgSelector = function (imgId, options) {

    var
        // 当前加载图片
        img,
        areaMap,
        labelDataMap,
        draw,
        //ui组件
        // layTemplate,
        // 官方标签库
        officialLabels = [
            {
                'id': '',
                'name': '绿萝'
            },
            {
                'id': '',
                'name': '仙人掌'
            }, {
                'id': '',
                'name': '虎皮兰'
            },
            {
                'id': '',
                'name': '多肉'
            },
            {
                'id': '',
                'name': '竹'
            }
        ];


    // 创建多边形
    function polygonHandler() {
        var polygon = draw.polygon()
            .plot([[180, 10], [280, 10], [280, 200], [180, 200]])
            .fill('none').stroke({width: 2});
        var polygonId = polygon.node.attributes.getNamedItem('id').nodeValue;
        // 配置区域选择最大区域,允许选择和拖动
        var constraint = {
            minX: 0,
            minY: 0,
            maxX: img.width,
            maxY: img.height
        };
        var opt = {
            constraint: constraint,
            snapToGrid: 20,
            snapToAngle: 15
        };
        polygon.selectize({deepSelect: true}).resize(opt);
        // 允许拖动
        polygon.draggable(constraint);
        // 将多边形添加到areaMap中
        areaMap.put(polygonId, polygon);
        // 构造标签数据
        var labelData = {
            label: '',
            points: polygon.array().value,
            polygonId: polygonId
        };
        labelDataMap.put(polygonId, labelData);
        // 注册事件
        // 顶点移动处理器
        pointMoveEventHandler(polygon);
        // 区域移动处理器
        areaMoveEventHandler(polygon);
        // 区域操作处理器
        areaOperateHandler(polygon)
    }

    // 顶点移动处理器
    function pointMoveEventHandler(element) {
        // 注册调整区域完毕事件
        element.on('resizedone', function () {
            // this 代表当前元素,更新区域坐标
            // console.log(this.node.attributes.getNamedItem('points'));
            updateElementPoints(this)
        });
    }

    // 区域移动处理器
    function areaMoveEventHandler(element) {
        element.on('mouseover', function () {
            // 鼠标变成移动图标
            this.style('cursor:move');
        });
        element.on('dragend', function () {
            // this 代表当前元素,更新区域坐标
            updateElementPoints(this)
        })
    }

    // 更新labelMap坐标信息
    function updateElementPoints(element) {
        var elementId = element.node.attributes.getNamedItem('id').nodeValue;
        var labelDate = labelDataMap.get(elementId);
        labelDate.points = element.array().value;
        console.log(labelDate);
    }

    // 区域操作处理器
    function areaOperateHandler(element) {
        // 双击打开标签
        element.on('dblclick', function () {
            // 渲染标签
            updateLabelTemplate(this.node.attributes.getNamedItem('id').nodeValue);
        });
    }

    // 渲染标签
    function updateLabelTemplate(elementId) {
        // 初始化UI组件
        layui.use(['laytpl'], function () {
            var layTemplate = layui.laytpl;
            var data = {
                // 标签数据
                'currentLabel': '当前标签',
                'elementId': elementId
            };
            var
                // 获取模板
                template = document.getElementById('labelTemplate').innerHTML,
                // 获取渲染视图
                view = document.getElementById('labelView');
            // 渲染标签模板
            layTemplate(template).render(data, function (renderedHtml) {
                view.innerHTML = renderedHtml;
            });
            // 显示标签
            $('#labelView').show();
            // 标签处理器
            labelTemplateHandler();
        });
    }

    // 渲染标签列表
    function updateLabelsTemplate() {
        // 初始化UI组件
        layui.use(['laytpl'], function () {
            var layTemplate = layui.laytpl;
            var data = {
                'labels': officialLabels
            };
            var
                // 获取模板
                template = document.getElementById('labelsTemplate').innerHTML,
                // 获取渲染视图
                view = document.getElementById('labelsView');
            // 渲染
            layTemplate(template).render(data, function (renderedHtml) {
                view.innerHTML = renderedHtml;
            });
        });
    }


    // 标签处理器
    function labelTemplateHandler() {
        var elementId = $('#elementId').text();
        $('button#deleteAreaButton').click(function () {
            var element = areaMap.get(elementId);
            if (!!element) {
                // 移除以及顶点
                var childNodes = element.node.nextElementSibling.childNodes;
                while (childNodes.length > 0) {
                    childNodes.forEach(function (each, index) {
                        each.remove()
                    });
                }
                element.remove();
                // map中移除
                areaMap.remove(elementId)
            }
            $('#labelView').hide()
        });
        $('button#closeLabelTemplate').click(function () {
            $('#labelView').hide()
        });
    }

    // 添加多边形
    function areaAddListener() {
        $('#addAreaButton').click(function () {
            polygonHandler();
        })
    }

    // 自定义Map,存储所选区域
    function Map() {
        this.elements = [];

        //获取MAP元素个数
        this.size = function () {
            return this.elements.length;
        };


        //判断MAP是否为空
        this.isEmpty = function () {
            return (this.elements.length < 1);
        };


        //删除MAP所有元素
        this.clear = function () {
            this.elements = [];
        };


        //向MAP中增加元素（key, value)
        this.put = function (_key, _value) {
            this.elements.push({
                key: _key,
                value: _value
            });
        };


        //删除指定KEY的元素，成功返回True，失败返回False
        this.remove = function (_key) {
            var bln = false;
            try {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        this.elements.splice(i, 1);
                        return true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };


        //获取指定KEY的元素值VALUE，失败返回NULL
        this.get = function (_key) {
            try {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        return this.elements[i].value;
                    }
                }
            } catch (e) {
                return null;
            }
        };


        //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
        this.element = function (_index) {
            if (_index < 0 || _index >= this.elements.length) {
                return null;
            }
            return this.elements[_index];
        };


        //判断MAP中是否含有指定KEY的元素
        this.containsKey = function (_key) {
            var bln = false;
            try {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].key == _key) {
                        bln = true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };


        //判断MAP中是否含有指定VALUE的元素
        this.containsValue = function (_value) {
            var bln = false;
            try {
                for (var i = 0; i < this.elements.length; i++) {
                    if (this.elements[i].value == _value) {
                        bln = true;
                    }
                }
            } catch (e) {
                bln = false;
            }
            return bln;
        };


        //获取MAP中所有VALUE的数组（ARRAY）
        this.values = function () {
            var arr = [];
            for (var i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].value);
            }
            return arr;
        };


        //获取MAP中所有KEY的数组（ARRAY）
        this.keys = function () {
            var arr = [];
            for (var i = 0; i < this.elements.length; i++) {
                arr.push(this.elements[i].key);
            }
            return arr;
        };
    }

    // 初始化图片信息，img为图片id
    function imgInit(imgId) {
        var theImage = new Image();
        theImage.src = $(imgId).attr('src');
        img = theImage;
    }

    function init() {
        // 初始化图片并且获取图片真实宽度和高度
        imgInit(imgId);
        // 初始化区域存储map
        areaMap = new Map();
        // 初始化dataMap
        labelDataMap = new Map();
        // 初始化画板
        draw = new SVG('panel').size(img.width, img.height);
        areaAddListener();
        // 更新标签列表
        updateLabelsTemplate();
    }

    init()
};

imgSelector.prototype = {

    // 公用办法
    something: function () {

    }
};