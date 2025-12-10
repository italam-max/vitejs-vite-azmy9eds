import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import PdfPrinter from 'pdfmake';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- CONFIGURACIÓN PDF ---
const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};
const printer = new PdfPrinter(fonts);

// --- GENERADOR DE PDF ---
const generatePdfBinary = (formData) => {
  return new Promise((resolve, reject) => {
    const docDefinition = {
      content: [
        { text: 'COTIZACIÓN ALAMEX ELEVADORES', style: 'header', alignment: 'center', margin: [0, 0, 0, 20] },
        { text: `Cliente: ${formData.clientName}`, margin: [0, 5] },
        { text: `Proyecto: ${formData.projectRef}`, margin: [0, 5] },
        { text: `Fecha: ${formData.projectDate}`, margin: [0, 20] },
        {
          table: {
            widths: ['*', 'auto'],
            body: [
              [{ text: 'Descripción', bold: true }, { text: 'Valor', bold: true }],
              ['Modelo', formData.model],
              ['Capacidad', `${formData.capacity} kg`],
              ['Paradas', formData.stops.toString()],
              ['Velocidad', `${formData.speed} m/s`],
            ]
          }
        },
        { text: 'Este documento es una propuesta preliminar generada automáticamente.', margin: [0, 30], italics: true, fontSize: 10 }
      ],
      styles: {
        header: { fontSize: 18, bold: true }
      }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    let chunks = [];
    pdfDoc.on('data', (chunk) => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.end();
  });
};

// --- ENDPOINT ENVÍO WHATSAPP (WHAPI) ---
app.post('/api/share/send', async (req, res) => {
  const { formData, method } = req.body;

  try {
    const pdfBuffer = await generatePdfBinary(formData);

    if (method === 'whatsapp') {
      // 1. Formatear teléfono (Asegúrate que tenga código de país, ej 52 para MX)
      let phone = formData.clientPhone.replace(/\D/g, '');
      if (phone.length === 10) phone = '52' + phone; 

      // 2. Convertir PDF a Base64
      const pdfBase64 = pdfBuffer.toString('base64');
      
      // 3. Enviar a Whapi
      const whapiResponse = await axios.post(
        `${process.env.WHAPI_URL}/messages/document`,
        {
          to: `${phone}@s.whatsapp.net`,
          media: `data:application/pdf;base64,${pdfBase64}`,
          filename: `Cotizacion_${formData.projectRef}.pdf`,
          caption: `Hola ${formData.clientName}, adjunto encontrarás la cotización para el proyecto *${formData.projectRef}*. \n\nQuedo atento a tus comentarios.`
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.WHAPI_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Devolvemos datos para el chat simulado en el frontend
      return res.json({ 
        success: true, 
        message: 'Enviado por Whapi',
        chatData: {
            id: Date.now(), // ID temporal
            name: formData.clientName,
            lastMsg: 'Documento enviado: Cotización.pdf',
            time: 'Ahora',
            history: [
                { sender: 'me', text: `Hola ${formData.clientName}, adjunto encontrarás la cotización para el proyecto ${formData.projectRef}.`, timestamp: Date.now() }
            ]
        }
      });
    }

    res.status(400).json({ success: false, message: 'Método no soportado' });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});