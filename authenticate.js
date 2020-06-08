const path = require('path');
const fs = require('fs');

const { authenticate } = require('@google-cloud/local-auth');

exports.getAccessTokens = async function() {

    const { credentials } = await authenticate({
        keyfilePath: path.join(__dirname, 'secrets/oauth2.keys.json'),
        scopes: [
          'https://www.googleapis.com/auth/gmail.send',
        ],
      });

    fs.writeFile('secrets/tokens.json', JSON.stringify(credentials), function (err) {
        if (err) return console.log(err);
        console.log('Saved tokens to secrets/tokens.json');
    })

    return credentials;
      
}

// export default getAccessTokens

// getAccessTokens().catch(console.error);