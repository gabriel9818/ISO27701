document.getElementById('generateCase').addEventListener('click', async () => {
  const response = await fetch('/generate-case');
  const data = await response.json();
  document.getElementById('caseText').innerHTML = marked.parse(data.case);
  document.getElementById('aiSolution').textContent = '';
  document.getElementById('comparisonResult').textContent = '';
  document.getElementById('userSolution').value = '';
});

document.getElementById('clearCase').addEventListener('click', () => {
  document.getElementById('caseText').textContent = '';
  document.getElementById('userSolution').value = '';
  document.getElementById('aiSolution').textContent = '';
  document.getElementById('comparisonResult').textContent = '';
});

document.getElementById('generateAISolution').addEventListener('click', async () => {
  const caseText = document.getElementById('caseText').textContent;
  if (!caseText.trim()) {
    alert("Primero genera un caso de estudio.");
    return;
  }

  const response = await fetch('/generate-ai-solution', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ caseText })
  });
  const data = await response.json();
  document.getElementById('aiSolution').innerHTML = marked.parse(data.solution);
  
});

document.getElementById('compareSolutions').addEventListener('click', async () => {
  const caseText = document.getElementById('caseText').textContent;
  const userSolution = document.getElementById('userSolution').value;
  const aiSolution = document.getElementById('aiSolution').textContent;

  if (!userSolution.trim()) {
    alert("Debes ingresar tu solución para poder comparar.");
    return;
  }

  if (!aiSolution.trim()) {
    alert("Debes generar la solución IA antes de comparar.");
    return;
  }

  const response = await fetch('/compare-solutions', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ caseText, userSolution, aiSolution })
  });
  const data = await response.json();
  document.getElementById('comparisonResult').innerHTML = marked.parse(data.feedback);
});

document.getElementById('downloadPdf').addEventListener('click', async () => {
  const caseText = document.getElementById('caseText').textContent;
  if (!caseText.trim()) {
    alert("Primero genera un caso de estudio para poder descargarlo.");
    return;
  }

  const response = await fetch('/download-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ caseText })
  });

  const blob = await response.blob();
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'caso_de_estudio.pdf';
  link.click();
});
//   doc.text(caseText);
//   doc.end();