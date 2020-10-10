{
    function preventDefault(event) {
        event.preventDefault();
    }
    
    document.addEventListener("touchstart", preventDefault, {passive: false})
    document.addEventListener("touchmove", preventDefault, {passive: false})
}