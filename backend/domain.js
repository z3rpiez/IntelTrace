// IntelTrace — Domain Intelligence (domain.js)

const REGISTRARS = ['GoDaddy LLC', 'Namecheap Inc.', 'Google Domains', 'Cloudflare Registrar'];

function lookupDomain() {
  let domain = document.getElementById('domainInput').value.trim().toLowerCase();
  let resultsEl = document.getElementById('domainResults');
  let spinner = document.getElementById('domainSpinner');

  if (domain === '') {
    resultsEl.innerHTML = '<div class="cyber-alert cyber-alert-error">Please enter a domain name.</div>';
    return;
  }

  resultsEl.innerHTML = '';
  spinner.style.display = 'flex';

  setTimeout(function() {
    spinner.style.display = 'none';

    // Fake data generator for educational display
    let registrar = REGISTRARS[Math.floor(Math.random() * REGISTRARS.length)];
    let now = new Date();
    let pastDate = new Date(now);
    pastDate.setFullYear(now.getFullYear() - 3);
    let futureDate = new Date(now);
    futureDate.setFullYear(now.getFullYear() + 1);

    let regDate = pastDate.toISOString().split('T')[0];
    let expDate = futureDate.toISOString().split('T')[0];

    // Build the Terminal-style HTML output manually
    let html = '<div class="terminal-output"><div class="output-inner">';
    html += '<div style="margin-bottom:1rem;"><span class="t-key">$ whois ' + domain + '</span></div>';
    
    html += '<div><span class="t-label">Domain Name: </span><span class="t-value">' + domain.toUpperCase() + '</span></div>';
    html += '<div><span class="t-label">Registrar: </span><span class="t-value">' + registrar + '</span></div>';
    html += '<div><span class="t-label">Registration Date: </span><span class="t-value">' + regDate + 'T00:00:00Z</span></div>';
    html += '<div><span class="t-label">Expiry Date: </span><span style="color:var(--green);">' + expDate + 'T23:59:59Z</span></div>';
    
    html += '<div class="mt-2"></div>';
    html += '<div><span class="t-label">Name Server 1: </span><span class="t-value">NS1.CLOUDFLARE.COM</span></div>';
    html += '<div><span class="t-label">Name Server 2: </span><span class="t-value">NS2.CLOUDFLARE.COM</span></div>';
    
    html += '<div class="mt-2"></div>';
    html += '<div><span class="t-label">Domain Status: </span><span class="t-value">clientTransferProhibited</span></div>';
    
    html += '<div class="mt-3" style="color:var(--muted); font-size:0.78rem;">[ SIMULATED DATA — For educational purposes only ]</div>';
    html += '</div></div>';

    resultsEl.innerHTML = html;

  }, 1200);
}