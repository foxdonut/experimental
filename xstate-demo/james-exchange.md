Hi James!

I have been doing a **LOT** of thinking about what you posted. It's all very interesting to me and as you said, there is a lot of valuable territory to explore here.

I just have one question, because I'm not quite clear about "watching state and fetch data based on something _changing_". Your idea of relationships instead of events and transitions really resonated with me, and I'm thinking a lot more in terms of just state instead of "what event happened". However in the phrase above it does look like we have to look at what happened. Here is the context (from your text):

Elsewhere we can say (potentially globally in a service), if any data is active, but hasn't been fetched since the last route change or a delta maximum, fetch it from the appropriate location.

```javascript
const Active = S.either('Active')
const init = () => ({
    route: Route.Settings(),
    tasks: Active.N(),
    settings: Active.N()
})

// watches state, fetches data based on Active changing <-- how do we know Active changed?
// does not change Active itself
activeService(getState)
    .map(setState)

// Changes task's active status based on relationships in state
// Does not fetch data
taskActiveService(getState)
    .map(setState)

// Changes settings's active status based on relationships in state
// Does not fetch data
settingsActiveService(getState)
    .map(setState)
```

What does the `activeService` have to do to know that Active _changed_? Does it have to keep track of the previous state, so that it can compare it to the next state, and determine whether Active has changed, to decide whether it must fetch data?

I was wondering if that is the idea, or whether we can just use state instead, such as, fetch data if `Active` is `Y` AND data is `Loaded.N`.

What approach to do you prefer?

Thank you again. I've been doing a lot of experimenting with stags and superouter and it's awesome.

