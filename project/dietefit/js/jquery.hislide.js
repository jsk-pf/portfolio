(function($) {
    var slide = function(ele,options) {
        var $ele = $(ele);
        
        var setting = {
            speed: 1000,
            interval: 2000,
            
        };
        $.extend(true, setting, options);
        var states = [
            { $zIndex: 1, width: 255, height: 491, top: 44, left:0, $opacity: 0.7},
            { $zIndex: 2, width: 255, height: 491, top: 44, left:305, $opacity: 0.7},
            { $zIndex: 3, width: 278, height: 535, top: 0, left:601, $opacity: 1},
            { $zIndex: 2, width: 255, height: 491, top: 44, left: 918, $opacity:0.7},
            { $zIndex: 2, width: 255, height: 491, top: 44, left: 1224, $opacity: 0.7},
            { $zIndex: 1, width: 255, height: 491, top: 0, left: 601, $opacity: 0.7},
       
        ];

        var $lis = $ele.find("li");
        var timer = null;

        $ele.find(".slide_next_btn").on("click", function() {
            next();
        });
        $ele.find(".slide_prev_btn").on("click", function() {
            states.push(states.shift());
            move();
        });

        move();
     //   autoPlay();

        function move() {
            $lis.each(function(index, element) {
                var state = states[index];
                
                // slide text
                if(state.$zIndex == 3){
                    $("#slide_title").html($(element).attr("slide_title"));
                    $("#slide_cont").html($(element).attr("slide_cont"));
                }
                $(element).css("zIndex", state.$zIndex).finish().animate(state, setting.speed).find("img").css("opacity", state.$opacity);
                
             
            });
        }
        


        function next() {
            
            states.unshift(states.pop());
            
            move();
        }/*

        function autoPlay() {
            timer = setInterval(next, setting.interval);
        }*/
    }
    $.fn.hiSlide = function(options) {
        $(this).each(function(index, ele) {
            slide(ele,options);
        });
        return this;
    }
})(jQuery);
