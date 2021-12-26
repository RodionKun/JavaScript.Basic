let table = document.createElement("table");
let letters = "HGFEDCBA";
for (let i = 0; i < 9; i++) {
    let tr = document.createElement('tr');
    for (let j = 0; j < 9; j++) {
        let td = document.createElement('td');
        if (i === 8) {
            td.textContent = 0 + j || '';
            tr.appendChild(td);
            continue;
        }
        if (j === 0) {
            td.textContent = letters.charAt(i - 0);
            td.classList.add('letter');
            tr.appendChild(td);
            continue;
        }
        if (i % 2 == j % 2) {
            td.className = "white";
        } else {
            td.className = "black";
        }
        tr.appendChild(td);
    }
    table.appendChild(tr);
}
document.body.appendChild(table);