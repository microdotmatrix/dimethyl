         ---
         FitText.js
         ---

# FitText.js, a jQuery plugin for inflating web type
FitText makes font-sizes flexible. Use this plugin on your responsive design for ratio-based resizing of your headlines.

## How it works
Here is a simple FitText setup:

```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script src="jquery.fittext.js"></script>
<script>
  jQuery("#responsive_headline").fitText();
</script>
```

Your text should now fluidly resize, by default: Font-size = 1/10th of the element's width.

## The Compressor
If your text is resizing poorly, you'll want to turn tweak up/down "The Compressor". It works a little like a guitar amp. The default is `1`.

```javascript
jQuery("#responsive_headline").fitText(1.2); // Turn the compressor up   (resizes more aggressively)
jQuery("#responsive_headline").fitText(0.8); // Turn the compressor down (resizes less aggressively)
```

This will hopefully give you a level of "control" that might not be pixel perfect, but resizes smoothly & nicely.

## minFontSize & maxFontSize
FitText now allows you to specify two optional pixel values: `minFontSize` and `maxFontSize`. Great for situations when you want to preserve hierarchy.

```javascript
jQuery("#responsive_headline").fitText(1.2, { minFontSize: '20px', maxFontSize: '40px' });
```

## CSS FAQ

- :warning: Run FitText before anything that hides the element you're trying to size (e.g. before Carousels, Scrollers, Accordions, Tabs, etc). Hiding an element's container removes its width. It can't resize without a width.
- :warning: **Make sure your container has a width!**
  - `display: inline` elements don't have a width. Use `display: block` OR `display: inline-block`+ a specified width (i.e. `width: 100%`).
  - `position:absolute` elements need a specified width as well.
- Tweak until you like it.
- Set a No-JS fallback font-size in your CSS.
- :new: If your text is full width, you might want to **NOT** use FitText and just use CSS `vw` units instead. Supported in all major browsers.

## Don't use jQuery?
That's okay. Check out these handy non-jQuery versions maintained by other people.

