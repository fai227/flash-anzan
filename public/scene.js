const sceneList = {
    load: "load",
    home: "home",
    room: "room",
    problem: "problem",
    answer: "answer",
    battle: "battle",
}

function changeScene(scene) {
    // すべて非表示
    Object.keys(sceneList).forEach(element => {
        document.getElementById(element).style.display = "none";
    });

    document.getElementById(scene).style.display = "block";
}