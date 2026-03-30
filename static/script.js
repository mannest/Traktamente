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

        const startdate = data.get("startdate") || "";
        const starttime = data.get("starttime") || "";
        const enddate = data.get("enddate") || "";
        const endtime = data.get("endtime") || "";

        const boxar = document.getElementById("boxar");
        boxar.innerHTML = `${table}
            <input type="hidden" name="days" value="${days}">
            <input type="hidden" name="startdate" value="${startdate}">
            <input type="hidden" name="starttime" value="${starttime}">
            <input type="hidden" name="enddate" value="${enddate}">
            <input type="hidden" name="endtime" value="${endtime}">
            <input type="submit" value="Skicka">`;

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
    .then(text => {
        let parsed;
        try {
            parsed = JSON.parse(text);
        } catch (err) {
            parsed = null;
        }

        if (parsed && parsed.traktamente !== undefined) {
            const message = `Traktamente: ${parsed.traktamente} kr, Tillägg: ${parsed.tillagg} kr`;
            console.log(message);
            document.getElementById("result").textContent = message;
            addNote(parsed);
            return;
        }

        console.log(text);
        document.getElementById("result").textContent = text;
        addNote(text);
    });
});

function addNote(response) {
    const notes = document.getElementById("notes");
    const newNote = document.createElement("div");
    const startDate = document.querySelector("input[name='startdate']")?.value || "";
    const endDate = document.querySelector("input[name='enddate']")?.value || "";
    newNote.classList.add("note");

    let displayText;
    if (typeof response === "object" && response !== null && response.traktamente !== undefined) {
        displayText = `Traktamente: ${response.traktamente} kr\nTillägg: ${response.tillagg} kr`;
    } else {
        displayText = response;
    }

    let dateLine = "";
    if (startDate || endDate) {
        dateLine = `<p>Resa ${startDate}${startDate && endDate ? " till " : ""}${endDate}</p>`;
    }

    newNote.innerHTML = `
        ${dateLine}
        <p style="font-size: 20px; font-weight: bold; white-space: pre-line;">${displayText}</p>
        <button type="button" class="delete-btn">Ta bort</button>
    `;
    const deleteBtn = newNote.querySelector(".delete-btn");

    // när man klickar → ta bort lappen
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            newNote.remove();
        });
    }
    notes.prepend(newNote);
}