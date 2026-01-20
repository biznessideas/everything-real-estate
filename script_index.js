// ----------------------------------
// City list by province
// ----------------------------------
const citiesByProvince = {
  ON: ['Toronto','Ottawa','Mississauga','Brampton','Hamilton'],
  BC: ['Vancouver','Surrey','Burnaby','Richmond'],
  AB: ['Calgary','Edmonton','Red Deer'],
  QC: ['Montreal','Quebec City','Laval'],
  MB: ['Winnipeg'],
  SK: ['Regina','Saskatoon'],
  NS: ['Halifax'],
  NB: ['Moncton','Saint John'],
  NL: ['St. John’s'],
  PE: ['Charlottetown'],
  YT: ['Whitehorse'],
  NT: ['Yellowknife'],
  NU: ['Iqaluit']
};

// ----------------------------------
// Google Sheets API
// ----------------------------------
const API_URL =
  'https://script.google.com/macros/s/AKfycbwuhO_zvZCYTY8sI4cNs26rszuNsy8C2VgqGc1a4D_z4nkdHdWXQV_YMSCps6pLo2jy/exec';

let allListings = [];

// ------------------------------
// Fetch approved listings
// ------------------------------
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    allListings = data;
  })
  .catch(err => {
    console.error('API error:', err);
  });

// ----------------------------------
// Update cities
// ----------------------------------
function updateCities() {
  const province = document.getElementById('filterProvince').value;
  const citySelect = document.getElementById('filterCity');

  citySelect.innerHTML = '<option value="">City</option>';

  if (!province || !citiesByProvince[province]) return;

  citiesByProvince[province].forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

// ------------------------------
// Apply Filters (Search button)
// ------------------------------
function applyFilters() {
  const type = document.getElementById('filterType').value;
  const province = document.getElementById('filterProvince').value;
  const city = document.getElementById('filterCity').value;

  if (!province) {
    alert('Please select a province or territory.');
    return;
  }

  const filtered = allListings.filter(item => {
    const types = item.service_type
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


// ------------------------------
// Render cards
// ------------------------------
function renderResults(data) {
  const container = document.getElementById('results');
  const noResults = document.getElementById('noResults');

  container.innerHTML = '';

  if (data.length === 0) {
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';
  // Featured first
    data.sort((a, b) =>
      (b.tier === 'paid') - (a.tier === 'paid')
    );

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'listing-card' + (item.tier === 'paid' ? ' paid' : '');

      card.innerHTML = `
        <a href="${item.website}" target="_blank" rel="noopener noreferrer">
        <h3 class="name">${item.business_name}</h3>
        <p class="meta">${item.city}, ${item.province}</p>
        <p class="link">  Visit Website</p>
        </a>
      `;

      container.appendChild(card);
    });
  }
