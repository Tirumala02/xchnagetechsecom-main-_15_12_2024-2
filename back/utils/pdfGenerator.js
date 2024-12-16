

import PDFDocument from 'pdfkit-table';
import fs from 'fs';
import { format } from 'date-fns';
import numberToWords from 'number-to-words';
import axios from 'axios';


function convertToRupeeFormat(number) {
    // Split the number into integer and decimal parts
    const [integerPart, decimalPart] = number.toString().split('.');

    // Convert the integer part to words in Indian numbering system
    const integerInWords = convertToIndianWords(Number(integerPart));

    // Convert the decimal part (if any) to words
    const decimalInWords = decimalPart
        ? decimalPart.split('').map(digit => numberToWords.toWords(Number(digit))).join(' ')
        : null;

    // Form the rupee string
    let result = `${integerInWords} rupees`;
    if (decimalInWords) {
        result += ` and ${decimalInWords} paise`;
    }

    return result;
}

function convertToIndianWords(number) {
    const units = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['thousand', 'lakh', 'crore'];

    if (number === 0) return 'zero';

    const words = [];
    let num = number;

    if (num >= 10000000) {
        words.push(convertToIndianWords(Math.floor(num / 10000000)), scales[2]);
        num %= 10000000;
    }
    if (num >= 100000) {
        words.push(convertToIndianWords(Math.floor(num / 100000)), scales[1]);
        num %= 100000;
    }
    if (num >= 1000) {
        words.push(convertToIndianWords(Math.floor(num / 1000)), scales[0]);
        num %= 1000;
    }
    if (num >= 100) {
        words.push(units[Math.floor(num / 100) - 1], 'hundred');
        num %= 100;
    }
    if (num >= 11 && num <= 19) {
        words.push(teens[num - 11]);
    } else if (num >= 10) {
        words.push(tens[Math.floor(num / 10) - 1]);
        num %= 10;
    }
    if (num >= 1 && num <= 9) {
        words.push(units[num - 1]);
    }

    return words.join(' ');
}

// Function to fetch the HSN code from Python API
async function fetchHSNFromPython(query) {
    console.log("fetchHSNFromPython: " + query)
    try {
        const response = await axios.post('https://xchange-1.onrender.com/get-hsn-code/', {
            query: query  // Send the query as JSON in the request body
        });
        console.log("response.data");  // Log the response to inspect it
        console.log(response.data);  // Log the response to inspect it
        return response.data.hsn_code;  // Return the HSN code from the response
    } catch (error) {
        console.error('Error fetching HSN code:', error);  // Log any error
        return "not_found";  // Return a default value in case of an error
    }
}

// Function to get HSN code by category
const getHSNCodeByCategory = async (categories, hsnData) => {
    if (!Array.isArray(categories) || categories.length === 0) {
        return "N/A";  // Return "N/A" if the categories array is empty or invalid
    }

    const lastCategory = categories[categories.length - 1];
    console.log("lastCategory")
    console.log(lastCategory)
    if (!lastCategory) {
        return "N/A";  // Return "N/A" if no valid category name is found
    }
    // Flatten the table cells and search for the category name
    const tableCells = hsnData.info.flatMap(info =>
        info.tables.flatMap(table => table.tableCells)
    );

    for (const row of tableCells) {
        const descriptionCell = row.find(cell =>
            cell.text && cell.text.trim().toLowerCase() === lastCategory.toLowerCase()
        );
        if (descriptionCell) {
            const hsnField = row[1];  // Assuming the second column contains the HSN code
            return hsnField?.text || "N/A";  // Return the HSN code if found, otherwise "N/A"
        }
    }

    // Fetch HSN code from the Python API if not found locally
    try {
        const pythonHSNCode = await fetchHSNFromPython(lastCategory);  // Await the promise
        // console.log("Python HSN Code:", pythonHSNCode);  // Log the fetched code
        return pythonHSNCode !== "not_found" ? pythonHSNCode : "N/A";  // Return the code or "N/A" if not found
    } catch (error) {
        console.error("Error resolving Python HSN Code:", error);  // Log any errors
        return "N/A";  // Return "N/A" if there's an error during the fetch
    }
};

