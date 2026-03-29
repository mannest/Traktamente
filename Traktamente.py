"""En traktamentes räknare åt rikstaxens fältpersonal"""
import datetime as dt
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods = ["GET","POST"])
def index():

    if "days" in request.form:
        print(request.form.get("days"))
        days = int(request.form.get("days"))

        for i in range(days):
            frukost = request.form.get(f"frukost{i}")
            lunch = request.form.get(f"lunch{i}")

            print(i, frukost, lunch)
            
    
    #Konstanter
    error_time = None
    error_datum = None
    differens = None

    if request.method == "POST":
        startdate = request.form["startdate"]
        starttime = request.form["starttime"]
        enddate = request.form["enddate"]
        endtime = request.form["endtime"]

        if not startdate or not enddate:
            return "alla datum måste fyllas i"       
        elif not starttime or not endtime:
            return "Start eller slut tid ej ifyllt"
        else:
            start = dt.date.fromisoformat(startdate)
            end = dt.date.fromisoformat(enddate)

            differens = (end - start).days +1
            #print(differens)
            return str(differens)
        

    return render_template("index.html")
    
if __name__ == "__main__":
    app.run(debug=True)