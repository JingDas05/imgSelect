/**
 * @author wusi
 */

var imgSelect = function () {

    function imgMouseDown(event) {
        console.log('start');
        $("p").click(function () {
            console.log('click')
        });
    }

    function imgMouseMove(event) {

    }

    function imgMouseUp(event) {

    }

    this.init();
    $("p").click(function () {
        console.log('outer-click')
    });
};

imgSelect.prototype = {

    init: function () {

    },

    polygon: function (polygonId) {
        var polygonEntity = $('<svg xmlns="http://www.w3.org/2000/svg" version="1.1">');
    }
};

