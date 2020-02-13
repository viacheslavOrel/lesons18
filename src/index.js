const $filmList = document.querySelector('.filmList');

const starWarsRequest = new XMLHttpRequest;
starWarsRequest.open('GET', 'https://swapi.co/api/films/');
starWarsRequest.send();
starWarsRequest.responseType = 'json';

// eslint-disable-next-line no-use-before-define
starWarsRequest.addEventListener('loadend', event => {
    const starWarsFilms = event.target.response.results;
    $filmList.insertAdjacentHTML('beforeend', starWarsFilms.reduce((acc, val) => {
        // eslint-disable-next-line no-param-reassign
        acc += `<li>
                    <h1>Star Wars. ${val.title}</h1>
                    <p>${val.opening_crawl}</p>
                    <button data-film='episodeid${val.episode_id}' data-starships='${val.starships}'>
                        Starships in episode
                    </button>
                </li>`;
        return acc;
    }, ''));
});

$filmList.addEventListener('click', event => {
    if (event.target.dataset.starships) {
        const $starshipsBlock = event.currentTarget.querySelector(`#${event.target.dataset.film}`);
        if ($starshipsBlock) $starshipsBlock.classList.toggle('hidden');
        else {
            const starshipLinks = event.target.dataset.starships.split(',');
            const starshipsRequest = new XMLHttpRequest;
            let starshipsUl = `<ul id=${event.target.dataset.film}>`;
            for (let index = 0; index < starshipLinks.length; index++) {
                starshipsRequest.open('GET', starshipLinks[index], false);
                starshipsRequest.send();
                // eslint-disable-next-line no-magic-numbers
                if (starshipsRequest.status !== 200) {
                    event.target.dataset.insertAdjacentHTML('afterend', '<div>Ooops</div>');
                    return;
                }
                const starshipObj = JSON.parse(starshipsRequest.response);
                starshipsUl += `
                    <li>
                        <p>Name: ${starshipObj.name}</p>
                        <p>Model: ${starshipObj.model}</p>
                        <p>Class: ${starshipObj.starship_class}</p>
                        <p>Cost: ${starshipObj.cost_in_credits} credits</p>
                    </li>
                `;
            }
            starshipsUl += '</ul>';

            event.target.insertAdjacentHTML('afterend', starshipsUl);
        }
    }
});

console.log('test');