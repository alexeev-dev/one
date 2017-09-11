let app = (function ($) {

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
        return console.error(`Ошибка! Не возможно инициализировать компонент ${callback} - объект компонента не является функцией`);
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

  let myPreview = '\
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

      projectList() {
        let [list, listContent, closeButton] = [
          '.js-projectListToggle', '.js-projectList',
          '.js-projectListAction li a'
        ].map(el => $(el));

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

        return Object.freeze({ listContent });
      },

			/**
			 * COMPONENT: LOGIN FORM - форма входа в личный кабинет
			 * @return Возвращает статус пользователя
			 */

			loginForm() {
				// Проверка на статус пользователя (вошел или нет)
				let isLogin = (function showForm() {
					let [body, wrapper] = [ $('body'), $('.wr-login')];
					if (body.data('user') === undefined) {
						// Пользователь не залогинелся - показываем форму
						wrapper.addClass('active');
						return false;
					} else {
						return true;
					}
				}());
				// Валидация и отправка формы
				function submitForm(event) {
					let form = $('.login form'),
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

				return { isLogin }
			},

			/**
			 * COMPONENT: PARTICIPANT SELECT - выбор конкретного участника проекта
			 * @return Возвращает компонент
			 */

			participantSelect() {
				let [select, list] = [
					$('#participants'), $('.js-participants')
				];

        let isFirst = true;

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
              responsive:{
                0: {
                  items:1
                },
                480: {
                  items:2
                },
                768:{
                  items:3
                },
                992:{
                  items:4
                }
              }
            });
            isFirst = false;
          }
				});

				return Object.freeze({ activateSelect });
			},

      /**
			 * COMPONENT: PHOTOS UPLOADER - загрузка файлов с предпросмотром
			 * @return Возвращает компонент
			 */

      photosUploader() {
        $('.js-dropzone .photos a').click(e => e.preventDefault());

        if ($('.js-dropzone .photos').length === 0) {
          return null;
        }

        return new Dropzone('.js-dropzone .photos', {
          url: 'uploadPhoto',
          acceptedFiles: 'image/jpeg, image/png',
          clickable: '.js-dropzone .photos a',
          previewsContainer: '.js-dropzone .preview .images',
          previewTemplate: myPreview
        }).on('addedfile', (file) => {
          $('.js-dropzone .preview').addClass('active');
        });
      },

      /**
       * COMPONENT: PRODUCTS LIST - список товаров с возможностью
       * добавления новых экземпляров
       */

      productsList() {
        let productsList = $('.js-dropzone');

        /**
         * Добавляет новый товар
         */

        function addNew() {
          let product = Product();
          product.find('.photos a').click(e => e.preventDefault());
          product.find('.photos').dropzone({
            url: 'uploadPhoto',
            acceptedFiles: 'image/jpeg, image/png',
            clickable: product.find('.photos a')[0],
            previewsContainer: product.find('.photos .images')[0],
            previewTemplate: myPreview
          }).on('addedfile', (file) => {
            $('.js-dropzone .preview').addClass('active');
          });
          $(window).trigger('selectbox-created', product.find('.js-selectToogle'));
          productsList.find('a.add_item').before(product);
        }

        productsList.find('a.add_item').click(function addItem(event) {
          event.preventDefault();
          addNew();
        });

        return Object.freeze({ addNew });
      },

      /**
       * COMPONENT: TABS - табы направлений
       */

      directionsTabs() {
        let tabs = $('.js-tab_direct-wr > .tab');
        tabs.not('.tab--active').hide();
        $('.js-tab_direct li a').click(function changeTab(event) {
          let tabId = $(this).attr('href');
          event.preventDefault();
          tabs.hide().filter(tabId).show();
          $('.js-tab_direct li').removeClass('active');
          $(this).parent().addClass('active');
        });
      },

      /**
       * COMPONENT: PROFILE TABS - табы профиля
       */

      profileTabs() {
        let tabs = $('.js-tab_user-wr > .tab');
        tabs.not('.tab--active').hide();
        $('.js-tab_user li a').click(function changeTab(event) {
          let tabId = $(this).attr('href');
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

      purchasesAccordion() {
        let items = $('.js-accordion .goods-header');
        items.find('a').click(e => e.preventDefault());
        $('js-accordion .goods-content').hide();
        items.click(function openItem(event) {
          $(this).next().toggle();
        });
      },

      /**
       * COMPONENT: PROFILE BOOKMARKS - управление лайками
       */

      profileBookmarks() {
        return $('#bookmarks-tab > ul > li').each(function initItem() {
          let bookmark = $(this);
          bookmark.find('ul + a').click(function toggleLike(event) {
            event.preventDefault();
            bookmark.toggleClass('active');
          });
        });
      },

      /**
       * COMPONENT: SELECT BOX - кастомный селект
       */

      selectBox() {
        $('.js-selectToogle, .js-selectLists').removeClass('active');

        function initSelectBox(selectToggle) {
          let selectList = selectToggle.next();

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

        $('.js-selectToogle').each((i, el) => initSelectBox($(el)));

        return {initSelectBox};
      },

      /**
       * COMPONENT: SEARCH BOX - Поиск с фильтром
       */

      searchBox() {
        let [searchArea, searchPrice, selectArea] = [
          $('.filter-main .search'),
          $('.filter-main .price'),
          $('.filter-selects')
        ];

        $('.js-open_filter').click(function toggleFilter(event) {
          event.preventDefault();
          [searchArea, searchPrice, selectArea].forEach((item) => {
            item.toggleClass('active');
          });
          $(this).toggleClass('active');
        });
      }

    },

    events: [
			['project-selected', 'activateParticipantSelect'],
      ['#confirm', 'click', 'toggleConfirm'],
      ['.js-toggle-menu', 'click', 'showProfileMenu'],
      ['.js-open_menu-general', 'click', 'showThingsMenu'],
      ['.js-open_found-filter', 'click', 'showFoundFilter'],
      ['.js-open_menu-top', 'click', 'showSiteMenu'],
      ['.js-close_notice, .js-later', 'click', 'hideNotice'],
      ['selectbox-created', 'initSelectBox']
    ],

    actions: {

			activateParticipantSelect() {
				let {participantSelect} = this.components;
				participantSelect.activateSelect();
			},

      toggleConfirm() {
        let isChecked = $('#confirm').prop('checked');
        $('.js-confirm').prop('disabled', !isChecked);
      },

      showProfileMenu(event) {
        event.preventDefault();
        $('.tabs-main ul').toggleClass('active');
        $('.js-toggle-menu i').toggleClass('active');
      },

      showThingsMenu(event) {
        event.preventDefault();
        $('.js-open_menu-general').toggleClass('active');
        $('.menu-general ul').toggleClass('active');
      },

      showFoundFilter(event) {
        event.preventDefault();
        $('.js-open_found-filter').toggleClass('active');
        $('.found-main-filter ul').toggleClass('active');
      },

      showSiteMenu(event) {
        event.preventDefault();
        $('.js-open_menu-top').toggleClass('active');
        $('.menu-top ul').toggleClass('active');
      },

      hideNotice(event) {
        event.preventDefault();
        $('.wr-notice').hide();
      },

      initSelectBox(event, box) {
        let {selectBox} = this.components;
        selectBox.initSelectBox($(box));
      }

    },

    run() {
      initComponents(this.components);
      bindEvents(this, this.events, this.actions);
    }
  });

})(jQuery);

$(() => { app.run(); });
