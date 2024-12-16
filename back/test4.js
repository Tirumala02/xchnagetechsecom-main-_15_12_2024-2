const puppeteer = require('puppeteer');

async function scrapeAmazon(query) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.amazon.in/s?k=${encodeURIComponent(query)}`);
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // Parse the page here using cheerio
    const products = [];
    $('.s-main-slot .s-result-item').each((i, element) => {
        const title = $(element).find('.a-text-normal').text();
        const price = $(element).find('.a-price .a-offscreen').text();
        products.push({ title, price });
    });
    
    await browser.close();
    return products;
}
scrapeAmazon('water')
