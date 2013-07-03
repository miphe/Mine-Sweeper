Mine Sweeper
===========

Personal tiny project, writing Mine Sweeper in js.

### How to play

**The rules in Minesweeper are simple:**

- Uncover a mine, and the game ends.
- Uncover an empty square, and you keep playing.
- Uncover a number, and it tells you how many mines lay hidden in the eight surrounding squares—information you use to deduce which nearby squares are safe to click.

### Bugs and TODOs

**Control panel**
- [] Add form styles
- [ ] Fields should have tooltips or labels
- [ ] When disabled, should have overlay saying 'game in progress'
- [ ] Should have button 'give up'

**Gameplay**
- [ ] Add 
- [ ] Add delay between (Hit mine => Reveal board => Show message, Finished game => Show message)

**Flagging**
- [ ] Fix bug about flagging mines
- [ ] Fix bug about removing flag when tile is swept

**Graphics**
- [ ] Should show flag image
- [ ] Should show mine image

**Hardcore mode**
- [ ] Add keyboard shortcut to 'commit game result' game instead of mouse click

**Log**
- [ ] Add log (Game type (normal, hardcore), Game finish time, Game result)

**Timer**
- [ ] Add timer (Game start, until game end)
- [ ] Add stress indicator (too long between clicks)
