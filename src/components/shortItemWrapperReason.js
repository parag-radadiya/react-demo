import React, {useEffect, useState} from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {Link} from "react-router-dom";

const ShortItemWrapperReason = () => {
    const [movieData, setMovieData] = useState([]);
    const [loading, setLoading] = useState(true);
    const settings =
        {
            // dots: true,
            infinite: true,
            speed: 1000,
            autoplay:true,
            autoplaySpeed:2000,
            slidesToShow: 7 ,
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
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        initialSlide: 1
                    }
                }
            ]
        };

    const fetchMovieData = async () => {
        try {
            // Make a fetch call to your AI service
            const response = await fetch(`${process.env.REACT_APP_API_URL}/consent/get-recommend-movies`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add any necessary authentication headers here
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch movie data');
            }

            // Assuming the AI service returns JSON data
            const data = await response.json();
            // Update state with the fetched movie data
            setMovieData(data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movie data:', error);
            setLoading(false); // Update loading state in case of error
        }
    };

    useEffect(() => {
        // Call the fetchMovieData function when the component mounts
        fetchMovieData();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className='slicks '>
                    <Slider {...settings}>
                        {movieData.map((movie, index) => (
                            <Link
                                to={`/movie/${movie.cid}`}
                                key={movie.cid}
                                target="_blank"
                                className="w-full"
                            >
                                <div key={index} className='psh'>
                                    <div className="shdow">
                                        <div className="ibocx hover:border-yellow-500" style={{ height: "275px", resize: 'both' }}>
                                            <img
                                                src={movie.info.posterlink}
                                                alt={movie.name}
                                                className='rounded-xl object-cover '
                                                style={{ height: '100%', width: '100%' }}                      />
                                        </div>
                                        <div className="ide unbounded-font text-sm">
                                            <span>{movie.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </Slider>
                </div>
            )}
        </div>
    )
}

export default ShortItemWrapperReason
