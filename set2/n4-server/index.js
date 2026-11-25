// Full Name: Liezelle Mangunay
// Section: IV-BSIT C
// Activity Code: N4
// Date: November 25, 2026

const http = require('http');

const PORT = 8000;

// Create an HTTP server using the built-in http module
const server = http.createServer((req, res) => {
    const url = req.url;

    // Home page route
    if (url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>Welcome to My Node.js HTTP Server</h1>
            <p><strong>Name:</strong> Liezelle Mangunay</p>
            <p><strong>Section:</strong> IV-BSIT C</p>
            <p><strong>Activity:</strong> ELEC 3 - N4 Basic HTTP Server</p>
        `);
    }
    // About page route
    else if (url === '/about' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>About Me</h1>
            <p>Hi! I am Liezelle Mangunay from IV-BSIT C.</p>
            <p>I am currently studying Node.js web servers, REST APIs, and middleware for ELEC 3.</p>
        `);
    }
    // Contact page route
    else if (url === '/contact' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>Contact Information</h1>
            <p><strong>Email:</strong> mangunayliezelle18@gmail.com</p>
            <p><strong>GitHub:</strong> github.com/mangunayliezelle18-cmd</p>
        `);
    }
    // 404 Not Found route for any other URL
    else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <h1>404 - Page Not Found</h1>
            <p>The page <strong>${url}</strong> does not exist.</p>
        `);
    }
});

// Listen on port 8000 and log startup message
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});