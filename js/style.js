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
    let scrollPosition = $($(this).find('a').attr('href')).offset().top;

    $('html, body').animate(
      {
        scrollTop: scrollPosition,
      },
      1000
    );
  });
}

let aboutAnimation = function () {
  $(window).scroll(function () {
    $('.about_con > dl').addClass('on');
  });
};

clearTimeout(aboutAnimation, 1000);

// skill영역 스크롤 이동 시 애니메이션 제어
function skillAnimation() {
  $(window).scroll(function () {
    let currentPostion = $('html, body').scrollTop();

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

// let x = window.matchMedia('(min-width:799px)');
// mediaFunc(x);

/* portfolio  popup*/
/* poftfolio img */
function poftfolioImg() {
  $(window).resize(function () {
    let imgHeight = $('.pop_img img').height();
    // $('.pop_img ul').height(imgHeight);
  });
}

$('.pf_img, .more_btn').click(function (e) {
  e.preventDefault();
  let pfTarget = $(this).attr('id');
  $(`#${pfTarget}`).animatedModal({ modalTarget: `${pfTarget}Modal` });

  let imgHeight = $(`${pfTarget}Modal`).find('.pop_img img').height();
  $('.pop_img img').height(imgHeight);
  $('.pop_img li').css('position', 'absolute');
  let select = $(this).attr('href');
  let $imgList = $(select).find('.pop_img li');
  let nImgCount = $imgList.children().length;
  let nIndex = 0;

  // reset
  $($imgList.get(0)).css('display', 'block');
  $($imgList.get(1), $imgList.get(2)).css('display', 'none');
  $($imgList.get(2)).css('display', 'none');

  let repeat = setInterval(autoSlide, 2000);

  function autoSlide() {
    let next = ++nIndex % nImgCount;
    $($imgList.get(next - 1)).fadeOut(1000);
    $($imgList.get(next)).fadeIn(1000);
  }

  // stop image
  $('.btn-close-modal').click(function () {
    clearInterval(repeat);
  });
});

$(function () {
  topMenuBtn();
  scrollGnb();
  skillAnimation();
  poftfolioImg();
});

// 스크롤이 발생하면 메뉴 보이기
function scrollHeader() {
  $(window).on('scroll', function () {
    let scrollPosition = $(this).scrollTop();

    if (scrollPosition > 200) {
      $('#header').addClass('on');
    } else {
      // 윈도우 감추기
      $('#header').removeClass('on');
      return 0;
    }
  });
}
scrollHeader();
//clearTimeout(scrollHeader, 1000);

// $('#thinktree').animatedModal({ modalTarget: 'ttModal' });
// $('#mot').animatedModal({ modalTarget: 'motModal' });
// $('#rollpop').animatedModal({ modalTarget: 'rollpopModal' });
// $('#fourdshop').animatedModal({ modalTarget: 'fourdshopModal' });
// $('#hanam').animatedModal({ modalTarget: 'hanamModal' });
// $('#item').animatedModal({ modalTarget: 'itemModal' });
// $('#vap').animatedModal({ modalTarget: 'vapModal' });
// $('#dietefit').animatedModal({ modalTarget: 'dietefitModal' });
// $('#iwedding').animatedModal({ modalTarget: 'iweddingModal' });
// $('#iweddingb').animatedModal({ modalTarget: 'iweddingbModal' });
// $('#icolor').animatedModal({ modalTarget: 'icolorModal' });
// $('#sportsguru').animatedModal({ modalTarget: 'sportsguruModal' });
// $('#hyundaicapital').animatedModal({ modalTarget: 'hyundaicapitalModal' });
// $('#busandbt').animatedModal({ modalTarget: 'busandbtModal' });
// $('#hyundaicard').animatedModal({ modalTarget: 'hyundaicardModal' });
// $('#lguplus').animatedModal({ modalTarget: 'lguplusModal' });
// $('#kmiAdmin').animatedModal({ modalTarget: 'kmiAdminModal' });
// $('#kmiPc').animatedModal({ modalTarget: 'kmiPcModal' });
// $('#omnicare').animatedModal({ modalTarget: 'omnicareModal' });
