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
                'Cookie': 'session-id=260-5885697-2340514; ubid-acbin=258-8888319-6704052;  mbox=PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800194344|session#41940a9883ec47078b650d52738b1e30#1736951404;   i18n-prefs=INR; lc-acbin=en_IN; session-token=8YmJGhLiFGT4IfhfDQyZkXDx5sXdJnpjrIUnez0ELVDQr8oE/DJDHYO//5ROOCMB+SlQRgUQ92oC0oMN3QQfzCa89PpRQeMoiXQNTWyUiA479x1ZPHF6pPRipms0S77PGUl4EqjxSuyeUna6IdzVcE9yb53uXYZmgIqyrYcgte+WmPeuqhbflafwh8157hzLPjWmiTMTXJBlbAjCCq2PbslbUGz5oACRu92l8ezwfSqYY/NN9psxGPIgEfh6uYS1UZrfjKlpMcXoTQA87QF5zTRR19XyoYVYTbPaMwx7s8YcdwTahVyNqDqjwuM5hPMx7GMFRifhYT/fYi1R0v2eiWA29X6k+DhMVYILQCjzFf9aUJUQ6G56bvZnXU0xO/CU; x-acbin="TbFygNU8AMzSneprfNnuyg8TbIJi79teIoLCMPkSP6QNjbCGZSQYB9Mo@DpwWwZy"; at-acbin= Atza|IwEBIL1JptvG9emJP2e3dGG__ycMihjoV8bZKjxeos9gND6VPYtdH174klYEJJBEDh7K3KghvGJur257WigyUUjtmM4QV5itNYEkbeVtY1b6IRPn1jQs5KA2nNXPePgDTRbfi70i_OmjkwO2kbykYW5EDNk1b3mJTEj2-j5zYqvoBu9P3RzopXuiEV2KyGy4o121oumUQwvdylYNjemKCtpqQ8qCCDWLzl27IqQsoqhUIbRajw; sess-at-acbin="O0GdhlOf5abf4jA+y+uPzK7c046Ywc1zarHPlijuhZU="; sst-acbin=Sst1|PQFxmkHir35Iopwrfx1j9mReCUG0SCsqT9lqgbQZ8bUPolPO09uI3cygFlP5pxUgovg3Anxqtktb7lPJKr887Sr6oxgOBI4zaUSlLzRuX7iSPlluIwrv3SG4MF7T43pmWCZHECUPKIWjq5QnYjj7AH_MCecLfr-JvWnerbvy3GnLeiSfqzjD8qqZrua98ronDsoxVvszcHLbd_4yF8XNGHs_KcIKyNO9HtrUHVxS7IfB8R7sWkVwQDUpSKqSDHG1cTNJOTDqaMAXXkJNxT04yL7RaAqtwmeBdnxWUlkys_OwYMI; session-id-time=2082787201l; sp-cdn=J4F7; ',
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
            products.push({ title, price });
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
