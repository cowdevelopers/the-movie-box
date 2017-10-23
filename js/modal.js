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



  

  init();

}(window, window.jQuery));