
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
                'Cookie': 'session-id=260-5885697-2340514; ubid-acbin=258-8888319-6704052; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557|MCIDTS|20104|MCMID|91803326462664857293820254995898386697|MCAAMLH-1737554343|12|MCAAMB-1737554343|RKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y|MCOPTOUT-1736956743s|NONE|vVersion|5.5.0|MCCIDH|545471373; mbox=PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800194344|session#41940a9883ec47078b650d52738b1e30#1736951404; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1736951344%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token=8YmJGhLiFGT4IfhfDQyZkXDx5sXdJnpjrIUnez0ELVDQr8oE/DJDHYO//5ROOCMB+SlQRgUQ92oC0oMN3QQfzCa89PpRQeMoiXQNTWyUiA479x1ZPHF6pPRipms0S77PGUl4EqjxSuyeUna6IdzVcE9yb53uXYZmgIqyrYcgte+WmPeuqhbflafwh8157hzLPjWmiTMTXJBlbAjCCq2PbslbUGz5oACRu92l8ezwfSqYY/NN9psxGPIgEfh6uYS1UZrfjKlpMcXoTQA87QF5zTRR19XyoYVYTbPaMwx7s8YcdwTahVyNqDqjwuM5hPMx7GMFRifhYT/fYi1R0v2eiWA29X6k+DhMVYILQCjzFf9aUJUQ6G56bvZnXU0xO/CU; x-acbin="TbFygNU8AMzSneprfNnuyg8TbIJi79teIoLCMPkSP6QNjbCGZSQYB9Mo@DpwWwZy"; at-acbin= Atza|IwEBIL1JptvG9emJP2e3dGG__ycMihjoV8bZKjxeos9gND6VPYtdH174klYEJJBEDh7K3KghvGJur257WigyUUjtmM4QV5itNYEkbeVtY1b6IRPn1jQs5KA2nNXPePgDTRbfi70i_OmjkwO2kbykYW5EDNk1b3mJTEj2-j5zYqvoBu9P3RzopXuiEV2KyGy4o121oumUQwvdylYNjemKCtpqQ8qCCDWLzl27IqQsoqhUIbRajw; sess-at-acbin="O0GdhlOf5abf4jA+y+uPzK7c046Ywc1zarHPlijuhZU="; sst-acbin=Sst1|PQFxmkHir35Iopwrfx1j9mReCUG0SCsqT9lqgbQZ8bUPolPO09uI3cygFlP5pxUgovg3Anxqtktb7lPJKr887Sr6oxgOBI4zaUSlLzRuX7iSPlluIwrv3SG4MF7T43pmWCZHECUPKIWjq5QnYjj7AH_MCecLfr-JvWnerbvy3GnLeiSfqzjD8qqZrua98ronDsoxVvszcHLbd_4yF8XNGHs_KcIKyNO9HtrUHVxS7IfB8R7sWkVwQDUpSKqSDHG1cTNJOTDqaMAXXkJNxT04yL7RaAqtwmeBdnxWUlkys_OwYMI; session-id-time=2082787201l; sp-cdn=J4F7; ',
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
