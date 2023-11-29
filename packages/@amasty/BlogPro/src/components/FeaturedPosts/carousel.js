export const carouselSettings = {
  slidesToShow: 3,
  slidesToScroll: 1,
  draggable: false,
  autoplay: false,
  infinite: true,
  arrows: true,
  dots: false,
  centerMode: false,
  responsive: [
    {
      breakpoint: 1280,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
        draggable: true
      }
    },
    {
      breakpoint: 425,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true
      }
    }
  ]
};
