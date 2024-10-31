console.log(document.getElementById('plant1'));
dragElement(document.getElementById('plant1'));
dragElement(document.getElementById('plant2'));
dragElement(document.getElementById('plant3'));
dragElement(document.getElementById('plant4'));
dragElement(document.getElementById('plant5'));
dragElement(document.getElementById('plant6'));
dragElement(document.getElementById('plant7'));
dragElement(document.getElementById('plant8'));
dragElement(document.getElementById('plant9'));
dragElement(document.getElementById('plant10'));
dragElement(document.getElementById('plant11'));
dragElement(document.getElementById('plant12'));
dragElement(document.getElementById('plant13'));
dragElement(document.getElementById('plant14'));


function dragElement(terrariumElement) {

    let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
    terrariumElement.ondblclick = elementdblClick;

    terrariumElement.ondragstart = (ev) => {
        // ev.preventDefault();
        pos3 = ev.clientX;
        pos4 = ev.clientY;
        console.log(ev);
        console.log("dragstart");
    }

    terrariumElement.ondragend = (ev) => {
        pos1 = pos3 - ev.clientX;
        pos2 = pos4 - ev.clientY;
        pos3 = ev.clientX;
        pos4 = ev.clientY;
        console.log(pos1, pos2, pos3, pos4);
        terrariumElement.style.top = terrariumElement.offsetTop - pos2 + 'px';
        terrariumElement.style.left = terrariumElement.offsetLeft - pos1 + 'px';
        console.log(ev);
        console.log("end");
    }

    function elementdblClick(e) {
        e.preventDefault();
        let TopPlant = document.getElementsByClassName("plant");
        let sample = 2;
        for(let i = 0; i < TopPlant.length; i++){
            if(TopPlant[i].style.zIndex > sample){
                sample = TopPlant[i].style.zIndex;
            }
        }

        terrariumElement.style.zIndex = sample + 1;
       }

}
   



   