
export function updateArcProgress(city){
    const progressPath = document.querySelector('.arc-progress');


    const arcLength = progressPath.getTotalLength();
    progressPath.style.strokeDasharray = arcLength;
    progressPath.style.strokeDashoffset = arcLength;

    let progressValue = Math.floor(Math.random() * 100);

    function updateProgress(value) {
        const offset = arcLength - (arcLength * value) / 100;
        progressPath.style.strokeDashoffset = offset;
    }

    updateProgress(progressValue);
}