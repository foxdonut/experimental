one of the benefits of sum types is not needing those booleans

ok so I'd argue, you never want booleans in state
and I sort of need to see the usage code to see why the boolean is needed
but usually instead an `if(x){ do y}` we should `map( do y )`
so I need to see usage code, but ... let's assume you need these booleans

well they are just things that can get out of sync
beware of the bugs
and they are lossy

ah this is when I'd use otherwise

I'd have distinct folds for each state, so

```javascript
const _ = {
  all: S.otherwise(PlayerState.tags)
  , playable: S.otherwise(['Stopped', 'Paused', 'Rewinding', 'FastForwarding'])
}

const canPlay = state => PlayerState.fold({
  ... _.all( () => false ),
  ... _.playable( () => state.currentTime < MAX_TIME )
})
```

and I'd suggest currentTime should be on the PlayerState object

```javascript
const _ = {
  all: S.otherwise(PlayerState.tags)
  , playable: S.otherwise(['Stopped', 'Paused', 'Rewinding', 'FastForwarding'])
}

const canPlay = PlayerState.fold({
  ... _.all( () => false ),
  ... _.playable( ({ currentTime }) => currentTime < MAX_TIME )
})
```

in vs code you can now find all references for that _.playable partial fold, and if you want to
change the definition you can see where the outdated placeholder was used so what I do is...

```javascript
const _ = {
  all: S.otherwise(PlayerState.tags)
  , playable: S.otherwise(['Stopped', 'Paused', 'Rewinding', 'FastForwarding'])
  , playableNext: S.otherwise(['Stopped', 'Paused', 'Rewinding', 'FastForwarding', 'Loading'])
}
```

then I find all references on `_.playable` and review each call site to see if a simple rename will
still make sense or if I need to change my usage code

so in my case, I do, because I'm destructuing currentTime from the player state but Loading
presumably has no currentTime

and you could argue `Loading` shouldn't be there, but let's pretend it needs to be for demonstration
purposes

```javascript
const canPlay = PlayerState.fold({
  ... _.all( () => false )
  , ... _.playable( ({ currentTime }) => currentTime < MAX_TIME )
  , Loading( () => false )
})
```

so we update the fold so that `Loading` is handled specifically, and then we can now change the
definition to `playableNext`

```javascript
const canPlay = PlayerState.fold({
  ... _.all( () => false )
  , ... _.playableNext( ({ currentTime }) => currentTime < MAX_TIME )
  , Loading( () => false )
})
```

we do that for each usage, and when we're done we can rename playableNext to playable and commit
so that workflow is a lot more like say using Elm
where you keep getting type errors until your usage matches the model
and normally having a placeholder `_` means "everything other than the specified cases"
but that's a massive footgun

because at the time of writing the definition of your union could have been completely different so
`_` was safe then, but may not be for all future cases

but that's why defining specific placeholders for reusuable sections of folds solves that problem

np, but that's really more of a long term thing, I wouldn't define `_` initially, I'd inline it,
because I like inlining

so I'd go

```javascript
const isPlayable = PlayerState.fold({
   ... S.otherwise ( PlayerState.tags ) (  ({ currentTime }) => currentTime < MAX_TIME )
   , Playing: () => false
})
```

it's a bit of a risk reward thing

using `S.otherwise(PlayerState.tags)` is dangerous, but is ok when you're in an early prototyping
stage

it's dangerous because if you don't manually specify the tags you're automatically accepting changes
to the definition without being forced by type errors to revise the usage code

it's almost like automatically accepting semver major changes to your model

what's safe, is to manually enumerate them, and I tend to call that `_.all`

```javascript
const _ = {
  all: S.otherwise(['Stopped', 'Playing', 'Paused', 'Rewinding', 'FastForwarding'])
}

const isPlayable = PlayerState.fold({
   ... _.all (  ({ currentTime }) => currentTime < MAX_TIME )
   , Playing: () => false
})
```

that's way safer

because right now, all the player states have the same data structure

but a big win of sum types, is they don't need to

and so if we add a new tag that doesn't have currentTime, isPlayable will throw a type error that we
didn't handle the new tag, because `_.all` was manually defined instead of going `PlayerState.tags`

don't know if that makes sense, but it's hugely powerful, which is why I need to blog about it I
think
