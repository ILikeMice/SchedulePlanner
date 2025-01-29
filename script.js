let resizing = false

function startresize(id) {

    let element = document.getElementById(id)
    const movelisten = (e) => {
        console.log(element.offsetTop)
        element.style.height = e.clientY - element.getBoundingClientRect().top + "px" 
        
    }
    document.addEventListener("mousemove", movelisten)
    document.addEventListener("mouseup", function () {
        resizing = false
        document.removeEventListener("mousemove", movelisten)
    })
    
}

