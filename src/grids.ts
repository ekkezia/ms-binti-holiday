// Generate grids (dot pattern)
export function generateGrids(): void {
  const table = document.getElementById('grid');

  if (table instanceof HTMLTableElement) {
    for (let i = 0; i < 50; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < 50; j++) {
        const cell = document.createElement('td');
        cell.textContent = '.';
        cell.style.color = 'grey';
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
  } else {
    console.error('The element with ID "grid" is not a valid table element.');
  }
}
