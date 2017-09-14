(function (app) {
  let parallaxItems = $('.scroll-parallax-inner'),
      parallaxArea = $('.parallax-area'),
      slides = $('.slide'),
      iteration = 0,
      intervalId,
      isFading = true,
      page = Scrollbar.initAll()[0];

  /**
   * Обновляет высоту слайдов в соответсвтии с базовой высотой
   * (высотой окна)
   */

  function updateSlidesHeight(baseHeight) {
    slides.each((index, item) => {
      let $item = $(item),
          innerHeight = $item.height(),
          verticalPadding = (baseHeight - innerHeight) / 2;
      $item.css('padding-top', verticalPadding)
        .css('padding-bottom', verticalPadding);
    });
  }

  /**
   * Обновляет пространство для параллакса в соответствии
   * с базовой высотой (высотой окна)
   */

  function updateParallaxArea(baseHeight) {
    parallaxArea.height(baseHeight * parallaxItems.length);
  }

  /**
   * Вычисляет высоту слайдов при заданном скролле
   * @param base - вертикальное удаление слайда от начала прокрутки
   * @param scroll - величина вертикальной прокрутки
   * @param limit - предел высоты слайда
   */

  function slideHeight(base, scroll, limit) {
    return Math.max(0, Math.min(scroll - base, limit));
  }

  /**
   * Вычисляет значение списка классов меню, в зависимости
   * от дистанции вертикального скролла и его направления
   * @param scroll - величина вертикальной прокрутки
   * @param state - направление прокрутки ('up' или 'down')
   * @param offset - смещение с которого начинается основной контент
   */

  function menuClass(scroll, state, offset) {
   let style = scroll > offset ? ' styled' : '',
       visible = scroll < offset || state === 'up'
         ? ' active' : '';
   return 'header header-land js-header' + visible + style;
  }

  /**
   * Вычисляет состояние каждого слайда в зависимости от
   * следующих параметров:
   * @param index - номер слайда
   * @param iteration - номер итерации
   * @param stage - номер стадии итерации
   * @param count - общее количество слайдов
   */

  function slideState(index, iteration, stage, count) {
    let offset = 2 - index * 3 + iteration * 3 + stage;
    // Функция зацикливания индексов
    function cycled(index, size) {
      return index >= 0 ? index % size : cycled(size + index % size, size);
    }
    // Функция состояния от смещения
    function state(offset) {
      const values = ['A', 'B', 'B', 'B', 'C'];
      return offset < 5 ? values[offset] : 'D';
    }
    return state(cycled(offset, count * 3));
  }

  /**
   * Устанавливает соотвествие между классом и состоянием
   */

  function slideClass(state) {
    const classNames = {
      'A': ' top animated',
      'B': '',
      'C': ' top invisible',
      'D': ' top animated invisible'
    }
    return classNames[state];
  }

  /**
   * Определяет досточно ли пролистали слайд,
   * чтобы включить фейдинг
   * @param scroll - величина вертикальной прокрутки
   * @param base - вертикальный размер одного слайда
   */

  function isCloseToScreen(scroll, base) {
    let progress = scroll % base;
    return progress / base < 0.05 || (base - progress) / base < 0.12;
  }

  // ===================================================================

  // Обновляем размеры слайдов и место под них, при изменении размера окна
  $(window).resize((event) => {
   let baseHeight = $(app).height();
   updateSlidesHeight(baseHeight);
   updateParallaxArea(baseHeight);
  });

  // Инициализируем начальными размерами окна
  $(app).resize();

  // Обновляем состояния слайдов, кнопки и меню при скролле
  page.addListener(function updateScroll(state) {
    let scroll = page.scrollTop,
      baseHeight = $(app).height(),
      mainContentOffset = baseHeight * parallaxItems.length,
      className = menuClass(scroll, state.direction.y, mainContentOffset);
    // Обновялем состояние скролл-слайдов
    parallaxItems.each(function updateSlide(index, slide) {
      if (index !== 0) {
        $(slide).css('height', slideHeight((index - 1) * baseHeight, scroll, baseHeight));
      }
    });
    // Обновляем положение кнопки-стрелочки
    $('.slide .down').css('z-index', scroll > 50 ? 'auto' : '100');
    // Обновляем меню
    $('.header-land').attr('class', className);
    isFading = false;
  });

  // Начальное состояние скролл-слайдов
  parallaxItems.each(function initSlide(index, slide) {
    const baseHeight = $(app).height();
    if (index !== 0) {
      $(slide).css('height', slideHeight((index - 1) * baseHeight, 0, baseHeight));
    }
  });

  // При клике по кнопке листаем на слайд ниже
  $('.slide .down').click(function goToNext(event) {
    let nextPos = $(app).height();
    event.preventDefault();
    page.scrollTo(0, nextPos, 1000);
  });

  // Инициализация fade-слайдов
  parallaxItems.each((index, pItem) => {
    $(pItem).find('.slide').each((index, item) => {
      let $item = $(item),
        classNameBase = $item.attr('class');
      $item.on('update', (event, iteration, stage, count) => {
        let className = classNameBase + slideClass(
          slideState(index, iteration, stage, count)
        );
        $item.attr('class', className);
      });
    });
  });

  slides.trigger('update', [iteration, 0, 2]);

  intervalId = setInterval(function tick() {
    if (isFading) {
      slides.trigger('update', [iteration, 1, 2]);
      setTimeout(function animationEnd() {
        slides.trigger('update', [iteration, 2, 2]);
      }, 500);
      setTimeout(function afterRecombination() {
        slides.trigger('update', [++iteration, 0, 2]);
      }, 550);
    }
  }, 3000);

  setInterval(function enableFading() {
    if (isCloseToScreen(page.scrollTop, $(app).height())) {
      isFading = true;
    }
  }, 500);

})(window);
