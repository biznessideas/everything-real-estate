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
// Hide all listings on page load
// ----------------------------------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.item').forEach(item => {
    item.style.display = 'none';
  });

  // Force all links to open in a new tab (initial items)
  document.querySelectorAll('.item a').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
});

// ----------------------------------
// Update city dropdown when province changes
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

// ----------------------------------
// Apply filters (Search button click)
// Province REQUIRED
// Supports multi-type, multi-city, multi-province
// ----------------------------------
function applyFilters() {
  const type = document.getElementById('filterType').value;
  const province = document.getElementById('filterProvince').value;
  const city = document.getElementById('filterCity').value;

  // Enforce province selection
  if (!province) {
    alert('Please select a province or territory to search.');
    return;
  }

  const items = document.querySelectorAll('.item');
  const results = document.getElementById('results');
  let visibleCount = 0;

  items.forEach(item => {
    const itemTypes = item.dataset.type
      .split(',')
      .map(t => t.trim());

    const itemCities = item.dataset.city
      .split(',')
      .map(c => c.trim());

    const itemProvinces = item.dataset.province
      .split(',')
      .map(p => p.trim());

    const matches =
      (!type || itemTypes.includes(type)) &&
      itemProvinces.includes(province) &&
      (!city || itemCities.includes(city));

    item.style.display = matches ? 'block' : 'none';

    if (matches) {
      visibleCount++;
      // Ensure link opens in new tab for filtered items
      item.querySelectorAll('a').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      });
    }
  });

  // Show / hide "No results" message
  let noResults = document.getElementById('noResults');
  if (!noResults) {
    noResults = document.createElement('p');
    noResults.id = 'noResults';
    noResults.textContent = 'No results found.';
    results.appendChild(noResults);
  }

  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}
