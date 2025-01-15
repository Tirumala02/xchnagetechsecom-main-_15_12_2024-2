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
                'Cookie': 'session-id=260-3124270-2308463; ubid-acbin=262-8903529-8818126; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg= 179643557%7CMCIDTS%7C20104%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1737523595%7C12%7CMCAAMB-1737523595%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1736925995s%7CNONE%7CvVersion%7C5.5.0%7CMCCIDH%7C545471373; mbox= PC#3b54445e15c94b729752408c2ba856ee.41_0#1800163874|session#ce9379aaf0a4433c8395714d540191a1#1736920934; i18n-prefs=INR; lc-acbin=en_IN; session-token "mH95/3u2VI1imaxDs7NRwBiIfFW91KVD2jZDFTN93ZEVRDhmPeurX05XE9I8ji6Z+fxkWIBhZNm+4U4k3WKUUC1b+qjhAscY5FMIDU8EinCNfvBnXH1v0bqXXqMy1lvvBd/ebusC3/RIcVE6Mh7Uo2qMZGEXktrdaDQwDpH3j2pMuUrNETO2nEIesdNyK/2xTxdCozbJZK/WwaXVfPBPqInFtH13K2WbnGe+pK/kftReb+jxjpwLM9Vq9ZR3cIvI+Iy+Waq5KlZ//ONkad7PbN3xbzs3HX1ilWYRQR9y6ZNZCAVoKNuQkPP+m0W2oDEyEqA2qgm7KWj6C6zK1Xu7BResQEI1a+dYjw/QPhQlbO6KFWuMC0y1hw=="; x-acbin= "53lQF3YE2@KKjYDP2JbrZT9udQnTEPhL6Ehq34cBEtoz@ijstj91XknhowrbMcbP"; at-acbin= Atza|IwEBIBbA_WZmIWg6z_sPdHcj9ZhtcyO3xm94hWVaEo2_Wdb5Xo78y7BjOGB0HI7Q-fxmjOo2AHtPnLrHU61imGBrvfTP10crvnifCyTDRatfks7ubkiebh0fzEgTN9liC-UJgdMgvvn4RWbKLeiVux_hQ3shmsm7sVI5GgPjbwuuFOy3tttA-3tvU4PO-meG1fOdQCkKapr30SLO9YD-L5hgRPcLPPxsxn0elu1jep0_5heIig; sess-at-acbin="xqPjIbXNyn5wCif1KjN5VpEpH/5CLq0oN7QPbM40ncA="; sst-acbin= Sst1|PQHbujB9CCzuwjVoYzMbMax1CXFWuaHfYTLtDOthW-kiicKVzzgWx9Ms8sGrwHHXb4tV1BRpn7sc3rjEzdNrhhvMRF9P6Gd3SjmGzznQtFYNnQ6uWIileZlgRKwI1J8UfllQ_tFEPVE_AwBziMCn0UyATh0nAlqfGGiVqJ_Fduzk-gRrsz8x9MaiWc8XhFriq8k70D0kt0zefSLraraqO0BpqjAFx-yt0tpLR6uK_8RhMkKubudcu3cVLuY9Rw051CATgO--5DScIWi7D7w-x1e-ztDJnU4R3-gcMLgSN6Hpb9c;sp-cdn=J4F7; ',// Add all relevant cookies here
            },
        });

        const $ = cheerio.load(data);

        // Scrape product details (title, price, image, delivery date)
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
