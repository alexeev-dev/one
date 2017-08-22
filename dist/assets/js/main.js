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
    <div class="product-group">\
      <div class="info">\
        <ul>\
          <li>\
            <input type="text" placeholder="Название">\
            <p>Полное название, модель и пр.</p>\
          </li>\
          <li>\
            <input type="text" placeholder="Цена">\
          </li>\
        </ul>\
      </div>\
      <textarea class="description" placeholder="Описание"></textarea>\
      <div class="photos">\
        <h4>Фотографии</h4>\
        <p>Перетащите сюда фотографии, <br> или нажмите <a href="#">загрузить</a></p>\
      </div>\
    </div>\
    ');
  }

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
        var _ref2 = [$('#participants'), $('.participants-container')],
            select = _ref2[0],
            list = _ref2[1];


        var isFirst = true;

        $('.participants').hide();
        select.prop('checked', false).prop('disabled', 'true');

        function activateSelect() {
          select.prop('disabled', false);
          $('.participants').fadeIn();
        }

        $('#participants').change(function toggleList() {
          list.toggleClass('active');
          if (isFirst) {
            $('.owl-carousel').owlCarousel({
              loop: false,
              margin: 10,
              nav: false,
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
                  items: 4
                }
              }
            });
            isFirst = false;
          }
        });

        return Object.freeze({ activateSelect: activateSelect });
      },


      /**
      * COMPONENT: SELECT 2 - пользовательская стилизация Select
      * @return Возвращает компонент
      */

      mySelect: function mySelect() {
        return $('select').select2({
          minimumResultsForSearch: Infinity
        });
      },


      /**
      * COMPONENT: PHOTOS UPLOADER - загрузка файлов с предпросмотром
      * @return Возвращает компонент
      */

      photosUploader: function photosUploader() {
        $('.choose-product .photos a').click(function (e) {
          return e.preventDefault();
        });
        return new Dropzone('.choose-product .photos', {
          url: 'uploadPhoto',
          clickable: '.choose-product .photos a'
        });
      },


      /**
       * COMPONENT: PRODUCTS LIST - список товаров с возможностью
       * добавления новых экземпляров
       */

      productsList: function productsList() {
        var productsList = $('.choose-product');

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
            clickable: product.find('.photos a')[0]
          });
          productsList.find('a.add-item').before(product);
        }

        productsList.find('a.add-item').click(function addItem(event) {
          event.preventDefault();
          addNew();
        });

        return Object.freeze({ addNew: addNew });
      }
    },

    events: [['project-selected', 'activateParticipantSelect'], ['#confirm', 'click', 'toggleConfirm']],

    actions: {
      activateParticipantSelect: function activateParticipantSelect() {
        var participantSelect = this.components.participantSelect;

        participantSelect.activateSelect();
      },
      toggleConfirm: function toggleConfirm() {
        var isChecked = $('#confirm').prop('checked');
        $('.confirm button').prop('disabled', !isChecked);
      }
    },

    run: function run() {
      initComponents(this.components);
      bindEvents(this, this.events, this.actions);
    }
  });
}(jQuery);

$(function () {
  app.run();
});

/* Old code

//main-menu
$('.responsive-menu').click(function(){
  $('.main-menu > ul').toggleClass('active');

  return false;
});

//things-menu
$('.buy-nav-resp').click(function(){
  $('.buy-nav > ul, .buy-nav-resp').toggleClass('active');

//filter
$('.filter-resp').click(function(){
$('.filter-resp, .search-block .search-area, .filter > .select-area, .filter .search-block .price').toggleClass('active');

return false;
});


//profile tabs
$('.my-menu').click(function(){
$('.profile-tabs > ul, .my-menu').toggleClass('active');

return false;
});

*/