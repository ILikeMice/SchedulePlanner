let resizing = false

function startresize(id) {

    let element = document.getElementById(id)
    const movelisten = (e) => {
        console.log(element.offsetTop)
        
        element.style.height = e.clientY - element.getBoundingClientRect().top + 5 + "px" 
        
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