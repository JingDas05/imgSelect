/**
 * @author wusi
 */

// containerId: 容器id, imgSrc:图片路径， officialLabelsDefine：标签列表
var imgSelector = function (containerId, imgSrc, officialLabelsDefine, options) {

    var
        // 当前加载图片
        img = {
            width: 0,
            height: 0
        },
        // 图片判断加载定时器
        t_img,
        // 图片是否加载标志位
        isLoad = true,
        // 保存区域
        areaMap,
        // 保存标签坐标点，获取数组可以调用 labelDataMap.values()
        // 结构如下： {
        //     'elementId':{
        //         'label':'',
        //         'points':[[],[],[],[]]
        //         'elementId':''
        //     }
        // }
        labelDataMap,
        textMap,
        draw,
        // 官方标签库
        officialLabels = officialLabelsDefine,
        // 画图相关参数，调整时isResize必须为true,拖动时isDrag必须为true,之后置位清零
        x1, y1, x2, y2, isMouseDown = false, isResize = false, isDrag = false,
        colorOptions = {
            fill: '#B0C4DE',
            'fill-opacity': 0.3,
            // stroke: '#000',
            'stroke-width': 1
        },
        textOptions = {
            color: '#f06',
            // opacity: 0.6
            width: 1
        };

    // 清除画图点
    function clearDrawPositon() {
        x1 = 0;
        y1 = 0;
        x2 = 0;
        y2 = 0;
        isMouseDown = false;
    }

    // 绘制多边形
    function polygonDrawHandler(points, labelText) {
        if (!points) {
            console.log('请选择点');
            return
        }
        var polygon = draw.polygon()
            .plot(points).attr(colorOptions);
        var polygonId = polygon.node.attributes.getNamedItem('id').nodeValue;
        // 将多边形添加到areaMap中
        areaMap.put(polygonId, polygon);
        // 构造标签数据
        var labelData = {
            label: labelText || '',
            points: polygon.array().value,
            elementId: polygonId
        };
        labelDataMap.put(polygonId, labelData);
        // 如果有文字标签需要显示文字标签
        if (labelText) {
            createText(polygonId, labelText)
        }
        // 配置区域选择最大区域,允许选择和拖动
        var constraint = {
            minX: 0,
            minY: 0,
            maxX: img.width,
            maxY: img.height
        };
        var opt = {
            constraint: constraint
            // snapToGrid: 5,
            // snapToAngle: 2
        };
        polygon.selectize({deepSelect: true}).resize(opt);
        // 允许拖动
        polygon.draggable(constraint);
        // 注册事件
        // 图形调整处理器
        resizeHandler(polygon);
        // 拖动处理器
        dragHandler(polygon);
        // 区域操作处理器
        areaOperateHandler(polygon)
    }

    // 顶点移动处理器
    function resizeHandler(element) {
        // 注册调整区域完毕事件
        element.on('resizing', function () {
            // 屏蔽画图
            isResize = true;
            // 调整标签坐标
            var elementId = this.node.attributes.getNamedItem('id').nodeValue;
            adjustTextPosition(elementId);
        });
        // 注册调整区域完毕事件
        element.on('resizedone', function () {
            // this 代表当前元素,更新区域坐标
            // console.log(this.node.attributes.getNamedItem('points'));
            updateElementPoints(this);
            isResize = false;
            // 清除画图坐标点
            clearDrawPositon();
        });
    }

    // 区域移动处理器
    function dragHandler(element) {
        element.on('dragstart', function () {
            // 屏蔽画图
            isDrag = true;
        });
        element.on('dragend', function () {
            // this 代表当前元素,更新区域坐标
            updateElementPoints(this);
            // 调整文字标签区域
            var elementId = this.node.attributes.getNamedItem('id').nodeValue;
            adjustTextPosition(elementId);
            isDrag = false;
            // 清除画图坐标点
            clearDrawPositon();
        });
    }

    // 更新labelMap坐标信息
    function updateElementPoints(element) {
        var elementId = element.node.attributes.getNamedItem('id').nodeValue;
        var labelDate = labelDataMap.get(elementId);
        labelDate.points = element.array().value;
    }

    // 区域操作处理器
    function areaOperateHandler(element) {
        // 双击打开标签
        // 右键点击打开标签等
        var polygonId = element.node.attributes.getNamedItem('id').nodeValue;
        $('#' + polygonId).mousedown(function (event) {
            // 阻止浏览器默认右键点击事件
            $(this).bind("contextmenu", function () {
                return false;
            });
            if (3 == event.which) {
                // 获取点击位置绝对坐标
                $('#labelView').css({
                    'left': event.screenX,
                    'top': event.screenY
                });
                // 渲染标签
                updateLabelTemplate(polygonId);
            }
        });
        // 样式优化
        element.on('mouseover', function () {
            // 焦点时改变颜色
            this.style('cursor:move');
            this.attr({
                'fill': '#FF8C00',
                'fill-opacity': 0.5
            });
        });
        element.on('mouseout', function () {
            // 还原默认显示
            this.attr(colorOptions);
        });
    }

    // 渲染标签 elementId：当前元素id, currentLabel:要设置的标签
    function updateLabelTemplate(elementId, currentLabel) {
        var element = labelDataMap.get(elementId);
        var storageLabel = currentLabel || (element ? element.label : '');
        // 初始化UI组件
        layui.use(['laytpl'], function () {
            var layTemplate = layui.laytpl;
            var data = {
                // 标签数据
                'currentLabel': storageLabel,
                'elementId': elementId,
                'labels': officialLabels
            };
            var
                // 获取模板
                template = document.getElementById('labelTemplate').innerHTML,
                // 获取渲染视图
                view = document.getElementById('option-label');
            // 渲染标签模板
            // 如果刚进来没有标签，显示暂无标签，请标注
            if (!data.currentLabel) {
                data.currentLabel = '暂无标签，请标注'
            }
            layTemplate(template).render(data, function (renderedHtml) {
                view.innerHTML = renderedHtml;
            });
            // 显示标签
            $('#labelView').show();
            // 标签处理器
            labelTemplateHandler();
        });
    }

    // 标签处理器
    function labelTemplateHandler() {
        var elementId = $('#elementId').text();
        // 处理删除按钮事件
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
                areaMap.remove(elementId);
                labelDataMap.remove(elementId);
                // 移除文字标签
                deleteText(elementId)
            }
            // 清空自定义标签
            $('#customLabel').val('');
            $('#labelView').hide()
        });
        // 处理关闭标签事件
        $('button#closeLabelTemplate').click(function () {
            // 清空自定义标签
            $('#customLabel').val('');
            $('#labelView').hide()
        });
        // 自定义标签 确认操作
        $('button#labelConfirm').click(function () {
            var customLabel = $('#customLabel').val();
            if (customLabel) {
                refreshCurrentLabel(customLabel);
            }
            // 清空自定义标签
            $('#customLabel').val('');
            // 隐藏标签面板
            $('#labelView').hide()
        });
        // 官方标签点击处理器
        $('.officialLabel').click(function () {
            // 获取获取标签值
            var labelText = $(this).children('#labelItem').text();
            refreshCurrentLabel(labelText);
        });
    }

    // 获取标注标签最终位置 points为area的顶点数组
    function getSuitablePosition(points) {
        var x = [points[0][0], points[1][0], points[2][0], points[3][0]];
        var y = [points[0][1], points[1][1], points[2][1], points[3][1]];
        // 排序
        x.sort(function (x1, x2) {
            return x1 - x2;
        });
        y.sort(function (y1, y2) {
            return y1 - y2;
        });
        return {x: (x[1] + x[2]) / 2, y: (y[1] + y[2]) / 2}
    }

    // 调整文字标签位置
    function adjustTextPosition(elementId) {
        // 获取文字标签
        var text = textMap.get(elementId);
        if (text) {
            var element = areaMap.get(elementId);
            // 获取元素坐标点
            var points = element.array().value;
            // 调整标签位置
            var suitablePoints = getSuitablePosition(points);
            text.attr({x: suitablePoints.x, y: suitablePoints.y});
        }
    }

    // 删除文字标签
    function deleteText(elementId) {
        var text = textMap.get(elementId);
        if (text) {
            text.remove();
            areaMap.remove(elementId);
        }
    }

    // 创建文字标签
    function createText(elementId, labelText) {
        // 获取element添加文字标签
        if (elementId && labelText) {
            // 首先查看是否已经有标签，有则更新，没有则创建
            var storageText = textMap.get(elementId);
            if (!storageText) {
                var text = draw.text(labelText).stroke(textOptions);
                textMap.put(elementId, text);
                adjustTextPosition(elementId);
            } else {
                storageText.node.textContent = labelText;
            }
        }
    }

    // 刷新当前标签显示值
    function refreshCurrentLabel(labelText) {
        // 获取当前选择的 elementId
        var elementId = $('#elementId').text();
        // 创建文字标签
        createText(elementId, labelText);
        // console.log(element);
        // 获取当前标注的标签数据
        var label = labelDataMap.get(elementId);
        // 赋值
        label.label = labelText;
        // 将标签展示到选择框里

        // 更新标签
        updateLabelTemplate(elementId, labelText);
    }

    // 添加多边形
    function areaAddListener() {
        $('#panel').mousemove(function (event) {
            // 没有拖动和调整区域的时候才能画图
            // 如果拖动的时候，点击鼠标左键，绘制图片
            if (1 == event.which && !isMouseDown && !isResize && !isDrag) {
                x1 = event.offsetX;
                y1 = event.offsetY;
                isMouseDown = true;
                // console.log('x1:' + event.offsetX);
                // console.log('y1:' + event.offsetY);
            }

            if (0 == event.which && isMouseDown && !isResize && !isDrag) {
                x2 = event.offsetX;
                y2 = event.offsetY;
                // 处理点过小的情况
                if (x2 - x1 < 20 || y2 - y1 < 20) {
                    x2 = x1 + 25;
                    y2 = y2 + 25;
                }
                isMouseDown = false;
                // 渲染标签
                polygonDrawHandler(getPolygonPointsByCross([[x1, y1], [x2, y2]]));
                // console.log('x2:' + event.offsetX);
                // console.log('y2:' + event.offsetY);
                // 清零
                x1 = 0;
                y1 = 0;
                x2 = 0;
                y2 = 0;
            }
        });
    }

    // 通过对角线两点构建多边形坐标
    function getPolygonPointsByCross(points) {
        var point1 = points[0];
        var point2 = points[1];
        return [point1, [point2[0], point1[1]], point2, [point1[0], point2[1]]]
    }

    // 初始化图片信息，img为图片id
    function imgInit(imgSrc) {
        var imgPanel = $('#' + containerId);
        // 设置图片属性
        imgPanel.attr('src', imgSrc);
        isImgLoad(function () {
            img = {
                width: imgPanel.width(),
                height: imgPanel.height()
            };
            // 初始化画板以及背景图片
            draw = new SVG('panel').size(img.width, img.height);
        })
    }

    // 判断图片是否加载完毕
    function isImgLoad(callback) {
        var imgPanel = $('#' + containerId)
        var isLoad = true;
        // 找到为0就将isLoad设为false，并退出each
        if (imgPanel.height() === 0) {
            isLoad = false;
        }
        // 为true，加载完毕
        if (isLoad) {
            // 清除定时器
            clearTimeout(t_img);
            // 回调函数
            callback();
            return true;
        } else {
            isLoad = true;
            t_img = setTimeout(function () {
                isImgLoad(callback); // 递归扫描
            }, 200);
        }
    }


    function init() {
        // 初始化图片并且获取图片真实宽度和高度
        imgInit(imgSrc);
        // 初始化区域存储map
        areaMap = new Map();
        // 初始化dataMap
        labelDataMap = new Map();
        // 初始化文字标签
        textMap = new Map();
        // 绘制多边形处理器
        areaAddListener()
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
            // console.log(this.values())
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
            // console.log(this.values());
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

    // 根据点的数组绘制图形
    this.showElementsByPoints = function (points) {
        if (points instanceof Array && points) {
            points.forEach(function (each) {
                polygonDrawHandler(each.points, each.label);
            })
        }
    };

    init();

    this.labelDataMap = labelDataMap;
};

imgSelector.prototype = {

    // 获取标签数据
    getLabels: function () {
        var labels = this.labelDataMap.values();
        var notNullLabels = [];
        if (labels) {
            labels.forEach(function (each) {
                if (each.label) {
                    notNullLabels.push(each)
                }
            })
        }
        return notNullLabels;
    },
    // 回填标签数据，数据结构为（导出数据)
    // [{label: "仙人掌", points: [[176,122], [255, 122], [255, 209], [176, 209]], elementId: "SvgjsPolygon1008"},{label: "绿萝", points: [[352,196], [416, 196], [416, 288], [352, 288]], elementId: "SvgjsPolygon1008"}]
    setLabels: function (points) {
        this.showElementsByPoints(points)
    }
};