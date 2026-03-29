["form", "boxar"].forEach(id => {
    const el = document.getElementById(id);

    if (el) {
        el.addEventListener("submit", function(e){
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
        table += "<tr><th>Dag</th><th>Frukost</th><th>Lunch</th><th>Middag</th><th>Ingen</th><th>Eget</th><th>Bokat</th></tr>";

        for (let i = 0; i < days; i++) {
            table += `<tr>
            <td>Dag ${i+1}</td>
            <td><input type="checkbox" name="frukost${i}" value="Frukost"></td>
            <td><input type="checkbox" name="lunch${i}" value="Lunch"></td>
            <td><input type="checkbox" name="middag${i}" value="Middag"></td>
            <td><input type="checkbox" name="ingen${i}" value="Ingen"></td>
            <td><input type="checkbox" name="egen${i}" value="Eget"></td>
            <td><input type="checkbox" name="bokat${i}" value="Bokat"></td>
            </tr>`;
        }

        table += "</table>";

document.getElementById("table").innerHTML = `
    <form method="POST" id="boxar">
        ${table}
        <input type="hidden" name="days" value="${days}">
        <input type="submit" value="Skicka">
    </form>
`;
    
    });

});
}
})