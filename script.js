const searchForm = document.getElementById('searchForm');
const searchTitle = document.getElementById('searchTitle');
const searchYear = document.getElementById('searchYear');
const searchFormSection = document.querySelector('.searchForm');
const resultsContainer = document.querySelector('.resultsContainer');
const MAX_RESULT = 10;
let searchResults = [];
let pollArray1 = [];

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
      checkResult(result);
    })
    .catch(() => {
      checkResult('error');
    });
}

// Evaluate the result to ensure it actually has movies
function checkResult(result) {
  console.log('search result:', result);
  if (result === 'error') {
    console.log('catch promise error');
    return;
  } else if (result['data']['Response'] === 'False') {
    console.log('bad search');
    return;
  }
  searchResults = result['data']['Search'];
  displayResult(searchResults);
}

// Append movie results
function displayResult(movies) {
  // remove previous search results, if any
  while (resultsContainer.firstChild) {
    resultsContainer.removeChild(resultsContainer.firstChild);
  }

  let len = movies.length;
  let movieOption, optionLabel;
  for (let i = 0; i < len; i++) {
    movieOption = document.createElement('input');
    optionLabel = document.createElement('label');
    movieOption.id = `searchResults[${i}]`;
    movieOption.name = `searchResults[${i}]`;
    movieOption.type = 'checkbox';
    optionLabel.htmlFor = `searchResults[${i}]`;
    optionLabel.innerText = `${movies[i]['Title']} (${movies[i]['Year']})`;
    resultsContainer.append(movieOption);
    resultsContainer.append(optionLabel);
  }

  displayMaxResult(len);
}

// Provides notice there are more results than displayed
function displayMaxResult(length) {
  let currentMax = document.querySelector('.maxResult');
  if (currentMax) {
    searchFormSection.removeChild(currentMax);
  }

  if (length === MAX_RESULT) {
    let maxResultNotice = document.createElement('p');
    maxResultNotice.classList.add('maxResult');
    maxResultNotice.innerHTML =
      '<em>to get more than 10 results, try refining your search</em>';
    searchFormSection.append(maxResultNotice);
  }
}
