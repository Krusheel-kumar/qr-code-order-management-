const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'menu.ts');
let data = fs.readFileSync(filePath, 'utf8');

// The file got corrupted between p-cheese-shots and the newly added p-lemon-iced-boba.
// Let's completely replace the broken section.

// Use regex to replace everything from "id: 'p-french-fries'," (that was accidentally inserted inside flavorProfile)
// all the way down to the start of "id: 'p-lemon-iced-boba'"

const brokenRegex = /id: 'p-french-fries'[\s\S]*?id: 'p-lemon-iced-boba',/;

const fixedContent = `creaminess: 4,
    refreshment: 0,
    energy: 3
  },
  recommendedToppings: ['t1'],
  pairings: [
    'p-ferrero-rocher-boba-tea'
  ]
},
{
  id: 'p-lemon-iced-boba',`;

data = data.replace(brokenRegex, fixedContent);

fs.writeFileSync(filePath, data);
console.log('Fixed menu.ts');
