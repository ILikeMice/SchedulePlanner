let resizing = false
let data = {
    "1": {
        "1": {
            "name": "Testing",
            "start": 0,
            "end": 60
        },
        "2": {
            "name": "Testing",
            "start": 60,
            "end": 120
        }
    },
    "2": {
        "1": {
            "name": "Testing",
            "start": 0,
            "end": 60
        }
    }
}

function startresize(id) {
    let element = document.getElementById(id)

    const movelisten = (e) => {
        console.log(element.getBoundingClientRect().bottom - element.parentNode.getBoundingClientRect().top)

        let scale = 1
        
        element.style.height = (e.clientY - element.getBoundingClientRect().top + 5).toFixed(0) + "px" 
        let rawminutes = Math.round((1140/scale) / ( element.parentNode.offsetHeight / (element.getBoundingClientRect().bottom - element.parentNode.getBoundingClientRect().top)))
        let hours = Math.floor(rawminutes / 60)
        let minutes = rawminutes % 60
        element.getElementsByClassName("righttime")[0].innerText = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`
        data[id.split("-")[0]][id.split("-")[1]]["end"] = rawminutes
        
        try {
            document.getElementById(String(id.split("-")[0] + "-" + (Number(id.split("-")[1]) + 1))).getElementsByClassName("timespan")[0].innerText = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`
        } catch {}
        
        rawminutes = Math.round((1140/scale) / ( element.parentNode.offsetHeight / (element.getBoundingClientRect().top - element.parentNode.getBoundingClientRect().top)))
        
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
}

function setscale() {
    let scale = document.getElementById("scaleinp").value
    
    for (let i = 0; i < 7; i++) {
        let day = document.getElementsByClassName("day")[i]
        for (let b = 0; b < day.children.length; b++) {
            let node = day.children[b]
            console.log(i,b)

            console.log(node.getElementsByClassName("timespan")[0].height * 2)

            node.style.minHeight = "unset"
            node.style.height = ((data[i + 1][b + 1]["end"] - data[i + 1][b + 1]["start"])*(day.offsetHeight / (1140/scale))) + "px"
            node.style.overflow = "hidden"

            node.getElementsByClassName("timespan")[0].innerText = data[i+1][b+1]["start"]
            node.getElementsByClassName("righttime")[0].innerText = data[i+1][b+1]["end"]
        }
    }
}

function addevent(id) {
    let daydiv = document.getElementById(id)
    let eventdiv = document.createElement("div")
    
    let maxheight = 0
    for (let i = 0; i < daydiv.children.length; i++) {
        maxheight += daydiv.children[i].offsetHeight
    }
    eventdiv.style.height = daydiv.offsetHeight - maxheight
    eventdiv.className = "event"
    
}