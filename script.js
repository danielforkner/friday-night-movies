// API KEY
const API_KEY = config.SECRET_API_KEY;

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
let pollArray2 = [];
let pollArray3 = [];

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
  switch (activePolls) {
    case 1:
      localStorage.setItem('poll1', JSON.stringify(pollArray1));
      localStorage.setItem('activePolls', activePolls);
      break;
    case 2:
      localStorage.setItem('poll2', JSON.stringify(pollArray2));
      localStorage.setItem('activePolls', activePolls);
      break;
    case 3:
      localStorage.setItem('poll3', JSON.stringify(pollArray3));
      localStorage.setItem('activePolls', activePolls);
      break;
  }

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
  // needs to be dynamic
  pollArray1 = [];
  pollArray2 = [];
  pollArray3 = [];
  // reset poll number
  activePolls = 1;
  // remove links
  while (document.querySelector('a')) {
    let link = document.querySelector('a');
    link.parentNode.removeChild(link);
  }
});

// HTTP request to the OMDB api
function sendApiRequest(title, year) {
  axios
    .get(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${title}&y=${year}`)
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
    removeOption(e.target, activePolls);
  });
  option.innerText = searchResults[index]['Title'];
  incrementPollArray(activePolls, index);
  pollOptions.append(option);
}

function incrementPollArray(poll, index) {
  switch (poll) {
    case 1:
      pollArray1.push(searchResults[index]);
      break;
    case 2:
      pollArray2.push(searchResults[index]);
      break;
    case 3:
      pollArray3.push(searchResults[index]);
      break;
  }
}

// Remove clicked movie from poll
function removeOption(element, poll) {
  let searchIndex = parseInt(element.id);
  let pollIndex;
  switch (poll) {
    case 1:
      pollIndex = pollArray1.indexOf(searchResults[searchIndex]);
      pollArray1.splice(pollIndex, 1);
    case 2:
      pollIndex = pollArray2.indexOf(searchResults[searchIndex]);
      pollArray2.splice(pollIndex, 2);
    case 3:
      pollIndex = pollArray3.indexOf(searchResults[searchIndex]);
      pollArray3.splice(pollIndex, 3);
  }
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
