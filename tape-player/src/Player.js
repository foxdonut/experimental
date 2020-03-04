// Original example credit: Steve Ruiz @steveruizok https://codesandbox.io/s/state-designer-counter-2nmd5
/** @jsx jsx */
import { jsx, Box, Card, Grid, Flex, Button } from "theme-ui"
import { Rewind, FastForward, Play, Square, Pause } from "react-feather"
import { motion, transform } from "framer-motion"
import { either, run } from "stags"
import merge from "mergerino"
import meiosisMergerino from "meiosis-setup/mergerino"
import simpleStream from "meiosis-setup/simple-stream"
import React from "react"

const K = x => () => x

const MAX_TIME = 30

const Moving = either("Moving")
const Forward = either("Forward")
const Accelerating = either("Accelerating")
const Scrubbing = either("Scrubbing")
const Paused = either("Paused")

const getLabel = Moving.bifold(
  Paused.bifold(K("Stopped"), K("Paused")),
  Forward.bifold(
    Scrubbing.bifold(K("Rewinding"), K("Scrubbing Back")),
    Accelerating.bifold(
      K("Playing"),
      Scrubbing.bifold(K("Fast Forwarding"), K("Scrubbing Forward"))
    )
  )
)

const computeDelay = Moving.bifold(
  K(0),
  Forward.bifold(
    Scrubbing.bifold(K(-100), K(-75)),
    Accelerating.bifold(
      K(1000),
      Scrubbing.bifold(K(100), K(75))
    )
  )
)

// This "accepts" a patch to update the current time.
// While playing, the effect triggers a currentTime update after a delay.
// After the trigger but before the delay elapses, we could press Stop or Pause.
// Then the currentTime update arrives, but we are Stopped or Paused.
// In that case, we should not accept the currentTime update, and instead revert to the previous.
const acceptService = ({ state, previousState, patch }) => {
  if (patch && patch.currentTime && (Moving.isN(state.playerState))) {
    return { currentTime: previousState.currentTime }
  }
}

const withinRange = t => Moving.bifold(
  K(false),
  Forward.bifold(
    () => t > 0,
    () => t < MAX_TIME
  )
)

const validateRange = state => () => withinRange(state.currentTime)(state.playerState)
  ? null
  : { playerState: Moving.N(Paused.N()) }

// This determines whether the next state should be Stopped, which is if we are "moving"
// (Playing, Rewinding, Fast Forwarding, etc.), and have reached the end (or beginning) of the tape.
const stateService = ({ state }) =>
  run(
    state.playerState,
    Moving.bifold(
      K(null),
      validateRange(state)
    )
  )

const effect = ({ state, update }) => {
  const within = withinRange(state.currentTime)(state.playerState)

  if (within) {
    const delay = computeDelay(state.playerState)
    if (delay !== 0) {
      const amount = Math.sign(delay)
      setTimeout(() => {
        update({ currentTime: t => t + amount })
      }, Math.abs(delay))
    }
  }
}

const Actions = update => ({
  stop: () => update({ playerState: Moving.N(Paused.N()) }),
  play: () => update({ playerState: Moving.Y(Forward.Y(Accelerating.N())) }),
  pause: () => update({ playerState: Moving.N(Paused.Y()) }),
  rewind: () => update({ playerState: Moving.Y(Forward.N(Scrubbing.N())) }),
  scrubBack: () => update({ playerState: Moving.Y(Forward.N(Scrubbing.Y())) }),
  fastForward: () => update({ playerState: Moving.Y(Forward.Y(Accelerating.Y(Scrubbing.N()))) }),
  scrubForward: () => update({ playerState: Moving.Y(Forward.Y(Accelerating.Y(Scrubbing.Y()))) })
})

const computeEnabled = state => ({
  play: state.currentTime < MAX_TIME && run(state.playerState,
    Moving.bifold(
      K(true),
      Forward.bifold(
        K(true),
        Accelerating.bifold(K(false), K(true))))),

  rewind: state.currentTime > 0 && run(state.playerState,
    Moving.bifold(
      K(true),
      Forward.bifold(
        Scrubbing.bifold(K(false), K(true)),
        K(true)))),

  fastForward:  state.currentTime < MAX_TIME && run(state.playerState,
    Moving.bifold(
      K(true),
      Forward.bifold(
        K(true),
        Accelerating.bifold(
          K(true),
          Scrubbing.bifold(K(false), K(true)))))),

  stop: run(state.playerState, Moving.bifold(K(false), K(true))),
  pause: run(state.playerState, Moving.bifold(K(false), K(true)))
})

