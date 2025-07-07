document.getElementById('uploadForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById('file');
  const resultDiv = document.getElementById('result');
  const linkInput = document.getElementById('link');
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  const res = await fetch('/upload', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (data.success) {
    linkInput.value = data.url;
    resultDiv.classList.remove('hidden');
  } else {
    alert(data.message || 'Erreur lors de l\'upload');
  }
});

function copyLink() {
  const link = document.getElementById('link');
  link.select();
  document.execCommand('copy');
  alert('Lien copié !');
}
