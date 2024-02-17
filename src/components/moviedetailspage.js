import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DetailScroll = () => {

    const settings =
        {
            // dots: true,
            infinite: true,
            speed: 1000,
            autoplay:true,
            autoplaySpeed:2000,
            slidesToShow: 10,
            slidesToScroll: 1,

            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        initialSlide: 1
                    }
                }
            ]
        };

    // make one api for get popular movie data and add it dynamically
    const movieData = [
        {
            src: 'https://image.tmdb.org/t/p/w400/iJv2ROkp55GxiCx9AFECZ2Cj2RJ.jpg',
            name: 'Amelia\'s Children'
        },
        {
            src: 'https://image.tmdb.org/t/p/w400/iJv2ROkp55GxiCx9AFECZ2Cj2RJ.jpg',
            name: 'Amelia\'s son'
        },
        {
            src: 'https://image.tmdb.org/t/p/w400/iJv2ROkp55GxiCx9AFECZ2Cj2RJ.jpg',
            name: 'Amelia\'s Father'
        },
        {
            src: 'https://image.tmdb.org/t/p/w400/iJv2ROkp55GxiCx9AFECZ2Cj2RJ.jpg',
            name: 'Amelia\'s Father'
        },
        {
            src: 'https://image.tmdb.org/t/p/w400/iJv2ROkp55GxiCx9AFECZ2Cj2RJ.jpg',
            name: 'Amelia\'s Father'
        },
        {
            src: 'https://image.tmdb.org/t/p/w400/iJv2ROkp55GxiCx9AFECZ2Cj2RJ.jpg',
            name: 'Amelia\'s Father'
        },
        {
            src: 'https://image.tmdb.org/t/p/w400/iJv2ROkp55GxiCx9AFECZ2Cj2RJ.jpg',
            name: 'Amelia\'s Father'
        },
        {
            src: 'https://image.tmdb.org/t/p/w400/iJv2ROkp55GxiCx9AFECZ2Cj2RJ.jpg',
            name: 'Amelia\'s Father'
        },
    ]

    return (
        <div>
            <div className='slicks'>
                <Slider {...settings}>
                    {movieData.map((d) => (
                        <div className='psh'>
                            <div className="shdow">
                                <div className="ibocx">
                                    <img src={d.src} alt="" className='rounded' />
                                </div>
                                <div className="ide">

                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default DetailScroll
