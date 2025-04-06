const fileInput = document.getElementById('ride_image');
const preview = document.getElementById('imagePreview');

fileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
    preview.src = '';
  }
});