const initial = {
  currentTime: 0,
  playerState: Moving.N(Paused.N())
}

const app = {
  initial,
  Actions,
  services: [acceptService, stateService],
  effects: [effect]
}

const { states, actions } =
  meiosisMergerino({ stream: simpleStream, merge, app })

const rewindEvents = {
  onClick: () => actions.rewind()
}

const scrubBackEvents = {
  onMouseDown: () => actions.scrubBack(),
  onMouseUp: () => actions.pause()
}

const fastForwardEvents = {
  onClick: () => actions.fastForward()
}

const scrubForwardEvents = {
  onMouseDown: () => actions.scrubForward(),
  onMouseUp: () => actions.pause()
}

function EventButton({ enabled, type, events, children }) {
  const isDisabled = !enabled[type]
  const buttonEvents = isDisabled ? {} : events

  return (
    <Box {...buttonEvents}>
      <Button variant="icon" disabled={isDisabled}>
        {children}
      </Button>
    </Box>
  )
}

function Wheel({ progress, speed }) {
  return (
    <motion.div
      initial={false}
      animate={{ scale: progress, }}
      transition={{ ease: "linear", duration: speed, }}
      style={{
        height: 128, width: 128,
        backgroundColor: "#c6c7cb", borderRadius: "100%",
        margin: 16,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}
    >
      <div
        style={{
          height: 16, width: 16,
          borderRadius: "100%", backgroundColor: "#333"
        }}
      />
    </motion.div>
  )
}

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = states()
    this.skippedFirst = false
  }

  componentDidMount() {
    const setState = this.setState.bind(this)
    states.map(state => {
      if (this.skippedFirst) {
        setState(state)
      } else {
        this.skippedFirst = true
      }
      return false
    })
  }

  render() {
    const state = this.state

    const progress = transform(state.currentTime, [0, MAX_TIME], [1, 0])
    const speed = Math.abs(computeDelay(state.playerState) / 1000)
    const enabled = computeEnabled(state)

    const rewindButtonEvents = run(state.playerState,
      Moving.bifold(
        Paused.bifold(K(rewindEvents), K(scrubBackEvents)),
        Forward.bifold(
          Scrubbing.bifold(K(rewindEvents), K(scrubBackEvents)),
          K(rewindEvents))))

    const fastForwardButtonEvents = run(state.playerState,
      Moving.bifold(
        Paused.bifold(K(fastForwardEvents), K(scrubForwardEvents)),
        Forward.bifold(
          K(fastForwardEvents),
          Accelerating.bifold(
            K(fastForwardEvents),
            Scrubbing.bifold(K(fastForwardEvents), K(scrubForwardEvents))))))

    return (
      <Card>
        <div style={{display: "flex", justifyContent: "space-between", fontSize: "24px"}}>
          <span>{state.currentTime}</span>
          <span>{getLabel(state.playerState)}</span>
        </div>
        <Flex mb={3} bg="shade" sx={{ justifyContent: "center", borderRadius: 3 }}>
          <Wheel progress={progress} speed={speed} />
          <Wheel progress={1 - progress} speed={speed} />
        </Flex>
        <Grid columns="repeat(5, auto)" gap={1}>
          <EventButton enabled={enabled} type="play"
            events={{ onClick: () => actions.play() }}>
            <Play />
          </EventButton>
          <EventButton enabled={enabled} type="rewind" events={rewindButtonEvents}>
            <Rewind />
          </EventButton>
          <EventButton enabled={enabled} type="fastForward" events={fastForwardButtonEvents}>
            <FastForward />
          </EventButton>
          <EventButton enabled={enabled} type="stop"
            events={{ onClick: () => actions.stop() }}
          >
            <Square />
          </EventButton>
          <EventButton enabled={enabled} type="pause"
            events={{ onClick: () => actions.pause() }}>
            <Pause />
          </EventButton>
        </Grid>
        <div style={{marginTop: "24px"}}>
          Original example credit: Steve Ruiz @steveruizok
        </div>
        <div>
          <a href="https://codesandbox.io/s/state-designer-counter-2nmd5">Codesandbox</a>
        </div>
      </Card>
    )
  }
}
