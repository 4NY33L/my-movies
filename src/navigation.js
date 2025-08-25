window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);

const navigationHistory = ['#home'];
let currentPosition = navigationHistory.length - 1;
let history = true;

function navigator() {

    const hash = decodeURI(location.hash);

    // Modify browsing history
    if (history && location.hash) { // Validar que el hash sí se deba agregar al historial y que no esté vacío
        navigationHistory.splice(currentPosition + 1); // Eliminar lo que este después de la posición actual, po si acaso se retrocedió en el historial
        hash !== navigationHistory[currentPosition] ? navigationHistory.push(hash) : false; // Validar que hash que se va agregar al historial no sea igual al de la posición actual
        currentPosition = navigationHistory.length - 1; // Update current position
        console.log(navigationHistory);
    }

    if (hash.startsWith('#trends')) {

        trendsPage();

    } else if (hash.startsWith('#category')) {

        categoryPage();

    } else if (hash.startsWith('#movie')) {

        movieDetailPage();

    } else if (hash.startsWith('#search')) {


        searchPage();

    } else {

        homePage();
    }

    document.documentElement.scrollTop = 0;
    history = true;
}

function historyBrowser() {
    currentPosition = currentPosition - 1;
    history = false;
    location.hash = navigationHistory[currentPosition];
}

// Functions para ahorrar código
function hideElements(elements) {
    for (const element of elements) {
        element.classList.add('inactive')
    }
}
function showElements(elements) {
    for (const element of elements) {
        element.classList.remove('inactive')
    }
}

// ---------------------- Pages -----------------------------
async function movieDetailPage() {

    hideElements([
        headerTitle,
        headerTitleCategory,
        searchForm,
        trendingPreview,
        categoriesPreview,
        genericList
    ]);

    showElements([movieDetail, headerArrow])

    // Add classes
    header.classList.add('header-container--long');
    headerArrow.classList.add('header-arrow--white');

    const [_, movieId] = location.hash.split('='); // Extraer ID del hash
    const movie = await getMovieById(movieId);
    console.log(movie)

    // Render movie details |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    movieDetailTitle.textContent = movie.title; // Redender title
    movieDetailScore.textContent = movie.vote_average.toFixed(1); // Render Score
    movieDetailDescription.textContent = movie.overview; // Render description
    const movieImgURL = movie.poster_path;
    // Render image
    header.style = ` 
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), 
        url('https://image.tmdb.org/t/p/w500${movieImgURL}');
    `;

    const categories = movie.genres;
    renderCategories(categories, movieDetailCategories);


    const similarMovies = await getSimilarMoviesById(movie.id);
    renderMovies(similarMovies, movieDetailRelatedMovies);
    clickEventToMovies('.movie-container', '#movie', movieDetailRelatedMovies);
}

async function homePage() {

    hideElements([
        headerArrow,
        headerTitleCategory,
        genericList,
        movieDetail
    ])

    showElements([
        headerTitle,
        searchForm,
        trendingPreview,
        categoriesPreview,
    ]);

    // Restore styles
    header.style.background = '';

    // Remove classes
    header.classList.remove('header-container--long');

    // Get and render trends movies on the home
    (async function () {

        const movies = await getPopularMovies(); // Request popular movies
        renderMovies(movies, trendingPreviewMovieList); // Render popular movies on the home 
        clickEventToMovies('.movie-container', '#movie', trendingPreview); // Cambiar el hash cuando se le de click a una película

    })();

    // Get and render categories on the home
    (async function () {

        const categories = await getCategoriesPreview(); // Request category list
        renderCategories(categories, categoriesPreviewList); // Render categories on the home 
        
    })();

}

async function searchPage() {

    hideElements([
        headerTitle,
        trendingPreview,
        categoriesPreview,
        movieDetail
    ])

    showElements([
        headerArrow,
        headerTitleCategory,
        searchForm,
        genericList
    ]);

    // Restore styles
    header.style.background = '';

    // Remove classes
    headerArrow.classList.remove('header-arrow--white');
    header.classList.remove('header-container--long')

    const [_, query] = location.hash.split('=');

    const movies = await getMoviesBySearch(query);
    renderMovies(movies, genericList);
    clickEventToMovies('.movie-container', '#movie', genericList);

    headerTitleCategory.textContent = decodeURIComponent(query); // de formt URL a texto plano
}

function categoryPage() {

    hideElements([
        headerTitle,
        searchForm,
        trendingPreview,
        categoriesPreview,
        movieDetail
    ])

    showElements([
        headerArrow,
        headerTitleCategory,
        genericList
    ]);

    // Restore styles
    header.style.background = '';

    // Remove classes
    headerArrow.classList.remove('header-arrow--white');
    header.classList.remove('header-container--long')

    // Extraer ID  del hash (Ej: #category=123-Family)
    const [_, idAndName] = location.hash.split('=');
    const [id, categoryName] = idAndName.split('-');
    headerTitleCategory.textContent = decodeURI(categoryName);
    // console.log(id);
    getMoviesByCategory(id)
        .then(() => clickEventToMovies('.movie-container', '#movie', genericList));

}

async function trendsPage() {

    hideElements([
        headerTitle,
        searchForm,
        trendingPreview,
        categoriesPreview,
        movieDetail
    ])

    showElements([
        headerArrow,
        headerTitleCategory,
        genericList
    ]);

    // Restore styles
    header.style.background = '';

    // Remove classes
    headerArrow.classList.remove('header-arrow--white');
    header.classList.remove('header-container--long');

    headerTitleCategory.textContent = 'Trends';

    const popularMovies = await getPopularMovies();
    renderMovies(popularMovies, genericList);
    clickEventToMovies('.movie-container', '#movie', genericList);
}

// ---------------------- Links of fixed elements -----------------------------
headerTitle.addEventListener('click', () => location.hash = '#home');
headerArrow.addEventListener('click', historyBrowser)
seeMoreTrendsBtn.addEventListener('click', () => location.hash = '#trends')
SearchButton.addEventListener('click', () => location.hash = '#search=' + searchInput.value)

// Implementar navigation history
// Creo que mejor agrego el event handler a las categorías en el archivo main.js)