THIS PROYECT IS FORKED FROM 9bitStudios/flexisel

Flexisel
========

A responsive carousel jQuery plugin...

[View Demo](http://9bitstudios.github.com/flexisel/) | [Buy Author a Coffee](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NNCJ79B2W6MUL)

All you have to do is call flexisel on your unordered list containing images. Call it on the $(window).load event (as opposed to the $(document).ready event) so that Flexisel can calculate the width of the images and figure out how to space them out properly. For example...

```javascript
$(window).load(function() {
  $("#myCarousel").flexisel();
});
```

Below is how you'd call it passing in all the options....

```javascript
$(window).load(function() {
  $("#myCarousel").flexisel(
    visibleItems: 4,
    animationSpeed: 200,
    autoPlay: false,
    autoPlaySpeed: 3000,
    pauseOnHover: true,
    enableResponsiveBreakpoints: true,
    responsiveBreakpoints: {
      portrait: {
        changePoint:480,
        visibleItems: 1
      }, 
      landscape: {
        changePoint:640,
        visibleItems: 2
      },
      tablet: {
        changePoint:768,
        visibleItems: 3
      }
    }
  );
});
```

### Options

Below is a listing of some basic options you can set...

| Option | Value | Default Value | Description | Example |
| --- | --- | --- | --- | --- |
visibleItems | Integer | 4 | Sets the initial number of visible items in the carousel | visibleItems: 5
animationSpeed | Integer (in Milliseconds) | 200 | Sets the "speed" of the animation when the carousel navigates right or left. | animationSpeed: 1000 
autoPlay | Boolean | false | Sets whether or not the carousel automatically scrolls items on a timer | autoPlay: true
autoPlaySpeed | Integer (in milliseconds) | 3000 | Sets the interval by which items scroll when autoplaying. Note that the autoPlay value has to be set to true for this value to be applicable | autoPlaySpeed: 5000
pauseOnHover | Boolean | true | Sets whether or not to pause the carousel on hover if playing. Note that the autoPlay value has to be set to true for this to be applicable | pauseOnHover: false
enableResponsiveBreakpoints | Boolean | false | Sets whether or not to enable responsive breakpoints | enableResponsiveBreakpoints: true

### Responsive Breakpoints

This is an object that specifies responsive breakpoints. In order for this to be enabled the enableResponsiveBreakpoints setting must be set to true. There are 3 different responsive events you can specify (portrait, landscape, and tablet). The responsiveBreakpoints object sets the threshold of where the screen width falls below a certain width. So for example, the portrait responsive breakpoint will be applied to the carousel when the screen width is less than the changePoint value set for portrait. The number of items shown in this state will be whatever value is set for visibleItems. Usually, because the portrait responsive event is used to show portrait views on mobile phones, 1 is a good value to set here.

For example...

```javascript
 responsiveBreakpoints: {
    portrait: {
      changePoint:480,
      visibleItems: 1
    }, 
    landscape: {
      changePoint:640,
      visibleItems: 2
    },
    tablet: {
      changePoint:768,
      visibleItems: 3
    }
}
```

The landscape responsive breakpoint will be applied when the screen width is greater than the width of the portrait changePoint value, but less that the width of the tablet changePoint value. Likewise, when the screen width falls below the tablet changePoint, the number of visibleItems set for the tablet event will be shown.


