require('dotenv').config();
const express = require('express');
const cors = require('cors');
const xmlrpc = require('xmlrpc');
const nodemailer = require('nodemailer');
const PdfPrinter = require('pdfmake');
const axios = require('axios'); // <--- Nuevo: Para conectar con Whapi

const app = express();
app.use(cors());
// Aumentamos el límite del body porque enviaremos PDFs en Base64
app.use(express.json({ limit: '50mb' })); 

// --- CONFIGURACIONES ---

const odooConfig = {
    url: new URL(process.env.ODOO_URL || 'http://localhost'), // Fallback simple
    db: process.env.ODOO_DB,
    username: process.env.ODOO_USERNAME,
    password: process.env.ODOO_PASSWORD
};

const fonts = {
    Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
    }
};
const printer = new PdfPrinter(fonts);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// --- FUNCIONES HELPER ---

const connectToOdoo = () => {
    return new Promise((resolve, reject) => {
        const common = xmlrpc.createSecureClient({
            host: odooConfig.url.hostname,
            port: odooConfig.url.port || 443,
            path: '/xmlrpc/2/common'
        });
        common.methodCall('authenticate', [odooConfig.db, odooConfig.username, odooConfig.password, {}], (error, uid) => {
            if (error) reject(error);
            else resolve(uid);
        });
    });
};

const generatePdfBinary = (formData, materialsList) => {
    return new Promise((resolve, reject) => {
        // ... (Tu definición del PDF sigue igual, la resumo aquí) ...
        const docDefinition = {
            content: [
                { text: 'COTIZACIÓN ALAMEX ELEVADORES', style: 'header' },
                { text: `Cliente: ${formData.clientName}\nReferencia: ${formData.projectRef}`, margin: [0, 10] },
                { text: 'Detalles:', style: 'subheader' },
                { ul: [ `Modelo: ${formData.model}`, `Paradas: ${formData.stops}` ] },
                { text: 'Este documento es una propuesta preliminar.', margin: [0, 20], italics: true }
            ],
            styles: {
                header: { fontSize: 18, bold: true },
                subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }
            }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        let chunks = [];
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.end();
    });
};

// Función para limpiar el número de teléfono para Whapi
const formatPhoneForWhapi = (phone) => {
    // Eliminar caracteres no numéricos
    let clean = phone.replace(/\D/g, '');
    // Whapi espera el número con código de país (ej. 52155...)
    // Si el número no tiene código de país, asume México (52) o el que necesites
    if (clean.length === 10) { 
        clean = '52' + clean; // Ajusta esto según tu país
    }
    return clean;
};

// --- ENDPOINTS ---

// Crear Orden en Odoo (Sin cambios mayores)
app.post('/api/odoo/create-order', async (req, res) => {
    // ... (Mismo código de Odoo de la respuesta anterior) ...
    res.json({ success: true, message: 'Simulación Odoo OK' }); 
});

// ENVIAR PDF (EMAIL O WHAPI)
app.post('/api/share/send', async (req, res) => {
    const { formData, materialsList, method } = req.body;

    try {
        console.log(`Generando PDF para ${method}...`);
        const pdfBuffer = await generatePdfBinary(formData, materialsList);

        if (method === 'email') {
            await transporter.sendMail({
                from: process.env.SMTP_USER,
                to: formData.clientEmail,
                subject: `Cotización Alamex - ${formData.projectRef}`,
                text: 'Adjunto encontrará su propuesta.',
                attachments: [{
                    filename: `Cotizacion_${formData.projectRef}.pdf`,
                    content: pdfBuffer
                }]
            });
            return res.json({ success: true, message: 'Correo enviado correctamente' });
        }

        if (method === 'whatsapp') {
            // 1. Preparar datos para Whapi
            const cleanPhone = formatPhoneForWhapi(formData.clientPhone);
            
            // Convertir PDF a Base64 para enviarlo en el cuerpo del JSON
            const pdfBase64 = pdfBuffer.toString('base64');
            const mediaData = `data:application/pdf;base64,${pdfBase64}`;

            // 2. Enviar petición a Whapi
            // Usamos el endpoint /messages/document
            const whapiResponse = await axios.post(
                `${process.env.WHAPI_URL}/messages/document`,
                {
                    to: `${cleanPhone}@s.whatsapp.net`, // Formato de Whapi para números
                    media: mediaData,
                    filename: `Cotizacion_${formData.projectRef}.pdf`,
                    caption: `Hola ${formData.clientName}, aquí tienes la cotización solicitada para el proyecto *${formData.projectRef}*.`
                },
                {
                    headers: {
                        'Authorization': `Bearer ${process.env.WHAPI_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Whapi Response:', whapiResponse.data);
            return res.json({ success: true, message: 'WhatsApp enviado por Whapi' });
        }

    } catch (error) {
        console.error('Error enviando:', error.response ? error.response.data : error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message, 
            details: error.response ? error.response.data : null 
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Backend corriendo en puerto ${PORT}`);
});