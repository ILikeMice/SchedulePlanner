let resizing = false

try {
    data = JSON.parse(window.localStorage.getItem("data"))
    if (data == null) {
        data = {"1": {}, "2": {}, "3": {}, "4": {}, "5": {}, "6": {}, "7": {}}
        writedata()
    }
} catch {
    data = {"1": {}, "2": {}, "3": {}, "4": {}, "5": {}, "6": {}, "7": {}}
    writedata()
}

window.onload = () => {
    loadevents()
    setscale()
}

function writedata() {
    window.localStorage.setItem("data", JSON.stringify(data))
}

function dothething() {
    for (let i = 1; i < 8; i++) {
        data[String(i)] = {}
        for (let b = 1; b < document.getElementById(String(i)).children.length + 1; b++) {
            let child  = document.getElementById(String(i)).children[b-1]
            console.log(child)
            data[String(i)][String(b)] = {
                "start": Math.round((1440/60) / (child.offsetHeight / (child.getBoundingClientRect().top - child.parentNode.getBoundingClientRect().top))),
                "end": Math.round((1440/60) / (child.offsetHeight / (child.getBoundingClientRect().bottom - child.parentNode.getBoundingClientRect().top))),
                "name": child.getElementsByClassName("namespan")[0].innerText
            }
        }
    }
    writedata()
}

function loadevents() {
    let scale = document.getElementById("scaleinp").value
    for (let i = 1; i < 8; i++) {
        let day = document.getElementById(String(i))
        day.innerHTML = ""
        for (let b = 1; b < Object.keys(data[String(i)]).length + 1; b++) {
            console.log("thing: ", i, b)
            let eventdiv = document.createElement("div")
            eventdiv.id = `${i}-${b}`
            eventdiv.className = "event"
            eventdiv.style.height = ((data[String(i)][String(b)]["end"] - data[String(i)][String(b)]["start"])*(day.offsetHeight / (1440/scale))) + "px"

            eventdiv.style.backgroundColor = data[String(i)][String(b)]["color"]

            eventdiv.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                deleteevent(eventdiv.id)
            })

            let startdiv = document.createElement("div")
            startdiv.className = "eventrow"

            let startspan = document.createElement("span")
            startspan.className = "timespan"
            
            let rawminutes = data[String(i)][String(b)]["start"] // wohoo ctl+c ctl+v
            console.log("start ", rawminutes)
            let hours = Math.floor(rawminutes / 60)
            let minutes = rawminutes % 60
            startspan.innerText = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`

            let enddiv = document.createElement("div")
            enddiv.className = "eventrow"

            let endresize = document.createElement("span")
            endresize.className = "resizespan rightresize"
            endresize.onmousedown = () => {
                startresize(`${i}-${b}`)

            }
            endresize.innerText = "══"

            let endspan = document.createElement("span")
            endspan.className = "timespan righttime"

            let endminutes = data[String(i)][String(b)]["end"] 
            console.log("end ", endminutes)
            hours = Math.floor(endminutes / 60)
            minutes = endminutes % 60
            endspan.innerText = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`

            let namespan = document.createElement("span")
            namespan.className = "namespan"
            namespan.innerText = data[String(i)][String(b)]["name"]

            startdiv.appendChild(startspan)
        
            enddiv.appendChild(endresize)
            enddiv.appendChild(endspan)

            eventdiv.appendChild(startdiv)
            eventdiv.appendChild(namespan)
            eventdiv.appendChild(enddiv)

            day.appendChild(eventdiv)
            console.log("done")
        }
    }
}

function startresize(id) {
    let element = document.getElementById(id)

    const movelisten = (e) => {
        console.log(element.getBoundingClientRect().bottom - element.parentNode.getBoundingClientRect().top)
    
        let scale = document.getElementById("scaleinp").value

        if (e.clientY - element.getBoundingClientRect().top < 0) {
            return
        }

        if ((e.clientY - element.getBoundingClientRect().top + 5).toFixed(0) < (13.6 + 30)) {
            console.log("too small")    
            element.getElementsByClassName("namespan")[0].style.display = "none"
            if ((e.clientY - element.getBoundingClientRect().top + 5).toFixed(0) < (13.6*2)) {
                element.getElementsByClassName("timespan")[0].style.display = "none"
                if ((e.clientY - element.getBoundingClientRect().top + 5).toFixed(0) < (13.6)) {
                    element.getElementsByClassName("righttime")[0].style.display = "none"
                }
            }
        } else {
            element.getElementsByClassName("timespan")[0].style.display = "flex"
            element.getElementsByClassName("namespan")[0].style.display = "flex"
            element.getElementsByClassName("righttime")[0].style.display = "block"
        }
        
        element.style.height = (e.clientY - element.getBoundingClientRect().top + 5).toFixed(0) + "px" 
        let rawminutes = Math.round((1440/scale) / ( element.parentNode.offsetHeight / (element.getBoundingClientRect().bottom - element.parentNode.getBoundingClientRect().top)))
        if (rawminutes > 1441) {
            rawminutes = 1440;
            document.removeEventListener("mousemove", movelisten);
            return;
        }
        
        let hours = Math.floor(rawminutes / 60)
        let minutes = (rawminutes % 60).toFixed(0)
        element.getElementsByClassName("righttime")[0].innerText = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`
        data[id.split("-")[0]][id.split("-")[1]]["end"] = rawminutes
        
        let currentId = id;
        while (true) { // thanks to copilot for helping me out with this, got really confused at some point
            let nextId = String(currentId.split("-")[0] + "-" + (Number(currentId.split("-")[1]) + 1));
            let nextElement = document.getElementById(nextId);
            if (!nextElement) break;

            try {
                nextElement.getElementsByClassName("timespan")[0].innerText = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
                let timediff = data[currentId.split("-")[0]][String(Number(currentId.split("-")[1]) + 1)]["end"] - data[currentId.split("-")[0]][String(Number(currentId.split("-")[1]) + 1)]["start"];
                data[currentId.split("-")[0]][String(Number(currentId.split("-")[1]) + 1)]["start"] = rawminutes;
                data[currentId.split("-")[0]][String(Number(currentId.split("-")[1]) + 1)]["end"] = rawminutes + timediff;
                let newrawminutes = rawminutes + timediff;

                if (newrawminutes > 1441) {
                    newrawminutes = 1440
                    document.removeEventListener("mousemove", movelisten)
                    break
                }

                let newhours = Math.floor(newrawminutes / 60);
                let newminutes = (newrawminutes % 60).toFixed(0);
                nextElement.getElementsByClassName("righttime")[0].innerText = `${newhours}:${newminutes < 10 ? "0" + newminutes : newminutes}`;

                rawminutes = newrawminutes;
                hours = newhours;
                minutes = newminutes;
                currentId = nextId;
            } catch (err) {
                console.error(err);
                break;
            }
        }
        
        writedata()
        
        rawminutes = Math.round((1440/scale) / ( element.parentNode.offsetHeight / (element.getBoundingClientRect().top - element.parentNode.getBoundingClientRect().top)))
        
        hours = Math.floor(rawminutes / 60)
        minutes = rawminutes % 60
        element.getElementsByClassName("timespan")[0].innerText = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`        
    }
    document.addEventListener("mousemove", movelisten)
    document.addEventListener("mouseup", function () {
        resizing = false
        document.removeEventListener("mousemove", movelisten)
    })
}

