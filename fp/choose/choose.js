const choose = x => ({ value: x, solved: false })
const solved = x => ({ value: x, solved: true })
const cond = (pred, f) => H => H.solved ? H : pred(H.value) ? solved(f(H.value)) : H
const other = g => H => H.solved ? H.value : g(H.value)

R.applyTo(25, R.pipe(
  choose,
  cond(x => x < 0, x => x * 2),
  cond(x => x < 50, x => x + 5),
  other(x => x * 10)
))
// ==> 30

