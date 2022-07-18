//화면에 따른 video 높이 지정
function topMenuBtn(){
	$(".topmenu_btn").click(function(){
		$("nav").slideToggle("1000");
		$(this).toggleClass("on");
	});
}


//화면에 따른 video 높이 지정
function videoHeight(){
	$(window).on("load resize", function(){
		var videoHeight = $(".visual_video").height();
		$(".visual .wrap").css("height", videoHeight);
	});
}

// 스크롤 발생 시 메뉴 보이기
function scrollHeader() {
	// 스크롤이 발생하면 메뉴 보이기
	$(window).scroll(function () {
		var scrollPosition = $(this).scrollTop();
		// 스크롤의 위치가 20 이상 일 때 
		if (scrollPosition > 20) {
			$("#header").addClass("on");
		} else { // 윈도우 감추기
			$("#header").removeClass("on")
		}
	});
}

function sectionPos(){
	$(window).load(function(){
		//var scrollPosition = $($(this).find("a").attr("href")).offset().top;
		
		$("section").each(function (idx) { // 각 percent value 가져오기
			

			//position = $(this).offset().top;
		


		});





	});
}






// gnb 메뉴 선택시 스크롤 이동
function scrollGnb(){
	$(".gnb li").click(function() {
		var selMenu = $(this).find("a").attr("href");
		
		var scrollPosition = $($(this).find("a").attr("href")).offset().top;



		$("html, body").animate({
			scrollTop : scrollPosition
		}, 1000);

		alert(scrollPosition);

	


		if(selMenu == "#about"){
			aboutAnimation();
		}

	});
}

// about 메뉴 애나메이션


function aboutAnimation(){
	//  현재 about 위치 600
	$(window).scroll(function () {
			$(".about_con > dl").addClass("on");
	});
}


// skill영역 스크롤 이동 시 애니메이션 제어
function skillAnimation() {
	$(window).scroll(function () {
		var currentPostion = $("html, body").scrollTop();

		if (currentPostion >= 1300 && currentPostion < 1700) {
			skillList = $(".progress_list li");

			$(skillList).each(function (idx) { // 각 percent value 가져오기
				value = $(this).find("input").val(); // percent 값
				$(skillList).eq(idx).find("div").textProgress(value);
			});
		}
	});

	// progress 채우기
	$.fn.extend({
		textProgress: function () {
			this.next().animate({ // 다음 div요소의 animate를 부여하여 색이 채워지도록 함 
			width: ((200 / 100) * value) + "px" // img width값
			}, 1500);
		}
	});
}


/* portfolio  popup*/
function portfolioPopup(){
  $("#thinktree").animatedModal({modalTarget:'ttModal'});
  $("#mot").animatedModal({modalTarget:'motModal'});
  $("#rollpop").animatedModal({modalTarget:'rollpopModal'});
  $("#fourdshop").animatedModal({modalTarget:'fourdshopModal'});
  $("#hanam").animatedModal({modalTarget:'hanamModal'});
  $("#item").animatedModal({modalTarget:'itemModal'});
  $("#vap").animatedModal({modalTarget:'vapModal'});
  $("#dietefit").animatedModal({modalTarget:'dietefitModal'});
}


/* poftfolio img */
function poftfolioImg(){
     $(window).resize(function() {
          var imgHeight = $(".pop_img li").height();
            $(".pop_img ul").height(imgHeight);
        });
    $(".more_btn").click(function(){
        var imgHeight = $(".pop_img li").height();
         $(".pop_img ul").height(imgHeight);
        var select = ($(this).attr("href"));
        var $imgList = $(select).find('.pop_img li');		
        var nImgCount = $imgList.children().length;	
        var nIndex = 0;	

        // reset
        $($imgList.get(0)).css("display","block");
        $($imgList.get(1),$imgList.get(2)).css("display","none");
        $($imgList.get(2)).css("display","none");

         var repeat = setInterval(autoSlide, 2000);		

        function autoSlide() {
            var next = (++nIndex % nImgCount);
            $($imgList.get(next - 1)).fadeOut(1000);
            $($imgList.get(next)).fadeIn(1000);
        }

        // stop image
         $(".btn-close-modal").click(function(){
           clearInterval(repeat);
        });
    });
}






$(function () {
	topMenuBtn();
	videoHeight();
	scrollHeader();
	sectionPos();
	scrollGnb();
	skillAnimation();
	 portfolioPopup();
    poftfolioImg();
});