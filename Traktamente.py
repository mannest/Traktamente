"""En traktamentes räknare åt rikstaxens fältpersonal"""
import datetime as dt
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods = ["GET","POST"])
def index():
    error_time = None
    error_datum = None
    differens = None
    traktamente = 0
    if request.method == "POST":
        if "startdate" in request.form or "enddate" in request.form or "starttime" in request.form or "endtime" in request.form:
            startdate = request.form.get("startdate")
            starttime = request.form.get("starttime")
            enddate = request.form.get("enddate")
            endtime = request.form.get("endtime")

            if not startdate or not enddate:
                return "alla datum måste fyllas i"
            elif not starttime or not endtime:
                return "Start eller slut tid ej ifyllt"
            else:
                start = dt.date.fromisoformat(startdate)
                end = dt.date.fromisoformat(enddate)
                differens = (end - start).days + 1
                return str(differens)

        if "days" in request.form:
            days = int(request.form.get("days"))
            print(request.form.get("days"))

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
            

                print(i, frukost, lunch, middag, inget, eget, bokat)
                print(f"Traktamente{traktamente}")
                print(f"Förrättnings tillägg: {tillägg}")
            #return traktamente, tillägg
            return "Skickat!"
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)