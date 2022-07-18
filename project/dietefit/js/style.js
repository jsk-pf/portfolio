$(document).ready(function () {
    var minScrollTop = 0;
    var maxScrollTop = $('body').prop("scrollHeight");
    $('#quick_menu').css("top", minScrollTop);
    var nowScrollTop = 0;
    $(window).scroll(function () {
        nowScrollTop = $(this).scrollTop();
        if (nowScrollTop <= minScrollTop || nowScrollTop < minScrollTop) {
            nowScrollTop = minScrollTop;
        }
        else if (nowScrollTop >= maxScrollTop || nowScrollTop > maxScrollTop) {
            nowScrollTop = maxScrollTop;
            
        }
        $('#quick_menu').stop();
        $('#quick_menu').animate({"top": nowScrollTop}, 300);
    });
    /* Gallery Slide */
    $(".regular").slick({
        prevArrow: '<img src="/images/pc/prev_btn.png" class="slick-prev" alt="">'
        , nextArrow: '<img src="/images/pc/next_btn.png" class="slick-next" alt="">'
        , slidesToShow: 3
        , slidesToScroll: 3
        , draggable: false
    });
    $('.slide').hiSlide();
    /* Gallery Popup*/
    $(".gallery_group").colorbox({
        rel: 'gallery_group'
    });
});