const https = require('https');

const migrate = () => {
    const options = {
        hostname: 'qr-code-order-management-production.up.railway.app',
        port: 443,
        path: '/api/admin/migrate-images',
        method: 'POST',
        rejectUnauthorized: false
    };

    const req = https.request(options, res => {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('Migration successful:', data);
                process.exit(0);
            } else if (res.statusCode === 404) {
                console.log('Endpoint not found yet, waiting for deployment... (Status: 404)');
                setTimeout(migrate, 10000); // retry after 10s
            } else {
                console.log(`Failed with status ${res.statusCode}: ${data}`);
                setTimeout(migrate, 10000); // retry after 10s
            }
        });
    });

    req.on('error', error => {
        console.error('Error calling endpoint:', error.message);
        setTimeout(migrate, 10000); // retry after 10s
    });

    req.end();
};

console.log("Waiting for Railway deployment to complete...");
migrate();
