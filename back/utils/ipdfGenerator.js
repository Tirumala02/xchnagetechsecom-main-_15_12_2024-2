import PDFDocument from 'pdfkit-table';
import fs from 'fs';
import { format } from 'date-fns';
import numberToWords from 'number-to-words';
import axios from 'axios';

// Function to fetch HSN Code from the Python API
async function fetchHSNFromPython(query) {
    try {
        const response = await axios.post('https://xchange-hsn-code.onrender.com/get-hsn-code', { query });
        return response.data.hsn_code || "N/A";
    } catch (error) {
        console.error('Error fetching HSN code:', error);
        return "N/A";
    }
}

// Cache HSN code lookups to reduce API calls
const hsnCache = new Map();
const getHSNCodeByCategory = async (categories, hsnData) => {
    const lastCategory = categories?.[categories.length - 2] || categories?.[categories.length - 1];
    if (!lastCategory) return "N/A";

    if (hsnCache.has(lastCategory)) return hsnCache.get(lastCategory);

    // Search in local HSN JSON file
    const tableCells = hsnData.info.flatMap(info =>
        info.tables.flatMap(table => table.tableCells)
    );

    for (const row of tableCells) {
        const descriptionCell = row.find(cell => cell.text?.trim().toLowerCase() === lastCategory.toLowerCase());
        if (descriptionCell) {
            const hsnField = row[1];
            hsnCache.set(lastCategory, hsnField?.text || "N/A");
            return hsnField?.text || "N/A";
        }
    }

    // If not found, fetch from API
    const pythonHSNCode = await fetchHSNFromPython(lastCategory);
    hsnCache.set(lastCategory, pythonHSNCode);
    return pythonHSNCode;
};

// Function to convert numbers to words
function convertToRupeeFormat(number) {
    const [integerPart, decimalPart] = number.toString().split('.');
    let result = `${numberToWords.toWords(integerPart).toUpperCase()} RUPEES`;
    if (decimalPart) result += ` AND ${numberToWords.toWords(decimalPart).toUpperCase()} PAISE`;
    return result;
}

// PDF generation function
const iGenerateQuotationPDF = async (order, address, gstDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hsnData = JSON.parse(fs.readFileSync('./utils/HSN_SAC.json', 'utf-8'));
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => resolve(Buffer.concat(buffers)));

            // Header Section
            doc.image('utils/logo.png', 50, 30, { width: 80 });
            doc.fontSize(18).text('QUOTATION', { align: 'center', underline: true }).moveDown();
            doc.fontSize(12)
                .text('XCHANGETECHS STAR ALLIANCE LLP', { align: 'center' })
                .text('GSTIN: 29AAAFX1191P2ZJ    PAN: AAAFX1191P', { align: 'center' })
                .text('# 459, KIRAN Towers, Bengaluru, Karnataka, 560034', { align: 'center' })
                .moveDown(2);

            // Quotation Details
            const currentDate = new Date();
            const expiryDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            doc.text(`Quotation #: ${order.orderId}`, 50)
                .text(`Quotation Date: ${format(currentDate, 'dd MMM yyyy')}`, 50)
                .text(`Due Date: ${format(expiryDate, 'dd MMM yyyy')}`, 50)
                .moveDown(1.5);

            // Billing & Shipping Addresses
            doc.text('Billing Address:', { underline: true })
                .text(`${gstDetails.billingAddress}`)
                .text(`GSTIN: ${gstDetails.gstNumber}`).moveDown();

            doc.text('Shipping Address:', { underline: true })
                .text(`${address.street}, ${address.city}, ${address.state}, ${address.zipcode}`)
                .text(`${address.country}`)
                .moveDown(2);

            // Table Rows Preparation
            const tableRows = await Promise.all(order.items.map(async (item) => {
                const hsnCode = await getHSNCodeByCategory(item.category, hsnData);
                const gstAmount = (item.iprice || item.price) - item.price;
                const totalWithGST = (item.iprice || item.price) * item.quantity;

                return [
                    item.title?.[0] || 'Unknown Item',
                    hsnCode,
                    item.quantity,
                    item.price.toFixed(2),
                    (item.price * item.quantity).toFixed(2),
                    gstAmount.toFixed(2),
                    totalWithGST.toFixed(2),
                ];
            }));

            // Add Delivery Charges
            if (order.deliveryCharge) {
                tableRows.push([
                    'Delivery Charges', '', 1,
                    order.deliveryCharge.toFixed(2),
                    order.deliveryCharge.toFixed(2),
                    '0.00',
                    order.deliveryCharge.toFixed(2)
                ]);
            }

            // Table Configuration
            const table = {
                title: 'Order Details',
                headers: ['Item Name', 'HSN Code', 'Quantity', 'Unit Price', 'Amount', 'GST Amount', 'Amount with GST'],
                rows: tableRows,
            };

            // Table Rendering with Pagination Fix
            await doc.table(table, {
                prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
                prepareRow: (row, i) => {
                    doc.font('Helvetica').fontSize(10);
                    if (i % 30 === 0 && i !== 0) doc.addPage(); // Add new page after 30 rows
                },
                columnSpacing: 10,
                width: 500,
            });

            // Total Amount
            const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + (order.deliveryCharge || 0);
            const itotalAmount = order.items.reduce((sum, item) => sum + (item.iprice || item.price) * item.quantity, 0) + (order.deliveryCharge || 0);
            const gstTotal = itotalAmount - totalAmount;

            doc.text(`Sub Total: ${totalAmount.toFixed(2)}/-`, 400)
                .text(`GST: ${gstTotal.toFixed(2)}/-`, 400)
                .text(`Total: ${itotalAmount.toFixed(2)}/-`, 400)
                .moveDown();

            doc.text(convertToRupeeFormat(itotalAmount), { underline: true }).moveDown();

            // Bank Details
            doc.text('Bank Details:')
                .text('Bank: ICICI Bank')
                .text('Account #: 428405001856')
                .text('IFSC Code: ICIC0004284')
                .moveDown();

            // Final Notes
            doc.text('Terms and Conditions:')
                .text('1. Prices are in INR.')
                .text('2. Payment terms: Immediate.')
                .text('3. Proposal validity: 7 days from issue date.')
                .moveDown(2);

            doc.text('This is a computer-generated quotation and does not require a physical signature.');
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

export default iGenerateQuotationPDF;
