export function buttonTop(){
    const topButton = document.getElementById("button__top");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
        topButton.classList.add("visible");
        } else {
        topButton.classList.remove("visible");
        }
    });

    // topButton.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     window.scrollTo({
    //     top: 0,
    //     behavior: "smooth",
    //     });
    // });
}