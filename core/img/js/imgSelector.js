/**
 * @author wusi
 */
var imgSelector = function (imgId, options) {

    var
        // 当前加载图片
        img,
        areaMap;

    // 创建多边形
    function createPolygon() {

    }

    // 顶点进入处理器
    function pointMouseEnter(event) {
    }

    // 顶点选择处理器
    function pointMouseDown(event) {
    }

    // 顶点移动处理器
    function pointMouseMove(event) {
    }

    // 顶点确定处理器
    function pointMouseUp(event) {
    }

    // area区域进入处理器
    function areaMouseEnter(event) {
    }

    // area区域选择处理器
    function areaMouseDown(event) {
    }

    // area区域移动处理器
    function areaMouseMove(event) {
    }

    // area区域确定处理器
    function areaMouseUp(event) {
    }

    // 删除area
    function deleteArea() {

    }

    function init() {
        // 初始化图片
        img = $(imgId);
        // 初始化区域存储map
        areaMap = new Map();
    }

    init()
};

imgSelector.prototype = {

    polygon: function (polygonId) {
        var polygonEntity = $('<svg xmlns="http://www.w3.org/2000/svg" version="1.1">');
    }
};