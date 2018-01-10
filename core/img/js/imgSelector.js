/**
 * @author wusi
 */
var imgSelector = function (imgId, options) {

    var
        // 当前加载图片
        img,
        areaMap;

    // 顶点进入处理器
    function pointMouseEnter(event) {
        console.log('顶点进入处理器')
    }

    // 顶点选择处理器
    function pointMouseDown(event) {
        console.log('顶点选择处理器')
    }

    // 顶点移动处理器
    function pointMouseMove(event) {
        console.log('顶点移动处理器')
    }

    // 顶点确定处理器
    function pointMouseUp(event) {
        console.log('顶点确定处理器')
    }

    // area区域进入处理器
    function areaMouseEnter(polygonId) {
        console.log('area区域进入处理器' + polygonId)
    }

    // area区域选择处理器
    function areaMouseDown(polygonId) {
        console.log('area区域选择处理器' + polygonId)
    }

    // area区域移动处理器
    function areaMouseMove(polygonId) {
        console.log('area区域移动处理器' + polygonId)
    }

    // area区域确定处理器
    function areaMouseUp(polygonId) {
        console.log('area区域确定处理器' + polygonId)
    }

    // 创建多边形
    function createPolygon() {
        var draw = SVG('panel').size(1000, 1000);
        var polygon = draw.polygon('180,10 280,10 280,200 180,200').fill('black').stroke({width: 2});
        // 获取多边形id
        var polygonId = polygon.node.attributes.getNamedItem('id').nodeValue;
        // 注册事件处理器（提取方法会报错）
        polygon.on('mouseover', function () {
            // this 为当前元素
            this.fill({color: '#f06'});
            this.plot([[160, 10], [280, 10], [260, 200], [180, 200]]);
        });
        // polygon.on('mousedown', areaMouseDown(polygonId));
        // polygon.on('mousemove', areaMouseMove(polygonId));
        // polygon.on('mouseup', areaMouseUp(polygonId));
        // console.log(polygon.node.attributes.getNamedItem('points'));
    }

    // 改变多边形属性
    function changePolygon() {
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
    };

    function init() {
        // 初始化图片
        img = $(imgId);
        // img = imgId;
        // 初始化区域存储map
        areaMap = new Map();
        createPolygon();
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