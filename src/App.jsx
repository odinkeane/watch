import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import { loremIpsum } from 'lorem-ipsum';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { createContext, useContext, useEffect, useState } from 'react';


// THIS IS EXAMPLE TASK

function BuildPage(index) {
  return (
    <>
      <h2>Page {index}</h2>
      <p>
        Page {index} content: {loremIpsum({ count: 5 })}
      </p>
    </>
  )
}

const PageOne = () => BuildPage(1);
const PageTwo = () => BuildPage(2);

function MainPage() {
  const location = useLocation();
  useEffect(() => {
    console.log('Current location is ', location);
  }, [location]);
  return (
    <>
      <header>
        <nav>
          <Link to="/one">PageOne</Link>
          <Link to="/two">PageTwo</Link>
        </nav>
      </header>
      <Outlet />
    </>
  )
}

function Example() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage />}>
          <Route index element={<h2>No pages is selected</h2>} />
          <Route path='one' element={<PageOne />} />
          <Route path='two' element={<PageTwo />} />
        </Route>
        <Route path='*' element={<h2>404</h2>} />
      </Routes>
    </BrowserRouter>
  )
}




// THIS IS LESSON TASK


const FilmContext = createContext()



function LeftPanel() {
  const location = useLocation()

  return (
    <aside>
      <h3><img src="images/coffee.svg" alt="" />Watch</h3>
      <nav>
        <Link className={location.pathname === "/" ? "choose" : ""} to="/">
          <img src="images/calendar.svg" alt="" />Home
        </Link>
        <Link className={location.pathname === "/favorites" ? "choose" : ""} to="/favorites">
          <img src="images/heart.svg" alt="" />Favorites
        </Link>
        <Link className={location.pathname === "/trending" ? "choose" : ""} to="/trending">
          <img src="images/trending-up.svg" alt="" />Trending
        </Link>
      </nav>
    </aside>
  )
}


function Header() {

  return (
    <header>
      <nav>
        <a href="#">Movies</a>
        <a href="#">Series</a>
        <a href="#">Documentations</a>
      </nav>
      <nav>
        <a href="#"><img src="images/search.svg" alt="" /></a>
        <a href="#"><img src="images/bell.svg" alt="" /></a>
        <div>
          user
        </div>
      </nav>
    </header>
  )
}


function FavoriteButton({ film, isActive }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const filmsInterface = useContext(FilmContext);
  useEffect(() => {
    if (isActive) {
      setIsFavorite(true)
    } else {
      setIsFavorite(false)
    }
  }, [isFavorite, isActive])

  const favoriteHandler = () => {
    if (!isFavorite) {
      if (!filmsInterface.favoriteFilms.includes(film)) {
        localStorage.setItem("favoriteFilms", JSON.stringify([...filmsInterface.favoriteFilms, film]))
        filmsInterface.setFavoriteFilms([...filmsInterface.favoriteFilms, film])
      }
    } else {
      localStorage.setItem("favoriteFilms", JSON.stringify(filmsInterface.favoriteFilms.filter(f => f.Title != film.Title)))
      filmsInterface.setFavoriteFilms(filmsInterface.favoriteFilms.filter(f => f.Title != film.Title));
    }
    setIsFavorite(!isFavorite)

  }



  return (
    <button className='FavoriteButton' onClick={() => favoriteHandler()}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFavorite || isActive ? "#6100C2" : "none"}>
        <path d="M20.84 4.60999C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.60999L12 5.66999L10.94 4.60999C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.60999C2.1283 5.64169 1.54871 7.04096 1.54871 8.49999C1.54871 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.49999C22.4518 7.77751 22.3095 7.0621 22.0329 6.39464C21.7563 5.72718 21.351 5.12075 20.84 4.60999V4.60999Z" stroke="#6100C2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  )
}

function WatchButton() {
  return (
    <button className='WatchButton'>
      Watch Now
    </button>
  )
}


function FilmBtns({ film, isActive }) {
  console.log("FilmBtns: ", isActive);

  return (
    <div className='FilmBtns'>
      <WatchButton />
      <FavoriteButton film={film} isActive={isActive} />
    </div>
  )
}


