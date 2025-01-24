const characteristicsToSelect = ['4']; // Características a seleccionar

function selectCells() {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach(cell => {
        const characteristic = cell.getAttribute('data-characteristic');
        if (characteristicsToSelect.includes(characteristic)) {
            cell.classList.add('selected'); // Seleccionar celdas con características específicas
            cell.onclick = function() { // Añadir evento de clic
                this.classList.toggle('selected'); // Alternar la clase 'selected'
        }}
    });
    const cells2 = document.querySelectorAll('.cell2');
    cells2.forEach(cell2 => {
        const characteristic = cell2.getAttribute('data-characteristic');
        if (characteristicsToSelect.includes(characteristic)) {
            cell2.classList.add('selected'); // Seleccionar celdas con características específicas
            cell2.onclick = function() { // Añadir evento de clic
                this.classList.toggle('selected'); // Alternar la clase 'selected'
        }}
    });
    const cells3 = document.querySelectorAll('.cell3');
    cells3.forEach(cell3 => {
        const characteristic = cell3.getAttribute('data-characteristic');
        if (characteristicsToSelect.includes(characteristic)) {
            cell3.classList.add('selected'); // Seleccionar celdas con características específicas
            cell3.onclick = function() { // Añadir evento de clic
                this.classList.toggle('selected'); // Alternar la clase 'selected'
        }}
    });
    const cells4 = document.querySelectorAll('.cell4');
    cells4.forEach(cell4 => {
        const characteristic = cell4.getAttribute('data-characteristic');
        if (characteristicsToSelect.includes(characteristic)) {
            cell4.classList.add('selected'); // Seleccionar celdas con características específicas
            cell4.onclick = function() { // Añadir evento de clic
                this.classList.toggle('selected'); // Alternar la clase 'selected'
        }}
    });
}
window.onload = selectCells;

//Buscador
document.getElementById('search').addEventListener('keyup', function() {
    const filter = this.value.toLowerCase();
    const items = document.querySelectorAll('#buscador');

    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? '' : 'none';
    });
});