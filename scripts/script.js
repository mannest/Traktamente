document.getElementById("form").addEventListener("submit", function(e){

    e.preventDefault();

    const data = new FormData(this);

    fetch("/", {
        method: "POST",
        body: data
    })
    .then(response => response.text())
    .then(days => {
        days = parseInt(days)
        let table = "<table border=1>";
        table += "<tr><th>Dag</th><th>Frukost</th><th>Lunch</th><th>Middag</th><th>Ingen</th></tr>";

        for (let i = 0; i < days; i++) {

            table += `<tr>
            <td>Dag ${i+1}</td>
            <td><input type="checkbox" name="day${i}" value="Frukost"></td>
            <td><input type="checkbox" name="day${i}" value="Lunch"></td>
            <td><input type="checkbox" name="day${i}" value="Middag"></td>
            <td><input type="checkbox" name="day${i}" value="Ingen"></td>
            </tr>`;
        }

        table += "</table>";

        document.getElementById("table").innerHTML = table;

    });

});