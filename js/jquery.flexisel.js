/*
 * 
 * File: jquery.flexisel.js
 * Version: 1.0.2
 * Description: Responsive carousel jQuery plugin
 * Author: 9bit Studios
 * Copyright 2012, 9bit Studios
 * http://www.9bitstudios.com
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function ($) {
	$.widget( "9bit.flexiselWidget",{
		options: {
            visibleItems : 8,
            animationSpeed : 200,
            autoPlay : false,
            autoPlaySpeed : 3000,
	        pauseOnHover : true,
            setMaxWidthAndHeight : false,
            enableResponsiveBreakpoints : true,
            onScrollLeft : function() {},
            onScrollRight : function() {},
            noScrollLeft : function() {},
            noScrollRight : function() {},
            clone : true,
            responsiveBreakpoints : {
                portrait: { 
                    changePoint:480,
                    visibleItems: 3
                }, 
                landscape: { 
                    changePoint:640,
                    visibleItems: 4
                },
                tablet: { 
                    changePoint:768,
                    visibleItems: 6
                }
            }
		},

		
		_create: function(){
			this._instanceVariables=  {
		        object: this.element,
		        settings: this.options,
		        itemsWidth: 0, // Declare the global width of each item in carousel
		        canNavigate: true,
		        itemsVisible: this.options.visibleItems, // Get visible items
		        totalItems: this.element.children().length, // Get number of elements
		        responsivePoints: []
			};
			
			
			this._appendHTML();
			this._setEventHandlers();
            this._initializeItems();
		},
		
		/** Private Methods **/
		
        /******************************
        Initialize Items
        Fully initialize everything. Plugin is loaded and ready after finishing execution
    *******************************/
        _initializeItems : function() {

            var listParent = this._instanceVariables.object.parent();
            var innerHeight = listParent.height();
            var childSet = this._instanceVariables.object.children();
            this._sortResponsiveObject(this._instanceVariables.settings.responsiveBreakpoints);
            
            var innerWidth = listParent.width(); // Set widths
            itemsWidth = (innerWidth) / this._instanceVariables.itemsVisible;
            childSet.width(itemsWidth);        
            if (this._instanceVariables.settings.clone) {
                childSet.last().insertBefore(childSet.first());
                childSet.last().insertBefore(childSet.first());
                this._instanceVariables.object.css({
                    'left' : -this._instanceVariables.itemsWidth
                });
            }

            this._instanceVariables.object.fadeIn();
            $(window).trigger("resize"); // needed to position arrows correctly

        },		
		
	    /******************************
        Append HTML
        Add additional markup needed by plugin to the DOM
    	******************************/
        _appendHTML : function() {
            this.element.addClass("nbs-flexisel-ul");
            this.element.wrap("<div class='nbs-flexisel-container'><div class='nbs-flexisel-inner'></div></div>");
            this.element.find("li").addClass("nbs-flexisel-item");

            if (this._instanceVariables.settings.setMaxWidthAndHeight) {
                var baseWidth = $(".nbs-flexisel-item img").width();
                var baseHeight = $(".nbs-flexisel-item img").height();
                $(".nbs-flexisel-item img").css("max-width", baseWidth);
                $(".nbs-flexisel-item img").css("max-height", baseHeight);
            }
            $("<div class='nbs-flexisel-nav-left'></div><div class='nbs-flexisel-nav-right'></div>").insertAfter(this.element);
            if (this._instanceVariables.settings.clone) {
                var cloneContent = this.element.children().clone();
                this.element.append(cloneContent);
            }
        },
        
        /****
         * Allow a new child object to be added to the scroller
         * 
         * @param sDirection
         * @param oChild
         */
        appendChild : function(sDirection, oChild){
            var listParent = this.element.parent();
            var leftArrow = listParent.find($(".nbs-flexisel-nav-left"));
            var rightArrow = listParent.find($(".nbs-flexisel-nav-right"));

            if ( sDirection === "left"){
            	
            	this.element.prepend(oChild).css({
            		'left' : -this._instanceVariables.itemsWidth	
            	})
            	 
            	$(leftArrow).removeClass("nbs-flexisel-hidden");
            }else{
            	this.element.append(oChild);
            	$(rightArrow).removeClass("nbs-flexisel-hidden");
            }

        	
        	// Set new total item count
        	this._setChildrenTotalItems();
        	
        },
        
        //Set the items for the children
        _setChildrenTotalItems : function() {
        	this._instanceVariables.totalItems =  this.element.children().length; // Get number of elements
        },
        
        /******************************
        Set Event Handlers
    	Set events: click, resize, etc
        *******************************/
        _setEventHandlers : function() {

            var listParent = this.element.parent();
            var childSet = this.element.children();
            var leftArrow = listParent.find($(".nbs-flexisel-nav-left"));
            var rightArrow = listParent.find($(".nbs-flexisel-nav-right"));
            
            var widget = this;

            $(window).on("resize", function(event) {
            	widget._setResponsiveEvents();

                var innerWidth = $(listParent).width();
                var innerHeight = $(listParent).height();

                widget._instanceVariables.itemsWidth = (innerWidth) / widget._instanceVariables.itemsVisible;

                childSet.width(widget._instanceVariables.itemsWidth);
                if (widget._instanceVariables.settings.clone) {
                    widget.element.css({
                        'left' : -widget._instanceVariables.itemsWidth                            
                    });
                }else {
                    widget.element.css({
                        'left' : 0
                    });
                }

                var halfArrowHeight = (leftArrow.height()) / 2;
                var arrowMargin = (innerHeight / 2) - halfArrowHeight;
                leftArrow.css("top", arrowMargin + "px");
                rightArrow.css("top", arrowMargin + "px");

            });
            $(leftArrow).on("click", function(event) {
                widget.scrollLeft();
            });
            $(rightArrow).on("click", function(event) {
           	   widget.scrollRight();
            });
            
            // When the inital load occurs hide the left arrow if
            // scrolling is not allowed.
            if ( ! this.allowScroll("left")){
            	$(leftArrow).addClass("nbs-flexisel-hidden");
            }
            
            if (this._instanceVariables.settings.pauseOnHover == true) {
                $(".nbs-flexisel-item").on({
                    mouseenter : function() {
                        widget._instanceVariables.canNavigate = false;
                    },
                    mouseleave : function() {
                        widget._instanceVariables.canNavigate = true;
                    }
                });
            }
            if (this._instanceVariables.settings.autoPlay == true) {

                setInterval(function() {
                    if (this._instanceVariables.canNavigate == true)
                        this.scrollRight();
                }, this._instanceVariables.settings.autoPlaySpeed);
            }

        },
        /******************************
        Set Responsive Events
        Set breakpoints depending on responsiveBreakpoints
        *******************************/            
        
        _setResponsiveEvents: function() {
            var contentWidth = $('html').width();
            
            if(this._instanceVariables.settings.enableResponsiveBreakpoints) {
                
                var largestCustom = this._instanceVariables.responsivePoints[this._instanceVariables.responsivePoints.length-1].changePoint; // sorted array 
                
                for(var i in this._instanceVariables.responsivePoints) {
                    
                    if(contentWidth >= largestCustom) { // set to default if width greater than largest custom responsiveBreakpoint 
                        this._instanceVariables.itemsVisible = this._instanceVariables.settings.visibleItems;
                        break;
                    }
                    else { // determine custom responsiveBreakpoint to use
                    
                        if(contentWidth < this._instanceVariables.responsivePoints[i].changePoint) {
                            this._instanceVariables.itemsVisible = this._instanceVariables.responsivePoints[i].visibleItems;
                            break;
                        }
                        else
                            continue;
                    }
                }
            }
        },

        /******************************
        Sort Responsive Object
        Gets all the settings in resposiveBreakpoints and sorts them into an array
        *******************************/            
        
        _sortResponsiveObject: function(obj) {
            
            var responsiveObjects = [];
            
            for(var i in obj) {
                responsiveObjects.push(obj[i]);
            }
            
            responsiveObjects.sort(function(a, b) {
                return a.changePoint - b.changePoint;
            });
        
            this._instanceVariables.responsivePoints = responsiveObjects;
        },
        

        /******************************
        Adjust Scroll 
         *******************************/
        _adjustScroll : function() {
        	
            var listParent = this.element.parent();
            var childSet = this.element.children();

            var innerWidth = listParent.width();
            this._instanceVariables.itemsWidth = (innerWidth) / this._instanceVariables.itemsVisible;
            childSet.width(this._instanceVariables.itemsWidth);
            if (this._instanceVariables.settings.clone) {
                this.element.css({
                    'left' : -this._instanceVariables.itemsWidth
                });
            }
        },
        
        
        /** Public Methods **/
        
        /*******************************
         * Can Scroll             * 
         *******************************/
        allowScroll : function( direction){
        	var bReturn = false;
        	if ( this._instanceVariables.settings.clone){
        		bReturn = true;
        	}else if (direction === 'left'){
        		if ( parseInt(this.element.css("left")) < 0) {
                  bReturn = true;
                  
       	       }     	   
        	}else if (direction === 'right'){
                var listParent = this.element.parent();
                var innerWidth = listParent.width();

                this._instanceVariables.itemsWidth = (innerWidth) / this._instanceVariables.itemsVisible;

                var difObject = (this._instanceVariables.itemsWidth - innerWidth);
                var objPosition = (this.element.position().left + ((this._instanceVariables.totalItems-this._instanceVariables.itemsVisible)*this._instanceVariables.itemsWidth)-innerWidth);    
                
                if((difObject < Math.ceil(objPosition)) && (!this._instanceVariables.settings.clone)){
                	bReturn = true;                    	
                }
        	}
        	
        	return bReturn;
        },
        /******************************
        Scroll Left
        *******************************/
        scrollLeft : function() {
        	var widget = this;

            var listParent = this.element.parent();
            var leftArrow = listParent.find($(".nbs-flexisel-nav-left"));
            var rightArrow = listParent.find($(".nbs-flexisel-nav-right"));
        	
            if ( this.allowScroll("left") ){
            	
                if (this._instanceVariables.canNavigate == true) {
                    this._instanceVariables.canNavigate = false;

                    var listParent = this.element.parent();
                    var innerWidth = listParent.width();

                    this._instanceVariables.itemsWidth = (innerWidth) / this._instanceVariables.itemsVisible;

                    var childSet = this.element.children();

                    this.element.animate({
                        'left' : "+=" + this._instanceVariables.itemsWidth
                    }, {
                        queue : false,
                        duration : this._instanceVariables.settings.animationSpeed,
                        easing : "linear",
                        complete : function() {
                            if (widget._instanceVariables.settings.clone) {
                                childSet.last().insertBefore(
                                        childSet.first()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)                                   
                            }
                            widget._adjustScroll();
                            widget._instanceVariables.canNavigate = true;
                            widget._trigger( "onScrollLeft" ); //Callback for after the scroll has happened
                            
                            // Hide the navigation if scolling is not an option
                            $(rightArrow).removeClass("nbs-flexisel-hidden");
                            
                           if ( ! widget.allowScroll("left")){
                        	   $(leftArrow).addClass("nbs-flexisel-hidden");
                        	   widget._trigger( "noScrollLeft" );//Callback for after the scroll failed
                           }

                        }
                    });
                }
            }
        },
        /******************************
        Scroll Right
        *******************************/            
        scrollRight : function() {
            var widget = this;

            var listParent = this.element.parent();
            var childSet = this.element.children();
            var leftArrow = listParent.find($(".nbs-flexisel-nav-left"));
            var rightArrow = listParent.find($(".nbs-flexisel-nav-right"));
            
            
            if(this.allowScroll("right")  && (!this._instanceVariables.settings.clone)){
                if (this._instanceVariables.canNavigate == true) {
                    this._instanceVariables.canNavigate = false;                    

                    this.element.animate({
                        'left' : "-=" + this._instanceVariables.itemsWidth
                    }, {
                        queue : false,
                        duration : this._instanceVariables.settings.animationSpeed,
                        easing : "linear",
                        complete : function() {                                
                            widget._adjustScroll();
                            widget._instanceVariables.canNavigate = true;
                            widget._trigger( "onScrollRight" ); //Callback for after the scroll has happened

                            // Hide the navigation is scolling is not an option
                            $(leftArrow).removeClass("nbs-flexisel-hidden");
                           if ( ! widget.allowScroll("right")){
                        	   $(rightArrow).addClass("nbs-flexisel-hidden");
                           	   widget._trigger( "noScrollRight" ); //Callback for after the scroll failed
                           	 //  widget._adjustScroll(); //Testing
                           }
                            
                            
                        }
                    });

                }
            } else if(this._instanceVariables.settings.clone){
                if (this._instanceVariables.canNavigate == true) {
                    this._instanceVariables.canNavigate = false;

                    var childSet = this.element.children();

                    this.element.animate({
                        'left' : "-=" + this._instanceVariables.itemsWidth
                    }, {
                        queue : false,
                        duration : this._instanceVariables.settings.animationSpeed,
                        easing : "linear",
                        complete : function() {                                
                                childSet.first().insertAfter(childSet.last()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)                                
                            widget._adjustScroll();
                            widget._instanceVariables.canNavigate = true;
                            widget._trigger( "onScrollRight" ); //Callback for after the scroll has happened
                            
                        }
                    });
                }
            };                
        },
	});
	
	
})(jQuery);

