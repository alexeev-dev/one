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
          return false;
        });

        closeButton.click(function closeList() {
          listContent.removeClass('active');
          return false;
        });

        return Object.freeze({ listContent });
      }
    },

    events: [
    ],

    actions: {
    },

    run() {
      initComponents(this.components);
      bindEvents(this, this.events, this.actions);
    }
  });

})(jQuery);

$(() => { app.run(); });
