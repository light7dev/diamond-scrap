import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
const { convertArrayToCSV } = require('convert-array-to-csv');

const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const scrapInfo = {
  website_url: `https://www.bluenile.com/`,
  name: `;)`,
};

async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight - window.innerHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 10);
      });
  });
}

const fetchSource = () => {
  
  return new Promise(async (resolve,reject) => {
    try {
        const entities =[];
        const browserURL = 'http://127.0.0.1:21222';
        const browser = await puppeteer.connect({browserURL});
        // const browser = await puppeteer.launch({
          //     headless: false
          // })
            const page = await browser.newPage()
            await page.setViewport({
              width: 1200,
              height: 800
            });
            await page.setRequestInterception(true);
            page.on('request', (request) => {
              if (request.resourceType() === 'video'||request.resourceType() === 'image') {
                request.abort();
              }
              else {
                request.continue()
              }
            })
            page.goto(scrapInfo.website_url,{
              waitUntil: 'networkidle2',
              timeout: 0
            })
            await page.waitForSelector('.diamond_shape', {timeout: 100000});
            var html = await page.evaluate(() => {
              return document.body.innerHTML
            })

            const $ = cheerio.load(html);
            const items=[];
            $('.diamonds .diamond_shape > li').each((_idx, el) => {
              var item =$(el).find('a').eq(0);
              const link = item.attr('href')
              const name = item.text();
              items.push({
                name,
                link,
              })
            })
            for(var i = 8; i<items.length; i++){
              // if(i===1||i===2||i===3||i===7||i===9||i===5){
                const entity=[];
                console.log(items[i].name)
                await page.goto(items[i].link,{
                    waitUntil: 'networkidle2',
                    timeout: 0
                  })
                  await page.setViewport({
                    width: 1200,
                    height: 800
                  });
                  try{
                  await new Promise((rs, rj)=>{setTimeout(()=>rs(), 3000)})
                  await autoScroll(page);
                  await page.waitForSelector('.grid-alert', {timeout: 1000});
                  html= await page.evaluate(() => {
                    return document.body.innerHTML
                  })
                  const __$=cheerio.load(html);
                  var gb = __$('.grid-body').eq(0);
                  var grs = gb.find('.grid-row');
                  console.log(grs.length);
                  for(var j = 0; j < grs.length; j++) {
                    var r =[]
                    r.push(__$(grs[j]).find('.shape').eq(0).text())
                    r.push(__$(grs[j]).find('.price').eq(0).text())
                    r.push(__$(grs[j]).find('.carat').eq(0).text())
                    r.push(__$(grs[j]).find('.cut').eq(0).find('span').eq(0).text())
                    r.push(__$(grs[j]).find('.color').eq(0).text())
                    r.push(__$(grs[j]).find('.clarity').eq(0).text())
                    r.push(__$(grs[j]).find('.date').eq(0).text())
                    entities.push(r)
                  }
                }catch (e){
                  console.log(e)
                }
              // }
              break;
            }
            // browser.close()
            resolve(entities)
        
    } catch (error) {
     reject(error)
      throw error;
    }
});
};

const processFetch = () => {
    fetchSource()
    .then((data) => {
      const header = ["Shape","Price","Carat","Cut","Color","Clarity","Delivery Date"];
      let csvdata = convertArrayToCSV(data, {
        header,
        separator: ','
      })
      fs.writeFile('./results_/result.csv', csvdata, 'utf8', () => {
        console.log('saved json file')
      });
    })
    .catch();
};

export const scraperModule = {
  processFetch
};
