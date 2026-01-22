
// ----------------------------------
// mapping for provinces
// ----------------------------------

const PROVINCE_NAMES = {
  ON: 'Ontario',
  BC: 'British Columbia',
  AB: 'Alberta',
  QC: 'Quebec',
  MB: 'Manitoba',
  SK: 'Saskatchewan',
  NS: 'Nova Scotia',
  NB: 'New Brunswick',
  NL: 'Newfoundland and Labrador',
  PE: 'Prince Edward Island',
  YT: 'Yukon',
  NT: 'Northwest Territories',
  NU: 'Nunavut'
};


// ----------------------------------
// Google Sheets API (approved listings)
// ----------------------------------
const API_URL =
  'https://script.google.com/macros/s/AKfycbwuhO_zvZCYTY8sI4cNs26rszuNsy8C2VgqGc1a4D_z4nkdHdWXQV_YMSCps6pLo2jy/exec';

let allListings = [];

// ----------------------------------
// Initial load
// ----------------------------------
document.addEventListener('DOMContentLoaded', () => {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      allListings = data;
      populateProvinces();
      applyUrlFilters();
    })
    .catch(err => {
      console.error('API error:', err);
    });

  document
    .getElementById('filterProvince')
    .addEventListener('change', updateCities);
});

// ----------------------------------
// Populate Provinces (dynamic)
// ----------------------------------
function populateProvinces() {
  const provinceSelect = document.getElementById('filterProvince');

  provinceSelect.innerHTML =
    '<option value="">Province / Territory</option>';

  const provinces = [...new Set(
    allListings
      .map(item => item.province)
      .filter(Boolean)
  )].sort();

  provinces.forEach(code => {
    const opt = document.createElement('option');
    opt.value = code;
    opt.textContent = PROVINCE_NAMES[code] || code;
    provinceSelect.appendChild(opt);
  });
}


// ----------------------------------
// Populate Cities (based on province)
// ----------------------------------
function updateCities() {
  const province = document.getElementById('filterProvince').value;
  const citySelect = document.getElementById('filterCity');

  citySelect.innerHTML = '<option value="">City</option>';

  if (!province) return;

  const cities = [...new Set(
    allListings
      .filter(item => item.province === province)
      .map(item => item.city)
      .filter(Boolean)
  )].sort();

  cities.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });
}

// ----------------------------------
// Apply Filters (Search button)
// ----------------------------------
function applyFilters() {
  const type = document.getElementById('filterType').value;
  const province = document.getElementById('filterProvince').value;
  const city = document.getElementById('filterCity').value;

  if (!province) {
    alert('Please select a province or territory.');
    return;
  }

  const filtered = allListings.filter(item => {
    const types = (item.service_type || '')
      .toLowerCase()
      .split(',')
      .map(t => t.trim());

    return (
      (!type || types.includes(type)) &&
      item.province === province &&
      (!city || item.city === city)
    );
  });

  renderResults(filtered);
}

// ----------------------------------
// Render Results
// ----------------------------------
function renderResults(data) {
  const container = document.getElementById('results');
  const noResults = document.getElementById('noResults');

  container.innerHTML = '';

  if (!data.length) {
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';

  // Featured (paid) listings first
  data.sort((a, b) => (b.tier === 'paid') - (a.tier === 'paid'));

  data.forEach(item => {
    const card = document.createElement('div');
    card.className =
      'listing-card' + (item.tier === 'paid' ? ' featured' : '');

    card.innerHTML = `
      <a href="${item.website}" target="_blank" rel="noopener noreferrer">
        ${item.tier === 'paid' ? '<span class="featured-badge">Featured</span>' : ''}
        <h3 class="name">${item.business_name}</h3>
        <p class="meta">${item.city}, ${item.province}</p>
      </a>
    `;

    container.appendChild(card);
  });
}

// ----------------------------------
// Render URLs for better SEO
// ----------------------------------
function applyUrlFilters() {
  const params = new URLSearchParams(window.location.search);

  const province = params.get('province');
  const city = params.get('city');
  const type = params.get('type');

  if (province) {
    document.getElementById('filterProvince').value = province;
    updateCities();
  }

  if (city) {
    document.getElementById('filterCity').value = city;
  }

  if (type) {
    document.getElementById('filterType').value = type;
  }

  if (province) {
    applyFilters();
  }
}
