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
                'Cookie': 'session-id=257-5186271-0161543; ubid-acbin=258-7440453-9716007; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20104%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1737527220%7C12%7CMCAAMB-1737527220%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1736929620s%7CNONE%7CvVersion%7C5.5.0; mbox=session#a0771eaac02a4d4f9cbde27ef30b42f8#1736924282|PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800167222; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1736924221%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="4mIH5pWoQ9ShRcvQxNm1WG0J6LSL6aDUfALWCnrmcyHP3D81eciRqv8NnZ806sEVWLyA9GynfCwzB9+3QHkVkp+ysRidUdTD7QhPdvGmN3+rqdONP01ICm2VaVM6F6V88q4xlzZTcrVK9IHrak8xSL40GudepV/eXpyNOdrAMhKtkGma6uXbfeIOD2rIP7+blo3l6UI7HOSWyd4jS90pXfLNhVTUU4ijWT7ElsZwKCSaJIapGIIZK9P1aG/H0i2MaoUIRi6f7ZJttEnIH+C++TcOjfD/Dh16o+1IBpKFylD1T2+gglmnfWQE2sV6bNysryb7KbaXMnP2NAMTfFKNyaWr+qD1++gpgsuyuW7Wh3yIVSeShyJuPOzM2q2TcjSc"; x-acbin= "3PhDQSg9p5s@3V?0W2TiymoVBgMRGzTZdjgo2bbWhfufmU3uTK0LibEQVMuvPlqJ"; at-acbin= Atza|IwEBILWeatDr90VM9YKW99KsKAHwIzJDX3gIzNSGqKoaG-QETbDBuvRMUpu0yLytC5H1B8izg-E2FQfFh-zAJZC7EEKnJuAvdeLAeMzB1hiMqJxIgZJG0zSAPGFFb395svZr0VzV_UcLrIgp0201s_pu-EO1RlqrYUhLjP5EyGQGwtbzOGnIMZ9eifEkIHyQaHojQV6x2PzFrQeb2XNm8J8hZcIi5jfUaQMmuoWzlxKwX_VDtCGQV6Yz3jzsH-Wrx0z5hc4; sess-at-acbin= "LqRZNQl3mYC7ONpucY5qcsnG2WG6RBE60cuw90MemzQ="; sst-acbin= Sst1|PQHVupVX2FZS7_1Lfvwd-j5rDB208SjZ81w_oW0TtwYJUedHGhC8w2g92TAU19VsExikrM0zZWgGUO48ANJ34jP9e8dHpVzmMDZl2Jy98_7BhW2SCOk6sGjO4pX3QJYvYzKGLr7kV0waG_4n2aL9i9AdmJZgExR9nTya1GQ7mJvoQmj0By8fD08ex2_Hk_Fsf77yxtktEvhwCNI46Qx4cMLNuCXHDQLecvdVyr-6cpi2yc8J0sdk7nq-d3kJ5tsyXOurUgmqLXcFez_UqTWVlaF7dQP2ltTyxSB36ucmcTvo8OBFQg7ZMGb0Y4ZTzHQv2_E8pGDgNzWWyRQaUuzqeFj8Y4i8s780dSXhXnhwARHrauk; session-id-time=2082787201l; sp-cdn=J4F7; ',
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
