$('.modal__close-btn').click(function() {
  $('.modal').toggleClass('is-showing')
})

$(document).on('click', '.body__cont__item', function() {
  $('.modal').toggleClass('is-showing')
})

$(document).on('mouseover', '.body__cont__item', function() {
  $(this).css({
    'opacity': '0.5',
    'transition': '0.25s'
  })
})

$(document).on('mouseleave', '.body__cont__item', function() {
  $(this).css({
    'opacity': '1',
    'transition': '0.25s'
  })
})

;(function(global, $) {
  'use strict';
  var modal_list = null;

  var data = [],
    get_data_flag = false,
    page_number = 0,
    id_number = 0,
    min_data_index = 0,
    max_data_index = 1;

  function init() {
    modal_list = $('.modal__body');
    getData();
  }

  // function bind() {
  //   $(window).on('scroll', function() {
  //     var scrollY = $(this).scrollTop();
  //     console.log('scrollY', scrollY);
  //     if (scrollY > scrolling_offsetTop) {
  //       get_data_flag && getData();
  //     }
  //   })
  // }

  function getData() {
    get_data_flag = false;
    page_number++;
    id_number++;
    $.get('https://yts.ag/api/v2/list_movies.json?sort_by=rating&limit=' + id_number++, function(response) {
      // page_number, data 받기
      data = data.concat(response.data.movies);
      console.log(data);
      // remomveRenderedItem();
      $.each(data, function(index, data) {
        render(data, index);
      });
    });
  }



  function render(data, index) {
    // Create Element
    var modal__wrap = $('<div class="modal__wrap" data-index="' + index + '"></div>'),
      modal__body__wrap = $('<div class="modal__body__wrap"></div>'),
      modal__poster_wrap = $('<div class="modal__poster__wrap"></div>'),
      modal__info__wrap = $('<div class="modal__body__info__wrap"></div>'),

      modal__poster = $('<img class="modal__poster" src="' + data.medium_cover_image + '" alt="' + data.title + '"/>'),
      modal__year = $('<p class="modal__year">' + data.year + '</p>'),
      modal__title = $('<h3 class="modal__title">' + data.title + '</h3>'),
      // modal__rating = $('<p class="modal__rating">' + (data.rating / 2).toFixed(1) + '</p>'),
      modal__synopsis = $('<p class="modal__synopsis">' + data.description_full + '</p>');

    var genres = '';
    var modal__genre = null;

    $.each(data.genres, function(index, _data) {
      ((data.genres.length - 1) === index) ? genres += _data: genres += _data + ' ';
    });

    modal__genre = $('<p class="modal__genres">' + genres + '</p>');

    // Append Element
    modal__poster_wrap.append(modal__poster);

    modal__info__wrap.append(modal__title);
    modal__info__wrap.append(modal__year);
    modal__info__wrap.append(modal__genre);
    // modal__info__wrap.append(modal__rating);
    modal__info__wrap.append(modal__synopsis);

    modal__body__wrap.append(modal__poster_wrap);
    modal__body__wrap.append(modal__info__wrap);

    modal__wrap.append(modal__body__wrap);
    modal_list.append(modal__wrap);
  }

  init();

}(window, window.jQuery));