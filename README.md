Mine Sweeper
===========

Personal tiny project, writing Mine Sweeper in js. Try it out on [ms.miphe.com](http://ms.miphe.com)

### How to play

**The rules in Minesweeper are simple:**

- Uncover a mine, and the game ends.
- Uncover an empty square, and you keep playing.
- Uncover a number, and it tells you how many mines lay hidden in the eight surrounding squares—information you use to deduce which nearby squares are safe to click.

### Bugs and TODOs

**Known bugs**
- 'Give up' button may show up after game ended (refactor endGame event)

**Control panel**
- Fields should have tooltips or labels

**Hardcore mode**
- Add stress indicator (too long between clicks)
- Add keyboard shortcut to 'commit game result' game instead of mouse click
- Add information about 'How to play hardcore'

**Log**
- Add scoreboard (Game type (normal, hardcore), Game finish time, Game result)