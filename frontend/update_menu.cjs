const fs = require('fs');
const path = require('path');

const menuPath = path.join(__dirname, 'src/data/menu.ts');
const assetsDir = path.join(__dirname, 'public/assets');

let content = fs.readFileSync(menuPath, 'utf-8');

const assets = fs.readdirSync(assetsDir);
const assetNames = assets.map(a => a.toLowerCase().replace('.png', '').replace('.jpeg', '').replace('.jpg', '').replace('.avif', ''));

const pattern = /id: '([^']+)',\s+name: '([^']+)',\s+category: '([^']+)',\s+price: ([^,]+),\s+largePriceAddOn: ([^,]+),\s+image: '([^']*)',/g;

const newContent = content.replace(pattern, (match, idStr, nameStr, category, price, addOn, imgField) => {
    let cleanName = nameStr.toLowerCase().replace(/ /g, '').replace(/-/g, '');
    let cleanName2 = cleanName.replace('milktea', '').replace('bobatea', '').replace('boba', '');
    
    let matchedAsset = '';
    for (let i = 0; i < assetNames.length; i++) {
        let a = assetNames[i];
        if (a === cleanName || a === cleanName + 'boba' || a === cleanName2 || a === cleanName2 + 'boba' || a.startsWith(cleanName2)) {
            matchedAsset = '/assets/' + assets[i];
            break;
        }
    }
    
    if (!matchedAsset) {
        if (cleanName.includes('authentic')) matchedAsset = '/assets/authentic.png';
        else if (cleanName.includes('hongkong')) matchedAsset = '/assets/hongkong.png';
        else if (cleanName.includes('matcha')) matchedAsset = '/assets/matcha.png';
        else if (cleanName.includes('taro')) matchedAsset = '/assets/taro.png';
        else if (cleanName.includes('brownsugar')) matchedAsset = '/assets/brownsugar.png';
        else if (cleanName.includes('strawberry')) matchedAsset = '/assets/strawberryboba.png';
        else if (cleanName.includes('mango')) matchedAsset = '/assets/mangoboba.png';
        else if (cleanName.includes('lychee')) matchedAsset = '/assets/lycheeboba.png';
        else if (cleanName.includes('blueberry')) matchedAsset = '/assets/blueberryboba.png';
        else if (cleanName.includes('chocolate')) matchedAsset = '/assets/chocolateboba.png';
        else if (cleanName.includes('chocofantasy')) matchedAsset = '/assets/chocofantasyboba.png';
        else if (cleanName.includes('darkcocoa')) matchedAsset = '/assets/darkcocoaboba.png';
        else if (cleanName.includes('chococaramel')) matchedAsset = '/assets/chococaramelboba.png';
        else if (cleanName.includes('nutella')) matchedAsset = '/assets/nutellaboba.png';
        else if (cleanName.includes('ferrero')) matchedAsset = '/assets/ferrerorocherboba.png';
        else if (cleanName.includes('oreo')) matchedAsset = '/assets/oreoboba.png';
        else if (cleanName.includes('lotus')) matchedAsset = '/assets/lotusbiscoffboba.png';
        else if (cleanName.includes('hazelnut')) matchedAsset = '/assets/hazelnutboba.png';
        else if (cleanName.includes('mocha')) matchedAsset = '/assets/mochaboba.png';
        else if (cleanName.includes('desi')) matchedAsset = '/assets/desicoffeeboba.png';
        else if (cleanName.includes('seasalt')) matchedAsset = '/assets/seasaltbiscoffboba.png';
        else if (cleanName.includes('popcorn')) matchedAsset = '/assets/caramelpopcornboba.png';
        else if (cleanName.includes('mangopulp')) matchedAsset = '/assets/mangopulpboba.png';
        else if (cleanName.includes('coconut')) matchedAsset = '/assets/tendercoconutboba.png';
        else if (cleanName.includes('milo')) matchedAsset = '/assets/miloboba.png';
        else if (cleanName.includes('malt')) matchedAsset = '/assets/maltboba.png';
        else if (cleanName.includes('pink')) matchedAsset = '/assets/pinkgrapefruitnewarrival.png';
        else if (cleanName.includes('yuzu')) matchedAsset = '/assets/yuzunewarrival.png';
        else if (cleanName.includes('elderflower')) matchedAsset = '/assets/elderflowernewarrival.avif';
        else if (cleanName.includes('honeydew')) matchedAsset = '/assets/matcha.png'; // fallback
    }
    
    if (matchedAsset) {
        console.log(`Matched ${nameStr} -> ${matchedAsset}`);
        return `id: '${idStr}',\n  name: '${nameStr}',\n  category: '${category}',\n  price: ${price},\n  largePriceAddOn: ${addOn},\n  image: '${matchedAsset}',`;
    }
    return match;
});

fs.writeFileSync(menuPath, newContent, 'utf-8');
console.log('Done mapping assets to menu.');
