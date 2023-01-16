import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

const fetchUrl = `https://www.nbbonline.com/?q=locator#locator`;
const websiteUrl = `https://www.nbbonline.com`;

// const getDataFromNbbon = () => {
//   return new Promise((resolve, reject) => {
//     try {
//       console.log('start a fetching: %s', fetchUrl);
//       axios.get(
//         fetchUrl,
//       )
//         .then(res => {
//           console.log('processing res...');
//           const $ = cheerio.load(res.data);
//           const postTitles = [];
//
//           $('.branch-item').each((_idx, el) => {
//             // console.log('-->', $(el).find('h4').first().text());
//             const title = $(el).find('h4').first().text();
//             const addr = $(el).find('.b-detail .b-item span').first().text();
//             const phone = $(el).find('.b-detail .b-item-more div').first().text().replace(/(\r\n|\n|\r)/gm, "");
//             const type = $(el).find('.b-detail .facilities span').first().text();
//             const availability = $(el).find('.b-detail .branchDay').first().text();
//             const location_url = $(el).find('.b-detail .mapMobileView a').first().attr('href');
//             const lat_log = location_url.split('/').slice(-1);
//             const [lat, lon] = lat_log[0].split(',');
//             // const postTitle = $(el).find('h4').text();
//             postTitles.push({
//               title,
//               addr,
//               phone,
//               type,
//               availability,
//               coordinates: [lat, lon],
//             })
//           });
//
//           resolve(postTitles)
//         });
//     } catch (error) {
//       reject();
//       throw error;
//     }
//   });
// };
//
// const processFetch = () => {
//   getDataFromNbbon()
//     .then((resJson) => {
//       console.log(resJson);
//       let resData = {
//         type: 'Feature',
//         properties: {
//           store_url: fetchUrl,
//           website: websiteUrl,
//           locators: resJson,
//         }
//       };
//       fs.writeFile('res.json', JSON.stringify(resData, null, 2), 'utf8', () => {
//         console.log('saved json file')
//       });
//     })
//     .catch();
// };

const main = () => {
  const parameterArgs = process.argv.slice(2);
  console.log('envs: ', parameterArgs);
  const filePath = `./scrapers_/scraper${parameterArgs[0]}.js`;
  console.log('file path: ', filePath);
  delete require.cache[filePath];
  // Load function from file.
  let scraperModule = require(filePath)['scraperModule'];
  // console.log('module loaded-> ', scraperModule)
  scraperModule.processFetch();
};

main();

// fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     obj = JSON.parse(data); //now it an object
//     obj.table.push({id: 2, square: 3}); //add some data
//     json = JSON.stringify(obj); //convert it back to json
//     fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back
//   }
// });
