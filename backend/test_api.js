const http = require('http');
const req = http.request('http://localhost:8081/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
        const token = JSON.parse(data).data.token;
        if (!token) {
           console.log('Login failed:', data);
           process.exit(1);
        }
        console.log('Got token');
        const req2 = http.request('http://localhost:8081/api/menu/active', {
           headers: { 'Authorization': 'Bearer ' + token }
        }, (res2) => {
           let data2 = '';
           res2.on('data', chunk => data2 += chunk);
           res2.on('end', () => console.log('MENU:', data2));
        });
        req2.end();
        
        const req3 = http.request('http://localhost:8081/api/categories', {
           headers: { 'Authorization': 'Bearer ' + token }
        }, (res3) => {
           let data3 = '';
           res3.on('data', chunk => data3 += chunk);
           res3.on('end', () => console.log('CATEGORIES:', data3));
        });
        req3.end();
    } catch(e) { console.log('Error parsing login:', data, e.message); }
  });
});
req.write(JSON.stringify({email: 'admin@coffeeshop.com', password: 'Admin@123'}));
req.end();
