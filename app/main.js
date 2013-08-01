require.config({ 
    paths: {
        // a: '../modules/a',
        // b: '../modules/b',
        // c: '../modules/c',
        jquery: './lib/jquery'
    }
});

var hoverState = false;
require(['jquery'], function ($) {
    $('.carousel .dots').show();
    $(document).on('click','.carousel .dots li',function(e){
        if (e.preventDefault){
            e.preventDefault();
        }
        $('.carousel .tab').fadeOut();
        $('.carousel ' + $(this).find('a').attr('href')).fadeIn();
    });

    var rotateInterval = 7000;
    var tabs = $('.carousel .tab').get();
    var rotateCarousel = function(){
        var changed = false;
        if(!hoverState){
            $.each(tabs,function(i,tab){
                if($(tab).css('display') === 'block' && changed === false){
                    changed = true;
                    if($(tab).next().get().length > 0){
                        $(tab).next().fadeIn();
                        $(tab).fadeOut();
                    }else{
                        $(tabs[0]).fadeIn();
                        $(tab).fadeOut();
                    }
                }
            });
        }
    };

    var carouselScroll = setInterval(rotateCarousel, rotateInterval);
    $('.carousel').hover(function(){
        clearInterval(carouselScroll);
        hoverState = true;
    },function(){
        hoverState= false;
        carouselScroll = setInterval(rotateCarousel, rotateInterval);
    });
});