exports.confirmationMessage = (name) => {
    return `Dear ${name}, 
    
    Thank you for reaching out! I have received your message and will be in touch as soon as possible. 
    
    Sincerely, 
    Kaye`;
}

exports.forwardMessage = (name, email, message) => {
    return `Name: ${name} 
    Email: ${email} 
    Message: ${message}`;
}

exports.encodeMessage = (from, to, subject, body) => {
    const message = [
        `From: no-reply <${from}>`,
        `To: <${to}>`,
        `Content-Type: text/html; charset=utf-8`,
        `MIME-Version: 1.0`,
        `Subject: ${subject}`,
        '',
        body
    ].join('\n');

    return Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}