// 모바일 메뉴 아이콘
function topMenuBtn() {
  $('.topmenu_btn').click(function () {
    $('nav').slideToggle('1000');
    $(this).toggleClass('on');
  });
}

// gnb 메뉴 선택시 스크롤 이동
function scrollGnb() {
  $('#header h1, .gnb li').click(function () {
    var scrollPosition = $($(this).find('a').attr('href')).offset().top;

    $('html, body').animate(
      {
        scrollTop: scrollPosition,
      },
      1000
    );
  });
}

var aboutAnimation = function () {
  $(window).scroll(function () {
    $('.about_con > dl').addClass('on');
  });
};

clearTimeout(aboutAnimation, 1000);

// skill영역 스크롤 이동 시 애니메이션 제어
function skillAnimation() {
  $(window).scroll(function () {
    var currentPostion = $('html, body').scrollTop();

    skillList = $('.progress_list li');

    $(skillList).each(function (idx) {
      // 각 percent value 가져오기
      value = $(this).find('input').val(); // percent 값
      $(skillList).eq(idx).find('div').textProgress(value);
    });
  });

  // progress 채우기
  $.fn.extend({
    textProgress: function () {
      this.next().animate(
        {
          // 다음 div요소의 animate를 부여하여 색이 채워지도록 함
          width: (200 / 100) * value + 'px', // img width값
        },
        100
      );
    },
  });
}

// function mediaFunc(x) {
//   if (x.matches) {
//     console.log('test');

//     scrollHeader();
//   } else {
//     return 0;
//   }
// }

// var x = window.matchMedia('(min-width:799px)');
// mediaFunc(x);

/* portfolio  popup*/

function portfolioPopup() {
  $('#thinktree').animatedModal({ modalTarget: 'ttModal' });
  $('#mot').animatedModal({ modalTarget: 'motModal' });
  $('#rollpop').animatedModal({ modalTarget: 'rollpopModal' });
  $('#fourdshop').animatedModal({ modalTarget: 'fourdshopModal' });
  $('#hanam').animatedModal({ modalTarget: 'hanamModal' });
  $('#item').animatedModal({ modalTarget: 'itemModal' });
  $('#vap').animatedModal({ modalTarget: 'vapModal' });
  $('#dietefit').animatedModal({ modalTarget: 'dietefitModal' });
  $('#iwedding').animatedModal({ modalTarget: 'iweddingModal' });
  $('#iweddingb').animatedModal({ modalTarget: 'iweddingbModal' });
  $('#icolor').animatedModal({ modalTarget: 'icolorModal' });
  $('#sportsguru').animatedModal({ modalTarget: 'sportsguruModal' });
  $('#hyundaicapital').animatedModal({ modalTarget: 'hyundaicapitalModal' });
  $('#busandbt').animatedModal({ modalTarget: 'busandbtModal' });
  $('#hyundaicard').animatedModal({ modalTarget: 'hyundaicardModal' });
  $('#lguplus').animatedModal({ modalTarget: 'lguplusModal' });
}

/* poftfolio img */
function poftfolioImg() {
  $(window).resize(function () {
    var imgHeight = $('.pop_img li').height();
    $('.pop_img ul').height(imgHeight);
  });
  $('.more_btn').click(function () {
    var imgHeight = $('.pop_img li').height();
    $('.pop_img ul').height(imgHeight);
    var select = $(this).attr('href');
    var $imgList = $(select).find('.pop_img li');
    var nImgCount = $imgList.children().length;
    var nIndex = 0;

    // reset
    $($imgList.get(0)).css('display', 'block');
    $($imgList.get(1), $imgList.get(2)).css('display', 'none');
    $($imgList.get(2)).css('display', 'none');

    var repeat = setInterval(autoSlide, 2000);

    function autoSlide() {
      var next = ++nIndex % nImgCount;
      $($imgList.get(next - 1)).fadeOut(1000);
      $($imgList.get(next)).fadeIn(1000);
    }

    // stop image
    $('.btn-close-modal').click(function () {
      clearInterval(repeat);
    });
  });
}

$(function () {
  //videoHeight();
  topMenuBtn();
  scrollGnb();
  skillAnimation();
  portfolioPopup();
  poftfolioImg();
});

// 스크롤이 발생하면 메뉴 보이기
$(window).on('scroll', function () {
  var scrollPosition = $(this).scrollTop();
  // 스크롤의 위치가 20 이상 일 때

  if (scrollPosition > 200) {
    $('#header').addClass('on');
  } else {
    // 윈도우 감추기
    $('#header').removeClass('on');
    return 0;
  }
});

function scrollDisable() {
  $('body')
    .addClass('scrollDisable')
    .on('scroll touchmove mousewheel', function (e) {
      e.preventDefault();
    });
}
function scrollAble() {
  $('body').removeClass('scrollDisable').off('scroll touchmove mousewheel');
}

scrollDisable();
