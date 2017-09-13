let windowHeight = $(window).height();

let slides = $('.slide').each(function initSlideHeight(index, slide) {
  let $slide = $(slide),
      innerHeight = $slide.height(),
      verticalPadding = (windowHeight - innerHeight) / 2;
  $slide.css('padding-top', verticalPadding)
    .css('padding-bottom', verticalPadding);
});

(function initParallaxAreaHeight(parallaxArea) {
  $(parallaxArea).height(windowHeight * slides.length);
})('.parallax-area');

/*
(function initLandingContent(content) {
  $(content).height(windowHeight);
})('.land-content');
*/

function slidePosition(base, scroll) {
  let pos = base - scroll;
  return pos > 0 ? pos : pos * 0.3;
}

let page = Scrollbar.initAll()[0];

page.addListener(function updateParallax(state) {
  let scroll = page.scrollTop;
  slides.each(function updateSlide(index, slide) {
    $(slide).css('top', slidePosition(index * windowHeight, scroll));
  });
});
