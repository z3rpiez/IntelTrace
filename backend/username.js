// IntelTrace — Username Finder (username.js)

const PLATFORMS = [
  { name: 'GitHub',     icon: 'bi-github',    urlPrefix: 'https://github.com/' },
  { name: 'Twitter/X',  icon: 'bi-twitter-x', urlPrefix: 'https://x.com/' },
  { name: 'Instagram',  icon: 'bi-instagram', urlPrefix: 'https://instagram.com/' },
  { name: 'Reddit',     icon: 'bi-reddit',    urlPrefix: 'https://reddit.com/u/' },
  { name: 'TikTok',     icon: 'bi-tiktok',    urlPrefix: 'https://tiktok.com/@' },
  { name: 'LinkedIn',   icon: 'bi-linkedin',  urlPrefix: 'https://linkedin.com/in/' }
];

// Helper function to fake a database check
function hashFound(username, platformName) {
  let key = username.toLowerCase() + platformName;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = Math.imul(hash ^ key.charCodeAt(i), 2654435761);
  }
  return (Math.abs(hash >>> 0) % 100) < 50; 
}

function searchUsername() {
  let username = document.getElementById('usernameInput').value.trim();
  let out = document.getElementById('usernameResults');
  let statusDiv = document.getElementById('usernameStatus');
  let statusText = document.getElementById('usernameStatusText');

  if (username === '') {
    out.innerHTML = '<div class="cyber-alert cyber-alert-error"><i class="bi bi-exclamation-triangle me-2"></i>Enter a username to search.</div>';
    return;
  }

  out.innerHTML = '';
  statusDiv.style.display = 'flex';
  statusText.textContent = 'Scanning platforms for "' + username + '"…';

  let doneCount = 0;

  // Standard beginner for-loop
  for (let i = 0; i < PLATFORMS.length; i++) {
    let platform = PLATFORMS[i];
    let delay = 600 + (i * 200); // Stagger loading times
    
    setTimeout(function() {
      let isFound = hashFound(username, platform.name);
      let profileUrl = platform.urlPrefix + username;
      
      // Build HTML string
      let rowHtml = '<div class="result-item">';
      rowHtml += '<i class="bi ' + platform.icon + '" style="color:var(--muted); font-size:1.1rem; width:20px; text-align:center; margin-right:10px;"></i>';
      rowHtml += '<span class="platform-name" style="width:100px;">' + platform.name + '</span>';
      
      if (isFound === true) {
        rowHtml += '<a href="' + profileUrl + '" target="_blank" class="platform-url">' + profileUrl + '</a>';
        rowHtml += '<span class="status-found" style="margin-left:auto;">✓ FOUND</span>';
      } else {
        rowHtml += '<span class="platform-url" style="color:var(--muted);">Not registered</span>';
        rowHtml += '<span class="status-notfound" style="margin-left:auto;">✗ NOT FOUND</span>';
      }
      
      rowHtml += '</div>';
      out.innerHTML += rowHtml;

      doneCount++;
      statusText.textContent = 'Checked ' + doneCount + '/' + PLATFORMS.length + ' platforms…';

      if (doneCount === PLATFORMS.length) {
        statusDiv.style.display = 'none';
      }
    }, delay);
  }
}