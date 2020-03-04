// Original example credit: Steve Ruiz @steveruizok https://codesandbox.io/s/state-designer-counter-2nmd5
/** @jsx jsx */
import { jsx, Box, Card, Grid, Flex, Button } from "theme-ui"
import { Rewind, FastForward, Play, Square, Pause } from "react-feather"
import { motion, transform } from "framer-motion"
import { run, tags } from "stags"
import merge from "mergerino"
import meiosisMergerino from "meiosis-setup/mergerino"
import simpleStream from "meiosis-setup/simple-stream"
import React from "react"

const I = x => x
const K = x => () => x

const MAX_TIME = 30

const PlayerState = tags("PlayerState", [ "Stopped", "Playing", "Paused", "Rewinding", "FastForwarding" ])

const withinRange = t => PlayerState.fold({
  Stopped: K(false),
  Playing: () => t < MAX_TIME,
  Paused: K(false),
  Rewinding: () => t > 0,
  FastForwarding: () => t < MAX_TIME
})

const computeDelay = PlayerState.fold({
  Stopped: K(0), Playing: K(1000), Paused: K(0), Rewinding: I, FastForwarding: I
})

const validateRange = state => () => withinRange(state.currentTime)(state.playerState)
  ? null
  : { playerState: PlayerState.Stopped() }

const service = ({ state, previousState }) => {
  if (previousState
    && previousState.playerState.tag === "Stopped"
    && state.currentTime !== previousState.currentTime) {

    return { currentTime: previousState.currentTime }
  }

  return run(
    state.playerState,
    PlayerState.fold({
      Stopped: K(null),
      Playing: validateRange(state),
      Paused: K(null),
      Rewinding: validateRange(state),
      FastForwarding: validateRange(state)
    })
  )
}

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
  stop: () => update({ playerState: PlayerState.Stopped() }),
  play: () => update({ playerState: PlayerState.Playing() }),
  pause: () => update({ playerState: PlayerState.Paused() }),
  rewind: () => update({ playerState: PlayerState.Rewinding(-50) }),
  fastForward: () => update({ playerState: PlayerState.FastForwarding(50) }),
  scrubBack: () => update({ playerState: PlayerState.Rewinding(-100) }),
  scrubForward: () => update({ playerState: PlayerState.FastForwarding(100) })
})

const computeEnabled = state =>
  run(
    state.playerState,
    PlayerState.fold({
      Stopped: () => ({
        play: state.currentTime < MAX_TIME,
        rewind: state.currentTime > 0,
        fastForward: state.currentTime < MAX_TIME,
        stop: false,
        pause: false
      }),
      Playing: () => ({
        play: false,
        rewind: state.currentTime > 0,
        fastForward: state.currentTime < MAX_TIME,
        stop: true,
        pause: true
      }),
      Paused: () => ({
        play: state.currentTime < MAX_TIME,
        rewind: state.currentTime > 0,
        fastForward: state.currentTime < MAX_TIME,
        stop: false,
        pause: false
      }),
      Rewinding: () => ({
        play: state.currentTime < MAX_TIME,
        rewind: false,
        fastForward: state.currentTime < MAX_TIME,
        stop: true,
        pause: false
      }),
      FastForwarding: () => ({
        play: state.currentTime < MAX_TIME,
        rewind: state.currentTime > 0,
        fastForward: false,
        stop: true,
        pause: false
      })
    })
  )

const initial = {
  currentTime: 0,
  playerState: PlayerState.Stopped()
}

const app = { initial, Actions, services: [service], effects: [effect] }

const { states, actions } =
  meiosisMergerino({ stream: simpleStream, merge, app })

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

    return (
      <Card>
        <h2>{state.currentTime}</h2>
        <Flex mb={3} bg="shade" sx={{ justifyContent: "center", borderRadius: 3 }}>
          <Wheel progress={progress} speed={speed} />
          <Wheel progress={1 - progress} speed={speed} />
        </Flex>
        <Grid columns="repeat(5, auto)" gap={1}>
          <EventButton enabled={enabled} type="play"
            events={{ onClick: () => actions.play() }}>
            <Play />
          </EventButton>
          <EventButton enabled={enabled} type="rewind"
            events={{
              // onMouseDown: "HELD_REWIND",
              // onMouseUp: "RELEASED_REWIND",
              onClick: () => actions.rewind()
            }}
          >
            <Rewind />
          </EventButton>
          <EventButton enabled={enabled} type="fastForward"
            events={{
              // onMouseDown: "HELD_FASTFORWARD",
              // onMouseUp: "RELEASED_FASTFORWARD",
              onClick: () => actions.fastForward()
            }}
          >
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
          <a href="https://codesandbox.io/s/state-designer-counter-2nmd5">Codesandbox example</a>
        </div>
      </Card>
    )
  }
}
