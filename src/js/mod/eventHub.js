var eventHub = (function() {
    var events = {};

    // 订阅
    function on(eventName, fn) {
        if(!(eventName in events)) {
            events[eventName] = [];
        }
        events[eventName].push(fn);
    }

    // 发布
    function emit(eventName, data) {
        var fnList = events[eventName];

        for(var i = 0; i < fnList.length; i++) {
            fnList[i].call(null, data);
        }
    }

    return {
        on: on,
        emit: emit
    };
})();

module.exports = eventHub;