const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'src/data/mockData.ts');
let content = fs.readFileSync(mockDataPath, 'utf-8');

const replacements = {
  'image: hero1': "image: '/assets/herobanner1.jpeg'",
  'image: hero2': "image: '/assets/herobanner2.jpeg'",
  'image: hero3': "image: '/assets/herobanner3.jpeg'",
  'image: story1': "image: '/assets/storynew1.jpeg'",
  'slides: [story1, story2]': "slides: ['/assets/storynew1.jpeg', '/assets/storynew2.jpeg']",
  'image: trending1': "image: '/assets/trending1.png'",
  'slides: [trending1, trending2, trending3]': "slides: ['/assets/trending1.png', '/assets/trending2.png', '/assets/trending3.png']",
  'image: offers1': "image: '/assets/offers1.png'",
  'slides: [offers1]': "slides: ['/assets/offers1.png']",
  'image: bestseller1': "image: '/assets/bestseller1.png'",
  'slides: [bestseller1, bestseller2, bestseller3, bestseller4]': "slides: ['/assets/bestseller1.png', '/assets/bestseller2.png', '/assets/bestseller3.png', '/assets/bestseller4.png']",
  'image: bs_trending': "image: '/assets/brownsugartrending.png'",
  'image: fe_trending': "image: '/assets/ferrerotrending.png'",
  'image: ma_trending': "image: '/assets/matchatrending.png'",
  'image: mg_trending': "image: '/assets/mangotrending.png'",
  'image: na_yuzu': "image: '/assets/yuzunewarrival.png'",
  'image: na_elderflower': "image: '/assets/elderflowernewarrival.avif'",
  'image: na_pinkgrapefruit': "image: '/assets/pinkgrapefruitnewarrival.png'",
  'image: na_lotus': "image: '/assets/lotusbiscoffnewarrival.png'",
  'image: na_seasalt': "image: '/assets/seasaltbiscoffnewarrival.png'",
};

for (const [key, value] of Object.entries(replacements)) {
  content = content.replace(key, value);
}

fs.writeFileSync(mockDataPath, content, 'utf-8');
console.log('Mock data updated');
