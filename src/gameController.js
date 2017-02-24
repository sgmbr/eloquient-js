/* jshint undef: true, unused: true, esversion: 6, asi: true*/

function main() {
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
    console.log(simpleLevel.width, "by", simpleLevel.height)
}
