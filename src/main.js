// ----------- API base configuration ---------------

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        accept: 'application/json;charset=utf-8',
        Authorization: API_KEY
    },
    params: {
        language: 'en-US'
    }
})

// --------------- Requests -----------------

async function getPopularMovies() {

    const { data } = await api('/movie/popular');
    const movies = data.results;

    return movies;
}

async function getCategoriesPreview() {

    const { data } = await api('/genre/movie/list');
    const categories = data.genres;

    return categories;

}

async function getMoviesByCategory(id) {
    const { data } = await api('/discover/movie', {
        params: {
            with_genres: id
        }
    })
    const movies = data.results;

    renderMovies(movies, genericList);
}

async function getMoviesBySearch(query) {

    const { data } = await api('/search/movie', {
        params: {
            query
        }
    })
    const movies = data.results;
    return movies;

}
async function getMovieById(id) {
    const { data: movie } = await api(`/movie/${id}`);
    return movie;
}

async function getSimilarMoviesById(id) {
    const { data } = await api(`/movie/${id}/recommendations`);
    const similarMovies = data.results;
    
    return similarMovies;
}

// ------------- Redering functions ------------------

function renderMovies(movies, container) {

    container.innerHTML = movies.map(movie => `
        <div id=${movie.id} class="movie-container">
            <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" class="movie-img"
                alt="${movie.title}" />
        </div>`).join('');
}

function renderCategories(categories, container) {

    container.innerHTML = categories.map(category => `
        <div class="category-container">
            <h3 id="id${category.id}" class="category-title">${category.name}</h3>
        </div>`).join('');

    const categoriesDOM = container.querySelectorAll('.category-title');
    clickEventToCategories(categoriesDOM);
}

// --------------- Utils -----------------

function clickEventToMovies(selector, hash, container = document) {

    const elements = container.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener('click', () => location.hash = `${hash}=${element.id}`);
    })
    // Creo que se entiende mejor así:
    // for (const element of elements) {

    //     element.addEventListener('click', () => location.hash = hash)

    // }
}

function clickEventToCategories(categories) {
    for (const category of categories) {
        category.addEventListener('click', () => {

                const id = category.id.substring(2); // Clean ID: id123 => 123
                const categoryName = category.textContent // Extraer nombre de categoría

                location.hash = `#category=${id}-${categoryName}`; // Ej: #category=578-Family

            });
    }
    // Invoca dentro renderCategories();
}