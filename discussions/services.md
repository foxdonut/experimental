@JAForbes I've been thinking a lot about your services lately. I really like the idea. The only thing that was bothering me a bit was the need to worry about infinite loops, even though `dropRepeats` solves that. I wanted to see if there could be a way of having a separate stream instead of "feeding" updates back into the same stream. Having a separate stream would also mean not having to deal with infinite loops.

What I ended up with is something that doesn't "disrupt" your `start` functions much. Instead of composing functions with `.map` on streams, they just use plain function composition, `R.pipe`.

My version is not as "streamy" as yours :) so instead of having `start` which returns a stream of functions that update the model (actions), services have a `state` function which is a function of the model that returns an action (a function that updates the model). So `state = model => model => model`. It turns out there is a combinator for this, called "duplication", `W = f => x => f(x)(x)`. Ramda has this as `R.unnest`.

So now from the `model` stream we produce a `state` stream that is the result of calling the services:

```javascript
const model = m.stream.scan( T, initialModel(), update )
const state = model.map(
  R.apply(R.pipe,
    Object.values(services).map( s => s.state ).map(W)))

const view = state.map(View(update))
```

Whereas before we had e.g. `StatsService.start`:

```javascript
const StatsService = {
  start(model){
    return dropRepeats(
      model.map( x => x.boxes )
    )
    .map( R.countBy(I) )
    .map( R.objOf('stats') )
    .map( R.mergeDeepLeft )
  },
  ...
}
```

Now we have `StatsService.state`:

```javascript
const StatsService = {
  state: R.pipe(
      x => x.boxes
    , R.countBy(I)
    , R.objOf('stats')
    , R.mergeDeepLeft 
  ),
  ...
}
```

There you see how it's the same sequence of functions, just composed instead of mapped onto streams.