/* experimental for now
function startdrag(id) {
    let element = document.getElementById(id)

    element.style.cursor = "grabbing"

    const movelisten = (e) => {
        if (e.clientY - element.offsetHeight*2 < 0) {
            return
        }
        element.style.top = e.clientY - element.offsetHeight*2 + "px"
        console.log(element.style.top)
    }

    document.addEventListener("mousemove", movelisten)

    document.addEventListener("mouseup", () => {
        element.style.cursor = "grab"
        document.removeEventListener("mousemove", movelisten)
    })
}*/

function setscale() {
    let scale = document.getElementById("scaleinp").value
    
    for (let i = 0; i < 7; i++) {
        let day = document.getElementsByClassName("day")[i]
        for (let b = 0; b < day.children.length; b++) {
            let node = day.children[b]
            console.log(i,b)

            console.log(node.getElementsByClassName("timespan")[0].height * 2)

            node.style.minHeight = "unset"
            node.style.height = ((data[i + 1][b + 1]["end"] - data[i + 1][b + 1]["start"])*(day.offsetHeight / (1440/scale))) + "px"
            node.style.overflow = "hidden"
            
            if (node.offsetHeight < (13.6 + 30)) {
                console.log("too small")    
                node.getElementsByClassName("namespan")[0].style.display = "none"
                if (node.offsetHeight < (13.6*2)) {
                    node.getElementsByClassName("timespan")[0].style.display = "none"
                    if (node.offsetHeight < 13.6) {
                        node.getElementsByClassName("righttime")[0].style.display = "none"
                    }
                }
            } else {
                node.getElementsByClassName("timespan")[0].style.display = "flex"
                node.getElementsByClassName("namespan")[0].style.display = "flex"
                node.getElementsByClassName("righttime")[0].style.display = "block"
            }

            node.getElementsByClassName("timespan")[0].innerText = `${Math.floor(data[i+1][b+1]["start"]/60)}:${data[i+1][b+1]["start"] % 60 < 10 ? "0" + (data[i+1][b+1]["start"] % 60).toFixed(0) : (data[i+1][b+1]["start"] % 60).toFixed(0)}`
            node.getElementsByClassName("righttime")[0].innerText = `${Math.floor(data[i+1][b+1]["end"]/60)}:${data[i+1][b+1]["end"] % 60 < 10 ? "0" + (data[i+1][b+1]["end"] % 60).toFixed(0) : (data[i+1][b+1]["end"] % 60).toFixed(0)}`
        }
    }
}

function addevent(id, name, color) {
    let daydiv = document.getElementById(id)
    let eventdiv = document.createElement("div")
    
    let maxheight = 0
    for (let i = 0; i < daydiv.children.length; i++) {
        maxheight += daydiv.children[i].offsetHeight
    }
    console.log(maxheight)
    eventdiv.className = "event"
    eventdiv.style.height = daydiv.offsetHeight - maxheight + "px"

    let startspan = document.createElement("span")
    startspan.className = "timespan"
    
    let startmins;
    try {startmins = data[id][Object.keys(data[id]).length]["start"] + (data[id][Object.keys(data[id]).length]["end"] - data[id][Object.keys(data[id]).length]["start"])/2 } catch { startmins = 0}

    
    let endmins = 1440
    try {
        data[id][Object.keys(data[id]).length]["end"] = startmins
    } catch {}
    
    data[id][Object.keys(data[id]).length + 1] = {
        "start": startmins,
        "end": endmins,
        "name": name,
        "color": color
    }
    writedata()

    loadevents()
    setscale()
    window.location.reload()
}

function hidepopup() {
    document.getElementById("popup").style.display = "none"
}

function showpopup(id) {
    let popup = document.getElementById("popup")

    popup.style.display = "block"

    popup.getElementsByClassName("popupcontent")[0].getElementsByClassName("addeventbtn")[0].onclick = () => {
        addevent(id, document.getElementById("nameinput").value, document.getElementById("colorinput").value)
        hidepopup()
    }
}

