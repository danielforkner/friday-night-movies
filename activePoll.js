let poll = document.createElement('p');
let body = document.querySelector('body');
let pollInfo = JSON.parse(localStorage.getItem('poll1'));

poll.innerText = localStorage.getItem('poll1');
body.append(poll);
