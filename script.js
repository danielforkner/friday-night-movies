// API KEY
const API_KEY = process.env.SECRET_API_KEY;

const searchForm = document.getElementById('searchForm');
const searchTitle = document.getElementById('searchTitle');
const searchYear = document.getElementById('searchYear');
const searchFormSection = document.querySelector('.searchForm');
const resultsForm = document.querySelector('.resultsForm');
const pollLinks = document.querySelector('.pollLinks');
const MAX_RESULT = 10;
const pollOptions = document.querySelector('#pollOptions');
const createPollBtn = document.querySelector('#createPollBtn');
const clearMemoryBtn = document.querySelector('#clearMemory');
let activePolls = 1;
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
  localStorage.setItem(`poll${activePolls}`, JSON.stringify(pollArray1));
  localStorage.setItem('activePolls', activePolls);
  console.log(`poll${activePolls} has now been stored locally`);

  // create a link to the poll
  createPollLink();

  activePolls++;

  // update the header text
  updatePollNumber();

  // remove options from both the pollLinks area
  // and the resultsForm
  clearOptions();
});

clearMemoryBtn.addEventListener('click', () => {
  localStorage.clear();
  clearOptions();
  searchResults = [];
  pollArray1 = [];
});

// HTTP request to the OMDB api
function sendApiRequest(title, year) {
  axios
    .get(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${title}&y=${year}`)
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
  // remove previous search results, if any
  while (resultsForm.firstChild) {
    resultsForm.removeChild(resultsForm.firstChild);
  }
  // appends maxresult notice
  displayMaxResult();

  // displays the list of movie results
  // and adds click events to each one
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
  }
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

// Add clicked movie to poll
function addOption(id) {
  let index = parseInt(id);
  let option = document.createElement('p');
  option.classList.add('option');
  option.id = id;
  option.addEventListener('click', (e) => {
    removeOption(e.target);
  });
  option.innerText = searchResults[index]['Title'];
  pollArray1.push(searchResults[index]);
  console.log('pollArray1 is now:', pollArray1);
  pollOptions.append(option);
}

// Remove clicked movie from poll
function removeOption(element) {
  let searchIndex = parseInt(element.id);
  let pollIndex = pollArray1.indexOf(searchResults[searchIndex]);
  pollArray1.splice(pollIndex, 1);
  console.log('pollArray1 is now:', pollArray1);
  element.parentNode.removeChild(element);
}

function updatePollNumber() {
  let header = document.getElementById('optionsHeader');
  header.innerText = `Poll #${activePolls}: give me movies!`;
}

// currently can only handle Poll1, needs to by dynamic
function createPollLink() {
  let pollLink = document.createElement('a');
  pollLink.href = `poll${activePolls}.html`;
  pollLink.innerText = `Link to my poll #${activePolls}`;
  pollLinks.append(pollLink);
}

function clearOptions() {
  // clear resultsForm
  while (resultsForm.firstChild) {
    resultsForm.removeChild(resultsForm.firstChild);
  }
  // clear pollOptions
  while (pollOptions.firstChild) {
    pollOptions.removeChild(pollOptions.firstChild);
  }
}
