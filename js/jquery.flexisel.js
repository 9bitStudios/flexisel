/*
* File: jquery.flexisel.js
* Version: 2.2.2
* Description: Responsive carousel jQuery plugin
* Author: 9bit Studios
* Copyright 2016, 9bit Studios
* http://www.9bitstudios.com
* Free to use and abuse under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/

(function ($) {

    $.fn.flexisel = function (options) {

        var defaults = $.extend({
            visibleItems: 4,
            itemsToScroll: 3,
            draggable: true,
            animationSpeed: 400,
            infinite: true,
            navigationTargetSelector: null,
            autoPlay: {
                enable: false,
                interval: 5000,
                pauseOnHover: true
            },
            responsiveBreakpoints: { 
                portrait: { 
                    changePoint:480,
                    visibleItems: 1,
                    itemsToScroll: 1
                }, 
                landscape: { 
                    changePoint:640,
                    visibleItems: 2,
                    itemsToScroll: 2
                },
                tablet: { 
                    changePoint:768,
                    visibleItems: 3,
                    itemsToScroll: 3
                }
            },
            loaded: function(){ },
            before: function(){ },
            after: function(){ },
            resize: function(){ }
        }, options);
        
        /******************************
        Private Variables
        *******************************/         
        
        var object = $(this);
        var settings = $.extend(defaults, options);        
        var itemsWidth;
        var canNavigate = true; 
        var itemCount; 
        var itemsVisible = settings.visibleItems; 
        var itemsToScroll = settings.itemsToScroll;
        var responsivePoints = [];
        var resizeTimeout;
        var autoPlayInterval;        
        
        /******************************
        Public Methods
        *******************************/        
        
        var methods = {
                
            init: function() {
                return this.each(function () {
                    methods.appendHTML();
                    methods.setEventHandlers();                  
                    methods.initializeItems();                    
                });
            },

            /******************************
            Initialize Items
            *******************************/            
            
            initializeItems: function() {
                
                var obj = settings.responsiveBreakpoints;
                for(var i in obj) { responsivePoints.push(obj[i]); }
                responsivePoints.sort(function(a, b) { return a.changePoint - b.changePoint; });
                var childSet = object.children();
                childSet.first().addClass("index");
                itemsWidth = methods.getCurrentItemWidth();
                itemCount = childSet.length;
                childSet.width(itemsWidth);
                if(settings.infinite) {
                    methods.offsetItemsToBeginning(Math.floor(childSet.length / 2)); 
                    object.css({
                        'left': -itemsWidth * Math.floor(childSet.length / 2)
                    }); 
                }
                $(window).trigger('resize');              
                object.fadeIn();
                settings.loaded.call(this, object);
                
            },
            
            /******************************
            Append HTML
            *******************************/            
            
            appendHTML: function() {
                
                object.addClass("nbs-flexisel-ul");
                object.wrap("<div class='nbs-flexisel-container'><div class='nbs-flexisel-inner'></div></div>");
                object.find("li").addClass("nbs-flexisel-item");
                
                if(settings.navigationTargetSelector && $(settings.navigationTargetSelector).length > 0) {
                    $("<div class='nbs-flexisel-nav-left'></div><div class='nbs-flexisel-nav-right'></div>").appendTo(settings.navigationTargetSelector);
                } else {
                    settings.navigationTargetSelector = object.parent();
                    $("<div class='nbs-flexisel-nav-left'></div><div class='nbs-flexisel-nav-right'></div>").insertAfter(object);    
                }
                    
                if(settings.infinite) {    
                    var childSet = object.children();
                    var cloneContentBefore = childSet.clone();
                    var cloneContentAfter = childSet.clone();
                    object.prepend(cloneContentBefore);
                    object.append(cloneContentAfter);
                }
                
            },
                    
            
            /******************************
            Set Event Handlers
            *******************************/
            setEventHandlers: function() {
                var self = this;
                var childSet = object.children();
                
                $(window).on("resize", function(event){
                    canNavigate = false;
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(function(){
                        canNavigate = true;
                        methods.calculateDisplay();
                        itemsWidth = methods.getCurrentItemWidth();
                        childSet.width(itemsWidth);
                        
                        if(settings.infinite) {
                            object.css({
                                'left': -itemsWidth * Math.floor(childSet.length / 2)
                            });        
                        } else {
                            methods.clearDisabled();
                            $(settings.navigationTargetSelector).find(".nbs-flexisel-nav-left").addClass('disabled');
                            object.css({
                                'left': 0
                            });
                        }
                        
                        settings.resize.call(self, object);

                    }, 100);
                    
                });                    
                
                $(settings.navigationTargetSelector).find(".nbs-flexisel-nav-left").on("click", function (event) {
                    methods.scroll(true);
                });
                
                $(settings.navigationTargetSelector).find(".nbs-flexisel-nav-right").on("click", function (event) {
                    methods.scroll(false);
                });
                
                if(settings.autoPlay.enable) {

                    methods.setAutoplayInterval();

                    if (settings.autoPlay.pauseOnHover === true) {
                        object.on({
                            mouseenter : function() {
                                canNavigate = false;
                            },
                            mouseleave : function() {
                                canNavigate = true;
                            }
                        });        
                    }            
                    
                }
                
                /*
                If you handle mousedown, mousemove and mouseup then you don't need to handle 
                the corresponding equivalent events under touch. The same handlers should be executing.
                mousedown === touchstart
                mousemove === touchmove
                mouseup === touchend 
                https://stackoverflow.com/questions/13510999/when-to-use-touchmove-vs-mousemove
                */
                if(settings.draggable){
                    object[0].addEventListener('mousedown', methods.touchHandler.handleMouseDown, false);  
                    object[0].addEventListener('mousemove', methods.touchHandler.handleMouseMove, false);
                    object[0].addEventListener('mouseup', methods.touchHandler.handleMouseUp, false);    
                }            
                
            },        
            
            /******************************
            Calculate Display
            *******************************/            
            
            calculateDisplay: function() {
                var contentWidth = $('html').width();
                var largestCustom = responsivePoints[responsivePoints.length-1].changePoint; // sorted array 
                
                for(var i in responsivePoints) {
                    
                    if(contentWidth >= largestCustom) { // set to default if width greater than largest custom responsiveBreakpoint 
                        itemsVisible = settings.visibleItems;
                        itemsToScroll = settings.itemsToScroll;
                        break;
                    }
                    else { // determine custom responsiveBreakpoint to use
                    
                        if(contentWidth < responsivePoints[i].changePoint) {
                            itemsVisible = responsivePoints[i].visibleItems;
                            itemsToScroll = responsivePoints[i].itemsToScroll;
                            break;
                        }
                        else {
                            continue;
                        }
                    }
                }
                
            },                
            
            /******************************
            Scroll
            *******************************/                
            
            scroll: function(reverse) {

                if(typeof reverse === 'undefined') { reverse = true }

                if(canNavigate == true) {
                    canNavigate = false;
                    settings.before.call(this, object);
                    itemsWidth = methods.getCurrentItemWidth();
                    
                    if(settings.autoPlay.enable) {
                        clearInterval(autoPlayInterval);
                    }
                    
                    if(!settings.infinite) {
                        
                        var scrollDistance = itemsWidth * itemsToScroll;
                        
                        if(reverse) {                            
                            object.animate({
                                'left': methods.calculateNonInfiniteLeftScroll(scrollDistance)
                            }, settings.animationSpeed, function(){
                                settings.after.call(this, object);
                                canNavigate = true;
                            });                            
                            
                        } else {
                            object.animate({
                                'left': methods.calculateNonInfiniteRightScroll(scrollDistance)
                            },settings.animationSpeed, function(){
                                settings.after.call(this, object);
                                canNavigate = true;
                            });                                    
                        }
                        
                        
                        
                    } else {                    
                        object.animate({
                            'left' : reverse ? "+=" + itemsWidth * itemsToScroll : "-=" + itemsWidth * itemsToScroll
                        }, settings.animationSpeed, function() {
                            settings.after.call(this, object);
                            canNavigate = true;
                            
                            if(reverse) { 
                                methods.offsetItemsToBeginning(itemsToScroll); 
                            } else {
                                methods.offsetItemsToEnd(itemsToScroll);
                            }
                            methods.offsetSliderPosition(reverse); 
                            
                        });
                    }
                    
                    if(settings.autoPlay.enable) {
                        methods.setAutoplayInterval();
                    }
                    
                }
            },
            
            touchHandler: {

                xDown: null,
                yDown: null,
                handleMouseDown: function(evt) {    
                    this.xDown = evt.clientX;                                      
                    this.yDown = evt.clientY;
                }, 
                handleMouseMove: function (evt) {
                    
                    if (!this.xDown || !this.yDown) {
                        return;
                    }

                    var cx = evt.clientX;                                    
                    var cy = evt.clientY;

                    var xDiff = this.xDown - cx;
                    var yDiff = this.yDown - cy;

                    // small arbitrary tolerance to prevent sliding on clicks
                    if (Math.abs( xDiff ) > 20) {
                        if ( xDiff > 0 ) {
                            // swipe left
                            methods.scroll(false);
                        } else {
                            //swipe right
                            methods.scroll(true);
                        }   
                        /* reset values on successfull scroll */
                        this.xDown = null;
                        this.yDown = null;
                        canNavigate = true;                    
                    }
                },
                handleMouseUp: function(evt){
                    /* reset values on mouse up */
                    this.xDown = null;
                    this.yDown = null;
                    canNavigate = true;
                }
            },            
          
            
            /******************************
            Utility Functions
            *******************************/
            
            getCurrentItemWidth: function() {
                return (object.parent().width())/itemsVisible;
            },            
            
            offsetItemsToBeginning: function(number) {
                if(typeof number === 'undefined') { number = 1 }
                for(var i = 0; i < number; i++) {
                    object.children().last().insertBefore(object.children().first());
                }    
            },                
            
            offsetItemsToEnd: function(number) {
                if(typeof number === 'undefined') { number = 1 }
                for(var i = 0; i < number; i++) {
                    object.children().first().insertAfter(object.children().last());    
                }
            },            
            
            offsetSliderPosition: function(reverse) {
                var left = parseInt(object.css('left').replace('px', ''));
                if (reverse) { 
                    left = left - itemsWidth * itemsToScroll; 
                } else {
                    left = left + itemsWidth * itemsToScroll;
                }
                object.css({
                    'left': left
                });
            },

            getOffsetPosition: function() {
                return parseInt(object.css('left').replace('px', ''));    
            },
            
            calculateNonInfiniteLeftScroll: function(toScroll) {
                
                methods.clearDisabled();
                if(methods.getOffsetPosition() + toScroll >= 0) {
                    $(settings.navigationTargetSelector).find(".nbs-flexisel-nav-left").addClass('disabled');
                    return 0;
                } else {
                    return methods.getOffsetPosition() + toScroll;
                }
            },
            
            calculateNonInfiniteRightScroll: function(toScroll){
                
                methods.clearDisabled();
                var negativeOffsetLimit = (itemCount * itemsWidth) - (itemsVisible * itemsWidth);
                
                if(methods.getOffsetPosition() - toScroll <= -negativeOffsetLimit) {
                    $(settings.navigationTargetSelector).find(".nbs-flexisel-nav-right").addClass('disabled');
                    return -negativeOffsetLimit;        
                } else {
                    return methods.getOffsetPosition() - toScroll;
                }
            },
            
            setAutoplayInterval: function(){
                autoPlayInterval = setInterval(function() {
                    if (canNavigate) {
                        methods.scroll(false);
                    }
                }, settings.autoPlay.interval);                    
            },
            
            clearDisabled: function() {
                var parent = $(settings.navigationTargetSelector);
                parent.find(".nbs-flexisel-nav-left").removeClass('disabled');
                parent.find(".nbs-flexisel-nav-right").removeClass('disabled');
            }                        
            
        };

        if (methods[options]) {     // $("#element").pluginName('methodName', 'arg1', 'arg2');
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {     // $("#element").pluginName({ option: 1, option:2 });
            return methods.init.apply(this);  
        } else {
            $.error( 'Method "' +  method + '" does not exist in flexisel plugin!');
        }        
};

})(jQuery);
