import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai"; // icons form react-icons
import { IconContext } from "react-icons";
import ReactPaginate from "react-paginate";
// import 'flowbite';
import ShortItemWrapperReason from "../components/shortItemWrapperReason";
import DivSliderMain from "../components/divsliderMain";
import "flowbite-react";

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
  );
}
function MovieListPage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [isSearch, setIsSearch] = useState(false);
  const [rnId, setRnId] = useState("divKey12354");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isSearch) {
          return;
        }
        if (searchQuery === "") {
          setSearchCurrentPage(1);
        }
        setIsLoading(true);
        let url = `${process.env.REACT_APP_API}/list?page=${currentPage}&limit=12`;
        const response = await fetch(url);
        const res_json = await response.json();
        if (res_json) {
          setPageCount(res_json?.Count || 0);
          setMovies(res_json.Movies || []);
        }
      } catch (error) {
        console.log("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, isSearch]);

  useEffect(() => {
    const fetchSearchPG = async () => {
      try {
        if (!isSearch) {
          return;
        }
        setIsLoading(true);
        let url = `${process.env.REACT_APP_API}/search?page=${searchCurrentPage}&query=${searchQuery}&limit=12`;
        const response = await fetch(url);
        const res_json = await response.json();
        if (res_json) {
          setPageCount(res_json?.Count || 0);
          setMovies(res_json.Movies || []);
        }
      } catch (error) {
        console.log("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (searchQuery != "") {
      fetchSearchPG();
    }
  }, [searchCurrentPage, isSearch]);

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  };

  const fetchSearch = async () => {
    try {
      setIsLoading(true);
      let url = `${process.env.REACT_APP_API}/search?query=${searchQuery}&limit=12`;
      const response = await fetch(url);
      const res_json = await response.json();
      if (res_json) {
        setPageCount(res_json?.Count || 0);
        setMovies(res_json.Movies || []);
      }
    } catch (error) {
      console.log("Error fetching movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const debounceSearch = debounce(fetchSearch);

  useEffect(() => {
    setRnId(guidGenerator());
    if (searchQuery === "") {
      setSearchCurrentPage(1);
      setIsSearch(false);
    } else {
      setCurrentPage(1);
      setIsSearch(true);
    }
    debounceSearch();
  }, [searchQuery]);

  useEffect(() => {
    // Add the provided script here
    const dropdownButton = document.getElementById(
        "mega-menu-full-dropdown-button"
    );
    const dropdownContent = document.getElementById("mega-menu-full-dropdown");

    dropdownButton.addEventListener("click", function () {
      const expanded = dropdownButton.getAttribute("aria-expanded") === "true";
      dropdownButton.setAttribute("aria-expanded", !expanded);
      dropdownContent.style.display = expanded ? "none" : "block";
    });
  }, []);
  return (
      <div className="bg-black min-h-screen ">
        <nav className="bg-black border-gray-200 dark:border-gray-600 dark:bg-gray-900">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
            <a
                href=""
                className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <h1 class="text-6xl font-bold text-white mb-1">
                Movie<span class="text">Strom</span>
              </h1>
            </a>
            <button
                data-collapse-toggle="mega-menu-full"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mega-menu-full"
                aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
              >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            <div
                id="mega-menu-full"
                className="items-center justify-between font-medium hidden w-full md:flex md:w-auto md:order-1"
            >
              <ul className="flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-black dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block py-2 px-3 text-white rounded hover:text-yellow-300 md:hover:bg-transparent md:hover:text-yellow-300 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                      aria-current="page"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <button
                      id="mega-menu-full-dropdown-button"
                      data-collapse-toggle="mega-menu-full-dropdown"
                      className="flex items-center justify-between w-full py-2 px-3 text-white rounded md:w-auto hover:text-yellow-300 md:hover:bg-transparent md:border-0 md:hover:text-yellow-300 md:p-0 dark:text-white md:dark:hover:text-yellow-300 dark:hover:bg-gray-700 dark:hover:text-yellow-300 md:dark:hover:bg-transparent dark:border-gray-700"
                      aria-controls="mega-menu-full-dropdown"
                      aria-expanded="false"
                  >
                    Categeroy{" "}
                    <svg
                        className="w-2.5 h-2.5 ms-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                      <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 4 4 4-4"
                      />
                    </svg>
                  </button>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block py-2 px-3 text-white rounded hover:text-yellow-300 md:hover:bg-transparent md:hover:text-yellow-300 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Movies
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block py-2 px-3 text-white rounded hover:text-yellow-300 md:hover:bg-transparent md:hover:text-yellow-300 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-blue-500 md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Webserise
                  </a>
                </li>
              </ul>
              <input
                  type="text"
                  placeholder="Search ..."
                  className="mt-2 p-2 border rounded-full px-4 ml-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div
              id="mega-menu-full-dropdown"
              className="mt-1 border-gray-200 shadow-sm bg-gray-50 md:bg-black border-y dark:bg-gray-800 dark:border-gray-600"
              style={{ display: "none" }}
          >
            <div className="grid max-w-screen-xl px-4 py-5 mx-auto text-white dark:text-white sm:grid-cols-3 md:px-6">
              <ul>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">Bollywood</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">Hollywood</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">Comedy</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">Romance</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">Mustre</div>
                  </a>
                </li>
              </ul>
              <ul>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">Drama</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">Fantasy</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">Horrer</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">Punjabi</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">South</div>
                  </a>
                </li>
              </ul>
              <ul>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">WEBDL</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">4k</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border border-black border-1"
                  >
                    <div className="font-semibold">Horrer</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border-black border-1"
                  >
                    <div className="font-semibold">WebSeries</div>
                  </a>
                </li>
                <li>
                  <a
                      href="javascript:void(0)"
                      className="block p-3 rounded-lg hover:text-yellow-300 dark:hover:bg-gray-700 border-black border-1"
                  >
                    <div className="font-semibold">hindi</div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div>
          <div className="mt-7">
            <div>
              <h3 className="text-6xl font-serif text">TOP VIEWED</h3>
            </div>
            <hr className="text border-2" />
          </div>

          <DivSliderMain />
        </div>
        <br />
        <div className="mt-7">
          <div>
            <h3 className="text-6xl font-serif text">RECOMMENDED</h3>
          </div>

          <hr className="text border-2" />
          <ShortItemWrapperReason />
          {/*<GetRecommendedMovieComponent/>*/}
        </div>

        {/*<div className="text "> hello </div>*/}
        {/*<br/>*/}
        {/*<ShortItemWrapperReason/>*/}
        {/*<br/>*/}

        {/*<hr className="my-5 border-yellow-400 border-2"/>*/}
        {/* Horizontal line */}

        <br />
        <br />

        <div className="mt-7">
          <div>
            <h3 className="text-6xl font-serif text">LATEST-RELEASE</h3>
          </div>
          <hr className="text border-2" />
        </div>

        {searchQuery !== "" && (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-white text-lg font-bold">Search Result</div>
            </div>
        )}
        {isLoading && (
            <div className="fixed z-10 inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center w-full h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-25"></div>
            </div>
        )}
        <div className=" container mx-auto mt-8 px-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
              <Link
                  to={`/movie/${movie.CID}`}
                  key={movie.CID}
                  target="_blank"
                  className="w-full"
              >
                <div className="relative overflow-hidden transition-transform duration-200 transform hover:scale-105 hover:z-10 border-2 border-black transition duration-300 hover:border-yellow-500 rounded-lg">
                  <img
                      src={`https://images.cdn.kukufm.com/w:350/f:webp/q:100/${movie.Info.PosterLink}`}
                      alt={movie.Name}
                      style={{ height: "22rem" }}
                      className="w-full object-cover rounded-lg"
                  />
                  <div
                      className="absolute bottom-0 left-0 p-2 bg-black bg-opacity-80 w-full text-white text-sm font-semibold truncate"
                      style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)" }}
                  >
                    {movie.Name}
                  </div>
                </div>
              </Link>
          ))}
        </div>
        <div key={rnId}>
          <ReactPaginate
              previousLabel={
                <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
                  <AiFillLeftCircle />
                </IconContext.Provider>
              }
              nextLabel={
                <IconContext.Provider value={{ color: "#B8C1CC", size: "36px" }}>
                  <AiFillRightCircle />
                </IconContext.Provider>
              }
              breakLabel="..."
              breakClassName="mx-3 text-white font-bold"
              pageCount={
                parseInt(pageCount / 12) >= 999
                    ? 999
                    : pageCount % 12 === 0
                        ? parseInt(pageCount / 12)
                        : parseInt(pageCount / 12) + 1
              }
              marginPagesDisplayed={4}
              pageRangeDisplayed={10}
              initialPage={
                searchQuery === "" ? currentPage - 1 : searchCurrentPage - 1
              }
              onPageChange={(event) =>
                  searchQuery === ""
                      ? (setCurrentPage(event.selected + 1), setSearchCurrentPage(1))
                      : (setSearchCurrentPage(event.selected + 1), setCurrentPage(1))
              }
              containerClassName="flex flex-wrap justify-center items-center  my-10"
              activeClassName="bg-red-600 rounded-full  text-white active"
              pageClassName="mx-3  font-bold cursor-pointer text-white"
              previousClassName="mx-3  cursor-pointer"
              nextClassName="mx-3  cursor-pointer"
          />
        </div>
        <footer>
          <div className="flex w-full justify-center ">
          <span className="text-white font-semibold m-5">
            * This is UGC(User generated content) platfrom. If you want to add
            any post/content email at admin@ddlmovies.online. If you find any
            content in-appropriate or copywrited complaint us at
            admin@ddlmovies.online. Thanks :)
          </span>
          </div>
        </footer>
      </div>
  );
}

export default MovieListPage;