- [non-jQuery FitText](https://github.com/adactio/FitText.js) from @adactio
- [Angular.js FitText.js](https://github.com/patrickmarabeas/AngularJS-FitText.js) from @patrickmarabeas
- [AMP-HTML FitText](https://github.com/ampproject/amphtml/tree/master/extensions/amp-fit-text)
- [FitText UMD](https://github.com/peacechen/FitText-UMD) by @peacechen

## Changelog
* `v 1.2` - Added `onorientationchange` event
* `v 1.1` - FitText now ignores font-size and has minFontSize & maxFontSize options
* `v 1.0.1` - Fix for broken font-size.
* `v 1.0` - Initial Release

## In Use:
- [Trent Walton](http://trentwalton.com)

If you want more exact fitting text, there are plugins for that! We recommend checking out [BigText](https://github.com/zachleat/BigText) by Zach Leatherman or [SlabText](https://github.com/freqDec/slabText) by Brian McAllister.

### Download, Fork, Commit.
If you think you can make this better, please Download, Fork, & Commit. We'd love to see your ideas.




         ---
         FitVids.js
         ---

# Introducing FitVids.js
A lightweight, easy-to-use jQuery plugin for fluid width video embeds.

FitVids automates [the Intrinsic Ratio Method by Thierry Koblentz](http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/) to achieve fluid width videos in your responsive web design.

## How Do I Use It?
Include jQuery 1.7+ and FitVids.js in your layout and target your videos container with `fitVids()`.

```html
<script src="path/to/jquery.min.js"></script>
<script src="path/to/jquery.fitvids.js"></script>
<script>
  $(document).ready(function(){
    // Target your .container, .wrapper, .post, etc.
    $("#thing-with-videos").fitVids();
  });
</script>
```

This will wrap each video in a `div.fluid-width-video-wrapper` and apply the necessary CSS. After the initial Javascript call, it's all percentage-based CSS magic.

## Currently Supported Players

<table>
<tr><td>YouTube</td><td>Y</td></tr>
<tr><td>Vimeo</td><td>Y</td></tr>
<tr><td>Blip.tv</td><td>Y*</td></tr>
<tr><td>Viddler</td><td>Y*</td></tr>
<tr><td>Kickstarter</td><td> Y*</td></tr>
</table>

`*` means native support for these may be deprecated. If your video platform is not currently supported, try adding it via a `customSelector`...

## Add Your Own Video Vendor
Have a custom video player? We now have a `customSelector` option where you can add your own specific video vendor selector (_mileage may vary depending on vendor and fluidity of player_):

```javascript
  $("#thing-with-videos").fitVids({ customSelector: "iframe[src^='http://mycoolvideosite.com'], iframe[src^='http://myviiids.com']"});
  // Selectors are comma separated, just like CSS
```

_Note:_ This will be the quickest way to add your own custom vendor as well as test your player's compatibility with FitVids.

## Ignore With Class
Have a video you want FitVids to ignore? You can slap a class of `fitvidsignore` on your object or container and your video will be displayed as it is defined.

If you'd like to add a custom block to ignore FitVids, use the `ignore` option.

```javascript
  $("#thing-with-videos").fitVids({ ignore: '.mycooldiv, #myviiid'});
  // Selectors are comma separated, just like CSS
```

## Target Videos embedded without classes or containers 
Customers/clients will occasionally add a video to a general content area or article and this may be without a class or container that you're targetting. A solution to this is to target the parent of videos, using something like the below;

```javascript
  $('iframe[src*="youtube"]').parent().fitVids();
  // You can change the selector to suit potential video providers, or chain them if your customer is likely to use more than one provider
```

By targetting the iframe/embed parent you can then dynamically add in the fitVids special sauce on the fly without needing to know the container ahead of time.

## Known issues

* Vimeo Autoplay API is not compatible with FitVids in IE11. You must manually wrap videos you want to autoplay.




         ---
         Lettering.js
         ---

## Lettering.js, a jQuery plugin for radical Web Typography
[![CDNJS](https://img.shields.io/cdnjs/v/lettering.js.svg)](https://cdnjs.com/libraries/lettering.js)

We developed a lightweight, easy to use Javascript `span` injector for radical Web Typography, we're calling it "lettering-jay-ess", and we're releasing it today for free over on Github. Let me demo it for you: `</stevejobs>`

### Individual Letter Control with Lettering.js
We'll start with some really basic markup:

```html
<h1 class="fancy_title">Some Title</h1>
```
After including `jQuery 1.6.2+`, [download and include the minified version of Lettering.js](http://github.com/davatron5000/Lettering.js/downloads), then a script block with the magical `.lettering()` method:

```html
<script>
	  $(document).ready(function() {
	    $(".fancy_title").lettering();
	  });
</script>
```
The resulting code will churn your `.fancy_title` and output the following:

```html
<h1 class="fancy_title">
  <span class="char1">S</span>
  <span class="char2">o</span>
  <span class="char3">m</span>
  <span class="char4">e</span>
  <span class="char5"></span>
  <span class="char6">T</span>
  <span class="char7">i</span>
  <span class="char8">t</span>
  <span class="char9">l</span>
  <span class="char10">e</span>
</h1>
```
Magical. Now the text is easy to manipulate in your CSS using an ordinal `.char#` pattern.  This plugin assumes basic counting skills, but it's a pretty fast and easy way to get control over every letter.

### Letters, words, lines, and more!

There you have it, but Lettering.js does even more! Lettering.js has the ability to split `words` and `lines` as well. If you want more information on how you can get radical with text, read the Lettering.js Wiki:

[https://github.com/davatron5000/Lettering.js/wiki](https://github.com/davatron5000/Lettering.js/wiki)

#### Best Practices
We've found this to be a pretty quick and elegant solution to create typographical CSS3 posters. It's also a great solution for really custom type headings, while keeping the text selectable. Be smart and use sparingly. You'll probably break your browser if you try to wrap every letter on your page in a `span` tag, so don't do that.  Look to use this in your Headings, Blockquotes, Asides, etc.

#### Kern Well
If you're going through the trouble to load a fancy font and that word or phrase is the largest on the site, then it's important for it to be kerned well.  With Lettering.js, kerning is a breeze. You can simply use `$("#id-of-what-i-want-to-kern").lettering();` and then on each `.char#`, you can set relative position or left/right margin. Works like a charm.

### Accessibility

Lettering.js is now accessible by default. It uses an `aria-label` on the parent element and `aria-hidden` on each of the children to prevent screenreaders from pausing while reading each individual characters or words.

### Non-Javascript Fallback
As with any kind of Javascript, have a fall back plan in case the user doesn't have javascript enabled.  The bottom line is up to you, my bottom line would be "legible and on the screen". Also, use `lettering.min.js` [Download the Minified Version of Lettering.js here](http://github.com/davatron5000/Lettering.js/downloads)

#### Performance Anti-Pattern
Web performance patterns advise that you put Javascripts at the bottom of your page before your `</body>` tag.  There is an unfortunate side effect where you may experience a [FOUT (Flash of Unstyled Text)](http://paulirish.com/2009/fighting-the-font-face-fout/) when you're manipulating your text after the DOM has loaded.  Unfortunately, we found the best solution to avoid/minimize the FOUT caused by this plugin is to put your scripts (jQuery, Lettering.js) in the document `<head>`. On the one hand, your page will load slower. On the other hand, a flash/restyling makes your site feel slow. Users might ultimately feel the site is faster if they don't see the FOUT.

### Download, Fork, Commit, Please.
We really want Lettering.js to be a quality helper for web typography.  If you have any feedback or suggestions, please leave those over on the Github.  We're excited about typography on the web and want to help make it print quality.