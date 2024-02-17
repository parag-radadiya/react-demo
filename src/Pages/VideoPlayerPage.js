// VideoPlayerPage.js
import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-mobile-ui/dist/videojs-mobile-ui.css";
import "videojs-mobile-ui";
import "videojs-mux";
import { useLocation } from "react-router-dom";
import toWebVTT from "srt-webvtt";
import { isBrowser } from "react-device-detect";

const VideoPlayerPage = () => {
  const languagesMap = { hin: "Hindi", eng: "English" };

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubLoaded, setSubLoaded] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Function to update window size in state
  const updateWindowSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Add event listener on component mount
  useEffect(() => {
    window.addEventListener("resize", updateWindowSize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (player) {
      player.dimensions(windowSize.width, windowSize.height);
    }
  }, [windowSize]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      playerRef.current = videojs(video, {
        controlBar: {
          skipButtons: {
            forward: 10,
            backward: 10,
          },
        },
        fullscreen: {
          enterOnRotate: true,
          exitOnRotate: true,
          lockOnRotate: true,
          lockToLandscapeOnEnter: false,
          disabled: false,
        },
        touchControls: {
          seekSeconds: 10,
          tapTimeout: 300,
          disableOnEnd: false,
          disabled: false,
        },
        plugins: {
          mux: {
            debug: false,
            data: {
              env_key: "5g18rrpouk4jf14mgbprgj6s7", // required
              // Metadata
              player_name: "DDLMovies Player", // ex: 'My Main Player'
              // ... and other metadata
            },
          },
        },
      });
      const player = playerRef.current;
      player.ready(async function () {
        player.mobileUi();
        player.dimensions(windowSize.width, windowSize.height);
        if (location.state.streamToken) {
          player.src({
            type: "video/mp4",
            src: `https://video.ddlmovies.online/?streamToken=${encodeURIComponent(
              location.state.streamToken
            )}`,
          });
        }
        (async () => {
          let isSubAdded = false;
          if (location.state.subtitles && !isSubLoaded) {
            console.log("loading subs :)");
            setSubLoaded(true);
            for (let sub of location.state.subtitles) {
              try {
                const subRes = await fetch(sub.url);
                const subBlob = await subRes.blob();
                const textTrackUrl = await toWebVTT(subBlob);
                player.addRemoteTextTrack(
                  {
                    src: textTrackUrl,
                    kind: "subtitles",
                    label: languagesMap[sub.language]
                      ? languagesMap[sub.language]
                      : sub.language,
                  },
                  false
                );
                isSubAdded = true;
              } catch (e) {
                console.error(e);
              }
            }
          }
          if (!isSubAdded) {
            try {
              const subtitles = await (
                await fetch(
                  `https://subtitle-smart.showman-ddl.workers.dev/?fid=${location.state.fid}`
                )
              ).json();
              for (let sub of subtitles.subtitles) {
                try {
                  const subRes = await fetch(sub.SubDownloadLink).then(
                    (response) => {
                      // Create a new ReadableStream from the response body
                      const stream = response.body;
                      // Create a new DecompressionStream with the "gzip" type
                      const decompressionStream = new window.DecompressionStream(
                        "gzip"
                      );
                      // Pipe the response body through the DecompressionStream
                      const uncompressedStream =
                        stream.pipeThrough(decompressionStream);
                      // Create a new ReadableStream reader
                      const reader = uncompressedStream.getReader();

                      // Read data from the decompressed stream
                      return new Response(
                        new ReadableStream({
                          start(controller) {
                            function push() {
                              // Read from the decompressed stream
                              reader
                                .read()
                                .then(({ done, value }) => {
                                  if (done) {
                                    // Close the controller when done reading
                                    controller.close();
                                    return;
                                  }
                                  // Push the decompressed data
                                  controller.enqueue(value);
                                  push(); // Continue reading
                                })
                                .catch((error) => {
                                  console.error(
                                    "Error reading from decompressed stream:",
                                    error
                                  );
                                  controller.error(error);
                                });
                            }
                            push(); // Start reading
                          },
                        })
                      );
                    }
                  );
                  const subBlob = await subRes.blob();
                  const textTrackUrl = await toWebVTT(subBlob);
                  player.addRemoteTextTrack(
                    {
                      src: textTrackUrl,
                      kind: "subtitles",
                      label: sub.LanguageName + "-" + sub.SubFileName,
                    },
                    false
                  );
                } catch (e) {
                  console.error(e);
                }
              }
            } catch (e) {
              console.error(e);
            }
          }
        })();
        player.reloadSourceOnError();
        setIsLoading(false);
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoRef]);

  return (
    <div className="video-player-page w-full h-full bg-black overflow-hidden">
      {isLoading && (
        <div className="absolute z-10 inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-25"></div>
        </div>
      )}
      <video
        id="ddlMoviesPlayer"
        ref={videoRef}
        //className="video-js vjs-default-skin"
        className={`video-js vjs-default-skin ${
          isBrowser ? "vjs-luxmty" : ""
        } vjs-show-big-play-button-on-pause`}
        controls
        preload="auto"
      ></video>
    </div>
  );
};

export default VideoPlayerPage;
