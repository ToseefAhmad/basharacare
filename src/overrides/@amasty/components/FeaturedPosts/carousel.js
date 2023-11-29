export const carouselSettings = {
    slidesToShow: 3,
    slidesToScroll: 1,
    draggable: false,
    autoplay: false,
    infinite: false,
    arrows: true,
    dots: true,
    dotsClass: 'slick-line',
    centerMode: false,
    responsive: [
        {
            breakpoint: 1280,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                dots: true,
                infinite: true
            }
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                dots: true,
                draggable: true,
                infinite: true
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true,
                infinite: true
            }
        }
    ]
};
