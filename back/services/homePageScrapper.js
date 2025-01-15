import axios from 'axios';
import * as cheerio from 'cheerio';

async function searchAmazonNewReleases() {
    try {
        // Amazon New Releases URL
        const url = `https://www.amazon.in/gp/new-releases/electronics`;

        // Make a request with the appropriate headers
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Cookie': 'session-id=262-6056897-5987938; ubid-acbin=258-5332390-7652227; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20104%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1737527220%7C12%7CMCAAMB-1737527220%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1736929620s%7CNONE%7CvVersion%7C5.5.0; mbox=session#a0771eaac02a4d4f9cbde27ef30b42f8#1736924282|PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800167222; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1736924221%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="ZnVBWK4HH4/yMlA0bTOKuilja7Z4Pt0Xe+06pPvU52FOxuviS9xCIxWkkRGDQsLVt71UrDVENSf6WCt5tA3hOZ8AcVusRBVuwXLiYVVbisnCYayliOTEENlTgRMsRgLJ61nfig6cA6hdQMkdMVDgBiM9UiWt2B+CAA++2uRGYyOdPWvTBMZ3E7UfJvRtsJ0MfWifP/u/tt711oNLHUid7lDtbuUrVZ6ULiYxwBDk0xLI3EaKyHtFD82ZIgG0xt+/CvOjxUkxIoh3c49DhWUdwO0Bw5CtJf2b69T3lyoxewyfuLa3T5TO9utN+iD29qao6lnnqxKo7ilH242CC7tcT+4oOAgDkUGUvkqljyfmA/nWu0NEjhPbS16njzqcJEE3"; x-acbin="Qi34kZPPjdbeLaNifO0Q?gpQICSBU3BwUefnWuI1yBy7TC0zJsBE3MfLLlZ2qXuU"; at-acbin=Atza|IwEBICpZ8lf9PFrtbiGVgz4jRtB8mbQeXQBLSD82E1omabDXYeTmK4HrueN0Cq3Ck4GYON2uYaeNSE1q2by9p5u57VAVtUnBGh4YXCABrkUi0JyaLpjtFzLBnWnlWNVyB4VBirMho4AxjARC9o5yhpvmCEDuQsVNvCAqSlXAhjvyq05FJFy5qJwj64rL3iQngsUE9854T5vyJwXgnITaPJMVHZpq8yYNDEby0WD2aLVJ3oO87w; sess-at-acbin="vcApIogVYH0di27MOGLBOqdm7UjoLY3Tyddg0iElSvI="; sst-acbin=Sst1|PQFQ7F8K1AiHqM0XdrBOCtNnCUy4B7e9dOL2GRnxPNhcjHluWxG-zukOzlbrxRgldOuA0vM0bTVyDVojRx_YPW1uSnmW-OyBSNEfr3vp8puGZyr_1U8WYtEtSQ_1zt5GGNq8gCm8kaC2JQnI8qeathzgcjuSWBam1yro_kXesrBavnEI8CuCUv5MFlOe_lriUiEwsADyX9bySp2KRjKOIVOaM7vA1Stj3s70cp0TbZgum0YSfzrVSb8u94OmjmxuXQQMjhGlEZ1zo1yil1frBp5B1e-zbqlmd1Lf_Te5klHMlsw; session-id-time=2082787201l; sp-cdn=J4F7; ', // Add all relevant cookies here

            },
        });

        const $ = cheerio.load(data);
        const products = [];
        $('#gridItemRoot .p13n-sc-uncoverable-faceout').each((index, element) => {
            const title = $(element).find('div .a-link-normal').text().trim();
            const price = $(element).find('div div').next().next().next('div').find('a-link-normal a-text-normal').text().trim();
            // const image = $(element).find('img').attr('src');
            // const link = 'https://www.amazon.in' + $(element).find('.a-link-normal').attr('href');
            // const rating = $(element).find('.a-icon-alt').text().trim();
            
            // You can extract the delivery date if available in a specific part of the HTML
            // const deliveryDate = $(element).find('.a-color-secondary').text().trim(); // Adjust the selector if needed

            // if (title && price && image && link) {
                // products.push({ title, price, image, link, rating, deliveryDate });
                products.push({ title,price });
            // }
        });

        // Display the results
        if (products.length > 0) {
            console.log('Found Products:');
            products.forEach(product => {
                console.log(`Title: ${product.title}\n`);
                console.log(`Price: ${product.price}`);
                // console.log(`Delivery Date: ${product.deliveryDate || 'Not available'}`);
                // console.log(`Image URL: ${product.image}`);
                // console.log(`Product Link: ${product.link}\n`);
            });
        } else {
            console.log('No products found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Run the function to scrape the New Releases page
searchAmazonNewReleases();
