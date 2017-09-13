(function (app) {
  let windowHeight = $(window).height(),
      mainContentOffset;

  let slides = $('.slide').each(function initSlideHeight(index, slide) {
    let $slide = $(slide),
    innerHeight = $slide.height(),
    verticalPadding = (windowHeight - innerHeight) / 2;
    $slide.css('padding-top', verticalPadding)
    .css('padding-bottom', verticalPadding);
  });

  mainContentOffset = windowHeight * slides.length;

  (function initParallaxAreaHeight(parallaxArea) {
    $(parallaxArea).height(mainContentOffset);
  })('.parallax-area');

  function slidePosition(base, scroll) {
    let pos = base - scroll;
    return pos > 0 ? pos : pos * 0.3;
  }

  function menuClass(scroll, state) {
    let style = scroll > mainContentOffset ? ' styled' : '',
        visible = scroll < mainContentOffset || state === 'up'
          ? ' active' : '';
    return 'header header-land js-header' + visible + style;
  }

  let page = Scrollbar.initAll()[0];

  page.addListener(function updateParallax(state) {
    let scroll = page.scrollTop;
    slides.each(function updateSlide(index, slide) {
      $(slide).css('top', slidePosition(index * windowHeight, scroll));
    });
    $('.slide .down').css('z-index', scroll > 50 ? 'auto' : '100');
  });

  page.addListener(function updateMenu(state) {
    let scroll = page.scrollTop,
        className = menuClass(scroll, state.direction.y);
    $('.header-land').attr('class', className);
  });

  $('.slide .down').click(function goToNext(event) {
    event.preventDefault();
    page.scrollTo(0, windowHeight, 1000);
  });

})(window);
