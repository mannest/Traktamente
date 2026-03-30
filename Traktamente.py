"""En traktamentes räknare åt rikstaxens fältpersonal"""
import datetime as dt
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/", methods = ["GET","POST"])
def index():
    error_time = None
    error_datum = None
    differens = None
    traktamente = 0
    if request.method == "POST":
        if "days" not in request.form and ("startdate" in request.form or "enddate" in request.form or "starttime" in request.form or "endtime" in request.form):
            startdate = request.form.get("startdate")
            starttid_str = request.form.get("starttime")
            enddate = request.form.get("enddate")
            hemtid_str = request.form.get("endtime")

            if not startdate or not enddate:
                return "alla datum måste fyllas i"
            start = dt.date.fromisoformat(startdate)
            end = dt.date.fromisoformat(enddate)
            if end < start:
                return "slutdatum måste vara samma dag eller senare än startdatum"

            starttid = None
            if starttid_str:
                try:
                    starttid = dt.time.fromisoformat(starttid_str)
                except ValueError:
                    return "ogiltig starttid"

            hemtid = None
            if hemtid_str:
                try:
                    hemtid = dt.time.fromisoformat(hemtid_str)
                except ValueError:
                    return "ogiltig sluttid"

            differens = (end - start).days + 1
            return str(differens)
            


        if "days" in request.form:
            days = int(request.form.get("days"))
            print(request.form.get("days"))

            starttid = None
            starttid_str = request.form.get("starttime")
            if starttid_str:
                try:
                    starttid = dt.time.fromisoformat(starttid_str)
                except ValueError:
                    return "ogiltig starttid"

            hemtid = None
            hemtid_str = request.form.get("endtime")
            if hemtid_str:
                try:
                    hemtid = dt.time.fromisoformat(hemtid_str)
                except ValueError:
                    return "ogiltig sluttid"

            traktamente = 0
            tillägg = 0
            for i in range(days):
                frukost = request.form.get(f"frukost{i}")
                lunch = request.form.get(f"lunch{i}")
                middag = request.form.get(f"middag{i}")
                inget = request.form.get(f"ingen{i}")
                eget = request.form.get(f"eget{i}")
                bokat = request.form.get(f"bokat{i}")

                if i == 0:
                  traktamente = traktamente + 300
                  tillägg = tillägg + (300 *1.2)

                if i > 0:
                    traktamente = traktamente + 450 
                    tillägg = tillägg + (300*1.2) + (150*3.1)

                if frukost == "Frukost":
                    traktamente = traktamente - 60
                    tillägg = tillägg - ((300*1.2)*0.2)
                
                if lunch == "Lunch":
                    traktamente = traktamente -105
                    tillägg = tillägg - ((300*1.2)*0.35)
                if middag == "Middag":
                    traktamente = traktamente - 105
                    tillägg = tillägg - ((300*1.2)*0.35)
                if bokat == "Bokat" and i > 0:
                    traktamente = traktamente -150
                    tillägg = tillägg - (150*3.1)

            if starttid and starttid > dt.time(12, 0):
                traktamente = traktamente - 150
                tillägg = tillägg - 210
            if hemtid and hemtid < dt.time(18, 0):
                traktamente = traktamente - 150
                tillägg = tillägg - 210

            
            return jsonify(traktamente=traktamente, tillagg=tillägg)
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)