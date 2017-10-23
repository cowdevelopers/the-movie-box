(function(global, $) {
  'use strict';

  var cont_list = null, footer_heading = null;
  
  var data = [], 
      page_number = 0, 
      limit = 12, 
      scrolling_offsetTop = 0, 
      get_data_flag = false,
      submenu_flag = false;

  var URL = '',
      genre_value = 'what',
      urls = {
        trending: 'https://yts.ag/api/v2/list_movies.json?sort_by=download_count&limit=12&page=',
        topRated: 'https://yts.ag/api/v2/list_movies.json?sort_by=rating&limit=12&page=',
        newArrivals: 'https://yts.ag/api/v2/list_movies.json?sort_by=date_added&limit=12&page=',
        genres: 'https://yts.ag/api/v2/list_movies.json?genre=' + genre_value + '&limit=12&page='
      };
      
  // 리스트 버튼 
  var list_nav_btns;


  function init() {
    cont_list = $('.body__cont__list');
    footer_heading = $('.footer__heading');
    list_nav_btns = $('.body__nav__link');

    URL = urls.trending;

    bind();
    getData();
  }

  function bind() {
    $(window).on('scroll', function() {
      var scrollY = $(this).scrollTop();

      console.log('scrollY', scrollY);
      if (scrollY > scrolling_offsetTop) {
        get_data_flag && getData();
      }
    })

    list_nav_btns.each(function(index, list_nav_btn) {

      $(list_nav_btn).on('click', function(e) {
        
        e.preventDefault();
        
        var type = $(this).attr('data-type'),
            submenu = $(this).parent().find('.body__nav__submenu');

        URL = urls[type];
        
        if( submenu.length === 0 ) {
          console.log('0');
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
  }

  function getData() {
    get_data_flag = false;
    page_number++;

    // console.log('getData: ', page_number);
    $.get(URL + page_number, function(response) {
      // page_number, data 받기
      data = data.concat(response.data.movies); 
      console.log(data);
      remomveRenderedItem();

      $.each(data, function(index, data) {

        render(data, index);
      });
      // reset scrolling_offsetTop;


      setTimeout(function() {
        // scrolling_offsetTop = footer_heading.offset().top / 1.5;
        scrolling_offsetTop = $(document).height() - 1500;
        // console.log('scrolling_offsetTop: ', scrolling_offsetTop);

        get_data_flag = true;
      }, 500);
    });
  }

  function remomveRenderedItem() {
    var children = cont_list.children();
    
    if(children.length === 0) {
      return;
    }

    for(var i = 0, len = children.length; i < len; i++) {
      children[i].remove();
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
  }
  init();

}(window, window.jQuery));