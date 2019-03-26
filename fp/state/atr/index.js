const { P, S, PS, D } = require("patchinko/explicit")
const R = require("ramda")

const Oa = Object.assign

const assign = obj => target => P(target, obj)
const assignBy = (pred, obj) => R.when(pred, assign(obj))

const inc = x => x + 1
const dec = x => x - 1
const decOrInc = x => x ? dec : inc

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min)) + min

const clamp = (min, max) => x => Math.min(Math.max(min, x), max)
const clampAfter = R.curry( (min, max, fn) => R.compose(clamp(min, max), fn) )

const limitMoves = clampAfter(0, 8)
const limitRank = clampAfter(0, 4)
const decLeft = () => ({ left: S(limitMoves(dec)) })
const incMoves = () => ({ moves: S(limitMoves(inc)) })
const applyMove = () => Oa(decLeft(), incMoves())
const markSelected = id => assignBy(R.propEq("id", id), { selected: true })
const selectCard = id => ({ cards: S(R.map(markSelected(id))) })
const answer = id => Oa(applyMove(), selectCard(id))
const getHint = state => state.hint
const toHint = R.omit(["id"])
const getCard = id => state => R.defaultTo({ id, color: "unknown", shape: "unknown" },
  R.find(R.propEq("id", id), state.cards))

const notSelected = ({ selected }) => !selected
const getUnselectedCards = state => state.cards.filter(notSelected)
const pickRandomCard = cards => cards[randomBetween(0, cards.length)]
const pickRandomUnselectedCard = R.compose(pickRandomCard, getUnselectedCards)
const nextHint = R.compose(R.objOf("hint"), toHint, pickRandomUnselectedCard)

const setIsCorrect = isCorrect => ({ isCorrect })
const cardToHint = id => R.compose(toHint, getCard(id))
const validateAnswer = id => state => R.equals(cardToHint(id)(state), getHint(state))
const adjustRank = R.compose(limitRank, decOrInc)
const updateRank = isCorrect => ({ rank: S(adjustRank(isCorrect)) })
//const applyFeedback = isCorrect => Oa(setIsCorrect(isCorrect), updateRank(isCorrect))
const applyFeedback = R.converge(Oa, [setIsCorrect, updateRank])
const feedback = id => R.compose(applyFeedback, validateAnswer(id))

const buildCard = (color, shape) => ({ id: `${color}-${shape}`, color, shape })
const buildCards = R.compose(R.map(R.apply(buildCard)), R.xprod)
const generateCards = state => buildCards(state.colors, state.shapes)
const buildDeck = R.pair([])
const drawCardAt = index => deck => [
  R.append(deck[1][index], deck[0]),
  R.remove(index, 1, deck[1])
]
const getDeck = R.compose(buildDeck, generateCards)
const drawRandom = deck => drawCardAt(randomBetween(0, deck[1].length))(deck)
const drawNine = R.apply(R.pipe, R.repeat(drawRandom, 9))
const drawFromDeck = R.compose(drawNine, getDeck)
const pickCards = state => ({ cards: drawFromDeck(state) })

const state = () => ({
  left: 8,
  moves: 0,
  cards: [
    { id: "gs", color: "green", shape: "square" },
    { id: "os", color: "orange", shape: "square" },
    { id: "bt", color: "blue", shape: "triangle" }
  ],
  hint: {
    color: "green",
    shape: "square"
  },
  isCorrect: null,
  rank: 4,
  colors: ["orange", "green", "blue", "yellow"],
  shapes: ["square", "triangle", "circle"]
})

console.log("-- state")
console.log(state())
console.log("-- decLeft")
console.log(P(state(), decLeft()))
console.log("-- decLeft incMoves")
console.log(P(state(), decLeft, incMoves()))
console.log("-- applyMove")
console.log(P(state(), applyMove()))
console.log("-- selectCard")
console.log(P(state(), selectCard("os")))
console.log("-- answer")
console.log(P(state(), answer("gs")))
console.log("-- getHint")
console.log(getHint(state()))
console.log("-- getCard")
console.log(getCard("bt")(state()))
console.log("-- getCard(2)")
console.log(getCard("btx")(state()))
console.log("-- setIsCorrect")
console.log(P(state(), setIsCorrect(true)))
console.log("-- validateAnswer")
console.log(validateAnswer("gs")(state()))
console.log("-- updateRank")
console.log(P(state(), updateRank(true)))
console.log("-- feedback")
console.log(P(state(), feedback("gs")(state())))
console.log("-- randomBetween")
console.log(randomBetween(1,10))
console.log("-- getUnselectedCards")
console.log(getUnselectedCards(P(state(), selectCard("os"))))
console.log("-- pickRandomCard")
console.log(pickRandomCard(state().cards))
console.log("-- pickRandomUnselectedCard")
console.log(pickRandomUnselectedCard(state()))
console.log("-- nextHint")
console.log(P(state(), nextHint(state())))
console.log("-- buildCards")
console.log(buildCards(["red", "green", "black"], ["J", "Q", "K", "A"]))
console.log("-- generateCards")
console.log(generateCards(state()))
console.log("-- drawCardAt")
console.log(R.applyTo(state(), R.pipe(getDeck, drawCardAt(7))))
console.log("-- drawCardAt (2)")
console.log(R.applyTo(state(), R.pipe(getDeck, drawCardAt(7), drawCardAt(5))))
console.log("-- drawRandom")
console.log(R.applyTo(state(), R.pipe(getDeck, drawRandom, drawRandom)))
console.log("-- drawNine")
console.log(R.applyTo(state(), R.pipe(getDeck, drawNine)))
console.log("-- drawFromDeck")
console.log(drawFromDeck(state()))
console.log("-- pickCards")
console.log(JSON.stringify(P(state(), pickCards(state())), null, 4))

