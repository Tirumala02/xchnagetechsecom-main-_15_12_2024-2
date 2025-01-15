
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
                'Cookie': 'session-id=257-5186271-0161543; ubid-acbin=258-7440453-9716007; AMCV_5E35755F5B7C1B910A495C46%40AdobeOrg=179643557%7CMCIDTS%7C20104%7CMCMID%7C91803326462664857293820254995898386697%7CMCAAMLH-1737527220%7C12%7CMCAAMB-1737527220%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1736929620s%7CNONE%7CvVersion%7C5.5.0; mbox=session#a0771eaac02a4d4f9cbde27ef30b42f8#1736924282|PC#a0771eaac02a4d4f9cbde27ef30b42f8.41_0#1800167222; adcloud={%22_les_v%22:%22y%2Camazon.in%2C1736924221%22}; i18n-prefs=INR; lc-acbin=en_IN; session-token="4mIH5pWoQ9ShRcvQxNm1WG0J6LSL6aDUfALWCnrmcyHP3D81eciRqv8NnZ806sEVWLyA9GynfCwzB9+3QHkVkp+ysRidUdTD7QhPdvGmN3+rqdONP01ICm2VaVM6F6V88q4xlzZTcrVK9IHrak8xSL40GudepV/eXpyNOdrAMhKtkGma6uXbfeIOD2rIP7+blo3l6UI7HOSWyd4jS90pXfLNhVTUU4ijWT7ElsZwKCSaJIapGIIZK9P1aG/H0i2MaoUIRi6f7ZJttEnIH+C++TcOjfD/Dh16o+1IBpKFylD1T2+gglmnfWQE2sV6bNysryb7KbaXMnP2NAMTfFKNyaWr+qD1++gpgsuyuW7Wh3yIVSeShyJuPOzM2q2TcjSc"; x-acbin= "3PhDQSg9p5s@3V?0W2TiymoVBgMRGzTZdjgo2bbWhfufmU3uTK0LibEQVMuvPlqJ"; at-acbin= Atza|IwEBILWeatDr90VM9YKW99KsKAHwIzJDX3gIzNSGqKoaG-QETbDBuvRMUpu0yLytC5H1B8izg-E2FQfFh-zAJZC7EEKnJuAvdeLAeMzB1hiMqJxIgZJG0zSAPGFFb395svZr0VzV_UcLrIgp0201s_pu-EO1RlqrYUhLjP5EyGQGwtbzOGnIMZ9eifEkIHyQaHojQV6x2PzFrQeb2XNm8J8hZcIi5jfUaQMmuoWzlxKwX_VDtCGQV6Yz3jzsH-Wrx0z5hc4; sess-at-acbin= "LqRZNQl3mYC7ONpucY5qcsnG2WG6RBE60cuw90MemzQ="; sst-acbin= Sst1|PQHVupVX2FZS7_1Lfvwd-j5rDB208SjZ81w_oW0TtwYJUedHGhC8w2g92TAU19VsExikrM0zZWgGUO48ANJ34jP9e8dHpVzmMDZl2Jy98_7BhW2SCOk6sGjO4pX3QJYvYzKGLr7kV0waG_4n2aL9i9AdmJZgExR9nTya1GQ7mJvoQmj0By8fD08ex2_Hk_Fsf77yxtktEvhwCNI46Qx4cMLNuCXHDQLecvdVyr-6cpi2yc8J0sdk7nq-d3kJ5tsyXOurUgmqLXcFez_UqTWVlaF7dQP2ltTyxSB36ucmcTvo8OBFQg7ZMGb0Y4ZTzHQv2_E8pGDgNzWWyRQaUuzqeFj8Y4i8s780dSXhXnhwARHrauk; session-id-time=2082787201l; sp-cdn=J4F7; ',
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
