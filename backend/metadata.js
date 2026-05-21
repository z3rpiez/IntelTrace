// IntelTrace — Image Metadata Analyzer (metadata.js)

async function analyzeMetadata(inputElement) {
  let file = inputElement.files[0];
  let out = document.getElementById('metadataResults');
  let mapEl = document.getElementById('metadataMap');
  let spinner = document.getElementById('metadataSpinner');
  
  if (!file) return;

  out.innerHTML = ''; 
  mapEl.style.display = 'none'; 
  spinner.style.display = 'flex';

  try {
    let data = await exifr.parse(file, { gps: true, tiff: true, exif: true });
    spinner.style.display = 'none';

    if (!data) {
      out.innerHTML = '<div class="cyber-alert" style="border-color:#ffaa00; color:#ffaa00;">No EXIF data found. It may have been stripped.</div>';
      return;
    }

    let tableHtml = '<div style="overflow-x:auto;"><table class="cyber-table"><thead><tr><th>FIELD</th><th>VALUE</th></tr></thead><tbody>';
    let hasData = false;

    // Standard beginner for-in loop
    for (let key in data) {
      if (key.startsWith('_') === false && typeof data[key] !== 'object') {
        tableHtml += '<tr><td class="t-key" style="width:40%;">' + key + '</td><td class="t-value">' + data[key] + '</td></tr>';
        hasData = true;
      }
    }
    tableHtml += '</tbody></table></div>';

    if (hasData === false) {
      out.innerHTML = '<div class="cyber-alert" style="border-color:#ffaa00; color:#ffaa00;">No readable EXIF fields found.</div>';
      return;
    }

    out.innerHTML = tableHtml;

    if (data.latitude && data.longitude) {
      let alertMsg = '<div class="cyber-alert mt-3" style="border-color:var(--green); color:var(--green);">';
      alertMsg += '<i class="bi bi-geo-alt-fill me-2"></i>GPS found: <strong>' + data.latitude.toFixed(6) + ', ' + data.longitude.toFixed(6) + '</strong>';
      alertMsg += '</div>';
      out.innerHTML += alertMsg;
      
      mapEl.style.display = 'block';
      setTimeout(function() {
        showMap('metadataMap', data.latitude, data.longitude, '#00ff88', 'GPS Location');
      }, 100);
    }
  } catch (err) {
    spinner.style.display = 'none';
    out.innerHTML = '<div class="cyber-alert cyber-alert-error">Error processing image. Try a different file.</div>';
  }
}

// Shared map renderer for IP and Metadata tools
function showMap(elId, lat, lng, color, popupHtml, zoom) {
  let el = document.getElementById(elId);
  if (window._maps && window._maps[elId]) { window._maps[elId].remove(); }
  if (!window._maps) window._maps = {};
  
  el.innerHTML = '';
  let map = L.map(el).setView([lat, lng], zoom || 14);
  window._maps[elId] = map;
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  L.marker([lat, lng]).addTo(map).bindPopup(popupHtml).openPopup();
  setTimeout(function() { map.invalidateSize(); }, 200);
}