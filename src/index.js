import './css/styles.css';
import _ from 'lodash';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  card: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  _.debounce(event => {
    event.preventDefault();
    onInput(refs.input.value);
  }, DEBOUNCE_DELAY)
);

function onInput(value) {
  const name = value.trim();

  if (name === '') {
    clearAllMarkup();
    return;
  }
  fetchCountries(name)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearAllMarkup();
      } else if (data.length <= 10 && data.length >= 2) {
        clearAllMarkup();
        refs.list.innerHTML = createListMarkup(data);
      } else {
        clearAllMarkup();
        refs.card.innerHTML = createInfoMarkup(data);
      }
    })
    .catch(error => {
      console.log(error);
      clearAllMarkup();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createListMarkup(countries) {
  return countries
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class="country-list__item">
        <img src="${svg}" alt="${official}" class="country-list__item-img" />
        <p class="country-list__item-text">${official}</p>
      </li>`;
    })
    .join('');
}

function createInfoMarkup(country) {
  return country
    .map(
      ({
        name: { official },
        capital,
        population,
        flags: { svg },
        languages,
      }) => {
        return `<div class="country-info__wrapper">
        <img src="${svg}" alt="${official}" class="country-info__flag" />
        <h1 class="country-info__header">${official}</h1>
      </div>
      <p class="country-info__term">
        Capital: <span class="country-info__definition">${capital}</span>
      </p>
      <p class="country-info__term">
        Population: <span class="country-info__definition">${population}</span>
      </p>
      <p class="country-info__term">
        Languages: <span class="country-info__definition">${Object.values(
          languages
        )}</span>
      </p>`;
      }
    )
    .join('');
}

function clearAllMarkup() {
  refs.list.innerHTML = '';
  refs.card.innerHTML = '';
}
