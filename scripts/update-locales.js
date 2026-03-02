const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '..', 'messages');
const files = fs.readdirSync(messagesDir);

for (const file of files) {
    if (file.endsWith('.json')) {
        const filePath = path.join(messagesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);

        if (data.Common && data.Common.navbar && !data.Common.navbar.blog) {
            data.Common.navbar.blog = "Blog";
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
            console.log(`Updated ${file}`);
        }
    }
}
