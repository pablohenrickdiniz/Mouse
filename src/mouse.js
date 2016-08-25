(function(window){
    var Mouse = function (element) {
        var self = this;
        initialize.apply(self);
        self.element = element;
        self.events = [];
    };

    Mouse.prototype.addEventListener = function(name,callback){
        var self = this;
        if(self.events[name] == undefined){
            self.events[name] = [];
        }
        if(self.events[name].indexOf(callback) == -1){
            self.events[name].push(callback);
        }
    };

    Mouse.prototype.removeEventListener = function(name,callback){
        var self = this;
        if(self.events[name] != undefined){
            var index = self.events[name].indexOf(callback);
            if(index != -1){
                self.events[name].splice(index,1);
            }
        }
    };

    var initialize = function(){
        var self = this;
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


        var mousemove = function(event){
            event.preventDefault();
            var x = event.offsetX;
            var y = event.offsetY;
            lastX = x;
            lastY = y;
            if(self.events['mousemove'] != undefined){
                call_events(self.events['mousemove'],self,[x,y,event]);
            }
        };

        var mousedown=function(event){
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

            if(self.events['mousedown'] != undefined){
                call_events(self.events['mousedown'],self,[lastDownX,lastDownY,event]);
            }
        };

        var mouseout =function(event){
            event.preventDefault();
            left = false;
            right = false;
            middle = false;
            if(self.events['mouseout'] != undefined){
                call_events(self.events['mouseout'],self, [event]);
            }
        };

        var mouseenter = function(event){
            event.preventDefault();
            if(self.events['mouseenter'] != undefined){
                call_events(self.events['mouseenter'],self, [event]);
            }
        };

        var mousewheel = function(e){
            e.preventDefault();
            var wheel = e.detail ? e.detail * (-120) : e.wheelDelta;
            if(/Firefox/i.test(navigator.userAgent)){
                wheel = (wheel / 360)*120;
            }
            lastWheel = wheel;
            if(self.events['mousewheel'] != undefined){
                call_events(self.events['mousewheel'],self, [wheel,e]);
            }
        };

        var mouseup = function (event) {
            event.preventDefault();
            event.stopPropagation();
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

                if(self.events['mouseup'] != undefined){
                    call_events(self.events['mouseup'],self, [lastUpX,lastUpY,event]);
                }
            }
        };

        var contextmenu =  function(e){
            e.preventDefault();
        };

        var windowblur = function(e){
            left = false;
            right = false;
            middle = false;
        };

        window.addEventListener('blur',windowblur);

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
    };

    var call_events = function(events,context,params){
        var length = events.length;
        var i;
        for(i =0; i < length;i++){
            events[i].apply(context,params);
        }
    };

    window.Mouse = Mouse;
})(window);