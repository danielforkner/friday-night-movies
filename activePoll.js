let body = document.querySelector('body');
let pollNum = parseInt(body.id);

let pollOptions = JSON.parse(localStorage.getItem(`poll${pollNum}`));
let length = pollOptions.length;
console.log(length);

let posterImg, title, plot, card, info, poster;
for (let i = 0; i < length; i++) {
  card = document.createElement('div');
  card.classList.add('optionCard');
  poster = document.createElement('div');
  poster.classList.add('poster');
  info = document.createElement('div');
  info.classList.add('info');
  title = document.createElement('h4');
  plot = document.createElement('p');
  posterImg = document.createElement('img');
  posterImg.src = pollOptions[i]['Poster'];
  posterImg.classList.add('posterImg');
  title.innerText = pollOptions[i]['Title'];
  plot.innerText = pollOptions[i]['Year'];

  body.append(card);
  card.append(poster);
  poster.append(posterImg);
  card.append(info);
  info.append(title);
  info.append(plot);
}
