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
                'Cookie': 'session-id=262-3100388-0522949; ubid-acbin=262-0893701-3909251; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20104%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1737527220%7C12%7CMCAAMB-1737527220%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1736929620s%7CNONE%7CvVersion%7C5.5.0; mbox=session#a0771eaac02a4d4f9cbde27ef30b42f8#1736924282|PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800167222; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1736924221%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="tWAVCoXAMMaJOvKDNpPfmbS5O7h1Uxz+L0Q1tQ6ZUtgM+mwpq4qwG9n6bbXTPsN6ruFUdjNATJ4oA0RJBc4n4pDVxaDFBUHw010ddCaxLYpu4940UYx6u2pHklzGaEGCFOLEwQHq6EuQGorUxgVVKSykMTwLv2cHj2OHdpFYYt18fQMxXUEXU9jYZTKWtiLcpqDnUM2c/F7NbFMqcCvy3wJtz1vkNTVs8cgOtW+VMM/itcg7K0KB/Yzp655F2FM7db5jSiOXAJDSbqNfExcFgg6dcqTZk+c35i2xlR3dNNfHaqpJwy+6ciP1W1PI/2p+8MhVXAc3/VHpZaKN/XgYyKyDqPcNFOvjhiOn3ShTmxxj3E59AnN1j0nF3Lkm2l5l"; x-acbin="3TnW0QqQycmyvA2Vt9UgN@v6llH@Dh96ovxIBwAoESQ4JIOV22jP1i?4YisTa0ea"; at-acbin=Atza|IwEBIJoJhrv10onBJOPPFs3cMjcoQW1MwDG-SyiQUgkPDOv5-4Luv3x0KAey6NrR0KO1uS5qL2qu-giHrDSwiF1zJPlfpiw0OUN2d6a3CaxrdazcizKstDNN5-6blhfO8iI1c9RrL9V8_wg4OnGeLTbZ5b8JiTyVWZ4dN381CYzIbWh2MGr5oxR1DrG7NotobELhP9coP7iHjIPEMWilR398g5hpB2FrFIN0YcXrtVT7FNutcg; sess-at-acbin="iC0gzYw9AhJo/GEev82clHZ02/6uUsH/mc/4SSDsCVM="; sst-acbin=Sst1|PQGekdE0Fuenc0cU_ARj7SQOCRVozqPtbyXfEsR6SGW_XwApLwbGj3vG_IPPgdcV1YQG3yAFoXhlL3UhPTDUPq5NcBoXyOo7FO5hJw7WaTEyoKNbNr3MLeWPcAiHfWTLfMRV4RuXFUS2hJxifUm4of0TNomUk5bOvj-1INPyGnZklCRI7UwVAxbtQL7Ah2iTtQZMJ9MNVb7C_Gu1EA2MSFI_gpzURDW-xfUoxCi2gVTRw4VXQu4g_C4rVt9imCCZY2f_uM0tpFht8YU9wYMtBPe4dnIdAiw5dnjF4jqM6RwuOxg; session-id-time=2082787201l; sp-cdn=J4F7; ', // Add all relevant cookies here

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
