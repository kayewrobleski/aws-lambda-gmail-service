const fs = require('fs');
const { google } = require('googleapis');
const keys = require('./secrets/oauth2.keys.json');
const users = require('./secrets/users.json');
const { getAccessTokens } = require('./authenticate');
const { 
    confirmationMessage, 
    forwardMessage, 
    encodeMessage 
} = require('./helpers');

const OAuth2 = google.auth.OAuth2;
let tokens;

// exports.handler = (event, context, callback) => {
async function main(event) {

    const { name, email, body } = event;

    // Authenticate if necessary (one-time only)
    const path = 'secrets/tokens.json';
    if (!fs.existsSync(path)) {
        console.log('Authenticating...')
        tokens = await getAccessTokens();
    } else {
        tokens = JSON.parse(fs.readFileSync(path));
    }
    
    const client = new OAuth2(
        keys.web.client_id,
        keys.web.client_secret,
        keys.web.redirect_uris[0]
    )
    client.setCredentials(tokens);

    const gmail = google.gmail({
        version: 'v1',
        auth: client
    });

    const message = encodeMessage(
        users.fromEmail,
        users.forwardTo,
        'Contact Inquiry',
        forwardMessage(name, email, body)
    );

    // forward message
    gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: message
        }
    })
    .then(res => {

        console.log('Success: Contact inquiry received\n', res.data);

        const confirmation = encodeMessage(
            users.fromEmail,
            'kayewrobleski94@gmail.com',
            'Thank you for your message!',
            confirmationMessage('Kaye')
        );

        // send confirmation
        gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: confirmation
            }
        })
        .then(confirmRes => {
            console.log('Success: Confirmation sent\n', confirmRes.data);
        })
        .catch(err => console.error(err.data));
    })
    .catch(err => console.error(err.data));

}

main({
    name: 'Jane',
    email: 'xxx@gmail.com',
    body: 'Testing a contact inquiry'
}).catch(console.error);
