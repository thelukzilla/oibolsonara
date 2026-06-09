import https from 'https';
import fs from 'fs';

const download = (url, dest) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => { fs.writeFileSync(dest, data); console.log("Downloaded", dest); });
  });
};

download('https://raw.githubusercontent.com/Berllock/convite-date/main/index.html', 'temp_index.html');
download('https://raw.githubusercontent.com/Berllock/convite-date/main/styles.css', 'temp_styles.css');
download('https://raw.githubusercontent.com/Berllock/convite-date/main/script.js', 'temp_script.js');
