/* =========================================================
 * 
 *  Prisa Digital 2012 jQuery Plugins
 *   
 * =========================================================
 * */
// Responsive Flexisel
(function($){
    $.fn.flexisel = function (options) {        
        var defaults = $.extend({
            visibleItems: 7,
            animationSpeed: 200,
            autoPlay: false,
            autoPlaySpeed: 3000,            
            pauseOnHover: true,
            setMaxWidthAndHeight: false,
            enableResponsiveBreakpoints: true,
            responsiveBreakpoints: { 
                lowMedQuer: { 
                    changePoint:1213,
                    visibleItems: 4
                }, 
                middleMedQuer: { 
                    changePoint:1450,
                    visibleItems: 5
                },
                highMedQuer: { 
                    changePoint:1680,
                    visibleItems: 6
                }
            }
        }, options);
        /******************************
        Private Variables
        *******************************/ 
        var object = $(this);
        var settings = $.extend(defaults, options);        
        var itemsWidth; // Declare the global width of each item in carousel
        var canNavigate = true; 
        var itemsVisible = settings.visibleItems; 
        
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
                
                var listParent = object.parent();
                var innerHeight = listParent.height(); 
                var childSet = object.children();
                
                var innerWidth = listParent.width(); // Set widths
                itemsWidth = (innerWidth)/itemsVisible;
                childSet.width(itemsWidth);
                childSet.last().insertBefore(childSet.first());
                childSet.last().insertBefore(childSet.first());
                object.css({'left' : -itemsWidth}); 

                object.fadeIn();
                $(window).trigger("resize"); // needed to position arrows correctly

            },
            /******************************
            Append HTML
            *******************************/
            appendHTML: function() {
                
                object.addClass("nbs-flexisel-ul");
                object.wrap("<div class='nbs-flexisel-container'><div class='nbs-flexisel-inner'></div></div>");
                object.find("li").addClass("nbs-flexisel-item");
 
                if(settings.setMaxWidthAndHeight) {
                    var baseWidth = $(".nbs-flexisel-item img").width();
                    var baseHeight = $(".nbs-flexisel-item img").height();
                    $(".nbs-flexisel-item img").css("max-width", baseWidth);
                    $(".nbs-flexisel-item img").css("max-height", baseHeight);
                }
 
                $("<div class='nbs-flexisel-nav-left'></div><div class='nbs-flexisel-nav-right'></div>").insertAfter(object);
                var cloneContent = object.children().clone();
                object.append(cloneContent);
            },
            /******************************
            Set Event Handlers
            *******************************/
            setEventHandlers: function() {
                
                var listParent = object.parent();
                var childSet = object.children();
                var leftArrow = listParent.find($(".nbs-flexisel-nav-left"));
                var rightArrow = listParent.find($(".nbs-flexisel-nav-right"));
                
                $(window).on("resize", function(event){
                    
                    methods.setResponsiveEvents();
                    
                    var innerWidth = $(listParent).width();
                    var innerHeight = $(listParent).height(); 
                    
                    itemsWidth = (innerWidth)/itemsVisible;
                    
                    childSet.width(itemsWidth);
                    object.css({'left' : -itemsWidth});
                    
                    var halfArrowHeight = (leftArrow.height())/2;
                    var arrowMargin = (innerHeight/2) - halfArrowHeight;
                    leftArrow.css("top", arrowMargin + "px");
                    rightArrow.css("top", arrowMargin + "px");
                    
                });
                $(leftArrow).on("click", function (event) {
                    methods.scrollLeft();
                });             
                $(rightArrow).on("click", function (event) {
                    methods.scrollRight();
                });             
                if(settings.pauseOnHover == true) {
                    $(".nbs-flexisel-item").on({
                        mouseenter: function () {
                            canNavigate = false;
                        }, 
                        mouseleave: function () {
                            canNavigate = true;
                        }
                     });
                }
                if(settings.autoPlay == true) {
                    
                    setInterval(function () {
                        if(canNavigate == true)
                            methods.scrollRight();
                    }, settings.autoPlaySpeed);
                }
                
            },
            /******************************
            Set Responsive Events
            *******************************/
            setResponsiveEvents: function() {
                var contentWidth = $('html').width();
                
                if(settings.enableResponsiveBreakpoints == true) {
                    if(contentWidth < settings.responsiveBreakpoints.lowMedQuer.changePoint) {
                        itemsVisible = settings.responsiveBreakpoints.lowMedQuer.visibleItems;
                    }
                    else if(contentWidth > settings.responsiveBreakpoints.lowMedQuer.changePoint && contentWidth < settings.responsiveBreakpoints.middleMedQuer.changePoint) {
                        itemsVisible = settings.responsiveBreakpoints.middleMedQuer.visibleItems;
                    }
                    else if(contentWidth > settings.responsiveBreakpoints.middleMedQuer.changePoint && contentWidth < settings.responsiveBreakpoints.highMedQuer.changePoint) {
                        itemsVisible = settings.responsiveBreakpoints.highMedQuer.visibleItems;
                    }
                    else {
                        itemsVisible = settings.visibleItems;
                    }
                }
            },
            /******************************
            Scroll Left
            *******************************/
            scrollLeft:function() {

                if(canNavigate == true) {
                    canNavigate = false;
                    
                    var listParent = object.parent();
                    var innerWidth = listParent.width();
                    
                    itemsWidth = (innerWidth)/itemsVisible;
                    
                    var childSet = object.children();
                    
                    object.animate({
                            'left' : "+=" + itemsWidth
                        },
                        {
                            queue:false, 
                            duration:settings.animationSpeed,
                            easing: "linear",
                            complete: function() {  
                                childSet.last().insertBefore(childSet.first()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)                                
                                methods.adjustScroll();
                                canNavigate = true; 
                            }
                        }
                    );
                }
            },
            /******************************
            Scroll Right
            *******************************/
            scrollRight:function() {                
                if(canNavigate == true) {
                    canNavigate = false;
                    
                    var listParent = object.parent();
                    var innerWidth = listParent.width();
                    
                    itemsWidth = (innerWidth)/itemsVisible;
                    
                    var childSet = object.children();
                    
                    object.animate({
                            'left' : "-=" + itemsWidth
                        },
                        {
                            queue:false, 
                            duration:settings.animationSpeed,
                            easing: "linear",
                            complete: function() {  
                                childSet.first().insertAfter(childSet.last()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)   
                                methods.adjustScroll();
                                canNavigate = true; 
                            }
                        }
                    );
                }
            },          
            /******************************
            Adjust Scroll 
            *******************************/            
            adjustScroll: function() {              
                var listParent = object.parent();
                var childSet = object.children();               
                
                var innerWidth = listParent.width(); 
                itemsWidth = (innerWidth)/itemsVisible;
                childSet.width(itemsWidth);
                object.css({'left' : -itemsWidth});     
            }        
        };        
        if (methods[options]) {     // $("#element").pluginName('methodName', 'arg1', 'arg2');
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof options === 'object' || !options) {   // $("#element").pluginName({ option: 1, option:2 });
            return methods.init.apply(this);  
        } else {
            $.error( 'Method "' +  method + '" does not exist in flexisel plugin!');
        }     
};
})(jQuery);
// Slider plugin
(function($){
    $.fn.PlusSlider = function(){
        this.each(function(){
            var slider = {}, nextMov;

            slider = jQuery(this);        
            slider.ul = slider.find('ul');
            slider.li = slider.ul.find('li');
            slider.nu = slider.li.length;
            //slider.inc = slider.ul.find('li').outerWidth();        
            slider.pres = 0;
            slider.height = 0;
            slider.width = 0;

            for(i=0; i<slider.nu; i++){
                var w = $(slider.li[i]).width();
                var h = $(slider.li[i]).height();
                slider.height = (h > slider.height) ? h : slider.height;
                slider.width = (w > slider.width) ? w : slider.width;
            }
            slider.ul.css({
                width: slider.width,
                height: slider.height
            });
            for(i=0; i<slider.nu; i++){
                var sl = $(slider.li[i]);
                sl.attr('class', 'slider' +[i+1]);
                sl.css({
                    left: slider.width * i
                });
            }
            slider.go = function(where) {            
                if(where == 'next'){
                    slider.find('.sliderNav li', this).removeClass('active');
                    slider.pres = (slider.pres < slider.nu-1) ? slider.pres + 1 : 0;
                    slider.find('.sliderNav li.sliderLi-' + slider.pres).addClass('active');
                    
                } else if(where == 'prev') {
                    slider.find('.sliderNav li', this).removeClass('active');
                    slider.pres = (slider.pres > 0) ? slider.pres -1 : slider.nu -1;
                    slider.find('.sliderNav li.sliderLi-' + slider.pres).addClass('active');
                } else {
                    slider.pres = parseInt(where, 10);
                }
                for(i=0; i<slider.nu; i++){
                    var sl = $(slider.li[i]);
                    sl.animate({
                        left: slider.width * (i - slider.pres)
                    },100);    
                }                
                clearTimeout(nextMov);
                nextMov = setTimeout(autoSlider, 3000);
            }
            
            slider.find('.next').click(function() {
              slider.go('next');
              return false; 
            });

            slider.find('.prev').click(function() {
              slider.go('prev');
              return false; 
            });

            var autoSlider = function(){
                slider.go('next');
            };
            nextMov = setTimeout(autoSlider, 3000);

            var pagination = '<ul class="sliderNav">';        
                for(i=0; i<slider.nu; i++){
                    var activeClass = (i == 0) ? 'active' : '';
                    pagination += '<li class="sliderLi-' + (i) + ' ' + activeClass + '"><a href="#" data-slider-pos="' +(i) + '">'+ (i+1) +'</a></li>';
                }
                pagination += '</ul>'; 

            $(slider).append(pagination);

            slider.find('.sliderNav li a').click(function() {
                var goTo = $(this).data('slider-pos');
                slider.go(goTo);
                $(this).parent().parent().find("li").removeClass('active');
                $(this).parent().addClass('active');
                return false;
            });
        });        
    }
})(jQuery);
function detectMiddleBox(el) {
    var elemento = $(el+' .slider-box-item');
    var existClass = (elemento.hasClass('grande')) ? elemento.removeClass('grande') : '';
    if($(el+" > div").width() == 1602) {        
        elemento.eq(4).addClass('grande');       
    }else if($(el+" > div").width() == 1136 || $(el+" > div").width() == 1369) {        
        elemento.eq(3).addClass('grande');
    }else {        
        elemento.eq(2).addClass('grande');
    }
};
//=================================// 
// Custom select                   //
//=================================//
// Se reemplazan todos los select por ul. 
replaceSelect = function(elem){
    var valorInicial
    var optionSelected = $(elem).find('select option:selected');
    if( optionSelected.length > 0 ){
        valorInicial = optionSelected.text();
    } else{
        valorInicial = $(elem).find('select option:first-child').text();
    }        
    var custom = '<div class="custom">';
    custom += '<span class="current">'+valorInicial+'</span>';
    custom += '<ul>';
    $(elem).find('select option').each(function(index){
        var val = $(this).val();
        custom += '<li rel="'+val+'">';
        custom += $(this).text();
        custom += '</li>';
	});
    custom += '</ul>';
    custom += '</div>';
    
    $(elem).append(custom);
    $(elem).find('select').hide();
};   
// Mostrar/Ocultar opciones
showOptions = function(elem){
    $(elem).next('ul').toggleClass('desplegado');
};
setOption = function(elem){
    var seleccionado = $(elem).attr('rel');
    var txtSeleccionado = $(elem).text();
	var customSelect = $(elem).closest('.custom-select');
	//NOTA: comprobar
	if (customSelect.find('option:selected').val() != '')
	customSelect.find('option:selected').removeAttr('selected');
	customSelect.find('option[value="'+seleccionado+'"]').attr('selected', 'selected');
	customSelect.find('.current').text(txtSeleccionado);
	customSelect.find('.custom ul').toggleClass('desplegado');        
    $("select",customSelect).trigger("change");
};
/*
$('.custom-select .current').on('click', function(e){
   showOptions(this);
   e.stopPropagation();
});    
$(document).on('click', function(){
   $('.custom-select .custom ul').removeClass('desplegado');
});    
$('.custom-select ul li').on('click', function(){
   setOption(this);
});  
*/
$(document).ready(function(){
    var ie8 = false;

    $("#sliderDestacados").flexisel();
    $("#sliderMenuDeportes").flexisel();
    $("#sliderTodoCine").flexisel();
    $("#sliderTodoSeries").flexisel();
    $("#sliderTodoFutbol").flexisel();

    // If is Internet Explorer 8
    if(ie8){
        $('.floating-div-menu ul li').last().addClass('last');
    };
    //=================================// 
    // Menus                           //
    //=================================//
    $('header').on('mouseenter', 'ul li:has(ul.dropdown-menu)', function(e){
        $(this).find('ul').slideDown(500);
    });
    $('header').on('mouseleave', 'ul li:has(ul.dropdown-menu)', function(e){
        $(this).find('ul').hide();
    });
    var desDiv = $('#slider');
    //=================================// 
    //Ocultar destacados               //
    //=================================//    
    $('.destacados span').on('click',function(){        
        if($('.sliderDestacados').is(':visible')){
            $('.sliderDestacados').slideUp('linear');
            $('.destacados span').html('Mostrar Destacados').addClass('hide');
            $('.destacados h1').hide('400');
            if($('.decoration').length){
                $('.decoration').css('top','284px');
            }        
        }else{
            $('.sliderDestacados').slideDown('linear');
            $('.destacados span').html('Ocultar Destacados').removeClass('hide');
            $('.destacados h1').show('400');
            if($('.decoration').length){
                $('.decoration').css('top','585px');
            }        
        }
    });
    //Checked & Unchecked              //
    //=================================//  
    $('.conditionLabel input').on('click',function(){
        if($(this).parent('label').hasClass('unchecked')){
            $(this).parent('label').removeClass('unchecked').addClass('checked');
        }else{
            $(this).parent('label').removeClass('checked').addClass('unchecked');
        }
    });
    //=====================================================// 
    //Button Validar show and hide in pagos_taquilla.html //
    //===================================================//
    $('#codePromo').on('focus', function(){
       $('#validarCodePromo').show(); 
    });
    $('#codePromo').on('blur', function(){
        if($(this).val() == ''){
            $('#validarCodePromo, .shopInfoText').hide();
        }        
    });
    $('#validarCodePromo').on('click', function(){
       $('.shopInfoText').show(); 
    });
    //===============================================// 
    //Open facebook and twitter box in ficha.html   //
    //=============================================//
    $('#facebook').on('click', function(){
        var twitter = ($('.facebook').is(':hidden')) ? $('.facebook').fadeIn(200) : $('.facebook').fadeOut(200);
    });
    $('#twitter').on('click', function(){
        var twitter = ($('.twitter').is(':hidden')) ? $('.twitter').fadeIn(200) : $('.twitter').fadeOut(200);
    });
});