[flems of your example with this approach](https://flems.io/#0=N4IgtglgJlA2CmIBcA2AzAOgBxoDQgDMIEBnZAbVADsBDMRJEDACwBcxYR8BjAeytbwByEAB4S3AE4QADqwB8AHSoEArlW6sI-AARRJvGQCV4M+DVYkAFCQCUO4Mp3OdANxqSdk81ACeOgF4dAhpYEngAbicXd08oQJ0wDBJWbzorWyiqFx0SDDAaGSs1DS1dK1d7R2yclwgCHSsAQjS-HQAfdrcdJoCgqAyq6Nra1v8g1NVI4ZGXAcqs2Z0AXxnlzJnvVlVJbKgs1apRAHoJaTl5LhBwhE1tKjJGAEYABiQntBBl3Go6BiYAFZkHj8QTCRh8B6sHQASQSAA9AvIdPDlJCUjpeAlirgdABzewBZGIonBKx4qzw2y2NH8DEAaQRSMahOJymUx2OOhMBHg3g08CQOjYrBkJCQnLxEBSGClrGYqgARhg+GBjgBBdwAR2OTwIL3QKHg3AArNwsFAUDR4FAAEzwAAsJtpUJ0AHUEkYMOoqPAMZz3TpVYqILRWLxJLjFCAoKoZLAINwLPdo7iAO7MPnwQNBBqkknIgiU2zFnTsjR06EKgpUAAy0uhQRIzPhzdJ0VbGAQVDx8p0yKeMwA-Ci8iQE9x4FYXrgALRPWwYAG8UNWADkuLX9gA1Do13vtyRt-v97vO+PE1P5zSas4hZ3l6u11vy+joTJZNmgq2W3lvLHJyMCA8TYKxeFxGEbzfHQABIEmiYAdBkAwZCFABrZk82RLEiRmKxEIwQjwJ0cg0IAXSFIteFIsj7HWaJcTxeBWCFbs22w5lqhyWIdF8RYXDYxpnALXimXsMCbxyLYdmyPjokOZxDhdDEYMVXh4T9BIYIwZDDEaNc1I0kgXwrV0YKgP0pFkMpsiCbTdJkfSLLOaz7hM6CYL4WAIzbWCdJQ-SvJ8kzlOhdU7l0IIuJ0GgYAAIXU+8kRmD8zCsGZnHIHR6WLDKdFxXx2NHX8VX4JNWCsQrJNqXFVPUv08rImZbFwaJvDAXhXHgBL4SFCBktvWDDL9KxivzPIiFgQRJFGylcABVkdH63odABHR7BvJTTIxAA1CB4DTBI4ygCwv2RFJTuZaIwFGtcMEKGRTx0ZUBjXPFpCgLcMAIIs1wACXgWAuq0JMTJyXEbrXWhXBYHw+X3PLnF3RVEZcDBXoIBB4TBpYdCXbh1xIGQaEnWdFWYtN4CEHGlnuiB10nAR4eq2nFQJtcZB2eN4Bp2YVXXDMIEEXmRh09cnngMARdqVGIfXZgnjXbdlRul4Wr3Hq-Wl5xatlZjRs83hvMkZtxIuwQWdqfJCnSwaRhEyHFVUVhwyoBG7dmZHUdFtnco92n2cF4XLdxvG03Xe0pZD3GWAjyXtb5ghrDXSOE9F1Xo9ZiMLJmqH+B5zOau9lxELKic0KQYuRlSqdyHCmz7vi9Ti1xY7TtoquVk7zdj2LwvLct3BIce3WmIq8zLPOGyzdYU6NpmIf1yel713e6AvrXqAABVJfjU6AGEjdUMAHnXbwzAsKw8B0PVJFsBP7oTPEqBhQQwGTxnpofgFVBSepfFfpLD+Qgv6Fx0rFKAoYKRrgllHVGsoPpGF4GmAA4jbGB8cwEFHhADYCoEYEOkwfAzqfJMbIIAJrrhoM7XgIUPa4G0mPA2w1TaNHNvAew1siiozmktRaxdIbLwwL7Kk-M1xBwLhgcOa5CFR1jjIzBrV-a1FLhoculdlHV0-FYLKOUdD13uBgdqJCepWAgBtVuMgTqCB0B3TRLgFK42jgPHI0QbyvkrDoNuNighJBSGkG6UFPFb2xPCXABBFpFipB410ABlWelhYl8lcJeBI0V2FCi9DXW29sWzCPqiQBe3JSrqFYHFXwVhIJFK9LwRUAIADyv1zbGUHsU+gkgmIABEqYyFrPAAg0I3FKOcKGIWEBQg2ASRw6KzhpK7FyFM0qxtCkey4aNGpdTGnrTWdlacG0jE2lUJOKwXp2lMVxMAeiNRDhbWgrWXgSZYDxIjDQJiSTJApMnGk6I7CrAdQsrAWwMydBbz+bwAFuIsnaLylC7gaEdEGQKWuWiwzagiW8o855khXnwGSMxQBkNXCK1xAAKVifUgAcskVIUD-6lgHpbOZ2QYTyVxGWGooytATKBa4waTKSI6AxaELFOK9asAJeuIlW5bF5W+sQaao0EpG3MNkaOOyyWUvASbbMarITlXws9ApQpyBkRWGqkgzB6gVWqjcmJGJukuTkPcd5nyvwOB+VMzJOloWDREvCalFgSCoucF6cMAAFGgEATbBuKe9XgcZynrK7DQDELUZinJtm0m2XpMyxQsemnZ1YaB1gbFQqgn182DVDbwCNUag0FoKEUYpj4qDrj3JWnIRaS0pDLRWmNfqdC7juhuAttSGm-WclZJ1-AtwxtOXyLpPS+kDKGdETl4zYAZGBfy4FzhJ1T3uEKZ8ax5LRGULczx4QPmXl8tFIVTzwzYqYkKe5mLH04pdZeVFzTP2TiFPEwNv74Cov3a5fgQGhQOqnTZID567XQnXaEAAsuCwG2JFrRWguwwIMxEIsONU1QauIgomyFHlLKBlYAkzQmuPKm5-y0foXud6VM3Z0b3C8nsPN2Mc1DDRxqMbHE7pmIRANggY2ifqXU40rBZUgOkCNK9rq7CysbTk2YOi0K4FcLRZkMNEObvYc42V-4jlTnnR04DDgrmKTg1QUKiRUOwASH41I5g-FJlbSC3EBmUMAoyJY6xOqHPYd8U5nZXoHqwAqVCswuIpMAhkxgdwsApjWCUzexcancjMjHFM7Zam3TUnWvBtw+1DpNkWWpvaB0rDeI4e4qgKSDo7Idgc8tfIrBQAecfEB+S-C4ipCV+zVB-mAzWTIG87CJs3iuDcGT9xHggCeAAdiwEgF4XwfggFoPQEQKoSDAhAJCMErARBqTaNFAoHTQxCheDIeEBw5uAwW3SEQTx3gOi+GRfACYqBoUeJQHbfwRCQHlNITg+AdicEYCKMUEpjjqBkGhPEpU1Rg+YBDgAAk8DAuOUDHAxxDpcR3WC+DMCIR1Z3vi-D24wInxBZz+Pc1caHIg4fik5EjlHaPCdC0x4z5ndAcd44wC8U4bm6Ak6uGTinjAqdbdp-8RUh3WeSBhyADnCPueo9VMcFXJARe2gwGgfXh3pf4Fl-8BXNPgd05ANisAJ01ca611zqgyPde8DVI7k6WOXgYFtCaMXxxIEpGOL7mg+RQwW5AFbyn0HvvLCAA)

Now that we have a separate `model` and `state` stream, this works nicely with the upcoming version of the Meiosis Tracer that I'm currently working on. I had to create a codesandbox of this, because the flems resulted in an URL that exceeded the limit.

[codesandbox with Meiosis-Tracer](https://codesandbox.io/s/jp9q3nnzw9)

When you trigger a `model`, you see the resulting `state`, this can be helpful to check what your services are producing.

Also, you can trigger a `state` directly, if you wanted to test your view with anything, bypassing what the services are producing.


