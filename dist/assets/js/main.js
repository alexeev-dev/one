'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var app = function ($) {

  // ======================================================================== //
  //                        ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ                           //
  // ======================================================================== //

  /**
   * Выполняет последовательную инициализацию компонентов приложения
   * @param components - хэш (объект) с компонентами
   */

  function initComponents(components) {
    Object.getOwnPropertyNames(components).forEach(function (callback) {
      if (typeof components[callback] !== 'function') {
        return console.error('\u041E\u0448\u0438\u0431\u043A\u0430! \u041D\u0435 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u043E \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442 ' + callback + ' - \u043E\u0431\u044A\u0435\u043A\u0442 \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u0430 \u043D\u0435 \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0444\u0443\u043D\u043A\u0446\u0438\u0435\u0439');
      }
      components[callback] = components[callback]();
    });
  }

  /**
   * Связывет события уровня приложения с их обработчиками
   * @param app - экземпляр приложения
   * @param events - массив дескрипторов событий
   * @param actions - хэш с обработчиками событий
   */

  function bindEvents(app, events, actions) {
    events.forEach(function (event) {
      if (event.length === 2) {
        /* Привязываем событие приложения */
        $(window).on(event[0], $.proxy(actions[event[1]], app));
      } else {
        /* Привязываем событие DOM к приложению */
        $(event[0]).on(event[1], $.proxy(actions[event[2]], app));
      }
    });
  }

  /**
   * Создаёт новый экземпляр компонента Product
   * @return контейнер содержащий поля для нового товара
   */

  function Product() {
    return $('\
    <div class="wrapper">\
      <div class="select">\
        <a href="#" class="js-selectToogle">Категория товара<i></i></a>\
        <div class="js-selectLists">\
          <ul>\
            <li><a href="#">Личные вещи</a></li>\
            <li><a href="#">Электроника</a></li>\
            <li><a href="#">Спорт</a></li>\
            <li><a href="#">Дом и дача</a></li>\
            <li><a href="#">Детям</a></li>\
            <li><a href="#">Бизнесу</a></li>\
          </ul>\
        </div>\
      </div>\
      <div class="info">\
        <ul>\
          <li>\
            <input type="text" placeholder="Название">\
            <label>Полное название, модель и пр.</label>\
          </li>\
          <li>\
            <input type="text" placeholder="Цена">\
          </li>\
        </ul>\
        <textarea placeholder="Описание"></textarea>\
      </div>\
      <div class="photos">\
        <div class="preview">\
          <span>Фотографии</span>\
          <div class="images"></div>\
        </div>\
        <h4>Фотографии</h4>\
        <p>Перетащите сюда фотографии, <br> или нажмите <a href="#">загрузить</a></p>\
      </div>\
    </div>\
    ');
  }

  var myPreview = '\
    <span href="#" class="dz-preview image">\
      <img data-dz-thumbnail>\
      <a href="#" class="close-img" data-dz-remove><i class="icon icon-close-lit"></i></a>\
      <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>\
    </span>';

  // ======================================================================== //
  //                          ЭКЗЕМПЛЯР ПРИЛОЖЕНИЯ                            //
  // ======================================================================== //

  return Object.freeze({

    name: 'One + 1',

    components: {
      // ==================================================================== //
      //               ЗДЕСЬ РАЗМЕЩАЕТСЯ КОД КОМПОНЕНТОВ                      //
      // ==================================================================== //

      /**
      * COMPONENT: PROJECT LIST - Выпадающий список проектов
      * @return Возвращает содержимое списка в обёртке jQuery
      */

      projectList: function projectList() {
        var _map = ['.js-projectListToggle', '.js-projectList', '.js-projectListAction li a'].map(function (el) {
          return $(el);
        }),
            _map2 = _slicedToArray(_map, 3),
            list = _map2[0],
            listContent = _map2[1],
            closeButton = _map2[2];

        list.click(function toggleList() {
          listContent.toggleClass('active');
          if ($('.js-projectList input:checked').length > 0) {
            $(window).trigger('project-selected');
          }
          return false;
        });

        closeButton.click(function closeList() {
          listContent.removeClass('active');
          if ($('.js-projectList input:checked').length > 0) {
            $(window).trigger('project-selected');
          }
          return false;
        });

        return Object.freeze({ listContent: listContent });
      },


      /**
       * COMPONENT: LOGIN FORM - форма входа в личный кабинет
       * @return Возвращает статус пользователя
       */

      loginForm: function loginForm() {
        // Проверка на статус пользователя (вошел или нет)
        var isLogin = function showForm() {
          var _ref = [$('body'), $('.wr-login')],
              body = _ref[0],
              wrapper = _ref[1];

          if (body.data('user') === undefined) {
            // Пользователь не залогинелся - показываем форму
            wrapper.addClass('active');
            return false;
          } else {
            return true;
          }
        }();
        // Валидация и отправка формы
        function submitForm(event) {
          var form = $('.login form'),
              email = form.find('input[name=email]'),
              password = form.find('input[name=password]');
          if (!/^.*\@.*\..*$/.test(email.val())) {
            alert('Неправильно введён email!');
            return false;
          }
          if (password.val().length < 3) {
            alert('Пароль должен быть длиннее 3-х символов!');
            return false;
          }
          $('.login form').submit();
        }

        $('.js-login').click(submitForm);

        return { isLogin: isLogin };
      },


      /**
       * COMPONENT: PARTICIPANT SELECT - выбор конкретного участника проекта
       * @return Возвращает компонент
       */

      participantSelect: function participantSelect() {
        var _ref2 = [$('#participants'), $('.js-participants')],
            select = _ref2[0],
            list = _ref2[1];


        var isFirst = true;

        $('.js-hide').hide();
        select.prop('checked', false).prop('disabled', 'true');

        function activateSelect() {
          select.prop('disabled', false);
          $('.js-hide').fadeIn();
        }

        $('#participants').change(function toggleList() {
          list.toggleClass('active');
          if (isFirst) {
            $('.owl-carousel').owlCarousel({
              loop: false,
              margin: 10,
              nav: false,
              dotClass: 'owl-dot',
              dotsClass: 'navigation',
              dots: true,
              responsive: {
                0: {
                  items: 1
                },
                480: {
                  items: 2
                },
                768: {
                  items: 3
                },
                992: {
                  items: 3
                }
              }
            });
            isFirst = false;
          }
        });

        return Object.freeze({ activateSelect: activateSelect });
      },


      /**
      * COMPONENT: PHOTOS UPLOADER - загрузка файлов с предпросмотром
      * @return Возвращает компонент
      */

      photosUploader: function photosUploader() {
        $('.js-dropzone .photos a').click(function (e) {
          return e.preventDefault();
        });

        if ($('.js-dropzone .photos').length === 0) {
          return null;
        }

        return new Dropzone('.js-dropzone .photos', {
          url: 'uploadPhoto',
          acceptedFiles: 'image/jpeg, image/png',
          clickable: '.js-dropzone .photos a',
          previewsContainer: '.js-dropzone .preview .images',
          previewTemplate: myPreview
        }).on('addedfile', function (file) {
          $('.js-dropzone .preview').addClass('active');
        });
      },


      /**
       * COMPONENT: PRODUCTS LIST - список товаров с возможностью
       * добавления новых экземпляров
       */

      productsList: function productsList() {
        var productsList = $('.js-dropzone');

        /**
         * Добавляет новый товар
         */

        function addNew() {
          var product = Product();
          product.find('.photos a').click(function (e) {
            return e.preventDefault();
          });
          product.find('.photos').dropzone({
            url: 'uploadPhoto',
            acceptedFiles: 'image/jpeg, image/png',
            clickable: product.find('.photos a')[0],
            previewsContainer: product.find('.photos .images')[0],
            previewTemplate: myPreview
          }).on('addedfile', function (file) {
            $('.js-dropzone .preview').addClass('active');
          });
          $(window).trigger('selectbox-created', product.find('.js-selectToogle'));
          productsList.find('a.add_item').before(product);
        }

        productsList.find('a.add_item').click(function addItem(event) {
          event.preventDefault();
          addNew();
        });

        return Object.freeze({ addNew: addNew });
      },


      /**
       * COMPONENT: TABS - табы направлений
       */

      directionsTabs: function directionsTabs() {
        var tabs = $('.js-tab_direct-wr > .tab');
        tabs.not('.tab--active').hide();
        $('.js-tab_direct li a').click(function changeTab(event) {
          var tabId = $(this).attr('href');
          event.preventDefault();
          tabs.hide().filter(tabId).show();
          $('.js-tab_direct li').removeClass('active');
          $(this).parent().addClass('active');
        });
      },


      /**
       * COMPONENT: PROFILE TABS - табы профиля
       */

      profileTabs: function profileTabs() {
        var tabs = $('.js-tab_user-wr > .tab');
        tabs.not('.tab--active').hide();
        $('.js-tab_user li a').click(function changeTab(event) {
          var tabId = $(this).attr('href');
          event.preventDefault();
          tabs.hide().filter(tabId).show();
          $('.js-tab_user ul').removeClass('active');
          $('.js-tab_user li').removeClass('active');
          $(this).parent().addClass('active');
        });
      },


      /**
       * COMPONENT: PURCHASES ACCORDION - аккордион покупок
       */

      purchasesAccordion: function purchasesAccordion() {
        var items = $('.js-accordion .goods-header');
        items.find('a').click(function (e) {
          return e.preventDefault();
        });
        $('js-accordion .goods-content').hide();
        items.click(function openItem(event) {
          $(this).next().toggle();
        });
      },


      /**
       * COMPONENT: PROFILE BOOKMARKS - управление лайками
       */

      profileBookmarks: function profileBookmarks() {
        return $('#bookmarks-tab > ul > li').each(function initItem() {
          var bookmark = $(this);
          bookmark.find('ul + a').click(function toggleLike(event) {
            event.preventDefault();
            bookmark.toggleClass('active');
          });
        });
      },


      /**
       * COMPONENT: SELECT BOX - кастомный селект
       */

      selectBox: function selectBox() {
        $('.js-selectToogle, .js-selectLists').removeClass('active');

        function initSelectBox(selectToggle) {
          var selectList = selectToggle.next();

          selectToggle.click(function toggleSelect(event) {
            event.preventDefault();
            selectToggle.toggleClass('active');
            selectList.toggleClass('active');
          });

          selectList.find('a').click(function selectValue(event) {
            event.preventDefault();
            selectToggle.text($(this).text()).append('<i>');
            selectToggle.toggleClass('active');
            selectList.toggleClass('active');
          });
        }

        $('.js-selectToogle').each(function (i, el) {
          return initSelectBox($(el));
        });

        return { initSelectBox: initSelectBox };
      },


      /**
       * COMPONENT: SEARCH BOX - Поиск с фильтром
       */

      searchBox: function searchBox() {
        var _ref3 = [$('.filter-main .search'), $('.filter-main .price'), $('.filter-selects')],
            searchArea = _ref3[0],
            searchPrice = _ref3[1],
            selectArea = _ref3[2];


        $('.js-open_filter').click(function toggleFilter(event) {
          event.preventDefault();
          [searchArea, searchPrice, selectArea].forEach(function (item) {
            item.toggleClass('active');
          });
          $(this).toggleClass('active');
        });
      }
    },

    events: [['project-selected', 'activateParticipantSelect'], ['#confirm', 'click', 'toggleConfirm'], ['.js-toggle-menu', 'click', 'showProfileMenu'], ['.js-open_menu-general', 'click', 'showThingsMenu'], ['.js-open_found-filter', 'click', 'showFoundFilter'], ['.js-open_menu-top', 'click', 'showSiteMenu'], ['.js-close_notice, .js-later', 'click', 'hideNotice'], ['selectbox-created', 'initSelectBox']],

    actions: {
      activateParticipantSelect: function activateParticipantSelect() {
        var participantSelect = this.components.participantSelect;

        participantSelect.activateSelect();
      },
      toggleConfirm: function toggleConfirm() {
        var isChecked = $('#confirm').prop('checked');
        $('.js-confirm').prop('disabled', !isChecked);
      },
      showProfileMenu: function showProfileMenu(event) {
        event.preventDefault();
        $('.tabs-main ul').toggleClass('active');
        $('.js-toggle-menu i').toggleClass('active');
      },
      showThingsMenu: function showThingsMenu(event) {
        event.preventDefault();
        $('.js-open_menu-general').toggleClass('active');
        $('.menu-general ul').toggleClass('active');
      },
      showFoundFilter: function showFoundFilter(event) {
        event.preventDefault();
        $('.js-open_found-filter').toggleClass('active');
        $('.found-main-filter ul').toggleClass('active');
      },
      showSiteMenu: function showSiteMenu(event) {
        event.preventDefault();
        $('.js-open_menu-top').toggleClass('active');
        $('.menu-top ul').toggleClass('active');
      },
      hideNotice: function hideNotice(event) {
        event.preventDefault();
        $('.wr-notice').hide();
      },
      initSelectBox: function initSelectBox(event, box) {
        var selectBox = this.components.selectBox;

        selectBox.initSelectBox($(box));
      }
    },

    run: function run() {
      initComponents(this.components);
      bindEvents(this, this.events, this.actions);
    }
  }); // Инициализируем приложение после загрузки
}(jQuery);

$(function () {
  app.run();
});
$(window).load(function () {
  $('.preloader').fadeOut();
  $('body').removeClass('on-load');
});