// PDF generation function
const generateQuotationPDF = async (order, address, gstDetails) => {
    console.log("PDF GeN gstDetails")
    console.log(gstDetails)
    let totalPrice = 0
    let iTotalPrice = 0

    return new Promise(async (resolve, reject) => {
        try {
            const hsnData = JSON.parse(fs.readFileSync('./utils/HSN_SAC.json', 'utf-8'));
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.font('Helvetica').fillColor('black');
            
            doc.on('data', buffers.push.bind(buffers));  // Collect PDF data into the buffer
            doc.on('end', () => resolve(Buffer.concat(buffers)));  // Resolve with the complete PDF buffer

            // Header Section
            doc.image('utils/logo.png', 50, 30, { width: 80 });
            doc.fontSize(18).text('QUOTATION', { align: 'center', underline: true }).moveDown();
            doc.fontSize(12)
                .text('XCHANGETECHS STAR ALLIANCE LLP', { align: 'center' })
                .text('GSTIN: 29AAAFX1191P2ZJ    PAN: AAAFX1191P', { align: 'center' })
                .text('LUT ARN: AD2903240527422', { align: 'center' })
                .text('# 459, 2nd Floor, KIRAN Towers, Koramangala, HSR Layout 5th Sector, Bengaluru, Karnataka, 560034', { align: 'center' })
                .text('Email: accounts.payable@xchangetechs.com', { align: 'center' })
                .moveDown(2);

            // Quotation Details
            const currentDate = new Date();
            const expiryDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            doc.fontSize(12)
                .text(`Quotation #: ${order.orderId}`, 50)
                .text(`Quotation Date: ${format(currentDate, 'dd MMM yyyy')}`, 50)
                .text(`Due Date: ${format(expiryDate, 'dd MMM yyyy')}`, 50)
                .moveDown(2);

            // Customer Details
            doc.fontSize(12).text('Customer Details:', { underline: true });
            doc.text(`${gstDetails.legalName}, ${gstDetails.isSEZ ? 'SEZ Unit' : ''}`)
                .text(`GSTIN: ${gstDetails.gstNumber}`)
                .moveDown(1.5);

            doc.fontSize(12).text('Billing Address Details:', { underline: true });
            //Legal Name-GST NUMBER-
            doc.text(gstDetails.billingAddress, 50)
                .moveDown(1.5);


            // Shipping Address
            doc.text('Shipping Address:', { underline: true });
            doc.text(`${address.street}, ${address.city}, ${address.state}, ${address.zipcode}`, 50)
                .text(`${address.country}`)
                .moveDown(2);

            // Build Table Rows with HSN Codes
            const tableRows = [];
            for (const item of order.items) {
                console.log("item.category:\n");
                console.log(item);
                const hsnCode = await getHSNCodeByCategory(item.category, hsnData); // Await the promise here

                tableRows.push([
                    item.title,
                    hsnCode,
                    item.quantity,
                    `${item.price.toFixed(2) || item.price_upper.toFixed(2)}`,
                    `${(item.quantity * (item.price_upper || item.price))}`,
                ]);
            }


            // Total Amount
            //    console.log('type of:')
            console.log((order.items) + '\n')
            // const totalAmount = order.items.reduce((sum, item) =>{
            //      (sum + item.quantity * item.price, 0)
            //     }
            // );

            // Table Header and Rows
            const table = {
                title: 'Order Details',
                headers: ['Item Name', 'HSN Code', 'Quantity', 'Unit Price', 'Amount'],
                rows: tableRows,
            };

            // Render Table
            doc.table(table, {
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(10),
            });

            // Total in Words
            doc.moveDown();
            console.log('totalAmount in pdfGen')
            const totalAmount = order.items.reduce((sum, item) => sum + item.quantity * item.price, 0) + (order.deliveryCharge || 0);

            console.log(totalAmount)
            doc.moveDown();
            const totalInWords = `Total (in words): ${numberToWords.toWords(totalAmount).toUpperCase()} RUPEES ONLY.`;
            doc.text(`Total: ${totalAmount.toFixed(2)}/-`);
            doc.text(`Total Items / Qty: ${order.items.length} / ${order.items.reduce((sum, item) => sum + item.quantity, 0)}`).moveDown(2);

            doc.text(totalInWords, 50).moveDown();

            // Bank Details
            doc.text('Bank Details:', { underline: true }).moveDown();
            doc.text('Bank: ICICI Bank').text('Account #: 428405001856').text('IFSC Code: ICIC0004284').text('Branch: B NARAYANAPURA').moveDown();

            
            // Notes and Terms
            doc.text('Notes:', { underline: true }).text('Looking forward to your business!').moveDown();
            doc.text('Terms and Conditions:', { underline: true });
            doc.fontSize(10)
                .text('1. Supply meant for SEZ under LUT without Payment of Integrated Tax.')
                .text('2. Prices Quoted are in INR.')
                .text('3. Payment terms: Immediate.')
                .text('4. Packing and Delivery Charges: As applicable at actuals.')
                // .text('5. Delivery lead time: 4-5 weeks from the date of PO.')
                .text('5. Proposal validity: Quote valid till 7 days from issue date.')
                .moveDown(2);

            // Authorized Signatory
            doc.text('This is a computer-generated quotation and does not require a physical signature.');

            // Finalize document

            // Finalize document
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export default generateQuotationPDF;
