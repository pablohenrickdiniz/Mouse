(function(window){
    var remove_from_array = function(array,object){
        var index = array.indexOf(object);
        if(index != -1){
            array.splice(index,1);
        }
    };

    var MouseReader = function (element) {
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
        self.mousedown = [];
        self.mouseup = [];
        self.element = null;
        self.initializeVars();
        self.setElement(element);
    };

    MouseReader.prototype.initializeVars = function () {
        var self = this;
        self.left = false;
        self.middle = false;
        self.right = false;
        self.lastdown = {
            left: {x: 0, y: 0},
            right: {x: 0, y: 0},
            middle: {x: 0, y: 0},
            any:{x:0,y:0}
        };
        self.lastup = {
            left: {x: 0, y: 0},
            right: {x: 0, y: 0},
            middle: {x: 0, y: 0},
            any:{x:0,y:0}
        };
        self.lastwheel = 0;
        self.lastmove = {x:0,y:0};
        self.mousewheel = [];
    };


    MouseReader.prototype.initialize = function () {
        var self = this;
        var mousemove = function(event){
            event.preventDefault();
            var target = event.target;
            var x = event.offsetX;
            var y = event.offsetY;

            self.mousemove.forEach(function (callback) {
                callback.apply(self,[x,y,event]);
            });
        };

        var mousedown = function(event){
            event.preventDefault();
            var pos = {x: event.offsetX, y: event.offsetY};
            self.lastdown.any = pos;
            self.mousedown.forEach(function(callback){
                callback.apply(self, [pos.x,pos.y,event]);
            });

            switch (event.which) {
                case 1:
                    self.left = true;
                    self.lastdown.left = pos;
                    self.leftdown.forEach(function (callback) {
                        callback.apply(self, [pos.x, pos.y,event]);
                    });
                    break;
                case 2:
                    self.middle = true;
                    self.lastdown.middle = pos;
                    self.middledown.forEach(function (callback) {
                        callback.apply(self, [pos.x, pos.y,event]);
                    });
                    break;
                case 3:
                    self.right = true;
                    self.lastdown.right = pos;
                    self.rightdown.forEach(function (callback) {
                        callback.apply(self, [pos.x,pos.y,event]);
                    });
            }
        };

        var mouseout = function(event){
            event.preventDefault();
            self.left = false;
            self.right = false;
            self.middle = false;
            self.mouseout.forEach(function (callback) {
                callback.apply(self, [event]);
            });
        };

        var mouseenter = function(event){
            event.preventDefault();
            self.mouseenter.forEach(function (callback) {
                callback.apply(self, [event]);
            });
        };

        var mousewheel = function(e){
            e.preventDefault();
            var wheel = e.detail ? e.detail * (-120) : e.wheelDelta;
            if(/Firefox/i.test(navigator.userAgent)){
                wheel = (wheel / 360)*120;
            }
            self.lastwheel = wheel;
            self.mousewheel.forEach(function (callback) {
                callback.apply(self, [wheel,e]);
            });
        };

        var mouseup =  function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (self.element !== null) {
                var pos = {x: event.offsetX, y: event.offsetY};
                self.lastup.any = pos;
                self.mouseup.forEach(function (callback) {
                    callback.apply(self, [pos.x,pos.y,event]);
                });

                switch (event.which) {
                    case 1:
                        self.left = false;
                        self.lastup.left = pos;
                        self.leftup.forEach(function (callback) {
                            callback.apply(self, [pos.x,pos.y,event]);
                        });
                        break;
                    case 2:
                        self.middle = false;
                        self.lastup.middle = pos;
                        self.middleup.forEach(function (callback) {
                            callback.apply(self, [pos.x,pos.y,event]);
                        });
                        break;
                    case 3:
                        self.right = false;
                        self.lastup.right = pos;
                        self.rightup.forEach(function (callback) {
                            callback.apply(self, [pos.x,pos.y,event]);
                        });
                }
            }
        };

        var contextmenu = function(e){
            e.preventDefault();
        };

        document.addEventListener("mouseup",mouseup);
        self.element.addEventListener("mousemove",mousemove);
        self.element.addEventListener("mousedown",mousedown);
        self.element.addEventListener("mouseup",mouseup);
        self.element.addEventListener("mouseout",mouseout);
        self.element.addEventListener("mouseenter",mouseenter);
        self.element.addEventListener("contextmenu",contextmenu);
        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
        self.element.addEventListener(mousewheelevt,mousewheel);
    };

    MouseReader.prototype.setElement = function(element){
        if(!(element instanceof Element)){
            throw new TypeError('Elemento inexistente!');
        }
        var self = this;
        if(self.element != null){
            var old = self.element;
            old.removeEventListener("mousemove",mousemove);
            old.removeEventListener("mousedown",mousedown);
            old.removeEventListener("mouseout",mouseout);
            old.removeEventListener("mouseenter",mouseenter);
            old.removeEventListener("mouseup",mouseup);
            var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";
            old.removeEventListener(mousewheelevt,mousewheel);
            old.removeEventListener("contextmenu",contextmenu);
        }

        self.element = element;
        self.initialize();
    };

    MouseReader.prototype.removemousewheel = function(callback){
        var self = this;
        remove_from_array(self.mousewheel,callback);
    };

    MouseReader.prototype.removemousedown = function(callback,type){
        var self = this;
        switch(type){
            case 'left':
                remove_from_array(self.leftdown,callback);
                break;
            case 'middle':
                remove_from_array(self.middledown,callback);
                break;
            case 'right':
                remove_from_array(self.rightdown,callback);
                break;
            default:
                remove_from_array(self.mousedown,callback);
        }
    };

    MouseReader.prototype.removemouseup =function(callback,type){
        var self =this;
        switch(type){
            case 'left':
                remove_from_array(self.leftup,callback);
                break;
            case 'middle':
                remove_from_array(self.middleup,callback);
                break;
            case 'right':
                remove_from_array(self.rightup,callback);
                break;
            default:
                remove_from_array(self.mouseup,callback);
        }
    };

    MouseReader.prototype.removemousemove = function(callback){
        var self = this;
        remove_from_array(self.mousemove,callback);
    };

    MouseReader.prototype.removemouseenter = function(callback){
        var self= this;
        remove_from_array(self.mouseenter,callback);
    };

    MouseReader.prototype.removemouseout = function(callback){
        var self = this;
        remove_from_array(self.mouseout,callback);
    };

    MouseReader.prototype.onmousewheel = function (callback) {
        var self = this;
        self.mousewheel.push(callback);
    };

    MouseReader.prototype.onmousedown = function (callback,type) {
        var self = this;
        switch (type) {
            case 'left':
                self.leftdown.push(callback);
                break;
            case 'middle':
                self.middledown.push(callback);
                break;
            case 'right':
                self.rightdown.push(callback);
                break;
            default:
                self.mousedown.push(callback);
        }
    };

    MouseReader.prototype.onmouseup = function (callback,type) {
        var self = this;
        switch (type) {
            case 'left':
                self.leftup.push(callback);
                break;
            case 'middle':
                self.middleup.push(callback);
                break;
            case 'right':
                self.rightup.push(callback);
                break;
            default:
                self.mouseup.push(callback);
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

    window.MouseReader = MouseReader;
})(window);