const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filterMovies = []
let page = 1
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const renderIcon = document.querySelector('#render-icon')
const paginator = document.querySelector('#paginator')

axios.get(INDEX_URL)
.then(response => {
  movies.push(...response.data.results)
  renderMovieList(getMoviesByPage(1))
  renderPaginator(movies.length)
}).catch(error => {
  console.log(error)
})

dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('click', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  
  filterMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))

  if (filterMovies.length === 0) {
    return alert('Cannot find movies with keyword: ' + keyword)
  }

  renderMovieList(getMoviesByPage(1))
  renderPaginator(filterMovies.length)
})

renderIcon.addEventListener('click', function cilckOnIcon(event) {
  if (event.target.matches('.fa-th')) {
    renderMovieList(getMoviesByPage(page))
  } else if (event.target.matches('.fa-bars')) {
    renderByList(getMoviesByPage(page))
  }
})

paginator.addEventListener('click', function onClickPaginator(event) {
  if (event.target.tagName !== 'A') return
  page = event.target.dataset.page
  console.log(page)
  renderMovieList(getMoviesByPage(page))
})

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach(item => {
    rawHTML += `
    <div class="col-sm-3">
        <div class="card mb-2">
          <div class="card">
            <img src=${POSTER_URL + item.image} class="card-img-top" alt="Movie Poster">
            <div class="card-body" style="height: 80px;">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button type="button" class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-discription')

  axios.get(INDEX_URL + id).then(response => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `
    <img src="${POSTER_URL + data.image}" alt="movie poster" class="img-fluid">
    `
  }).catch(error => {
    console.log(error)
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)
  if (list.some(movie => movie.id === id)) {
    return alert('此電影已在收藏清單中')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

function getMoviesByPage(page) {
  const startIndex = (page - 1) * 12
  const data = filterMovies.length ? filterMovies : movies
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderByList(data) {
  let rawHTML = `
  <table class="table">
    <tbody style="border-top: 1px solid #C4C4C4;">
  `
  data.forEach(item => {
    rawHTML += `
    <tr>
      <td>${item.title}</td>
      <td>
        <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
        <button type="button" class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
      </td>
    </tr>
    `
  })

  rawHTML += `
    </tbody>
  </table>
  `

  dataPanel.innerHTML = rawHTML
}

function renderPaginator (amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}