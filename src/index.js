import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const inputEl = document.getElementById('search-box');
const countryInfoContainer = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');

const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));

function onCountryInput(evt) {
  const searchQuery = inputEl.value.trim();

  if (searchQuery) {
    return fetchCountries(searchQuery).then(showCountryInfo);
  }

  countryInfoContainer.innerHTML = '';
  countryList.innerHTML = '';
}

function showCountryInfo(countries) {
  if (countries.length > 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (countries.length === 1) {
    countryList.innerHTML = '';
    return renderCountryCard(countries);
  } else if (countries.length > 1 && countries.length < 10) {
    countryInfoContainer.innerHTML = '';
    return renderCountryItem(countries);
  }
}

function renderCountryItem(country) {
  const markup = country
    .map(el => {
      return `<li class="country-item">
            <img src="${el.flags.svg}" alt="${el.name.official}" width="40" height="20" />
            <p>${el.name.official}</p>
            </li>`;
    })
    .join('');

  countryList.innerHTML = markup;
}

function renderCountryCard(country) {
  const markup = country
    .map(el => {
      return `<h1>
       <img src="${el.flags.svg}" alt="${
        el.name.official
      }" width="40" height="20" />

        ${el.name.official}
      </h1>
      <ul class="country-info_list">
        <li class="country-info_item">
          <h2>Capital:</h2>
          <p>${el.capital}</p>
        </li>
        <li class="country-info_item">
          <h2>Population:</h2>
          <p>${el.population}</p>
        </li>
        <li class="country-info_item">
          <h2>Languages:</h2>
          <p>${Object.values(el.languages).join(', ')}</p>
        </li>
      </ul>`;
    })
    .join('');

  countryInfoContainer.innerHTML = markup;
}
