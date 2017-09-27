'use strict';

(function (app) {
  var parallaxItems = $('.scroll-parallax-inner'),
      parallaxArea = $('.parallax-area'),

  // footerArea = $('.footer-rasporka'),
  slides = $('.slide'),
      iteration = 0,
      intervalId = void 0,

  // numbersPos = 0,
  isFading = true,
      page = Scrollbar.initAll({
    speed: 0.42,
    damping: 0.1,
    renderByPixels: true,
    alwaysShowTracks: false,
    overscrollEffectColor: '#ffffff'
  })[0];

  /**
   * Обновляет высоту слайдов в соответсвтии с базовой высотой
   * (высотой окна)
   */

  function updateSlidesHeight(baseHeight) {
    slides.each(function (index, item) {
      var $item = $(item),
          innerHeight = $item.height(),
          verticalPadding = (baseHeight - innerHeight) / 2;
      $item.css('padding-top', verticalPadding).css('padding-bottom', verticalPadding);
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
   * Обновляет пространство для футера в соответствии
   * с размером футера
   */

  // function updateFooterArea(height) {
  //   footerArea.height(height);
  // }

  /**
   * Обновляет пространство для слайдов каруселей
   */

  function updateCarouselsArea() {
    $('.carousel').each(function (index, carousel) {
      if (index !== 0) {
        var $carousel = $(carousel),
            body = $carousel.find('.carousel-body'),
            items = $carousel.find('.carousel-wrapp'),
            maxHeight = 0;
        items.each(function (index, item) {
          var height = $(item).outerHeight();
          maxHeight = Math.max(maxHeight, height);
        });
        body.height(maxHeight);
      }
    });
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
    var style = scroll > offset ? ' styled' : '',
        visible = scroll < offset || state === 'up' ? ' active' : '';
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
    var offset = 2 - index * 3 + iteration * 3 + stage;
    // Функция зацикливания индексов
    function cycled(index, size) {
      return index >= 0 ? index % size : cycled(size + index % size, size);
    }
    // Функция состояния от смещения
    function state(offset) {
      var values = ['A', 'B', 'B', 'B', 'C'];
      return offset < 5 ? values[offset] : 'D';
    }
    return state(cycled(offset, count * 3));
  }

  /**
   * Устанавливает соотвествие между классом и состоянием
   */

  function slideClass(state) {
    var classNames = {
      'A': ' top animated',
      'B': '',
      'C': ' top invisible',
      'D': ' top animated invisible'
    };
    return classNames[state];
  }

  /**
   * Определяет досточно ли пролистали слайд,
   * чтобы включить фейдинг
   * @param scroll - величина вертикальной прокрутки
   * @param base - вертикальный размер одного слайда
   */

  function isCloseToScreen(scroll, base) {
    var progress = scroll % base;
    return progress / base < 0.05 || (base - progress) / base < 0.12;
  }

  /**
   * Вычисляет класс слайда в каруселе
   * @param index - номер слайда
   * @param current - текущий слайд карусели
   */

  function carouselItemClass(index, current) {
    var className = index < current ? 'left' : 'right';
    return index === current ? 'active' : className;
  }

  /**
   * Вычисляет класс нав-точки карусели
   * @param index - порядковый номер точки
   * @param current - текущий слайд карусели
   */

  function carouselPointClass(index, current) {
    return index === current ? 'active' : '';
  }

  // ===================================================================

  // Обновляем размеры слайдов и место под них, при изменении размера окна
  $(window).resize(function (event) {
    var baseHeight = $(app).height(),
        footerHeight = $('.footer').outerHeight();
    // numbersPos = $('#numbers').position().top;
    updateSlidesHeight(baseHeight);
    updateParallaxArea(baseHeight);
    // updateFooterArea(footerHeight - 2);
    updateCarouselsArea();
  });

  // Инициализируем начальными размерами окна
  $(app).resize();

  // Обновляем состояния слайдов, кнопки и меню при скролле
  page.addListener(function updateScroll(state) {
    var scroll = page.scrollTop,
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
    $('.down').css('z-index', scroll > mainContentOffset ? '-1' : '8');
    // Обновляем положение футера
    $('.footer').css('z-index', scroll > mainContentOffset ? '1' : '-1');
    // Обновляем меню
    $('.header-land').attr('class', className);
    isFading = false;
  });

  // Инициализируем счетчик цифр
  // $('#numbers .number').each((index, number) => {
  //   let $number = $(number),
  //       max = parseInt($number.text()),
  //       step = max / 20.0,
  //       current = 0;
  //   $number.text('0').on('update', function updateNumber() {
  //     $number.text(Math.round(current += step));
  //   });
  // });
  // Запускаем счетчик цифр сразу как до него доскролили
  // page.addListener(function tryToStartNumbers(state) {
  //   let currentStep = 1;

  //   if (state.offset.y > numbersPos - 800) {
  //     page.removeListener(tryToStartNumbers);
  //     let counter = setInterval(function updateNumbers() {
  //       $('#numbers .number').trigger('update');
  //       if (++currentStep > 20) {
  //         clearInterval(counter);
  //       }
  //     }, 50);
  //   }
  // });

  // Начальное состояние скролл-слайдов
  parallaxItems.each(function initSlide(index, slide) {
    var baseHeight = $(app).height();
    if (index !== 0) {
      $(slide).css('height', slideHeight((index - 1) * baseHeight, 0, baseHeight));
    }
  });

  // При клике по кнопке листаем на слайд ниже
  $('.down').click(function goToNext(event) {
    var nextPos = $(app).height();
    event.preventDefault();
    page.scrollTo(0, page.scrollTop + nextPos, 1000);
  });

  // Инициализация fade-слайдов
  parallaxItems.each(function (index, pItem) {
    $(pItem).find('.slide').each(function (index, item) {
      var $item = $(item),
          classNameBase = $item.attr('class');
      $item.on('update', function (event, iteration, stage, count) {
        var className = classNameBase + slideClass(slideState(index, iteration, stage, count));
        $item.attr('class', className);
      });
    });
  });

  // Инициализация фэйдинга
  slides.trigger('update', [iteration, 0, 2]);
  // Запуск фэйдинга
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
  // Повторно запускаем фэйдинг, если скроллинг остановлен
  setInterval(function enableFading() {
    if (isCloseToScreen(page.scrollTop, $(app).height()) && page.scrollTop < $(app).height() * parallaxItems.length) {
      isFading = true;
    }
  }, 500);

  // Инициализация простых каруселек
  $('.carousel').each(function initCarousel(index, carousel) {
    if (index !== 0) {
      var $carousel = $(carousel),
          items = $carousel.find('.carousel-item'),
          nav = $carousel.find('.navigation'),
          baseClass = 'carousel-item ',
          points = void 0;
      // Создаём точки для каждого слайда
      items.each(function (index) {
        nav.append($('<li class="' + (index === 0 ? 'active' : '') + '">').click(function (event) {
          $carousel.trigger('update', index);
        }));
      });
      // Запрашиваем получившиеся точки
      points = nav.find('li');
      // Обновляем карусель под новое состояние
      $carousel.on('update', function updateCarousel(event, current) {
        $carousel.data('current', current);
        items.each(function (index, item) {
          $(item).attr('class', baseClass + carouselItemClass(index, current));
        });
        points.each(function (index, item) {
          $(item).attr('class', carouselPointClass(index, current));
        });
      });
      $carousel.swipe({
        swipe: function swipe(event, direction) {
          var current = $carousel.data('current');
          if (direction === 'right') {
            if (current === 0) {
              $carousel.trigger('update', items.length - 1);
            } else {
              $carousel.trigger('update', current - 1);
            }
          } else if (direction === 'left') {
            if (current === items.length - 1) {
              $carousel.trigger('update', 0);
            } else {
              $carousel.trigger('update', current + 1);
            }
          }
        },

        allowPageScroll: 'vertical'
      });
      // Устанавливаем состояние в первый слайд
      $carousel.trigger('update', 0);
    }
  });

  // $('.footer').insertAfter('.scroll-content');

  // Инициализируем приложение после загрузки
  $(app).load(function (event) {
    $('.preloader').fadeOut();
    $('body').removeClass('on-load');
    $('footer').css('z-index', '-1');
    // numbersPos = $('#numbers').position().top;
    updateCarouselsArea();
  });

  // Инициализация owlCarousel
  $('.owl-carousel').owlCarousel({
    loop: true,
    //autoplay: true,
    //autoplayTimeout: 3000,
    //autoplaySpeed: 1000,
    responsive: {
      0: {
        items: 1
      },
      480: {
        items: 2
      },
      769: {
        items: 3
      },
      1200: {
        items: 3
      }
    }
  });
})(window);