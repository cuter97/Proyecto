const animacion1 = $('.animation1');
const animacion2 = $('.animation2');

animacion2.css({'display': 'none'});

$( () => {

    const loop = () => {
        animacion1.fadeOut(2000, () => {
            animacion2.fadeIn(2000, () => {
                animacion2.fadeOut(2000, () => {
                    animacion1.fadeIn(2000, () => {
                        setTimeout(loop, 500);
                    });
                });
            });
        });
    }
    loop();
    
});                  

let elementsArray = document.querySelectorAll(".efecto-cartas");

window.addEventListener('scroll', fadeIn ); 
function fadeIn() {
    elementsArray.forEach(elem => {
        let distInView = elem.getBoundingClientRect().top - window.innerHeight + 20;
        if (distInView < 0) 
            elem.classList.add("inView");       
    });
}
fadeIn();