const searchForm = document.getElementById('searchForm');
const searchTitle = document.getElementById('searchTitle');
const searchYear = document.getElementById('searchYear');
const resultsContainer = document.querySelector('.resultsContainer');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendApiRequest(searchTitle.value, searchYear.value);
});

// HTTP request to the OMDB api
function sendApiRequest(title, year) {
  axios
    .get(
      `http://www.omdbapi.com/?apikey=${config.MY_API_KEY}&s=${title}&y=${year}`
    )
    .then((result) => {
      getResult(result);
    })
    .catch(() => {
      getResult('error');
    });
}

// Evaluate the result to ensure it actually has movies
function getResult(result) {
  console.log('search result:', result);
  if (result === 'error') {
    console.log('catch promise error');
    return;
  } else if (result['data']['Response'] === 'False') {
    console.log('bad search');
    return;
  }
  displayResult(result['data']['Search']);
}

// Append movie results to the
function displayResult(movies) {
  // remove previous search results, if any
  while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.firstChild);
  }

  let len = movies.length;
  let movieData;
  for (let i = 0; i < len; i++) {
    movieData = document.createElement('div');
    movieData.classList.add('option');
    movieData.innerText = `${movies[i]['Title']} (${movies[i]['Year']})`;
    resultsContainer.append(movieData);
  }
}
