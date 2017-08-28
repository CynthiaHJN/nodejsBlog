$(function() {
    $('.listNav').click(function() {
        $('.sliderBar').slideToggle();
    });
    window.onresize = function() {
        if ($(window).width() > 600) {
            $('.sliderBar').hide();
        }
    }
});