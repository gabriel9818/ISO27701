const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const PDFDocument = require('pdfkit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Ruta para generar el caso de estudio usando Gemini
app.get('/generate-case', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
Actúa como un experto en privacidad de la información. Genera un caso de estudio realista basado en la norma ISO 27701 (Sistema de Gestión de la Información sobre la Privacidad - PIMS). El caso debe incluir:

1. El contexto de una empresa ficticia (nombre, sector, tamaño, etc.).
2. Una problemática específica que esta empresa enfrenta relacionada con la gestión de la privacidad de la información.
3. Debe parecer un caso real que podría ocurrir en la práctica.
4. Debe estar alineado con los principios de la ISO 27701.

Devuelve solo el texto del caso de estudio, sin explicaciones adicionales.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedCase = response.text();

    res.json({ case: generatedCase });
  } catch (error) {
    console.error('Error generando el caso:', error);
    res.status(500).json({ error: 'Error al generar el caso de estudio' });
  }
});

// ✅ Ruta para generar solución con IA
app.post('/generate-ai-solution', async (req, res) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `Dado el siguiente caso basado en la norma ISO 27701, proporciona una solución detallada, estructurada y alineada con la norma:\n\n${req.body.caseText}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  res.json({ solution: response.text() });
});

// ✅ Ruta para comparar soluciones
app.post('/compare-solutions', async (req, res) => {
  const { caseText, userSolution, aiSolution } = req.body;
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = `
Tienes el siguiente caso basado en la norma ISO 27701:

Caso:
${caseText}

Solución propuesta por el usuario:
${userSolution}

Solución generada por IA:
${aiSolution}

Compara ambas soluciones con base en los principios de la ISO 27701. Proporciona:
- Un análisis comparativo claro.
- Recomendaciones para mejorar la solución del usuario.
- Un porcentaje estimado de coincidencia entre ambas respuestas.
  `;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  res.json({ feedback: response.text() });
});

// ✅ Ruta para generar PDF con el caso
app.post('/download-pdf', (req, res) => {
  const { caseText } = req.body;
  const doc = new PDFDocument();
  const filename = 'caso_de_estudio.pdf';

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/pdf');

  doc.pipe(res);
  doc.fontSize(14).text('Caso de estudio ISO 27701', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(caseText);
  doc.end();
});

// ✅ Inicializar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
