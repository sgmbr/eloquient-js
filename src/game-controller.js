/* jshint undef: true, unused: true, esversion: 6, asi: true, browser: true, devel:true*/

function main() {
    /*
    let simpleLevelPlan = [
      "                      ",
      "                      ",
      "  x              = x  ",
      "  x         o o    x  ",
      "  x @      xxxxx   x  ",
      "  xxxxx            x  ",
      "      x!!!!!!!!!!!!x  ",
      "      xxxxxxxxxxxxxx  ",
      "                      "
    ];

    let simpleLevel = new Level(simpleLevelPlan)
    let display = new DOMDisplay(document.body, simpleLevel)

    console.log(simpleLevel)
    */
    runGame(GAME_LEVELS, DOMDisplay)
}
