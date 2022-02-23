const searchForm = document.getElementById('searchForm');
const searchTitle = document.getElementById('searchTitle');
const searchYear = document.getElementById('searchYear');
const searchFormSection = document.querySelector('.searchForm');
const resultsForm = document.querySelector('.resultsForm');
const MAX_RESULT = 10;
const createPollBtn = document.querySelector('#createPollBtn');
let searchResults = [];
let pollArray1 = [];

// Listen for user search input
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendApiRequest(searchTitle.value, searchYear.value);
});

resultsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log(e);
});

createPollBtn.addEventListener('click', () => {
  // commit the poll to local memory
  localStorage.setItem('poll1', pollArr1);

  // create a link to the poll
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
  displayResult();
}

// Append movie results
function displayResult() {
  console.log(searchResults);
  // remove previous search results, if any
  while (resultsForm.firstChild) {
    resultsForm.removeChild(resultsForm.firstChild);
  }
  // appends maxresult notice
  displayMaxResult();

  // creates an input and label for every movie returned from search
  let len = searchResults.length;
  let movieOption;
  for (let i = 0; i < len; i++) {
    movieOption = document.createElement('p');
    movieOption.id = i;
    movieOption.classList.add('option');
    movieOption.innerText = `${searchResults[i]['Title']} (${searchResults[i]['Year']})`;
    movieOption.addEventListener('click', (e) => {
      addOption(e.target.id);
    });
    resultsForm.append(movieOption);
    // THIS WAS FORM CHECKBOXES OPTION
    // movieOption = document.createElement('input');
    // optionLabel = document.createElement('label');
    // optionLabel.classList.add('option');
    // movieOption.id = `searchResults[${i}]`;
    // movieOption.name = `searchResults[${i}]`;
    // movieOption.type = 'checkbox';
    // movieOption.value = `searchResults[${i}]`;
    // optionLabel.htmlFor = `searchResults[${i}]`;
    // resultsForm.append(optionLabel);
    // optionLabel.append(movieOption);
    // optionLabel.append(
    //   ` ${searchResults[i]['Title']} (${searchResults[i]['Year']})`
    // );
  }

  // addOptionBtn();
}

// Button submits selected movies to the poll
// function addOptionBtn() {
//   let submitBtn = document.createElement('button');
//   submitBtn.type = 'submit';
//   submitBtn.innerText = 'Add Selected';
//   resultsForm.append(submitBtn);
// }

// Submit clicked movie to poll
function addOption(id) {
  let index = parseInt(id);
  pollArray1.push(searchResults[index]);
}

// Provides notice there are more results than displayed
function displayMaxResult() {
  let currentMax = document.querySelector('.maxResult');
  if (currentMax) {
    searchFormSection.removeChild(currentMax);
  }

  if (searchResults.length === MAX_RESULT) {
    let maxResultNotice = document.createElement('p');
    maxResultNotice.classList.add('maxResult');
    maxResultNotice.innerHTML =
      '<em>to get more than 10 results, try refining your search</em>';
    searchFormSection.append(maxResultNotice);
  }
}
