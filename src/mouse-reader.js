(function(window){
    var AppObject = window.AppObject;

    var MouseReader = function (properties) {
        var self = this;
        self.leftdown = [];
        self.rightdown = [];
        self.middledown = [];
        self.leftup = [];
        self.rightup = [];
        self.middleup = [];
        self.mousemove = [];
        self.mouseout = [];
        self.mouseenter = [];
        self.element = null;
        self.initialize();
        AppObject.call(self);
        MouseReader.bindProperties.apply(self);
        self.set(properties);
    };

    MouseReader.prototype = Object.create(AppObject.prototype);
    MouseReader.prototype.constructor = MouseReader;

    MouseReader.bindProperties = function () {
        var self = this;
        self._beforeSet('element', function (oldVal, newVal) {
            $(oldVal).unbind('mousemove');
            $(oldVal).unbind('mousedown');
            $(oldVal).unbind('mousewheel');
            $(oldVal).unbind('mouseout');
            $(oldVal).unbind('mouseenter');

            return newVal;
        });

        self._onChange('element', function (element) {
            self.initializeVars();
            $(element).on('mousemove',function (event) {
                event.preventDefault();
                var target = event.target;
                var x = event.offsetX;
                var y = event.offsetY;
                self.lastMove = {x: x, y: y};
                self.mousemove.forEach(function (callback) {
                    callback.apply(self, [event]);
                });
            });

            $(element).on('mousedown',function (event) {
                event.preventDefault();
                var pos = {x: event.offsetX, y: event.offsetY};
                switch (event.which) {
                    case 1:
                        self.left = true;
                        self.lastDown.left = pos;
                        self.leftdown.forEach(function (callback) {
                            callback.apply(self, [event]);
                        });
                        break;
                    case 2:
                        self.middle = true;
                        self.lastDown.middle = pos;
                        self.middledown.forEach(function (callback) {
                            callback.apply(self, [event]);
                        });
                        break;
                    case 3:
                        self.right = true;
                        self.lastDown.right = pos;
                        self.rightdown.forEach(function (callback) {
                            callback.apply(self, [event]);
                        });
                }

            });

            $(element).on('mouseout',function (event) {
                event.preventDefault();
                self.left = false;
                self.right = false;
                self.middle = false;
                self.mouseout.forEach(function (callback) {
                    callback.apply(self, [event]);
                });
            });

            $(element).on('mouseenter',function (event) {
                event.preventDefault();
                self.mouseenter.forEach(function (callback) {
                    callback.apply(self, [event]);
                });
            });

            var callback = function (e) {
                e.preventDefault();
                self.lastWheel = e.detail ? e.detail * (-120) : e.wheelDelta;
                self.mouseWheel.forEach(function (callback) {
                    callback.apply(self, [e]);
                });
            };

            var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

            $(element).on(mousewheelevt,callback);
        });
    };


    MouseReader.prototype.initializeVars = function () {
        var self = this;
        self.left = false;
        self.middle = false;
        self.right = false;
        self.lastDown = {
            left: {x: 0, y: 0},
            right: {x: 0, y: 0},
            middle: {x: 0, y: 0}
        };
        self.lastUp = {
            left: {x: 0, y: 0},
            right: {x: 0, y: 0},
            middle: {x: 0, y: 0}
        };
        self.lastMove = {x: 0, y: 0};
        self.lastWheel = 0;
        self.mouseWheel = [];
    };


    MouseReader.prototype.initialize = function () {
        var self = this;
        self.initializeVars();
        $(document).mouseup(function (event) {
            event.preventDefault();
            if (self.element !== null) {
                var pos = {x: event.offsetX, y: event.offsetY};
                switch (event.which) {
                    case 1:
                        self.left = false;
                        self.lastUp.left = pos;
                        self.leftup.forEach(function (callback) {
                            callback.apply(self, [event]);
                        });
                        break;
                    case 2:
                        self.middle = false;
                        self.lastUp.middle = pos;
                        self.middleup.forEach(function (callback) {
                            callback.apply(self, [event]);
                        });
                        break;
                    case 3:
                        self.right = false;
                        self.lastUp.right = pos;
                        self.rightup.forEach(function (callback) {
                            callback.apply(self, [event]);
                        });
                }
            }
        });
    };

    MouseReader.prototype.onmousewheel = function (callback) {
        var self = this;
        self.mouseWheel.push(callback);
    };

    MouseReader.prototype.onmousedown = function (which, callback) {
        var self = this;
        switch (which) {
            case 1:
                self.leftdown.push(callback);
                break;
            case 2:
                self.middledown.push(callback);
                break;
            case 3:
                self.rightdown.push(callback);
        }
    };

    MouseReader.prototype.onmouseup = function (which, callback) {
        var self = this;
        switch (which) {
            case 1:
                self.leftup.push(callback);
                break;
            case 2:
                self.middleup.push(callback);
                break;
            case 3:
                self.rightup.push(callback);
        }
    };

    MouseReader.prototype.onmousemove = function (callback) {
        var self = this;
        self.mousemove.push(callback);
    };

    MouseReader.prototype.onmouseout = function(callback){
        var self = this;
        self.mouseout.push(callback);
    };

    MouseReader.prototype.onmouseenter = function(callback){
        var self = this;
        self.mouseenter.push(callback);
    };

    MouseReader.LEFT = 1;
    MouseReader.MIDDLE = 2;
    MouseReader.RIGHT = 3;

    window.MouseReader = MouseReader;
})(window);