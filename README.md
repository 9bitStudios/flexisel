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
  $("#myCarousel").flexisel({
    visibleItems: 4,
    itemsToScroll: 3,
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
    }
  });
});
```

### Options

Below is a listing of some basic options you can set...

| Option | Value | Default Value | Description | Example |
| --- | --- | --- | --- | --- |
visibleItems | Integer | 4 | Sets the initial number of visible items in the carousel | visibleItems: 5
itemsToScroll | Integer | 3 | Sets the initial number of items that you want to scroll. Note: This value will be overridden by responsive breakpoint settings at smaller or larger screen widths | itemsToScroll: 2
animationSpeed | Integer (in Milliseconds) | 400 | Sets the "speed" of the animation when the carousel navigates right or left. | animationSpeed: 1000 
infinite | Boolean | true | Sets whether or not the carousel wraps infinitely | infinite: false
navigationTargetSelector | String (selector) | null | The left/right arrows will be added to the element with this selector instead of the default | navigationTargetSelector: '#navigation'
autoPlay | Object | autoPlay: { enable: false, interval: 5000, pauseOnHover: true } | Values for setting autoplay. The "enable" property must be true for this to apply | autoPlay: { enable: true, interval: 7000, pauseOnHover: false }

### Responsive Breakpoints

This is an object that specifies responsive breakpoints. You can name your objects whatever you want (the default names provided are "portrait," "landscape," and "tablet") and you can have as many or as few as you want (so you could add to or delete any of the defaults), but each one needs to have a "changePoint" a "visibleItems", and an "itemsToScroll" property. Those properties are required. The responsiveBreakpoints object sets the threshold of where the screen width falls below a certain width. So for example, the example default portrait responsive breakpoint will be applied to the carousel when the screen width is less than the changePoint value set for portrait. The number of items shown in this state will be whatever value is set for visibleItems and the number of items that scroll per click (or swipe) is set by the itemsToScroll property. 

For example...

```javascript
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
}
```

The landscape responsive breakpoint will be applied when the screen width is greater than the width of the portrait changePoint value, but less that the width of the tablet changePoint value. Likewise, when the screen width falls below the tablet changePoint, the number of visibleItems set for the tablet event will be shown. The same is true for the portrait breakpoint. Usually, because the portrait responsive event is used to show portrait views on mobile phones, 1 is a good value to set for both visibleItems and itemsToScroll here. And remember you can pass as many or as few of these as you like in and you can name them whatever you want. So, for example, if you wanted to just have things only show 1 item on all views below a certain width you could pass in something like the following... 

```javascript
 responsiveBreakpoints: {
    mobile: {
      changePoint:768,
      visibleItems: 1,
      itemsToScroll: 1
    }
}
```

And then this will be the only point at which Flexisel changes.

[View Demo](http://9bitstudios.github.com/flexisel/) | [Buy Author a Coffee](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NNCJ79B2W6MUL)
