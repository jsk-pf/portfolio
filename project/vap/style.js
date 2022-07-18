$(document).ready(function () {
    /* puzzle select */
    $(".puzzle_list>li").click(function () {
        var select_puz = $(this).attr("class");
        var src = $("." + select_puz + " img").attr("src");
        var html = "<img class=\"myPics\" src=\"" + src + "\" alt=\"\" />";
        $(".container").css("background-image", "url(images/" + select_puz + "_bg.jpg)");
        $(".mix_btn img").attr("src", "images/" + select_puz + "_mix.png");
        $("#puzzle_container").html(html);
        $(".myPics").jqPuzzle();
    });
    
    /* popup close */
    $(".popup_close_btn").click(function () {
        $(".popup_area").fadeOut(300);
        $(".layer_bg").css("display", "none");
    });
    
    /* ask select */
    $(".ask_select").change(function () {
        if ($(this).val() == "7") {
            $(".ask_input").css("visibility", "visible");
            $(".ask_input").focus();
        }
        else {
            $(".ask_input").css("visibility", "hidden");
        }
    });
    
});