//          DOM elements
const movieSearchBox = document.getElementById("movie-search-box");
const searchList = document.getElementById("search-list");
const resultGrid = document.getElementById("result-grid");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnsOpenModal = document.querySelector(".show-modal");
let favbtn;
let store = "";
let favArray = [];
let deleteBtn;
let favAdded = false;
///////////////////////////////////////////
//      modal functions
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
/////////////////////////////////////
// load movies from API
async function loadMovies(searchTerm) {
  const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=da8c5a38`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  // console.log(data.Search);
  if (data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
  let searchTerm = movieSearchBox.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("hide-search-list");
    loadMovies(searchTerm);
  } else {
    searchList.classList.add("hide-search-list");
  }
}

function displayMovieList(movies) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < movies.length; idx++) {
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    if (movies[idx].Poster != "N/A") moviePoster = movies[idx].Poster;
    else moviePoster = "image_not_found.png";

    movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
    searchList.appendChild(movieListItem);
  }
  loadMovieDetails();
}

function loadMovieDetails() {
  const searchListMovies = searchList.querySelectorAll(".search-list-item");
  searchListMovies.forEach((movie) => {
    movie.addEventListener("click", async () => {
      //   console.log(movie.dataset.id);
      searchList.classList.add("hide-search-list");
      movieSearchBox.value = "";
      const result = await fetch(
        `https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=da8c5a38`
      );
      const movieDetails = await result.json();
      //   console.log(movieDetails.imdbID);
      displayMovieDetails(movieDetails);
    });
  });
}

function displayMovieDetails(details) {
  resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${
          details.Poster != "N/A" ? details.Poster : "image_not_found.png"
        }" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <button class="fav-btn" id = "${
          details.imdbID
        }">Add to favourite</button>
        <ul class = "movie-misc-info">
            <li class = "year">Year: ${details.Year}</li>
            <li class = "rated">Ratings: ${details.Rated}</li>
            <li class = "released">Released: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Genre:</b> ${details.Genre}</p>
        <p class = "writer"><b>Writer:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actors: </b>${details.Actors}</p>
        <p class = "plot"><b>Plot:</b> ${details.Plot}</p>
        <p class = "language"><b>Language:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${
          details.Awards
        }</p>
    </div>
    `;
  //      favourite list functioning
  favAdded = false;
  favbtn = document.querySelector(".fav-btn");
  favbtn.addEventListener("click", async function () {
    // console.log(favAdded);
    if (favAdded) return;
    let temp = localStorage.getItem("movie");
    // console.log(temp);
    if (temp) {
      favArray = temp.split(",");
    }
    favArray = [...new Set(favArray)];
    const result = await fetch(
      `https://www.omdbapi.com/?i=${this.id}&apikey=da8c5a38`
    );
    const movieDetails = await result.json();
    // console.log(favArray, movieDetails.imdbID);
    if (favArray.includes(movieDetails.imdbID)) return;
    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movieDetails.imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    if (movieDetails.Poster != "N/A") moviePoster = movieDetails.Poster;
    else moviePoster = "image_not_found.png";

    movieListItem.innerHTML = `

        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movieDetails.Title}</h3>
            <p>${movieDetails.Year}</p>
            
            </div>
            <button class = "del-fav">delete</button>
        `;

    modal.insertAdjacentElement("beforeend", movieListItem);
    favAdded = true;
    favArray.push(movieDetails.imdbID);

    favArray = [...new Set(favArray)];
    let store = favArray.toString();
    // console.log(favArray);
    localStorage.setItem("movie", store);
  });
}

window.addEventListener("click", (event) => {
  if (event.target.className != "form-control") {
    searchList.classList.add("hide-search-list");
  }
});
//   loading of favourite list from local storage
window.addEventListener("DOMContentLoaded", function () {
  let temp = localStorage.getItem("movie");
  // console.log(temp);
  if (!temp) return;
  favArray = temp.split(",");
  favArray = [...new Set(favArray)];
  favArray.forEach(async function (item) {
    const result = await fetch(
      `https://www.omdbapi.com/?i=${item}&apikey=da8c5a38`
    );
    const movieDetails = await result.json();

    let movieListItem = document.createElement("div");
    movieListItem.dataset.id = movieDetails.imdbID; // setting movie id in  data-id
    movieListItem.classList.add("search-list-item");
    movieListItem.classList.add("modal-item");

    if (movieDetails.Poster != "N/A") moviePoster = movieDetails.Poster;
    else moviePoster = "image_not_found.png";

    movieListItem.innerHTML = `

        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movieDetails.Title}</h3>
            <p>${movieDetails.Year}</p>
            
            </div>
            <button class = "modal-btn del-fav">delete</button>
        `;

    modal.insertAdjacentElement("beforeend", movieListItem);
  });
});
//     modal list items event handlers
modal.addEventListener("click", async function (e) {
  if (e.target.closest(".search-list-item")) {
    const element = e.target.closest(".search-list-item");
    const id = element.dataset.id;
    if (e.target.classList.contains("del-fav")) {
      this.removeChild(element);
      favAdded = false;
      favArray.forEach(function (value, i) {
        if (value === id) {
          favArray.splice(i, 1);
        }
      });
      favArray = [...new Set(favArray)];

      let store = favArray.toString();
      localStorage.setItem("movie", store);
      if (!localStorage.getItem("movie")) {
        localStorage.clear();
      }
    } else {
      const result = await fetch(
        `https://www.omdbapi.com/?i=${id}&apikey=da8c5a38`
      );
      const movieDetails = await result.json();
      displayMovieDetails(movieDetails);
      closeModal();
    }
  }
});
