(function(w){
    var Mouse = function (element) {
        var self = this;
        initialize(self);
        self.element = element;
        self.listeners = [];
    };

    /**
     *
     * @param event
     * @param params
     */
    Mouse.prototype.trigger = function(event,params){
        var self = this;
        if(self.listeners[event] != undefined){
            var length = self.listeners[event].length;
            for(var i =0; i < length;i++){
                self.listeners[event][i].apply(self,params);
            }
        }
    };

    /**
     *
     * @param event
     * @param callback
     */
    Mouse.prototype.addEventListener = function(event,callback){
        var self = this;
        if(self.listeners[event] == undefined){
            self.listeners[event] = [];
        }
        if(self.listeners[event].indexOf(callback) == -1){
            self.listeners[event].push(callback);
        }
    };

    /**
     *
     * @param event
     * @param callback
     */
    Mouse.prototype.removeEventListener = function(event,callback){
        var self = this;
        if(self.listeners[event] != undefined){
            var index = self.listeners[event].indexOf(callback);
            if(index != -1){
                self.listeners[event].splice(index,1);
            }
        }
    };

    function initialize(self){
        var element = null;
        var left = false;
        var middle = false;
        var right = false;
        var lastDownX = 0;
        var lastDownY = 0;
        var lastUpX = 0;
        var lastUpY = 0;
        var lastWheel = 0;
        var lastX = 0;
        var lastY = 0;


        function mousemove(event){
            if(event.target == element){
                event.preventDefault();
                var x = event.offsetX;
                var y = event.offsetY;
                lastX = x;
                lastY = y;
                self.trigger('mousemove',[x,y,event]);
            }
        }

        function mousedown(event){
            if(event.target == element){
                event.preventDefault();
                lastDownX = event.offsetX;
                lastDownY = event.offsetY;

                switch(event.which){
                    case 1:
                        left = true;
                        break;
                    case 2:
                        middle = true;
                        break;
                    case 3:
                        right = true;
                        break;
                }

                self.trigger('mousedown',[lastDownX,lastDownY,event]);
                return false;
            }
        }

        function mouseenter(event){
            event.preventDefault();
            self.trigger('mouseenter',[event]);
        }

        function mousewheel(e){
            e.preventDefault();
            var wheel = e.detail ? e.detail * (-120) : e.wheelDelta;
            if(/Firefox/i.test(navigator.userAgent)){
                wheel = (wheel / 360)*120;
            }
            lastWheel = wheel;
            self.trigger('mousewheel',[wheel,e]);
        }

        function mouseout(event){
            if(event.target == element){
                event.preventDefault();
                left = false;
                right = false;
                middle = false;
                self.trigger('mouseout',[event]);
                return false;
            }
        }

        function mouseup(event) {
            if(event.target == element){
                event.preventDefault();
                if (element !== null) {
                    lastUpX = event.offsetX;
                    lastUpY = event.offsetY;

                    switch (event.which) {
                        case 1:
                            left = false;
                            break;
                        case 2:
                            middle = false;
                            break;
                        case 3:
                            right = false;
                    }

                    self.trigger('mouseup',[lastUpX,lastUpY,event]);
                }
                return false;
            }
        }

        function contextmenu(e){
            e.preventDefault();
            return false;
        }

        function windowblur(e){
            left = false;
            right = false;
            middle = false;
        }

        w.addEventListener('blur',windowblur);

        var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";


        Object.defineProperty(self,'element',{
            get:function(){
                return element;
            },
            set:function(e){
                if(e != element){
                    if(element != null && element instanceof Element){
                        document.removeEventListener("mouseup",mouseup);
                        element.removeEventListener("mousemove",mousemove);
                        element.removeEventListener("mousedown",mousedown);
                        element.removeEventListener("mouseup",mouseup);
                        element.removeEventListener("mouseout",mouseout);
                        element.removeEventListener("mouseenter",mouseenter);
                        element.removeEventListener("contextmenu",contextmenu);
                        element.remove(mousewheelevt,mousewheel);
                    }
                    element = e;
                    if(e instanceof Element){
                        document.addEventListener("mouseup",mouseup);
                        element.addEventListener("mousemove",mousemove);
                        element.addEventListener("mousedown",mousedown);
                        element.addEventListener("mouseup",mouseup);
                        element.addEventListener("mouseout",mouseout);
                        element.addEventListener("mouseenter",mouseenter);
                        element.addEventListener("contextmenu",contextmenu);
                        element.addEventListener(mousewheelevt,mousewheel);
                    }
                }
            }
        });

        Object.defineProperty(self,'left',{
           get:function(){
                return left;
           }
        });

        Object.defineProperty(self,'middle',{
            get:function(){
                return middle;
            }
        });

        Object.defineProperty(self,'right',{
            get:function(){
                return right;
            }
        });

        Object.defineProperty(self,'lastDownX',{
            get:function(){
                return lastDownX;
            }
        });

        Object.defineProperty(self,'lastDownY',{
            get:function(){
                return lastDownY;
            }
        });

        Object.defineProperty(self,'lastUpX',{
            get:function(){
                return lastUpX;
            }
        });


        Object.defineProperty(self,'lastUpY',{
            get:function(){
                return lastUpY;
            }
        });

        Object.defineProperty(self,'lastWheel',{
            get:function(){
                return lastWheel;
            }
        });

        Object.defineProperty(self,'lastX',{
            get:function(){
                return lastX;
            }
        });

        Object.defineProperty(self,'lastY',{
            get:function(){
                return lastY;
            }
        });
    }

    w.Mouse = Mouse;
})(window);