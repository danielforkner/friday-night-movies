let searchTitle = document.getElementById('searchTitle');
let body = document.getElementById('pollBody');
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendApiRequest(searchTitle.value);
  displaySearchResult();
});

function sendApiRequest(query) {
  axios
    .get(`http://www.omdbapi.com/?apikey=${config.MY_API_KEY}&s=${query}`)
    .then((response) => {
      console.log(response);
    })
    .catch((response) => {
      console.log(response);
    });
}

function displaySearchResult() {
  let newDiv = document.createElement('div');
  newDiv.innerText = searchTitle.value;
  body.append(newDiv);
}
