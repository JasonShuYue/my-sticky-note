var waterFall = (function() {
    var $ct;
    var $items;

    function render($c) {
        $ct = $c;
        $items = $ct.children();

        var nodeWidth = $items.outerWidth(true),
            colNum = parseInt($('#main-content').width()/nodeWidth),
            colSumHeight = [];

        // 初始化colSumHeight
        for(var i = 0; i < colNum; i++) {
            colSumHeight[i] = 0;
        }

        $items.each(function() {
            var $cur = $(this);

            var idx = 0,
                minSumHeight = colSumHeight[0];

            //找出最小高度的colomn
            for(var i = 0; i < colSumHeight.length; i++) {
                if(colSumHeight[i] < minSumHeight) {
                    idx = i;
                    minSumHeight = colSumHeight[i];
                }
            }

            $cur.css({
                left: nodeWidth * idx,
                top: minSumHeight
            })

            // 更新当前最小高度column的高度
            colSumHeight[idx] = $cur.outerHeight(true) + colSumHeight[idx];
        });
    }

    $('#main-content').on('resize', function() {
        render($ct);
    });

    return {
        init: render
    };

})();

module.exports = waterFall;