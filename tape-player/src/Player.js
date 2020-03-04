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

const PlayerState = tags("PlayerState", [
  "Stopped",
  "Playing",
  "Paused",
  "Rewinding",
  "FastForwarding"
])

// This "accepts" a patch to update the current time.
// While playing, the effect triggers a currentTime update after a delay.
// After the trigger but before the delay elapses, we could press Stop or Pause.
// Then the currentTime update arrives, but we are Stopped or Paused.
// In that case, we should not accept the currentTime update, and instead revert to the previous.
const acceptService = ({ state, previousState, patch }) => {
  if (patch && patch.currentTime &&
       (PlayerState.isStopped(state.playerState) ||
        PlayerState.isPaused(state.playerState)))
  {
    return { currentTime: previousState.currentTime }
  }
}

const withinRange = t => PlayerState.fold({
  Stopped: K(false),
  Playing: () => t < MAX_TIME,
  Paused: K(false),
  Rewinding: () => t > 0,
  FastForwarding: () => t < MAX_TIME
})

const validateRange = state => () => withinRange(state.currentTime)(state.playerState)
  ? null
  : { playerState: PlayerState.Stopped() }

// This determines whether the next state should be Stopped, which is if we are "moving"
// (Playing, Rewinding, FastForwarding), and have reached the end (or beginning) of the tape.
const stateService = ({ state }) =>
  run(
    state.playerState,
    PlayerState.fold({
      Stopped: K(null),
      Playing: validateRange(state),
      Paused: K(null),
      Rewinding: validateRange(state),
      FastForwarding: validateRange(state)
    })
  )

const computeDelay = PlayerState.fold({
  Stopped: K(0),
  Playing: K(1000),
  Paused: K(0),
  Rewinding: ({ delay }) => -delay,
  FastForwarding: ({ delay }) => delay
})

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
  rewind: () => update({ playerState: PlayerState.Rewinding({ delay: 100 }) }),
  fastForward: () => update({ playerState: PlayerState.FastForwarding({ delay: 100 }) }),
  scrubBack: () => update({ playerState: PlayerState.Rewinding({ delay: 50 }) }),
  scrubForward: () => update({ playerState: PlayerState.FastForwarding({ delay: 50 }) })
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

const app = {
  initial,
  Actions,
  services: [acceptService, stateService],
  effects: [effect]
}

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

    const rewindEvents = PlayerState.isPaused(state.playerState)
      ? { onMouseDown: () => actions.scrubBack(), onMouseUp: () => actions.pause() }
      : { onClick: () => actions.rewind() }

    const fastForwardEvents = PlayerState.isPaused(state.playerState)
      ? { onMouseDown: () => actions.scrubForward(), onMouseUp: () => actions.pause() }
      : { onClick: () => actions.fastForward() }

    return (
      <Card>
        <div style={{display: "flex", justifyContent: "space-between", fontSize: "24px"}}>
          <span>{state.currentTime}</span>
          <span>{state.playerState.case}</span>
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
          <EventButton enabled={enabled} type="rewind" events={rewindEvents}>
            <Rewind />
          </EventButton>
          <EventButton enabled={enabled} type="fastForward" events={fastForwardEvents}>
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
