import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import mixpanel from "mixpanel-browser";
import PopupModal from "../PopupModal";
import DetailScroll from "../components/moviedetailspage";

function MovieDetailPage() {
  const { dbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [mContent, setMContent] = useState({
    default: { R480: {}, R720: {}, R1080: {} },
  });
  const [popup, setPopup] = useState(false);
  const [popupList, setPopupList] = useState([]);
  const [subtitles, setSubtitles] = useState({});
  const [curEp, setCurEp] = useState("default");
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await (
          await fetch(`${process.env.REACT_APP_API}/movie/${dbID}`)
        ).json();
        mixpanel.track("movie clicked", {
          name: res.Name,
          dbID: dbID,
        });
        if (res?.length > 0) {
          setMovie(res[0]);
          const m_ = res[0];
          if (m_.Subtitles) {
            let subs = {};
            for (let x in m_.Subtitles) {
              subs[x] = [];
              for (let y in m_.Subtitles[x]) {
                subs[x].push({
                  language: m_.Subtitles[x][y][0],
                  url: m_.Subtitles[x][y][1],
                });
              }
            }

            setSubtitles(subs);
          }
          if (m_.IsMovie) {
            const fm = { R480: {}, R720: {}, R1080: {} };
            for (const r in m_.MediaLinks) {
              let d = {};
              if (m_.MediaLinks[r]) {
                for (let c of m_.MediaLinks[r]) {
                  if (!d.hasOwnProperty(c.UID)) {
                    d[c.UID] = [];
                  }
                  d[c.UID].push({ Fid: c.Fid, AudioTrack: c.AudioTrack, IsTemp: c.IsTemp, IsRoot: c.IsRoot });
                }
              }
              fm[r] = d;
            }
            setMContent({ default: fm });
          } else {
            const mc = {};
            for (const ep of m_.EpisodeData) {
              mc[ep.Name] = { R480: {}, R720: {}, R1080: {} };
              if (ep.R480) {
                let d = {};
                for (let c of ep.R480) {
                  if (!d.hasOwnProperty(c.UID)) {
                    d[c.UID] = [];
                  }
                  d[c.UID].push({ Fid: c.Fid, AudioTrack: c.AudioTrack, IsTemp: c.IsTemp, IsRoot: c.IsRoot });
                }
                mc[ep.Name].R480 = d;
              }
              if (ep.R720) {
                let d = {};
                for (let c of ep.R720) {
                  if (!d.hasOwnProperty(c.UID)) {
                    d[c.UID] = [];
                  }
                  d[c.UID].push({ Fid: c.Fid, AudioTrack: c.AudioTrack, IsTemp: c.IsTemp, IsRoot: c.IsRoot });
                }
                mc[ep.Name].R720 = d;
              }
              if (ep.R1080) {
                let d = {};
                for (let c of ep.R1080) {
                  if (!d.hasOwnProperty(c.UID)) {
                    d[c.UID] = [];
                  }
                  d[c.UID].push({ Fid: c.Fid, AudioTrack: c.AudioTrack, IsTemp: c.IsTemp, IsRoot: c.IsRoot });
                }
                mc[ep.Name].R1080 = d;
              }
            }
            setMContent(mc);
          }
        }
      } catch (error) {
        mixpanel.track("movie load failed", {
          dbID: dbID,
        });
        console.log("Error fetching movie details:", error);
      }
      setIsLoading(false);
    };

    fetchMovieDetails();
  }, [dbID, location.state]);

  const download = async (items) => {
    const fid = items.reduce((old, cur) => {
      if (cur.IsRoot) {
        return cur.Fid;
      }
      return old;
    }, items[0].Fid);
    setIsLoading(true);
    try {
      const res = await (
        await fetch(`${process.env.REACT_APP_API}/content/${fid}`)
      ).json();
      mixpanel.track("movie download clicked", {
        name: movie.Name,
        fid: fid,
        dbID: dbID,
      });
      if (res.DownloadLink) {
        var a = document.createElement("a");
        a.href = res.DownloadLink;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        throw res;
      }
    } catch (e) {
      mixpanel.track("movie download failed", {
        name: movie.Name,
        dbID: dbID,
        fid: fid,
      });
      console.error(e);
      alert("Error while downloading!");
    }
    setIsLoading(false);
  };

  const openPopUp = (list) => {
    list = list.filter((val) => !val.IsTemp);
    if (list.length === 1) {
      return watch(list[0].Fid);
    }
    setPopupList(list);
    setPopup(true);
  };

  const watch = async (fid) => {
    setIsLoading(true);
    try {
      const res = await (
        await fetch(`${process.env.REACT_APP_API}/content/${fid}`)
      ).json();
      mixpanel.track("movie stream clicked", {
        name: movie.Name,
        fid: fid,
        dbID: dbID,
      });
      if (res.StreamToken) {
        navigate("/play", {
          state: { streamToken: res.StreamToken, subtitles: subtitles[curEp],  fid },
        });
      } else {
        throw res;
      }
    } catch (e) {
      console.error(e);
      mixpanel.track("movie download failed", {
        name: movie.Name,
        fid: fid,
        dbID: dbID,
      });
      alert("Can't generate watch token");
    }
    setIsLoading(false);
  };

  const isStreamAble = (items) => {
    return items.reduce((old, cur) => {
      console.log(cur)
      if (!cur.IsTemp) {
        return true;
      }
      return old;
    }, false);
  };


  return (
    <div>
      {popup && (
        <PopupModal
          list={popupList}
          onLanguageSelect={(fid) => {
            watch(fid);
            setPopup(false);
          }}
          onClose={() => setPopup(false)}
        />
      )}
      {isLoading && (
        <div className="fixed z-10 inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-25"></div>
        </div>
      )}

      <a href="/"><h1 className="text-3xl  font-bold text-white mb-2 mt-3 md:ml-20 sm:ml-0">Movie<span className="text">Strom</span>
      </h1></a>
      <DetailScroll/>
      <div>
        <hr className="my-5 border-neutral-600 border-1"/>
        <h4 className='text-white  text-5xl font-serif text-center'>Your Movie</h4>

        <hr className="my-4 border-neutral-600  border-1"/>
      </div>
      <div className="min-h-screen bg-black text-white flex justify-center w-full">

        {movie && (
          <div className="w-10/12 my-5 flex items-center flex-col">
            <h1 className="text-2xl font-semibold mb-4">{movie.Name}</h1>

            <div className="flex flex-col justify-center items-center my-3">
              <img
                src={`https://images.cdn.kukufm.com/w:350/f:webp/q:100/${movie.Info.PosterLink}`}
                alt={movie.Name}
                className="h-96 object-cover rounded-lg"
              />

              <div className="flex flex-col mt-2">
                <div>
                  <span className="font-bold">Language: </span>
                  <span className="font-bold">{movie.Info.Language}</span>
                </div>
                <div>
                  <span className="font-bold">Genere: </span>
                  <span className="font-bold">{movie.Info.Genere}</span>
                </div>
                <div>
                  <span className="font-bold">Quality: </span>
                  <span className="font-bold">{movie.Info.Quality}</span>
                </div>
              </div>
            </div>

            {movie.Info.ScreenShots && (
              <div className="w-full flex justify-center flex-col items-center mt-3">
                <div className="w-full flex items-center">
                  <div
                    className="flex-1 bg-neutral-600 mx-2"
                    style={{ height: 1 }}
                  ></div>
                  <span className="text font-extrabold text-xl">
                    Screen Shots
                  </span>
                  <br/>
                  <br/>
                  <div
                    className="flex-1 bg-neutral-600 mx-2"
                    style={{ height: 1 }}
                  ></div>
                </div>
                {movie.Info.ScreenShots.length === 1 && (
                  <img
                    src={`https://images.cdn.kukufm.com/f:webp/q:100/${movie.Info.ScreenShots[0]}`}
                    className="mt-3"
                  />
                )}
                {movie.Info.ScreenShots.length > 1 && (
                  <div className="grid grid-cols-2">
                    {movie.Info.ScreenShots.map((val, index) => {
                      return (
                        <img
                          key={`${index}_img`}
                          src={`https://images.cdn.kukufm.com/f:webp/q:100/${val}`}
                          className="mt-3"
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <div className="w-full my-6">
              <div className="w-full flex items-center">
                <div
                  className="flex-1 bg-neutral-600 mx-2"
                  style={{ height: 1 }}
                ></div>
                {/*<span className="text-red-600 font-extrabold text-xl">*/}
                {/*  Download Links*/}
                {/*</span>*/}
                <div
                  className="flex-1 bg-neutral-600 mx-2"
                  style={{ height: 1 }}
                ></div>
              </div>
              {movie.IsMovie &&
                Object.keys(mContent.default?.R480).length > 0 && (
                  <div className="w-full mt-4">
                    <div className="w-full flex items-center">
                      <div
                        className="flex-1 bg-neutral-600 mx-2"
                        style={{ height: 1 }}
                      ></div>
                      <span className="text-yellow-300 font-extrabold text-10xl">
                        480p
                      </span>
                      <div
                        className="flex-1 bg-neutral-600 mx-2"
                        style={{ height: 1 }}
                      ></div>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center">
                      {Object.keys(mContent.default.R480).map((val, index) => {
                        return (
                          <div
                            key={mContent.default.R480[val][0].Fid}
                            className=" rounded p-2 m-3"
                          >
                            <span className="text-white text-base font-semibold">
                              {val}:{" "}
                            </span>
                            <button
                              onClick={() =>
                                download(mContent.default.R480[val])
                              }
                              type="button"
                              className="text-white ml-2 border border-yellow-300 border-1 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                              Download
                            </button>
                            {isStreamAble(mContent.default.R480[val]) && (
                              <button
                                onClick={() =>
                                  openPopUp(mContent.default.R480[val])
                                }
                                type="button"
                                className="focus:outline-none text-white border border-yellow-300 border-1  focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                              >
                                Watch Online
                              </button>
                            )}{" "}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              {movie.IsMovie &&
                Object.keys(mContent.default?.R720).length > 0 && (
                  <div className="w-full mt-4">
                    <div className="w-full flex items-center">
                      <div
                        className="flex-1 bg-neutral-600 mx-2"
                        style={{ height: 1 }}
                      ></div>
                      <span className="text-yellow-300 font-extrabold text-8xl">
                        720p
                      </span>
                      <div
                        className="flex-1 bg-neutral-600 mx-2"
                        style={{ height: 1 }}
                      ></div>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center">
                      {Object.keys(mContent.default.R720).map((val, index) => {
                        return (
                          <div
                            key={mContent.default.R720[val][0].Fid}
                            className=" rounded p-2 m-3"
                          >
                           <span className="text-white text-base font-semibold">
                              {val}:{" "}
                            </span>
                            <button
                              onClick={() =>
                                download(mContent.default.R720[val])
                              }
                              type="button"
                              className="text-white border border-yellow-300 border-1 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                              Download
                            </button>
                            {isStreamAble(mContent.default.R720[val]) && (
                              <button
                                onClick={() =>
                                  openPopUp(mContent.default.R720[val])
                                }
                                type="button"
                                className="focus:outline-none text-white border border-yellow-300 border-1 focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                              >
                                Watch Online
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              {movie.IsMovie &&
                Object.keys(mContent.default?.R1080).length > 0 && (
                  <div className="w-full mt-4">
                    <div className="w-full flex items-center">
                      <div
                        className="flex-1 bg-neutral-600 mx-2"
                        style={{ height: 1 }}
                      ></div>
                      <span className="text-yellow-300 font-extrabold text-8xl">
                        1080p
                      </span>
                      <div
                        className="flex-1 bg-neutral-600 mx-2"
                        style={{ height: 1 }}
                      ></div>
                    </div>
                    <div className="w-full flex flex-col justify-center items-center">
                      {Object.keys(mContent.default.R1080).map((val, index) => {
                        return (
                          <div
                            key={mContent.default.R1080[val][0].Fid}
                            className="rounded p-2 m-3"
                          >
                            <span className="text-white text-base font-semibold">
                              {val}:{" "}
                            </span>
                            <button
                              onClick={() =>
                                download(mContent.default.R1080[val])
                              }
                              type="button"
                              className="text-white border border-yellow-300 border-1 focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                              Download
                            </button>
                            {isStreamAble(mContent.default.R1080[val]) && (
                              <button
                                onClick={() =>
                                  openPopUp(mContent.default.R1080[val])
                                }
                                type="button"
                                className="focus:outline-none text-white border border-yellow-300 border-1 focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                              >
                                Watch Online
                              </button>
                            )}{" "}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {!movie.IsMovie && (
                <div className="w-full flex flex-col justify-center items-center">
                  {movie.EpisodeData.map((val, index) => {
                    return (
                      <div className="w-full my-4">
                        <div className="w-full flex items-center">
                          <div
                            className="flex-1 bg-neutral-600 mx-2"
                            style={{ height: 1 }}
                          ></div>
                          <span className="text-white font-extrabold text-xl">
                            {val.Name}
                          </span>
                          <div
                            className="flex-1 bg-neutral-600 mx-2"
                            style={{ height: 1 }}
                          ></div>
                        </div>
                        <div className="w-full flex flex-col justify-center items-center">
                          {Object.keys(mContent[val.Name]?.R480).length > 0 &&
                            Object.keys(mContent[val.Name].R480).map(
                              (val1, index) => {
                                return (
                                  <div
                                    key={mContent[val.Name].R480[val1][0].Fid}
                                    className="bg-cyan-50 rounded p-2 m-3"
                                  >
                                    <span className="text-black text-base font-semibold">
                                      480p (Mirror {index + 1}):{" "}
                                    </span>
                                    <button
                                      onClick={() =>
                                        download(mContent[val.Name].R480[val1])
                                      }
                                      type="button"
                                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                      Download
                                    </button>
                                    {isStreamAble(
                                      mContent[val.Name].R480[val1]
                                    ) && (
                                      <button
                                        onClick={() => {
                                          setCurEp(val.Name);
                                          openPopUp(
                                            mContent[val.Name].R480[val1]
                                          );
                                        }}
                                        type="button"
                                        className="focus:outline-none text-white border border-yellow-300 border-1 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                                      >
                                        Watch Online
                                      </button>
                                    )}{" "}
                                  </div>
                                );
                              }
                            )}
                          {Object.keys(mContent[val.Name]?.R720).length > 0 &&
                            Object.keys(mContent[val.Name].R720).map(
                              (val1, index) => {
                                return (
                                  <div
                                    key={mContent[val.Name].R720[val1][0].Fid}
                                    className="bg-cyan-50 rounded p-2 m-3"
                                  >
                                    <span className="text-black text-base font-semibold">
                                      720p (Mirror {index + 1}):{" "}
                                    </span>
                                    <button
                                      onClick={() =>
                                        download(mContent[val.Name].R720[val1])
                                      }
                                      type="button"
                                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                      Download
                                    </button>
                                    {isStreamAble(
                                      mContent[val.Name].R720[val1]
                                    ) && (
                                      <button
                                        onClick={() => {
                                          setCurEp(val.Name);
                                          openPopUp(
                                            mContent[val.Name].R720[val1]
                                          );
                                        }}
                                        type="button"
                                        className="focus:outline-none text-white border border-yellow-300 border-1 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                                      >
                                        Watch Online
                                      </button>
                                    )}{" "}
                                  </div>
                                );
                              }
                            )}
                          {Object.keys(mContent[val.Name]?.R1080).length > 0 &&
                            Object.keys(mContent[val.Name].R1080).map(
                              (val1, index) => {
                                return (
                                  <div
                                    key={mContent[val.Name].R1080[val1][0].Fid}
                                    className="bg-cyan-50 rounded p-2 m-3"
                                  >
                                    <span className="text-black text-base font-semibold">
                                      1080p (Mirror {index + 1}):{" "}
                                    </span>
                                    <button
                                      onClick={() =>
                                        download(mContent[val.Name].R1080[val1])
                                      }
                                      type="button"
                                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                      Download
                                    </button>
                                    {isStreamAble(
                                      mContent[val.Name].R1080[val1]
                                    ) && (
                                      <button
                                        onClick={() => {
                                          setCurEp(val.Name);
                                          openPopUp(
                                            mContent[val.Name].R1080[val1]
                                          );
                                        }}
                                        type="button"
                                        className="focus:outline-none text-white border border-yellow-300 border-1 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                                      >
                                        Watch Online
                                      </button>
                                    )}{" "}
                                  </div>
                                );
                              }
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieDetailPage;
