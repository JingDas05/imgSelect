/**
 * @author wusi
 */
var imgSelector = function (imgId, options) {

    var
        // 当前加载图片
        img,
        areaMap,
        draw;

    // 创建多边形
    function createPolygon1() {
        var polygon = draw.polygon('180,10 280,10 280,200 180,200').fill('none').stroke({width: 2});
        // 允许选择和拖动
        polygon.selectize({deepSelect: true}).resize();
        // 允许拖动
        polygon.draggable(true);
        // 注册resize完成事件
        polygon.on('resizedone', function () {
            // this 代表当前元素
            console.log(this.node.attributes.getNamedItem('points'));
        });
    }

    function createPolygon2() {
        var polygon = draw.polygon('160,20 260,20 260,200 160,200').fill('none').stroke({width: 2});
        // 允许选择和拖动
        polygon.selectize({deepSelect: true}).resize();
        // 允许拖动
        polygon.draggable(true);
        // 注册resize完成事件
        polygon.on('resizedone', function () {
            // this 代表当前元素
            console.log(this.node.attributes.getNamedItem('points'));
        });
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

    function init() {
        // 初始化图片并且获取图片真实宽度和高度
        img = $(imgId);
        var theImage = new Image();
        theImage.src = img.attr( "src");
        // img = imgId;
        // 初始化区域存储map
        areaMap = new Map();
        // 初始化画板
        draw = new SVG('panel').size(theImage.width, theImage.height);
        createPolygon1();
        createPolygon2();
    }

    // 删除area
    function deleteArea() {

    }

    init()
};

imgSelector.prototype = {

    something: function () {

    }
};