import React, {useEffect, useState} from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {Link} from "react-router-dom";
const DivSliderMain = () => {
    const [movieData, setMovieData] = useState([]);
    const [loading, setLoading] = useState(true);

    const settings = {
        // dots: true,
        infinite: true,
        autoplay:true,
        autoplaySpeed:2000,
        speed: 1000,
        slidesToShow:4,
        slidesToScroll:1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,

                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                    infinite: true,
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
        <div className="relative   text-left text-lgi text-white font-open-sans ">
            <div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div
                        className="mt-8">
                        <Slider {...settings} >
                            {movieData.map((d,index) => (
                                <Link
                                    to={`/movie/${d.cid}`}
                                    key={d.cid}
                                    target="_blank"
                                    className="w-full"
                                >
                                    <div key={index} className='psh'>
                                        <div className="relative" style={{ height: "550px", width:'400px', resize: 'both' }}>

                                            <img
                                                className="relative rounded-xl"
                                                loading="eager"
                                                alt=""
                                                src={d.info.posterlink}
                                                style={{ height: "100%", width: '100%' }}
                                            />
                                            <div
                                                className="absolute w-full right-[0%] bottom-[-0.5px] left-[0%] [background:linear-gradient(0deg,_#000_8%,_rgba(0,_0,_0,_0)_92%)] flex flex-col items-start justify-start pt-10 px-5 pb-5 box-border gap-[16px] max-w-full z-[1]">
                                                <h3 className="m-0 relative text-inherit leading-[20px] font-bold font-inherit text-whitesmoke">
                                                    {d.name.split('(')[0].trim()}
                                                </h3>
                                                <div
                                                    className="flex flex-col items-start justify-start gap-[5px] max-w-full text-smi">
                                                    <div className="flex flex-row items-start justify-start gap-[12px]">
                                                        {/*<div className="relative leading-[20px]">2023</div>*/}
                                                        {/*<div className="relative leading-[20px]">100 min</div>*/}
                                                        <div className="relative leading-[20px] font-bold font-inherit text-whitesmoke">{d.info.genere}</div>
                                                        <div className="relative leading-[20px] font-bold font-inherit text-whitesmoke">{d.info.language}</div>
                                                        <div className="relative leading-[20px] font-bold font-inherit text-whitesmoke">{d.info.rating}</div>
                                                        <div className="relative leading-[20px] font-bold font-inherit text-whitesmoke">{d.info.quality}</div>
                                                        {/*<div className="relative leading-[20px]">Romance (HD)</div>*/}
                                                    </div>
                                                    <div className="relative leading-[20px]">
                                                        <p className="m-0">
                                                            {d.description}
                                                        </p>
                                                        <p className="m-0">
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className="w-[143px] rounded-11xl  box-border flex flex-row items-center justify-center py-[9px] pr-4 pl-5 whitespace-nowrap text-base border-[2px] border-solid border-white hover: border border-1">
                                                    {
                                                        // todo : add download and watch now button
                                                    }
                                                    <div className="relative leading-[20px] uppercase">watch now</div>
                                                </div>
                                            </div>
                                            {/*<div className="absolute top-[0px] right-[0px] box-border w-[90px] h-[243px] overflow-hidden z-[2] border-t-[153px] border-solid border-hotpink border-b-[90px] border-l-[90px]" />*/}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </Slider>
                    </div>
                )}
            </div>
        </div>
    )
}
export default DivSliderMain;
