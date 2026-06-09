const https = require('https');
const fs = require('fs');

const download = (url, dest) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => { fs.writeFileSync(dest, data); });
  });
};

download('https://raw.githubusercontent.com/Berllock/convite-date/main/index.html', 'temp_index.html');
download('https://raw.githubusercontent.com/Berllock/convite-date/main/styles.css', 'temp_styles.css');
