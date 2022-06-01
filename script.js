const topMovie = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c';
const API_KEY = `api_key=3fd2be6f0c70a2a598f084ddfb75487c`;
const API_URL_POPULAR = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const API_URL_SEARCH = `https://api.themoviedb.org/3/search/movie?${API_KEY}`;

getData(topMovie);

let isSearch = false;

async function getData(url) {
    const res = await fetch(url);
    const respData = await res.json();
    console.log(respData);
    showMovies(respData);
  }
  

  function getClassByRate(vote) {
    if (vote >= 7) {
      return "blue";
    } else if (vote > 5) {
      return "orange";
    } else {
      return "red";
    }
  }

  function showMovies(data) {
    const movies = document.querySelector(".movies");

    document.querySelector(".movies").innerHTML = "";
    if(data.results.length == 0) {
      document.querySelector(".movies").innerHTML = `
      <h2>There is no result for "${search.value}"</h2>`;
    } else {

    data.results.forEach((movie) => {
      const movieEl = document.createElement("div")
      movieEl.classList.add("movie");
      let moviePoster = (movie.poster_path) ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}` : "cover.svg";
      movieEl.innerHTML = `
      <img src="${moviePoster}" alt="${movie.original_title}">
      <div clas="movie-information">
          <h3 class="h3">${movie.original_title}</h3>
          <p class="${getClassByRate(
            movie.vote_average
          )}">${movie.vote_average}</p>
          <div class="overview">
              <h3 class="h3">Overview</h3>
              ${movie.overview}
          </div>

      </div>
  </div>
  `;
  movies.appendChild(movieEl);
    
    });
  
  let page = data.page;
  let pages = getArrayPages(data);
  let maxPage = setMaxPage(data.total_pages);
  let pagesHtml = getPages(page, maxPage, pages);

  movies.insertAdjacentHTML("beforeend", pagesHtml);
  let pageButtons = document.querySelectorAll(".pages");

  pageButtons.forEach(item => {
    item.addEventListener("click", (e) => {
      if (!e.target.classList.contains("page-active")) {
        if (e.target.classList.contains("page")) {
          page = parseInt(e.target.textContent);
        } else if (e.target.classList.contains("arrow")) {
          switch (e.target.textContent) {
            case "→" :
                page < maxPage ? page ++ : maxPage;
                break;
            case "←" :
                page > 1 ? page-- : page;
                break;
            case "«" :
                page = 1;
                break;
            case "»" :
              page = maxPage;
              break;              
          }
        }
        let apiSearchUrl = `${isSearch?API_URL_SEARCH:API_URL_POPULAR}&page=${page}${(isSearch)?"&query="+search.value:""}`;
        lastApiQuary = apiSearchUrl;
        getData(apiSearchUrl);

          
        }
      });
    });
  }
  }

  function setMaxPage(totalPages = 1) {
    return (totalPages > 500) ? 500 : totalPages;
  }

  function getArrayPages(data) {
    let firstPage,
    lastPage,
    pages = [],
    page = data.page,
    maxPage = setMaxPage(data.total_pages);

    if (maxPage < 5) {
      firstPage = 1;
      lastPage = maxPage;
  } else if (page < 3) {
      firstPage = 1;
      lastPage = 5;
  } else if ((maxPage - page) < 4) {
      firstPage = maxPage - 4;
      lastPage = maxPage;
  } else if ((maxPage - page) < 5) {
      firstPage = maxPage - 5;
      lastPage = maxPage - 1;
  } else {
      firstPage = page - 2;
      lastPage = page + 2;
  }
  for (let i = firstPage; i <= lastPage; i++) {
    pages.push(i);
}

return pages;

  }

  function getPages(page, maxPage, pages) {
    let arrowsLeft = '';
    let arrowsRigth = '';

    arrowsLeft = (page > 1) ?
        `<span class = "arrow">«</span><span class = "arrow">←</span>` :
        `<span class = "disabled">«</span><span class = "disabled" style>←</span>`;
    arrowsRigth = (page < maxPage) ?
        `<span class = "arrow">→</span><span class = "arrow">»</span>` :
        `<span class = "disabled">→</span><span class = "disabled">»</span>`;
    return `<div class = "pages">${arrowsLeft}${pages.map((num) => {
            let str = ` <span class = "page`;
        if (num == page) {
            str += " page-active";
        }
        return `${str}">${num}</span>`;
        })
        .join('')}
        ${arrowsRigth}</div>`;
}
  

  const form = document.querySelector("form");
  const search = document.querySelector(".search");
  const apiSerch = 'https://api.themoviedb.org/3/search/movie?query=';
  const apiSearcKey = '&api_key=3fd2be6f0c70a2a598f084ddfb75487c';

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const apiSearchUrl = `${apiSerch}${search.value}${apiSearcKey}`;
    isSearch = true;
    console.log(search.value);
    if(search.value){
      getData(apiSearchUrl);
    }
  });

  const MOVIE = document.querySelector("#movie-app");
  MOVIE.addEventListener("click", () => getData(topMovie));