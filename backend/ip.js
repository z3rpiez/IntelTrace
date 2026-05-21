async function lookupIP() {
  const ip      = document.getElementById('ipInput').value.trim();
  const out     = document.getElementById('ipResults');
  const mapEl   = document.getElementById('ipMap');
  const spinner = document.getElementById('ipSpinner');

  if (!ip) {
    out.innerHTML = '<div class="cyber-alert cyber-alert-error">Enter an IP address.</div>';
    return;
  }
  if (!validateIPv4(ip)) {
    out.innerHTML = '<div class="cyber-alert cyber-alert-error">Invalid IPv4 format. Example: 8.8.8.8</div>';
    return;
  }
  if (PRIVATE_RANGES.some(rx => rx.test(ip))) {
    out.innerHTML = `<div class="cyber-alert" style="border-color:#ffaa00;color:#ffaa00;">
      <strong>${escapeHTML(ip)}</strong> is a private IP — no geolocation available.</div>`;
    mapEl.style.display = 'none';
    return;
  }

  out.innerHTML = '';
  mapEl.style.display = 'none';
  spinner.style.display = 'flex';

  try {
    const response = await fetch(`https://ipwho.is/${ip}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    spinner.style.display = 'none';

    if (!data.success) {
      out.innerHTML = `<div class="cyber-alert cyber-alert-error">API error: ${escapeHTML(data.message)}</div>`;
      return;
    }

    const city    = escapeHTML(data.city);
    const region  = escapeHTML(data.region);
    const country = escapeHTML(data.country);
    const org     = escapeHTML(data.connection?.org);  
    const tz      = escapeHTML(data.timezone?.id);  

    out.innerHTML = `
      <div style="overflow-x:auto;">
        <table class="cyber-table">
          <thead><tr><th>FIELD</th><th>VALUE</th></tr></thead>
          <tbody>
            <tr><td class="t-key">IP Address</td><td class="t-value">${escapeHTML(data.ip)}</td></tr>
            <tr><td class="t-key">City</td><td class="t-value">${city}</td></tr>
            <tr><td class="t-key">Region</td><td class="t-value">${region}</td></tr>
            <tr><td class="t-key">Country</td><td class="t-value">${country}</td></tr>
            <tr><td class="t-key">ISP / Org</td><td class="t-value">${org}</td></tr>
            <tr><td class="t-key">Timezone</td><td class="t-value">${tz}</td></tr>
          </tbody>
        </table>
      </div>`;

    if (data.latitude && data.longitude) {
      out.innerHTML += `
        <div class="cyber-alert mt-3" style="border-color:#ffaa00;color:#ffaa00;">
          <i class="bi bi-geo-alt-fill me-2"></i>Location: <strong>${city}, ${country}</strong>
        </div>`;
      mapEl.style.display = 'block';
      setTimeout(() => {
        showMap('ipMap', data.latitude, data.longitude, '#ffaa00', `${escapeHTML(data.ip)} — ${city}`, 10);
      }, 100);
    }
  } catch (err) {
    spinner.style.display = 'none';
    out.innerHTML = '<div class="cyber-alert cyber-alert-error"><i class="bi bi-exclamation-triangle me-2"></i>Network error. Please try again.</div>';
  }
}
