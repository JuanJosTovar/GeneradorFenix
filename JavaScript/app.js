function navigateTo(page) {
    window.location.href = page;
}

document.getElementById('archivo_excel').addEventListener('change', function() {
    let fileName = this.files[0] ? this.files[0].name : "Ningún archivo seleccionado";
    document.getElementById('file-name').textContent = fileName;
});