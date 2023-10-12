const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');

const cipherSuites = [
  "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
  "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
  "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
  "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA"
];

const ciphersString = cipherSuites.join(':'); // Transformați tabloul în șir de caractere
const httpsAgent = new https.Agent({
  ciphers: ciphersString, // Folosiți șirul de caractere creat anterior
  minVersion: 'TLSv1.2' // Specificați TLS 1.2
});

const bnrUrl = "https://www.bnr.ro/nbrfxrates.xml";


axios.get(bnrUrl, { httpsAgent })
  .then((response) => {
    // Parsează datele XML pentru a obține cursul valutar
    const xmlData = response.data;
    const regex = /<Rate currency="EUR">(.+)<\/Rate>/;
    const match = xmlData.match(regex);

    if (match) {
      const cursEuro = match[1];
      const main1FilePath = path.join(__dirname, 'public', 'main1.js');
      const main1Content = fs.readFileSync(main1FilePath, 'utf8');
      const updatedMain1Content = main1Content.replace(/cursValutar1.value = '.+'/, `cursValutar1.value = '${cursEuro}';`);
      
      fs.writeFileSync(main1FilePath, updatedMain1Content, 'utf8');
      
      console.log(`Cursul valutar pentru EURO a fost actualizat cu succes: ${cursEuro}`);
    } else {
      console.error('Nu s-a putut obține cursul valutar de la BNR.');
    }
  })
  .catch((error) => {
    console.error('Eroare la descarcarea datelor de la BNR:', error);
  });
