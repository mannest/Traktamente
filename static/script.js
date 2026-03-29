document.getElementById("form").addEventListener("submit", function(e){
    e.preventDefault();

    const data = new FormData(this);

    fetch("/", {
        method: "POST",
        body: data
    })
    .then(response => response.text())
    .then(response => {
        
            // 🔹 om det INTE är en siffra → gör inget
        if (isNaN(response)) {
            console.log("Svar:", response);
            return;
        }

        let days = parseInt(response);

        let table = "<table border=1>";
        table += "<tr><th>Dag</th><th>Frukost</th><th>Lunch</th><th>Middag</th><th>Ingen</th><th>Eget</th><th>Bokat</th></tr>";

        for (let i = 0; i < days; i++) {
            table += `
            <tr>
            <td>Dag ${i+1}</td>
            <td><input type="checkbox" class="frukost" name="frukost${i}" value="Frukost"></td>
            <td><input type="checkbox" class="lunch" name="lunch${i}" value="Lunch"></td>
            <td><input type="checkbox" class="middag" name="middag${i}" value="Middag"></td>
            <td><input type="checkbox" class="ingen" name="ingen${i}" value="Ingen"></td>
            <td><input type="checkbox" class="eget" name="eget${i}" value="Eget"></td>
            <td><input type="checkbox" class="bokat" name="bokat${i}" value="Bokat"></td>
            </tr>`;
        }

        table += `
<tr>
    <td>Alla</td>
    <td><input type="checkbox" class="alla" data-col="frukost"></td>
    <td><input type="checkbox" class="alla" data-col="lunch"></td>
    <td><input type="checkbox" class="alla" data-col="middag"></td>
    <td><input type="checkbox" class="alla" data-col="ingen"></td>
    <td><input type="checkbox" class="alla" data-col="eget"></td>
    <td><input type="checkbox" class="alla" data-col="bokat"></td>
</tr>
</table>
`;

document.getElementById("table").innerHTML = `
<form method="POST" id="boxar">
    ${table}
    <input type="hidden" name="days" value="${days}">
    <input type="submit" value="Skicka">
</form>
`
console.log(document.getElementById("table").innerHTML);
console.log("Skapar form");
console.log(document.getElementById("boxar"));
;
const newForm = document.querySelector("#table #boxar");

newForm.addEventListener("submit", function(e){
    e.preventDefault();

    const data = new FormData(this);

    fetch("/", {
        method: "POST",
        body: data
    })
    .then(res => res.text())
    .then(res => {
        console.log("Skickat!");
    });
});

document.querySelectorAll(".alla").forEach(box => {
    box.addEventListener("change", function() {
        let col = this.dataset.col;
        let checked = this.checked;

        document.querySelectorAll("." + col).forEach(cb => {
            cb.checked = checked;
            cb.dispatchEvent(new Event("change"));
        });
    });
});

document.querySelectorAll("table tr").forEach(row => {

    if (row.querySelector(".alla")) return; // hoppa över "Alla"

    let inget = row.querySelector(".ingen");
    let frukost = row.querySelector(".frukost");
    let lunch = row.querySelector(".lunch");
    let middag = row.querySelector(".middag");

    if (!inget || !frukost || !lunch || !middag) return;

    if (inget) {
        inget.addEventListener("change", function() {
            if (this.checked) {
                frukost.checked = false;
                lunch.checked = false;
                middag.checked = false;
            }
        });
    }

    [frukost, lunch, middag].forEach(box => {
        if (box) {
            box.addEventListener("change", function() {
                if (this.checked) {
                    inget.checked = false;
                }
            });
        }
    });

});

document.querySelectorAll("table tr").forEach(row => {

    let eget = row.querySelector(".eget");
    let bokat = row.querySelector(".bokat");

    if (eget && bokat) {

        eget.addEventListener("change", function() {
            if (this.checked) {
                bokat.checked = false;
            }
        });

        bokat.addEventListener("change", function() {
            if (this.checked) {
                eget.checked = false;
            }
        });
    }
    
});
    });

});
