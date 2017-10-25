(function(global, $) {
  'use strict';

  var cont_list = null, 
      // list filter
      list_nav_btns = null,
      // footer_offset
      footer_heading = null,
      modal = null,
      modal_list = null,
      target_modal = null, 
      // header 
      search = null,
      target_search_list = null,
      search_list = null,
      search_btn = null,
      search_input = null;

  
  var data = [],
      page_number = 0, 
      limit = 12, 
      // scrolling_offsetTop = 0, 
      get_data_flag = false,
      submenu_flag = false;

  var URL = '',
      genre_value = 'what',
      urls = {
        trending: 'https://yts.ag/api/v2/list_movies.json?sort_by=download_count&limit=12&page=',
        topRated: 'https://yts.ag/api/v2/list_movies.json?order_by=desc&sort_by=rating&limit=12&page=',
        newArrivals: 'https://yts.ag/api/v2/list_movies.json?sort_by=date_added&limit=12&page=',
        genres: 'https://yts.ag/api/v2/list_movies.json?genre=' + genre_value + '&limit=12&page='
      };


  function init() {
    cont_list = $('.body__cont__list');
    footer_heading = $('.footer__heading');
    list_nav_btns = $('.body__nav__link');
    modal = $('.modal');
    modal_list = $('.modal__body');
    search = $('.header__search-bar');
    search_list = $('.header__searh-list');
    search_btn = $('.search-btn');
    search_input = $('.header__search-bar');
    
    URL = urls.trending;

    bind();
    getData();
  }

  function bind() {
    $(window).on('scroll', function() {
      var scrollY = $(this).scrollTop();

      if ($(window).scrollTop() + $(window).height() > $(document).height() - 300) {
        get_data_flag && getData();
      }
    });

    $(modal).on('click', function(e) {
      console.log($(e.target).attr('class'));

      if( e.target === this || $(e.target).attr('class') === 'modal__close-btn' ) {
        $('.modal').toggleClass('is-showing');
      }
    });

    list_nav_btns.each(function(index, list_nav_btn) {

      $(list_nav_btn).on('click', function(e) {
        
        e.preventDefault();
        
        var type = $(this).attr('data-type'),
            submenu = $(this).parent().find('.body__nav__submenu');

        URL = urls[type];
        
        if( submenu.length === 0 ) {
          data = [];
          getData();

        } else {
          var genres = $(this).next().find('a');

          submenu.toggleClass('active');
          
          if(!submenu_flag) {
            $(genres).each(function(index, genre) {
              $(genre).on('click', function(e) {
                e.preventDefault();
                var text = $(this).text().trim();
                console.log('text: ', text);
                console.log('prev genre_value: ', genre_value);
                URL = URL.replace(genre_value, text);
                console.log('URL: ', URL);
                genre_value = text;
                console.log('next genre_value: ', genre_value);
                data = [];
                getData();
              });
            });
            submenu_flag = true;
          }
        }
      });
    });

    search.keypress(function(e) {
      
      if( e.target.value !== '' && e.keyCode === 13 ) {
        getSearchData(e.target.value);
      } 
      

    });
    search.keydown(function(e) {
      if( target_search_list && e.keyCode === 8 ) {
        target_search_list[0].parentNode.removeChild(target_search_list[0]);
        target_search_list = null;
      }
    });
    search_btn.on('click', function() {
      if( parseInt(search_input.css('width')) === 0 ) {
        search_input.animate({ width: 300 + 'px' }, 300);
      } else {
        search_input.animate({ width: 0 + 'px' }, 300);

        target_search_list && target_search_list[0].parentNode.removeChild(target_search_list[0]);
        search.attr('value', '');
      }
    });
  }

  function getSearchData(movie) {
    
    $.get('https://yts.ag/api/v2/list_movies.json?query_term=' + movie, function(response) {
      if( response.status === 'ok' && response.data.movie_count !== 0 ) {
        searchListRender(response.data.movies);
      } else {
        alert('영화를 찾지 못했습니다.\n다시 입력해주세요.');
      }
    });
  }

  function getData() {
    get_data_flag = false;
    page_number++;

    // console.log('getData: ', page_number);
    $.get(URL + page_number, function(response) {
      // page_number, data 받기
      if(response.status === 'ok' && response.data.movie_count !== 0) {
        
        data = data.concat(response.data.movies); 
        
        console.log(data);
        remomveRenderedItem();
  
        $.each(data, function(index, data) {
  
          render(data, index);
        });

        setTimeout(function() {
          get_data_flag = true;
        }, 500);

      } else {
        alert('영화를 불러올 수 없습니다.');
      }
      // reset scrolling_offsetTop;


      
    });
  }

  function remomveRenderedItem() {
    var children = cont_list.children();
    
    if(children.length === 0) {
      return;
    }

    for(var i = 0, len = children.length; i < len; i++) {
      var child = children[i];

      child.parentNode.removeChild(children[i]);
    }
  }

  function render(data, index) {
    /**
     * ul(cont_list) 
     *  - li.body__cont__item
     *    - div.body__cont__item-wrapper
     *      - div.body__cont__poster__wrapper
     *        - img.body__cont__poster 
     *        - span.body__cont__year
     *      - div.body__cont__info__wrapper
     *        - h3.body__cont__title
     *        - p.body__cont__genres
     *        - span.body__cont__rating
     */

    var poster_src = data.medium_cover_image ? data.medium_cover_image : '../no-poster.png';
  
    // Create Element
    var li = $('<li class="body__cont__item" data-index="' + index + '"></li>'),
        item_wrapper = $('<div class="body__cont__item-wrapper"></div>'),
        poster_wrapper = $('<div class="body__cont__poster__wrapper"></div>'),
        info_wrapper = $('<div class="body__cont__info__wrapper"></div>'),
        poster = $('<img class="body__cont__poster" src="' + poster_src + '" alt="' + data.title + '"/>'),
        year = $('<span class="body__cont__year">' + data.year + '</span>'),
        title = $('<h3 class="body__cont__title">' + data.title + '</h3>'),
        rating = $('<span class="body__cont__rating">' + (data.rating / 2).toFixed(1) + '</span>');

    var genres = '';
    var genre = null;

    // console.log('data.genres', data.genres);
    $.each(data.genres, function(index, _data) {
      ((data.genres.length - 1) === index) ? genres += _data: genres += _data + ' ';
    });

    genre = $('<p class="body__cont__genres">' + genres + '</p>');

    // Append Element
    poster_wrapper.append(poster);
    poster_wrapper.append(year);

    info_wrapper.append(title);
    info_wrapper.append(genre);
    info_wrapper.append(rating);

    item_wrapper.append(poster_wrapper);
    item_wrapper.append(info_wrapper);

    li.append(item_wrapper);
    cont_list.append(li);

    li.on('click', function(e) {
      var index = $(this).attr('data-index');
      $('.modal').toggleClass('is-showing');
      modalRender(data);
    });
  }

  function modalRender(data) {

    if( target_modal ) { 

      target_modal[0].parentNode.removeChild(target_modal[0]); 
      target_modal = null;
    }
    console.log('modalRender: ', data);
    // Create Element
    var modal__wrap = $('<div class="modal__wrap"></div>'),
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

    target_modal = modal__wrap;
  }

  function searchListRender(movies) {
    // search_list
    if( target_search_list ) { 
      target_search_list[0].parentNode.removeChild(target_search_list[0]); 
      target_search_list = null;
    }
    console.log(movies);
    if( movies.length === 0 ) { return; }

    var ul = $('<ul></ul>');

    for(var i = 0, len = movies.length; i < len; i++) {
      var li = $('<li></li>'),
          span = $('<span>' + movies[i].title + '</span>');
      
      li.append(span);
      li.on('click', renderedSearchingMovieShowModalEvt.bind(null, movies[i]));
      ul.append(li);
    }
    target_search_list = ul;
    search_list.append(ul);    
  }
  function renderedSearchingMovieShowModalEvt(movie) {
    console.log('movie: ', movie);
    $('.modal').toggleClass('is-showing');
    modalRender(movie);
  } 
  init();

}(window, window.jQuery));