document.getElementById("form").addEventListener("submit", function(e) {
    e.preventDefault();

    const data = new FormData(this);

    fetch("/", {
        method: "POST",
        body: data
    })
    .then(response => response.text())
    .then(response => {
        if (isNaN(response)) {
            console.log("Svar:", response);
            document.getElementById("result").textContent = response;
            return;
        }

        document.getElementById("result").textContent = "";

        const days = parseInt(response, 10);

        let table = "<table border='1'>";
        table += "<tr><th>Dag</th><th>Frukost</th><th>Lunch</th><th>Middag</th><th>Ingen</th><th>Eget</th><th>Bokat</th></tr>";

        for (let i = 0; i < days; i++) {
            table += `
            <tr>
                <td>Dag ${i + 1}</td>
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
        </table>`;

        const boxar = document.getElementById("boxar");
        boxar.innerHTML = `${table}<input type="hidden" name="days" value="${days}"><input type="submit" value="Skicka">`;

        attachCheckboxHandlers(boxar);
    });
});

function attachCheckboxHandlers(container) {
    container.querySelectorAll(".alla").forEach(box => {
        box.addEventListener("change", function() {
            const col = this.dataset.col;
            const checked = this.checked;

            container.querySelectorAll("." + col).forEach(cb => {
                cb.checked = checked;
                cb.dispatchEvent(new Event("change"));
            });
        });
    });

    container.querySelectorAll("table tr").forEach(row => {
        if (row.querySelector(".alla")) return;

        const inget = row.querySelector(".ingen");
        const frukost = row.querySelector(".frukost");
        const lunch = row.querySelector(".lunch");
        const middag = row.querySelector(".middag");

        if (inget) {
            inget.addEventListener("change", function() {
                if (this.checked) {
                    if (frukost) frukost.checked = false;
                    if (lunch) lunch.checked = false;
                    if (middag) middag.checked = false;
                }
            });
        }

        [frukost, lunch, middag].forEach(box => {
            if (box) {
                box.addEventListener("change", function() {
                    if (this.checked && inget) {
                        inget.checked = false;
                    }
                });
            }
        });
    });

    container.querySelectorAll("table tr").forEach(row => {
        const eget = row.querySelector(".eget");
        const bokat = row.querySelector(".bokat");

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
}

const boxarForm = document.getElementById("boxar");
boxarForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const data = new FormData(this);

    fetch("/", {
        method: "POST",
        body: data
    })
    .then(res => res.text())
    .then(res => {
        console.log("Skickat!");
        document.getElementById("result").textContent = "Skickat!";
    });
});
