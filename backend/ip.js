// IntelTrace — IP Intelligence (ip.js)

const PRIVATE_IP = ['10.', '192.168.', '172.', '127.', '0.', '169.254.'];

function validateIPv4(ip) {
  let parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  for (let i = 0; i < parts.length; i++) {
    let num = Number(parts[i]);
    if (isNaN(num) || num < 0 || num > 255) return false;
  }
  return true;
}

async function lookupIP() {
  let ip = document.getElementById('ipInput').value.trim();
  let out = document.getElementById('ipResults');
  let mapEl = document.getElementById('ipMap');
  let spinner = document.getElementById('ipSpinner');

  if (ip === '') {
    out.innerHTML = '<div class="cyber-alert cyber-alert-error">Enter an IP address.</div>';
    return;
  }
  
  if (validateIPv4(ip) === false) {
    out.innerHTML = '<div class="cyber-alert cyber-alert-error">Invalid IPv4 format. Example: 8.8.8.8</div>';
    return;
  }

  // Check private IPs
  for (let i = 0; i < PRIVATE_IP.length; i++) {
    if (ip.startsWith(PRIVATE_IP[i])) {
      out.innerHTML = '<div class="cyber-alert" style="border-color:#ffaa00; color:#ffaa00;"><strong>' + ip + '</strong> is a private IP — no geolocation available.</div>';
      mapEl.style.display = 'none';
      return;
    }
  }

  out.innerHTML = ''; 
  mapEl.style.display = 'none'; 
  spinner.style.display = 'flex';

  try {
    // FIXED: Swapped to ipwho.is to avoid the ad-blocker network error you got
    let response = await fetch('https://ipwho.is/' + ip);
    let data = await response.json();
    spinner.style.display = 'none';

    if (data.success === false) { 
      out.innerHTML = '<div class="cyber-alert cyber-alert-error">API error: ' + data.message + '</div>'; 
      return; 
    }

    // Build the table manually instead of using complex array mapping
    let html = '<div style="overflow-x:auto;"><table class="cyber-table"><thead><tr><th>FIELD</th><th>VALUE</th></tr></thead><tbody>';
    html += '<tr><td class="t-key">IP Address</td><td class="t-value">' + data.ip + '</td></tr>';
    html += '<tr><td class="t-key">City</td><td class="t-value">' + (data.city || 'N/A') + '</td></tr>';
    html += '<tr><td class="t-key">Region</td><td class="t-value">' + (data.region || 'N/A') + '</td></tr>';
    html += '<tr><td class="t-key">Country</td><td class="t-value">' + (data.country || 'N/A') + '</td></tr>';
    html += '<tr><td class="t-key">ISP / Org</td><td class="t-value">' + (data.connection ? data.connection.isp : 'N/A') + '</td></tr>';
    html += '<tr><td class="t-key">Timezone</td><td class="t-value">' + (data.timezone ? data.timezone.id : 'N/A') + '</td></tr>';
    html += '</tbody></table></div>';
    
    out.innerHTML = html;

    if (data.latitude && data.longitude) {
      let alertMsg = '<div class="cyber-alert mt-3" style="border-color:#ffaa00; color:#ffaa00;">';
      alertMsg += '<i class="bi bi-geo-alt-fill me-2"></i>Location: <strong>' + data.city + ', ' + data.country + '</strong>';
      alertMsg += '</div>';
      out.innerHTML += alertMsg;
      
      mapEl.style.display = 'block';
      setTimeout(function() {
        showMap('ipMap', data.latitude, data.longitude, '#ffaa00', data.ip + ' — ' + data.city, 10);
      }, 100);
    }
  } catch (err) {
    spinner.style.display = 'none';
    out.innerHTML = '<div class="cyber-alert cyber-alert-error"><i class="bi bi-exclamation-triangle me-2"></i>Network error. Please try again.</div>';
  }
}