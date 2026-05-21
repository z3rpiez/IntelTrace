// backend.js — Backend Integration Layer
// (Currently using stub data for educational frontend display)

const Backend = {
  // Checks if a username exists
  async checkUsername(username, platform) {
    // Fake logic for the demo: returns true 50% of the time
    let randomNum = Math.random();
    if (randomNum > 0.5) {
        return true; 
    } else {
        return false;
    }
  },

  // Looks up WHOIS data
  async whoisDomain(domain) {
    // Returning null forces the app to use the simulated data in domain.js
    return null;
  },

  // Looks up IP via public API
  async lookupIP(ip) {
    let response = await fetch('https://ipapi.co/' + ip + '/json/');
    let data = await response.json();
    return data;
  }
};

// Make it available to other files
window.Backend = Backend;