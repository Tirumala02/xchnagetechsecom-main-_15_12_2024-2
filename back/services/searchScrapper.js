
import axios from 'axios';
import * as cheerio from 'cheerio';
import 'dotenv/config'


const backendUrl = process.env.BACKEN_URL

async function searchAmazonQuery(query) {
    
    try {

       
        const response = await axios.get('https://xchnagetechsecom-main-15-12-2024-2.onrender.com/api/admin/value-changer'); // Adjust the URL as needed
        if (!response.data.success) {
            throw new Error(response.data.message || "Failed to fetch addPercentage value.");
        }
        // const  addDeliveryBuffer= response.data.values.deliveryLeadTime.value;
        const addPercentage = response.data.values.priceMargin.value;
        console.log('addPercentage : ',addPercentage)

        const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;

        // Make a request with the appropriate headers, including the session cookies
        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Cookie': 'session-id=257-4517540-8932521; ubid-acbin=260-0108776-0537347; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557|MCIDTS|20104|MCMID|91803326462664857293820254995898386697|MCAAMLH-1737554343|12|MCAAMB-1737554343|RKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y|MCOPTOUT-1736956743s|NONE|vVersion|5.5.0|MCCIDH|545471373; mbox=PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800194344|session#41940a9883ec47078b650d52738b1e30#1736951404; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1736951344%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token=ocx421hzY/KuXxnRzwFxbruZ8SedYIs0XOfQMkMitf+vqz3f8jITDvo8gZPF8BE0nnyylnJREzMIRXbKL1RQjIaqk7AwD0Jx0FHCvJmcm243Rgle0Jj3+ozGB1U7tsg+0odAMIiZiCGHAfs8wV/wMrROLwbjmxgdss12v+HJ4usIbvRn40G50pt4Yano6ju/MTxSY/zfWZ57G89oPbuRb8mxLhsr/6m6l1N+a48AX4rLDSmWlwIbXvtZxweoul6Zi0D3NBCJNx7c7xgpdFcW0dDPfn6ONSMck5rIo2eboKO6d21dV3uW4v7o6l7K82DV+fum7yETvahG5AvsRUEKGxZBsK4rS9Rw7Ezy1RFGhfHVxbQL4geo7g==; x-acbin="HSdVsOZd3?9g@ER0CmiqS?BlXkJdi@lOpmHPPExC2YMAi7ylOm9oTa8MVnIIYqyN"; at-acbin= Atza|IwEBIGzuyHIbf1iIBBO6S5qJZLmaiQEofdzylZ4FQE8gX2QRA8h3N-D9qbujK77a-BF76SgEE7_vKHxhtSK_Rf7-GvPKhAiCX5iLvI_iap94sfNQfjm94xY8EewqEoy0BLsci_-iErascYKm2IQUY7-Ql_FpIQMb6AQVBsm2yI3CReukFmH-p8kvBcXbXrWYC0JQj4LCOaWaunti-2wUhG93hiV19iWcE9sUTcRsXxSN9iZGPw; sess-at-acbin="tYsVGzF3vqSXPU7tBDUuGejZg++U/oObuM1tIz5drvQ="; sst-acbin=Sst1|PQEB00A_NblwEP_-Q0BQh5FPCX6LBTbloOhp6dEAfOhW8sptiGsX6M_oceh-kIZZHMxPBXSZtXios4N8BErG4hNEVUTnQ6Ab7B7P4L_r_4OVSlbRQFyWsFllqOINjoFWxqea4xaM2HTbHrAgrZb1I0p4HdjAozNJUxcLgtsT6m133dC04W0TEKhw1S8aIeNWWwSNp1HT-YFEwqDf7VuBYs12bg0O3YIGWL8SjN4DbbqisHVWr3yWgUZHrH6k2Kvl0oow67Y0Uwomskkh2qWPRFKGthyl0EWh3LY4R4ZuCKMU4NU; session-id-time=2082787201l; sp-cdn=J4F7; ',
            },
        });

        const $ = cheerio.load(data);

        // Scrape product details (title, price, link)
        const products = [];
        $('.s-main-slot .s-result-item').each((index, element) => {
            const title = $(element).find('.a-text-normal h2').text().trim();

            let price = $(element).find('.a-price .a-offscreen').first().text().trim().replace('₹', '');
            price = price.replace(/,/g, '')
            price = parseFloat(price);
            price = Math.round((price + price * (addPercentage / 100)) * 100) / 100;
            
            let iprice = $(element).find('.a-price .a-offscreen').eq(1).text().trim().replace('₹', '')
            iprice = iprice.replace(/,/g,'');
            iprice = parseFloat(iprice);
            iprice = Math.round((iprice + iprice * (addPercentage / 100)) * 100) / 100;

            const image = $(element).find('.s-image').attr('src');
            const link = 'https://www.amazon.in' + $(element).find('.a-link-normal').attr('href');
            // Skip sponsored items by checking for '/sspa/click?' in the URL
            if (link.includes('/sspa/click?')) {
                return;
            }

            const asinMatch = link.match(/\/dp\/([A-Z0-9]{10})/);  // Extract ASIN from the product link
            const asin = asinMatch ? asinMatch[1] : null;
            // Try to extract the category from the breadcrumb or other elements
            // const category = $(element).find('.a-row.a-size-base.a-color-secondary').text().trim(); // Adjust selector if needed

            if (title && price && image && link && asin) {
                products.push({ title, price, iprice, link, image, asin });
            }
        });

        // Display the results
        if (products.length > 0) {
            return products
        } else {
            console.log('No products found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Example: Search for "smartwatch"
export default searchAmazonQuery;