function Poster({ film }) {

  const filmsInterface = useContext(FilmContext);

  let isActive = false
  for (let f of filmsInterface.favoriteFilms) if (f.Title == film.Title) isActive = true;
  return (
    <div style={{ background: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url(${film.Images[0]})` }} className='MainPoster' >
      <h2>{film.Title}</h2>
      <span>
        {film.Year} | {film.Genre} | {film.Runtime}
      </span>
      <FilmBtns film={film} isActive={isActive} />
    </div>
  )
}


function HomeTrending({ children }) {
  return (
    <>

      <section className='HomeTrending'>
        <div>
          {children}
        </div>
      </section>
    </>
  )
}


function FilmCard({ film }) {

  const filmsInterface = useContext(FilmContext);
  let isActive = false
  for (let f of filmsInterface.favoriteFilms) if (f.Title == film.Title) isActive = true;

  return (
    <figure className='FilmCard'>
      <div className='FavoriteBlock'>
        <FavoriteButton film={film} isActive={isActive} />
      </div>

      <img src={film.Images[0]} alt="" />
      <figcaption>
        <h4>{film.Title}</h4>
        <span>{film.Year} | {film.Genre}</span>
      </figcaption>
    </figure>
  )
}

function ChoisingFilm({ film }) {
  const filmsInterface = useContext(FilmContext);

  let isActive = false
  for (let f of filmsInterface.favoriteFilms) if (f.Title == film.Title) isActive = true;
  console.log("ChoisingFilm: ", isActive);


  return (
    <figure className='ChoisingFilm'>
      <img src={film.Images[0]} alt="" />
      <figcaption>
        <div className='MainInfo'>
          <h2>{film.Title}</h2>
          <span className='Rating'>
            <img src="images/star.svg" alt="" />
            {film.imdbRating}/10
          </span>
        </div>
        <div className='AboutFilm'>
          <span>{film.Year}</span>
          <span>{film.Genre}</span>
          <span>{film.Runtime}</span>
        </div>
        <p className='DescriptionFilm'>
          {film.Plot}
        </p>
        <FilmBtns film={film} isActive={isActive} />

      </figcaption>
    </figure>
  )


}




function Home() {
  const filmsInterface = useContext(FilmContext)

  return (
    <>
      <Poster film={filmsInterface.films[2]} />
      <h3 className='UnderPoster'>Trending</h3>
      <HomeTrending>
        {filmsInterface.films.map((film, index) => <FilmCard key={index} film={film} />)}
      </HomeTrending>
    </>
  )
}
function Favorites() {
  const filmsInterface = useContext(FilmContext)
  return (
    <>
      <h1 className='PreHeader'>Favorites</h1>
      <HomeTrending>
        {filmsInterface.favoriteFilms.map((film, index) => <FilmCard key={index} film={film} />)}
      </HomeTrending>
    </>
  )
}




function Trending() {

  const [choise, setChoice] = useState(0);
  const filmsInterface = useContext(FilmContext)
  const selectFilms = filmsInterface.films.slice(0, 4)

  return (
    <>
      <h1 className='PreHeader'>Trending at this moment</h1>
      <HomeTrending>
        {selectFilms.map((film, index) => {
          return (
            <div key={index} style={{
              cursor: "pointer",
              opacity: index == choise ? "1" : "0.2",
              filter: index == choise ? "none" : "blur(2px)"
            }} onClick={() => { setChoice(index) }}>
              <FilmCard film={film} />
            </div>
          )
        })}
      </HomeTrending >
      <ChoisingFilm film={selectFilms[choise]} />
    </>
  )
}




function App() {

  const [isLoaded, setIsLoaded] = useState(false)
  const [films, setFilms] = useState([])
  const [favoriteFilms, setFavoriteFilms] = useState([])

  const filmsInterface = {
    films: films,
    favoriteFilms: favoriteFilms,
    setFavoriteFilms: setFavoriteFilms
  }


  useEffect(() => {
    fetch("https://odinkeane.github.io/web-developer/Film.JSON")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setFilms(result);

        })
  }, [isLoaded])


  useEffect(() => {
    setFavoriteFilms(JSON.parse(localStorage.getItem("favoriteFilms")) || [])
  }, [films])



  return (
    <>
      {isLoaded &&
        <BrowserRouter>
          <LeftPanel />
          <FilmContext.Provider value={filmsInterface}>
            <main>
              <Header />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='favorites' element={<Favorites />} />
                <Route path='trending' element={<Trending />} />
                <Route path='*' element={<h2>404</h2>} />
              </Routes>
            </main>
          </FilmContext.Provider >
        </BrowserRouter>
      }
    </>
  );
}

export default App;
