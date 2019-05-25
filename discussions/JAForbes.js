// Credit: James Forbes @james_a_forbes

```
@foxdonut had some realisations while working on a meiosis project. I'm super convinced that
actions should be functions now. It lets you update the state tree with anonymous actions and pull
them up into named actions as required. That's a nice workflow. It also plays very well with lenses
and queries.

But I figured out something new (for me at least). A distinction between one-off actions that occur
after a click event or user input, and ongoing state synchronization. Streams are really good at
the latter, but meiosis' one big stream runs sort of counter to that approach.

E.g. in my own projects I often use many distinct streams to efficiently create relationships
between different datasets and ensure those relationships are always in sync. E.g.
joining/grouping/filtering/counting/debouncing/throttling and sometimes even computing a view from
one of these streams.

But I figured out a pattern that lets you get the same benefits in meiosis.

I'm calling it a service.

So you have a structure like so
```

// Service
({ start: model$ => action$
 , initial: () => model
})

```
A start function that accepts the model stream and returns an action stream. The service can then
receive model changes and compute some new state from existing state and emit an action if
appropriate.

When you start up your app you can just add this to kick start your services.
```

// Ongoing things that should always react to model changes
const services = {
  stats: statisticsService,
  route: routeService,
  filtered: filterService,
  networking: networkingService,
  notifications: notificationService
}

// start every service
Object.values( services ).map( service => service.start(model).map( update ) )

```
And in your initialModel you can inject the initial for each service so there's no nulls.
```

[ initialModel ]
.concat(
  Object.entries( services ).map( ([key, service]) => ({ [key]: service.initial() }) )
)
.reduce( R.merge, {} )

```
Now you can get the best of both worlds. Event based and state reactive.

I'm really excited about this, I think this is a solution to a problem I've been thinking about
for a long long time. I really like entity component systems in game dev. I like how you can just
update the state tree and the game automatically reacts. Systems query the state every game loop
and respond.

UI's tend not to need that level of ambient intelligence. There's usually an event that triggers
some computation and then the view renders based on the state. But there's not much else to it.
But sometimes there's subtle overlap where a game awkwardly recreates events by adding data to the
state tree. Or a UI awkwardly triggers sequential actions to simulate the ambient intelligence of
an ECS. And I think services allow you to have a clean separation that's compatible with the
standard approach of dispatching actions that get consumed. Services ultimately just emit actions
automatically based on some relationship to state. So services are almost like a simulated user
that clicks buttons for you to keep things in sync.
```

mithril,mithril-stream,bss,ramda
https://flems.io/#0=N4IgtglgJlA2CmIBcA2AzAOgBxoDQgDMIEBnZAbVADsBDMRJEDACwBcxYR8BjAeytbwByEAB4S3AE4QADqwB8AHSoEArlW6sI-AARRJvGQCV4M+DVYkAFCQCUO4Mp3OdANxqSdk81ACeOgF4dAhpYEngAbicXd08oQJ0wDBJWbzorWyiqFx0SDDAaGSs1DS1dK1d7R2yclwgCHSsAQjS-HQAfdrcdJoCgqAyq6Nra1v8g1NVI4ZGXAcqs2Z0AXxnlzJnvVlVJbKgs1apRAHoJaTl5LhBwhE1tKjJGAEYABiQntBBl3Go6BiYAFZkHj8QTCRh8B6sHQASQSAA9AvIdPDlJCUjpeAlirgdABzewBZGIonBKx4qzw2y2NH8DEAaQRSMahOJtKhOmYqgKVAAMhAMUESMz4cLSdFRRgEFQ8axmDpkU8ZgB+FF5EiwCDceBWF64AC0T1sGABvAgVCsAHJcZb7ABqHSWx12kh2p1Oh2SjVanWGmk1ZxINUms0Wy225TsjEyWTwBFi4l5bxQVTaowQPFsKy8XEw-3o6EAEgS0WAOhkBhkQYA1syGqSsUSZlYyxg2zmdORqwBdIMEbNd7v2dbRXF4+CsIPShOY5nVHKxHS+RYuaeNZwk5HjFE6ezZ-05LY7bLL6KHZyHKNFgBGvHh8DFOkLGArhkaltv95IEY0dKLUAfKRZDKbIgmfV8ZHfACzmA+4fwLJ8+FgXhJEfcDK3fJCUO-f0rx0ABBO5dCCecdBoGAACE7yDTcZhjMwrBmZxyB0elKQPWpcV8GdRRFPJIW4CwrG4jiclxQtPwfJidG7GZbFwaJvDAXhXHgKj4SDCAkRmCS7wfKw1T4jAiFgQRJAMylcABVkdC03odABXdd2US9fw5AA1CB4AAdwSVQZCgCw41JFIguZaIwAMy0MEKGQPR0a8MAGS08WkKBbWM-tLQACXgWBVK0QSfzExIrVoVwWB8eBJCdaTnAda86pcJKrQIBB4WKpYdBNbgrRIGQaG1fVrwnbz4CETqlhiiArW1ARqsm2YMGvXrLRkHYZAQRaRgwVbvOYCBBG22oXytJ54DAY6cia3FIstZgnktO1Esil55MddSHyunRxIwcdWAMwssNQpybFYILRJOgoiiajdmTu69VFYVh+FqgMuoa2GTpW9isZyXarX2w74G+nbvKtAAmC7SZO5hKepyGuu6ghrEtKnLsZrr8l1TmptvSQAPMy0qH4Enec4vGHExDRNW4askElnJ6J1chCJAmLKLvdjcX8wLBCHSXzyZn7nUtLHxchyHcDuuLfv+qxC2goC5HuPdQsEewrbu+LEuS1LoAy-2oAAFQuzagoAYV4WBuQeK1vDMIS8B0J4CEkWxvpizU8SoGFBDAVm5rMzOAVUFJ6l8POLsLoRi-Fl9yKgc0KUtc6Oaav60qMXhvIAcUKM6GY7gp4VyjMs1bgAWIf0fxlTqranuAE0rRoJHeB-aTcGfe2n0k4U3fBj3uuhxjZ5cSzbJsrHvZ0Brlt6qkCctImjuNcnLWnjmWCtL-bQU8+Iwyz8G4LLeWityyxisCxNiBEiJUAwEpee6krAQE9jrAKYUDaANqEbJYnNLYzGiLhKgkY3IYl1mFIISQUhpEivmP8Ohg7YnhLgAgNl+xUjIQhAAykfEgPDqquB9AkUioVJAA2UgBWAthSLOCPLsPQlYTCJ0sGfEYUi8r5AHjuUk8Jlp6QPnJGY2iig6CMLtXg6hWAUV8FYPMzl0amIMhY3g14AQAHksruxwo4-Gp9zH5GquOAAIuNGQvJ4AEGhBxb40RzSHQgKEMGEM5FeAnMeXIR94CWOQqhaSzjAluM8Q0Y0AS2JvV3Ig+AKZtRWAsfQSQ45cTABHDUQ4rkEK8l4IJWAfCUI0HHIIyQwjtSiOiOIyRvBpGyJmAhShggEg0NSOYehRD0b6EMCo8wajpKaNgIUixMY5bQI-IYy0Q4-EuEhs46Sm4dDIV6f0yQgycnhFYFXO6rhHq4gAFI8I8QAOWSKkZuFd2JXOcBxTYGTFELPgGeABzh4lUESck2Z6MYXbEUSxR5oRnmvL+hOT5Vpvm2hkgUkyZkDJUWjuYbInNCn-KBQ3VCcZGUCSEmWfeQZyDdhWIykgB1okZCYmeFy3DGFhJgi7fgwzRnBQcBM8GEirD7IxYeWFexlGmB2dYPZ0ytEBPufonxkLzW3PPkcqBTULEowAAo0AgKhJFswLGpSsTIWxLipQ0AxPJW1hznEWOYD4dBgaAlch5PyFIq8qDpXDTgu1vBHXOpIK6kYDSdEWNNOaK0jpE1LCjTQPkAoAaWhLQmjNtQTV30dBgM259CFOICa49xXirRO3OCBclNzW1BKafAMJphInRKuXEmoCStDorSQo7IaTnBdtgvwIM4Y1jipqBK0h5DoThBGT6R8pE8V9JRi88cQZulPNPa8+VPpXU+NvdqIMfCLACKEXe6IS7ZVUEffAIM0rnYgV-VuvCU6kmwAALKGtgNiGypEELu2CjMMsCVDG8tkujXEwMSBBmkixD8sBBrVkbSMG0yYSOcUdKlcaVAKMlUtAMmUJMt6OhjFQYj0luzVqNnOpVTi2yIerW2DAHj3HwE0AU2u0h9J7oVXYApp8mrQOrLgVwlzSQVTA8kxDBCCnJlTDqBpwT4AtLaReEDO7EjQaWSCuhyRBIWiYbiLTkHoMZAwXrdlZDRMAnE6wDA7gY4yffdqOwhSZzqhVVMmZzj4We0lRyYRPklnQecZ5HyVg4skKS95Qp9ykjeHjdVKwUAenclrgYvwuIqS7iuDcPz9xHggDeC8Q0ABOSeSBJ6fG+L8egIhdokGBCASEYJWAiFvG0UiBQmnmiDC8GQ8IDh1byg1ukIgnjvEnl8LjIBNTsceJQEAtB+uMEgHKaQnB8A7E4IwNgrAZA4eOMcdQMhqx4ksWAY453mCXYAAJPAwIDlA33Dq-eICaYbrBfBmBEDK8bvXjt-BED9y7+paGrKuDdkQ93HtIGe6997n3QcXeIOjlZdAAdA4wC8U4FOkhAiuND2HjB4dfB+Ej07IBrxDax5IW7IBcdPZe1QN7H2+BfZ5yQKnFMMBoGOFLyHTOYf-DZ4jk7-wXlgECnzgXQv8ci7F8TrXgU-svAwBTAArDT44TcUjHBNzQfI5olf4GZ6rwDO3lhAA

https://flems.io/#0=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-ah7d4gOOtN0FB+DjALxTi06SECK4COkeMBR4N9H-xrwTfx5IJ7IAifvc+1Qb7v2+D-f5yQenFMMBoGOLLuH7PEf-G52jy7GOQDvLAIFQXwvRck-F5LinevArA5eBgCmABWRnxwm4pGOBbmg+RzSq-wBzjXd6jvLCAA

https://flems.io/#0=N4IgZglgNgpgziAXAbVAOwIYFsZJAOgAsAXLKEAGhAGMB7NYmBvAHgBMIA3AAgjYF4AOiAwAHUcIB8gtN24yWAeg6dJlEHBixqxCPQSIQARkQAmEAF8K6bLkP4AVgip0GTYnldxi3AJLd+bgAlfD53CGIATxkvHwAVAOD8MVEoSLjaGP0fAHVEkIBXNDR4YhlFRVjuPMCwAMluAA967jAACkaASg7OmSy0b25CAqwMNAAZCEHAuBbG2f4GmTl5-Fg0AHNiQm4Go2W5bgB+Jrh8OCgIahg2gAYKAFojTsdaCDQ2gHIKbk-O7gA1L9fgC4ADPsCgasLlcbk9erJDohTq93l8-n00FV3hFEsADsIAEa0RrwYTI5AHOTCDYAJxgTGEFCp8hA9LYwgOAF0ZBZMVUCqI2BhGIksOdiPTsG0Ef1BoK2EZ8vhRBBRDcWc1Fk18MTSXADj8QnQisQAEKRNq+BFyI34WiEhwAeXan28IrgGMRdpwtI2MAAIgzROMYGAfDIbfIsdluArTMrVeq2gctQ1GhKPczESFiLQAAoYCC0uDZuQhOm0QUWtpJKAYQadMtJUaiWshVttEKEGAYNj-JsHDtiWvDUYTKbEL5jNh-biDnP4POF4ulof4TtJBxvD4QucLuRjsaTbzTtCzg9NOaA374b7rh3O11seDUWlq3T0P7NjswP2B4NQ3DSMCRjAYfCwWgXygBZuHFbwpXg6gxi7ZJxDSDIfhxYgfgVEUYFlMDBndUVAhCFI0lQpMYB+ZAFSMXChVMLkNxHHJOkIqoSPgMUoK0M5O24-5MUg6CBJHUStBafFES8WhYDWWgNjaSSoARCxCO48S2246SDjkhSoCUtohIOcV6XPP82hSZs5CwFMQFEekmW4AApABlJ0ADkJXfTYIDAS1uJ+NACigKAfgAFg4g51MI1S4DaYBuD1eAKV+OkGTQb4MvpJgcs+dkIS5DS5QgvioATQIcjaejugSmUETbYRVNMFzWoRKpVIAZkSGr43qirTCahyevairuoRdRNG0T8BjwSLTEQSKAE5LGsEBMBwPB8GoOBnBoehGGYQxLC5KhLjQABrAxUE22w8FpbBhXUApaXIQwSGIUQ4EQCoilEK6Nl22gsEUJ6sGFAABW58FMABWfBbmUSdweejAN3eRwDqidU8DgN8P3WmxtsMLAIkId9yCoN6PpAL6fr+xQAaBkGwfJ7Yqahox8B5gA2RQOcp6BsfUXG7A0QnRA8KwSYloWqYeBDeywV73rwBnfv+tBAeBuh2YpxXlewbneaRxRjfFJwxciPHDAJ99pbOiwgA

https://flems.io/#0=N4IgtglgJlA2CmIBcA2AzAOgBxoDQgDMIEBnZAbVADsBDMRJEDACwBcxYR8BjAeytbwByEAB4S3AE4QADqwB8AHSoEArlW6sI-AARRJvGQCV4M+DVYkAFCQCUO4Mp3OdANxqSdk81ACeOgF4dAhpYEngAbicXd08oQJ0wDBJWbzorWyiqFx0SDDAaGSs1DS1dK1d7R2yclwgCHSsAQjS-HQAfdrcdJoCgqAyq6Nra1v8g1NVI4ZGXAcqs2Z0AXxnlzJnvVlVJbKgs1apRAHoJaTl5LhBwhE1tKjJGAEYABiQntBBl3Go6BiYAFZkHj8QTCRh8B6sHQASQSAA9AvIdPDlJCUjpeAlirgdABzewBZGIonBKx4qzw2y2NH8DEAaQRSMahOJymUx2OOhMBHg3g08CQOjYrBkJCQnLxEBSGClrGYqgARhg+GBjgBBdwAR2OTwIL3QKHg3AArNwsFAUDR4FAAEzwAAsJtpUJ0AHUEkYMOoqPAMZz3TpVYqILRWLxJLjFCAoKoZLAINwLPdo7iAO7MPnwQNBBqkknIgiU2zFnTsjR06EKgpUAAy0uhQRIzPhzdJ0VbGAQVDx8p0yKeMwA-Ci8iQE9x4FYXrgALRPWwYAG8UNWADkuLX9gA1Do13vtyRt-v97vO+PE1P5zSas4hZ3l6u11vy+joTJZNmgq2W3lvLHJyMCA8TYKxeFxGEbzfHQABIEmiYAdBkAwZCFABrZk82RLEiRmKxEIwQjwJ0cg0IAXSFIteFIsj7HWaJcTxeBWCFbs22w5lqhyWIdF8RYXDYxpnALXimXsMCbxyLYdmyPjokOZxDhdDEYMVXh4T9BIYIwZDDEaNc1I0kgXwrV0YKgP0pFkMpsiCbTdJkfSLLOaz7hM6CYL4WAIzbWCdJQ-SvJ8kzlOhdU7l0IIuJ0GgYAAIXU+8kRmD8zCsGZnHIHR6WLDKdFxXx2NHX8VX4JNWCsQrJNqXFVPUv08rImZbFwaJvDAXhXHgBL4SFCBktvWDDL9KxivzPIiFgQRJFGylcABVkdH63odABHR7BvJTTIxAA1CB4DTBI4ygCwv2RFJTuZaIwFGtcMEKGRTx0ZUBjXPFpCgLcMAIIs1wACXgWAuq0JMTJyXEbrXWhXBYHw+X3PLnF3RVEZcDBXoIBB4TBpYdCXbh1xIGQaEnWdFWYtN4CEHGlnuiB10nAR4eq2nFQJtcZB2eN4Bp2YVXXDMIEEXmRh09cnngMARdqVGIfXZgnjXbdlRul4Wr3Hq-Wl5xatlZjRs83hvMkZtxIuwQWdqfJCnSwaRhEyHFVUVhwyoBG7dmZHUdFtnco92n2cF4XLdxvG03Xe0pZD3GWAjyXtb5ghrDXSOE9F1Xo9ZiMLJmqH+B5zOau9lxELKic0KQYuRlSqdyHCmz7vi9Ti1xY7TtoquVk7zdj2LwvLct3BIce3WmIq8zLPOGyzdYU6NpmIf1yel713e6AvrXqAABVJfjU6AGEjdUMAHnXbwzAsKw8B0PVJFsBP7oTPEqBhQQwGTxnpofgFVBSepfFfpLD+Qgv6Fx0rFKAoYKRrgllHVGsoPpGF4GmAA4jbGB8cwEFHhADYCoEYEOkwfAzqfJMbIIAJrrhoM7XgIUPa4G0mPA2w1TaNHNvAew1siiozmktRaxdIbLwwL7Kk-M1xBwLhgcOa5CFR1jjIzBrV-a1FLhoculdlHV0-FYLKOUdD13uBgdqJCepWAgBtVuMgTqCB0B3TRLgFK42jgPHI0QbyvkrDoNuNighJBSGkG6UFPFb2xPCXABBFpFipB410ABlWelhYl8lcJeBI0V2FCi9DXW29sWzCPqiQBe3JSrqFYHFXwVhIJFK9LwRUAIADyv1zbGUHsU+gkgmIABEqYyFrPAAg0I3FKOcKGIWEBQg2ASRw6KzhpK7FyFM0qxtCkey4aNGpdTGnrTWdlacG0jE2lUJOKwXp2lMVxMAeiNRDhbWgrWXgSZYDxIjDQJiSTJApMnGk6I7CrAdQsrAWwMydBbz+bwAFuIsnaLylC7gaEdEGQKWuWiwzagiW8o855khXnwGSMxQBkNXCK1xAAKVifUgAcskVIUD-6lgHpbOZ2QYTyVxGWGooytATKBa4waTKSI6AxaELFOK9asAJeuIlW5bF5W+sQaao0EpG3MNkaOOyyWUvASbbMarITlXws9ApQpyBkRWGqkgzB6gVWqjcmJGJukuTkPcd5nyvwOB+VMzJOloWDREvCalFgSCoucF6cMAAFGgEATbBuKe9XgcZynrK7DQDELUZinJtm0m2XpMyxQsemnZ1YaB1gbFQqgn182DVDbwCNUag0FoKEUYpj4qDrj3JWnIRaS0pDLRWmNfqdC7juhuAttSGm-WclZJ1-AtwxtOXyLpPS+kDKGdETl4zYAZGBfy4FzhJ1T3uEKZ8ax5LRGULczx4QPmXl8tFIVTzwzYqYkKe5mLH04pdZeVFzTP2TiFPEwNv74Cov3a5fgQGhQOqnTZID567XQnXaEAAsuCwG2JFrRWguwwIMxEIsONU1QauIgomyFHlLKBlYAkzQmuPKm5-y0foXud6VM3Z0b3C8nsPN2Mc1DDRxqMbHE7pmIRANggY2ifqXU40rBZUgOkCNK9rq7CysbTk2YOi0K4FcLRZkMNEObvYc42V-4jlTnnR04DDgrmKTg1QUKiRUOwASH41I5g-FJlbSC3EBmUMAoyJY6xOqHPYd8U5nZXoHqwAqVCswuIpMAhkxgdwsApjWCUzexcancjMjHFM7Zam3TUnWvBtw+1DpNkWWpvaB0rDeI4e4qgKSDo7Idgc8tfIrBQAecfEB+S-C4ipCVqgVwbgyfuI8EATwADsKAkAvC+D8EAtB6AiBVCQYEIBIRglYCINSbRooFA6aGIULwZDwgOKNwG426QiCeO8B0XwyL4ATFQNCjxKDLb+CISA8ppCcHwDsTgjARRiglMcdQMg0J4lKmqX7zB-sAAEngYBRygY48P-tLk26wXwZgRCOt298X4q3GCY+ILOfx7mrhA5EKD8UnJIfQ9hxjoWCOKdU7oMj1HGAXinDc3QbHVxcf48YITxbJP-iKg2zTyQwOQD0-B0zmHqpjjS5INz20GA0Bq420L-AIv-ji+J190nIBsVgBOrL+XivGdUChyr3gaoLcnURy8DAtoTS8+OJAlIxwXc0HyKGfXIBDcE+g095YQA

const I = x => x
const o = (f, g) => x => f(g(x))
const K = x => () => x
const humanList = s => xs =>
  xs.length > 1
    ? xs.slice(0,-1).join(', ') + ' '+s+' ' + xs.slice(-1)
    : xs.join('')

const pipe = xs => xs.reduceRight(o, I)
const $ =
  { prop: k => f => o =>
    ({ ...o, [k]: f(o[k]) })
  , get: lens => o => {
    var y;
    lens (  x => y = x ) (o)
    return y;
  }
  }

const $boxes = $.prop ('boxes')
const $description = $.prop ('description')
const $colors = $.prop ('colors')

const Action = {
  addBox: x =>
    pipe(
      [ K(x)
      , ys => xs => xs.concat(ys)
      , $boxes
      ]
    ),
  removeBox: i =>
    $boxes( xs => xs.filter( (x,j) => i != j ) )
}

const View = update => state =>
  m( '.app' + b.d('grid').ff('Helvetica')
    , m('nav.header'
        + b
          .d('flex')
          .jc('space-between')
          .ai('center')
          .bc('purple')
          .c('white')
          .p('1em')

        , m('h1'+b.m(0), 'Boxes')
        , $.get( $colors ) (state)
        .map(
          x => m('button'
            + b
              .bc(x)
              .c('white')
              .w('2em')
              .h('2em')
              .fs('2em')
              .m(0)
              .border('none')
            ,
            { onclick:
                pipe([Action.addBox(x), update])
            }
            , '+'
          )
        )
    )
    ,m('p', $.get($description) (state) )
    ,m('' + b.d('grid').gridTemplateColumns('repeat(3, 1fr)')
        .alignItems('center')
        .justifyItems('center')
        .padding('1em')
        .gridRowGap('1em')
        .maxHeight('14em')
        .overflowY('auto')

      ,$.get( $boxes ) (state) .map(
        (x, i) =>
          m('' + b.bc(x).c('white').w('4em').h('4em'),
            { onclick:
              pipe([ K( Action.removeBox(i) ), update ])
            }
          )
      )
    )

  )



const update = m.stream()
const T = (x,f) => f(x)

const StatsService = {
  start(model){
    return dropRepeats(
      model.map( x => x.boxes )
    )
    .map( R.countBy(I) )
    .map( R.objOf('stats') )
    .map( R.mergeDeepLeft )
  },
  initial(state){
    return state.colors
      .map( R.objOf ).map( K(0) ).reduce(R.merge, {})
  }
}

const LocalStorageService = {
  start(model){
    const update = m.stream()

    dropRepeats(
      model.map( R.pick(['boxes']) )
    )
    .map(
      x => localStorage.setItem('v1', JSON.stringify(x) )
    )

    return update
  },

  initial(){

    return [ localStorage.getItem('v1') ]
      .filter( Boolean )
      .map( JSON.parse )
      .concat({ boxes: [] })
      .shift()

  }
}

const DescriptionService = {
  start(model){
    return dropRepeats(
      model.map( x => x.stats )
    )
    .map(
      R.pipe(
        R.toPairs,
        R.groupBy( R.last ),
        R.map( R.map(R.head) ),
        R.map( humanList('and') ),
        R.toPairs,
        R.map( R.join(' ') ),
        humanList('and'),
        x => x + '.'
      )
    )
    .map( R.objOf('description') )
    .map( R.mergeDeepLeft )
  },
  initial(){
    return {
      description: ''
    }
  }

}

const services = {
  localStorage: LocalStorageService,
  statsService: StatsService,
  descriptionService: DescriptionService
}

const initialModel = () => {
  const state =
    {  boxes: []
    , colors:
      [ 'black'
      , 'red'
      , 'green'
      , 'orange'
      , 'pink'
      ],
    }
  return {
    ...state,
    ...Object
      .entries(services)
      .map(
        ([k,v]) => v.initial(state)
      )
      .reduce(R.merge, {})
  }
}

const model = m.stream.scan( T, initialModel(), update )

Object.values(services).map( s => s.start(model).map(update) )

const view = model.map(View(update))

view.map( x => m.render(document.body, x) )

```
So in the above example. There some events that occur. Clicking a colour creates a new box of the
same colour. Clicking a created box, removes it.

That's standard action dispatching from events. But there's 2 features we want, that are less to do
with 1 off modifications and more to do with keep disparate parts of the state tree and the browser
in sync.

So we've got 3 services. LocalStorageService, StatsService and DescriptionService
You might notice, if you edit the boxes a refresh, will not lose your state. The management of that
state synchronization is a little awkward in a Redux model (which actions trigger persistence, and
  what gets persisted). But having an ongoing system that manages that is pretty logical.

There's a stats service, that just counts the different colours. Often in views, there's summaries
that we access by filtering in the view and getting the length. And that's fine, we've got plenty
of CPU cycles to burn. But what's awkward is when 2 parts of the app need the same count, or a
value used in the computation of that sum. So in React, this sort of thing would become instance
state or manually sync things in a saga. But what's missing is an explicit relationship to the data
that controls the updates, and streams are really good at that. So again, a service works well here.

Then we have an example of a service using the output of another service. The description service
just injects a description of the stats as human readable text. This is the sort of code that
usually doesn't have a nice place to "live".
```









```
@foxdonut I wanted to show you this notion, but was waiting til it was a bit more mature...
but oh well.

An idea I've been working on is nominal maybe's and eithers for common states, e.g. Validatable,
is just an Either that is nominally typed. So it has the exact same semantics and API, but if you
pass say an Either to a function that expects a Validatable, you get an error. So you're
constantly forced to handle the full possibility space when generating UI's but also testing.

That's what all this is about in the tests.
```

T(
    editing$()
    , pipe(
        caseIs( route.$Editing, 'Organization' )
        , M.map( e => e.value )
        , M.chain( Loadable.toMaybe )
        , M.chain( Validatable.toMaybe )
        , M.chain( Modifiable.toMaybe )
        , M.map( Saveable.fromSaveable )
        , M.map( o => o.organization_name )
        , M.chain( Validatable.toMaybe )
        , M.toBoolean
        , x => t.ok(
            x
            , 'Organization is Valid and Clean'
        )
    )
)

```
Here editing$() is a stream of the data we are currently editing, and it could be in various states.
I basically assert its in the correct state step by step by converting state into Maybe's...
gradually getting closer to the actual data.

It looks verbose, but think of it like code coverage. If you don't traverse all the states, the test
isn't very good.

Same is true for UI:

Here's a button that saves some data, its disabled state, and its label traverse its possible states
in order to determine the value.

Normally we'd do this with ternaries, but checking cases isn't as explicit or even enforced when you
do that.
```

m("button", {
  disabled:
    T(
        validatable
        ,Validatable.fold(
            () => true // invalid, therefore unsaveable
            ,Modifiable.fold(
                () => false //modified, therefore saveable
                ,() => true //unmodified, therefore nothing to save
            )
        )
    )
}
, T( validatable, pipe(
    Validatable.fold(I,I) // or Validatable.fromValidatable
    ,Modifiable.fold(I,I) // this just skips this layer explicitly
    ,Saveable.fold(
        () => 'Create'
        ,() => 'Save'
    )
)))

```
Above we do care if the state is valid or modified when determining if the button is disabled.
But we don't care about those states when determining the button text. For the button text we can
just pass through those layers by folding with identity.
```

Modifiable.fold(
    () => false //modified, therefore saveable
    ,() => true //unmodified, therefore nothing to save
)

```
This could just use Modifiable.toBoolean or Either.toBoolean, but I was cautious with sugar for
such a new approach

Ok so, that library sum-type that I wrote, you can use that to create Maybe
```

const a = $.TypeVariable('a')
const Maybe = Sum('Maybe', {
    Just: { value: a }
    ,Nothing: {}
})

"You can create instances, of that type like so:"

Maybe.Just(4)
Maybe.Nothing()

```
And you can create functions that handle each case of the sum type, in a discriminated manner
(if you don't handle every case, you get a type error).
```

Maybe.toNullable = Maybe.case({
  Just: x => x
  ,Nothing: () => null
})

Maybe.toNullable( { value: 'not a maybe' }) //=> TypeError
Maybe.toNullable( Maybe.Nothing() ) //=> null
Maybe.toNullable( Maybe.Just('Yay') ) //=> 'Yay'

"sum-type is 100% compatible with sanctuary-def, so you can now use Maybe as a type. e.g."

// A sanctuary-def record type
const $SomeType = $.Record({
  name: Maybe
  ,dob: $.ValidDate
})

const someFunction = def('someFunction', {}, [$SomeType, Maybe], o => o.name )

someFunction({ name: Just('hello'), dob: new Date() }) //=> Just('hello')
someFunction({ name: 'hello', dob: new Date() }) // type error, "name" is not a Member of Maybe...

"You can also use sanctuary-def types in a sum-type."

const Auth = Sum('Auth', {
  LoggedIn: { username: $.String, session_id: $.FiniteNumber }, //<-- built in sanctuary-def types
  LoggedOut: {}
})

"You can also nest types created by sum-type:"

const User = Sum('User', {
  User: { auth: Auth }
})

"With all that said... I have a data structure called Editing that is a bunch of nested sum-types."

const LoadableValidatableModifiableT = T =>
    Loadable.$Type(
        Validatable.$Type(
            Modifiable.$Type(T,T)
            ,Modifiable.$Type(T,T)
        )
    )

const $Editing =
    Sum(
        'Editing'
        ,T(
            { Organization: $SaveableEditableOrganization.$Type
            , Role: $SaveableEditableRole.$Type
            , Group: $SaveableEditableGroup.$Type
            , Invite: $SaveableEditableInvite.$Type
            }
            ,pipe(
                mapObj(
                    pipe(
                        LoadableValidatableModifiableT
                        ,objOf('value')
                    )
                )
                ,merge( { Nothing: {} } )
            )
        )
    )

```
It's kind of fancy, but we're basically wrapping every case in several layers of sum-types to
create a final outer layer $Editing.

The $ prefix is my way of saying 'this thing is a type'.

You could write the above literally, but it's painful, it'd look like:
```

const $Editing = Sum('Editing', {
  Organization: {
    value: Loadable.$Type(
        Validatable.$Type(
           Modifiable.$Type(
              SaveableEditable.$Type( SaveableEditableOrganization.$Type )
              ,SaveableEditable.$Type( SaveableEditableOrganization.$Type )
           )
           ,Modifiable.$Type(
              SaveableEditable.$Type( SaveableEditableOrganization.$Type )
              ,SaveableEditable.$Type( SaveableEditableOrganization.$Type )
           )
        )
    )
  }
})

```
But this basically says, we can Edit any of these things, so if you have a function that deals
with the Editing type, you have to handle all these possibilities.

The actual data just looks like this:
```

{ value: { value: { value: { value: { value: { organization_name: { value: '' }}}}}}}

```
Or something ridiculous. Each layer being a particular type. Each layer has some special fields
on their prototype which allows for type checking and dynamic dispatch of the case function. The
idea is, you should never manually dive into the data structure, and I'm considering enforcing that
via closures (one day)

This whole .$Type thing is a manually created UnaryType or BinaryType (which isn't built into the
sum-type library for free. The default provided type is a NullaryType, it basically states
'I was created by the Maybe constructor' but not much else. But these type functions let us be a
lot more specific. They let us say, this Maybe, will always have a record with these fields in it.

Or, if this Either is in the Right state, it will look like a normal string, but if its in the
Left state it will have a whole bunch of validation metadata. And we can type check that
(and we do!)
```

const { Modifiable, Dirty, Clean } =
    NominalEither({
        name: 'Modifiable'
        , Left: 'Dirty'
        , Right: 'Clean'
    })

```
There's this function, that generates an Either from scratch, with all the static methods, and
even some custom ones.

That's literally it.
```

const {
    Validatable
    ,Invalid
    ,Valid
} = NominalEither({
    name: 'Validatable'
    , Left: 'Invalid'
    , Right: 'Valid'
})

"There's a similar function for nominal maybe's"

const { Loadable, Loaded, Loading } =
    NominalMaybe({
        name: 'Loadable'
        , Just: 'Loaded'
        , Nothing: 'Loading'
    })

"To create an item, we just compose the constructors:"

const list = Loading()

"For example. Is like saying:"

const list = Maybe.Nothing()

```
But its type checked more specifically, and in error messages it will say 'Loading' instead of
'Nothing'.

If our data comes back from the server. We might do this.
```

pipe(
  Loaded
  ,Saved
  ,Valid
  ,Clean
  ,list$
)(list)

```
That list$ is a flyd stream, so we write decorated data into a stream, which ends up in our
single state model - that's another system, and could easily be redux or meiosis instead.

Sanctuary's Maybe's/Either's aren't nominal. So you can do it, but you don't get the same level of
guarantees.

Also the fold(I,I) isn't really type safe for an Either, because the signature is Either a b,
where a and b can be different. In my case, whenever I do that, a and b are exactly the same type
so its okay in my context. But sanctuary would rightfully complain. That's why there's methods like
fromEither in sanctuary.

You could do something like this in sanctuary:
```

T( validatable, pipe([
   fromEither(I)  // Validatable
   ,fromEither(I) // Modifiable
   ,either( K('Create'), K('Save') ) // Saveable
]))

```
Each layer is just an Either though, so with that code, sanctuary won't guarantee a particular
layer is meant to represent say Validation, or whether its been Modified
```

////////

"Fred's take:"

// A value can be invalid or valid; not modified or modified.

// valid = false
const raw1 = "hello";
const val1 = S.Left("invalid");
const disabled1 = S.either(S.K(true), S.K(false), val1);

// valid = true
const raw2 = "hello";
const val2 = S.Right(raw2);
const disabled2 = S.either(S.K(true), S.K(false), val2);

// valid = true, modified = true
const raw3 = "hello";
const modified3 = S.Right(raw3);
const val3 = S.Right(modified3);
const disabled3 = S.T(val3, S.pipe([
  S.either(S.I, S.I)
, S.either(S.K(true), S.K(false))
]));

// valid = true, modified = false
const raw4 = "hello";
const modified4 = S.Left(raw4);
const val4 = S.Right(modified4);
const disabled4 = S.T(val4, S.pipe([
  S.either(S.I, S.I)
, S.either(S.K(true), S.K(false))
]));

const r1 = S.Left(S.Left("w"));
const r2 = S.Left(S.Right("x"));
const r3 = S.Right(S.Left("y"));
const r4 = S.Right(S.Right("z"));

const bimapK = x => S.bimap(S.K(x), S.K(x));
const prependStr = S.flip(S.concat);

const result = S.pipe([
  S.either(bimapK("0"), bimapK("1"))
, S.either(prependStr("a"), prependStr("b"))
]);

[
  disabled1  // not valid -> true
, disabled2  // valid -> false
, disabled3  // valid, modified -> false
, disabled4  // valid, not modified -> true
, result(r1) // 0a
, result(r2) // 0b
, result(r3) // 1a
, result(r4) // 1b
]

////////

"Here's the source (so far, its changing frequently) for my nominal stuff."

////////

const $ = require('sanctuary-def')

const Sum = require('sum-type')($, { checkTypes: true, env: $.env }).Named

const a = $.TypeVariable('a')
const b = $.TypeVariable('b')

const T = (a, f) => f(a)
const I = x => x
const K = a => () => a
const B = (f,g) => x => f(g(x))
const C = f => x => y => f(y)(x)

const NominalMaybe = ({ name, Just, Nothing }) => {

	const $T = Sum('harth/'+name, {
		[Just]: { value: a }
		,[Nothing]: {}
	})

	const Y = $T[Just]
	const N = $T[Nothing]

	$T.$Type =
		$.UnaryType(
			'harth/'+name
			,''
			, Ma => [Ma]
				.filter( x => x != null)
				.map( Ma => Ma._name )
				.filter( a => [Just, Nothing].find( b => b == a) )
				.some( () => true )
			, x => x._name == Just ? [x.value] : []
		)

	$T.fold = (b, f) =>
		$T.case({
			[Just]: a => f(a)
			,[Nothing]: () => b
		})

	$T['is'+Just] =
		$T.fold( false, () => true )

	$T.map = f =>
		$T.fold(
			N()
			,a => Y(f(a))
		)

	$T.chain = f =>
		$T.fold(
			N()
			,f
		)

	$T.assert = f => a =>
		f(a)
		? Y(a)
		: N()

	$T.filter = f =>
		$T.chain($T.assert(f))

	$T.alt = (Ma, Na) =>
		$T.fold(
			// we use fold for type checking
			// could just be a `Na` otherwise
			$T.fold( Na, () => Na )(Na)
			,() => Ma
		)(Ma)

	$T.and = (Ma, Na) =>
		$T.chain( K(Na) )(Ma)


	if( name != 'Maybe'){
		$T.toMaybe =
			$T.fold(
				Maybe.Nothing()
				,Maybe.Just
			)
	}

	$T.toBoolean =
		$T.fold( false, () => true )

	$T['to'+name] = Unknown =>
		Unknown != null
		? Y( Unknown )
		: N()

	$T['from'+name] = b =>
		$T.fold( b, i => i )

	$T.toNullable =
		$T.fold( null, i => i )

	$T.zero = $T[Nothing]()

	$T.nominal = { Just, Nothing }

	return {
		[name]: $T
		, [Just] : Y
		, [Nothing]: N
	}
}

const {Maybe} = NominalMaybe({
	name: 'Maybe'
	, Just: 'Just'
	, Nothing: 'Nothing'
})

const NominalEither = ({name, Left, Right}) => {

	const $T = Sum('harth/'+name, {
		[Left]: { value: a }
		,[Right]: { value: b }
	})

	$T.fold = (Fac, Fbc) =>
		$T.case({
			[Left]: Fac
			,[Right]: Fbc
		})

	$T.swap =
		$T.fold( $T[Right], $T[Left] )

	$T['from'+name] =
		$T.fold(I,I)

	$T.bimap = (Fac, Fbc) =>
		$T.fold(
			a => $T[Left]( Fac(a) )
			,b => $T[Right]( Fbc(b) )
		)

	$T.map = (Fbc) => Eab =>
		$T.bimap( i => i, Fbc)(Eab)

	$T.toMaybe = $T.fold( () => Maybe.Nothing, Maybe.Just )

	$T.swapToMaybe = $T.fold( Maybe.Just, () => Maybe.Nothing() )

	$T.nominal = { Left, Right }

	$T.$Type = $.BinaryType(
		'harth/'+name
		,''
		, Ma => [Ma]
			.filter( x => x != null)
			.map( Ma => Ma._name )
			.filter( a => [Left, Right].find( b => b == a) )
			.some( () => true )
		, e => e != null
			&& e._name === Left ? [e.value] : []
		, e => e != null
			&& e._name === Right ? [e.value] : []
	)


	return {
		[name]: $T
		, [Left]: $T[Left]
		, [Right]: $T[Right]
	}
}

const {Either} = NominalEither({
	name: 'Either'
	, Left: 'Left'
	, Right: 'Right'
})

const MaybeToMaybe = (T1, T2) => a =>
	T1.case({
		[T1.nominal.just]: T2[T2.nominal.just]
		,[T1.nominal.nothing]: () => T2[T2.nominal.nothing]()
	}, a)

const EitherToEither = (T1, T2) => a =>
	T1.case({
		[T1.nominal.left]: T2[T2.nominal.left]
		,[T1.nominal.right]: T2[T2.nominal.right]
	}, a)

const get = k => o => Maybe.toMaybe(o[k])
const head = xs => Maybe.toMaybe(xs[0])
const find = f => xs =>
	Maybe.toMaybe(xs.find( x => f(x) ))

const pipeWith = (x, [f, ...fs]) =>
	fs.reduce(
		(x,f) => f(x)
		,f(x)
	)

const apply2 = f => ([x,y]) => f(x)(y)


const caseIs = ($T, caseName) => Ta =>
	$T.case({
		[caseName]: () => Maybe.Just(Ta)
		,_: () => Maybe.Nothing()
	}, Ta)

const caseIsNot = ($T, caseName) => Ta =>
	$T.case({
		[caseName]: () => Maybe.Nothing()
		,_: () => Maybe.Just( Ta )
	}, Ta)

//eslint-disable-next-line
module.exports = {
	Maybe
	,Either
	,NominalMaybe
	,NominalEither
	,MaybeToMaybe
	,EitherToEither
	,caseIs
	,caseIsNot
	,get
	,head
	,find
	,T
	,I
	,K
	,B
	,C
	,a
	,apply2
	,b
	,pipeWith
}

// Queries!
/*
The top 3 functions would be provided utils, the last 3 is usage code
so queries are like lenses that assume you want to update, and because we're assuming that we avoid
a lot of indirection by having to use functors ( R.over ). Instead we just call the query directly.

combinators:
https://gist.github.com/Avaq/1f0636ec5c8d6aed2e45k

*/

// Credit: James Forbes (http://james-forbes.com)
// Queries

// This is utility code

const B = f => g => x => f(g(x))
const $prop = k => f => obj =>
  Object.assign({}, obj, { [k]: f(obj[k]) })

const $stream = f => s => {
  s( f( s() ) )
  return s
}

// view is a visitor function that instead of transforming the value, it just returns it
// it basically cheats the system, instead of transforming x, it stores it, and then returns it
// it's literally this:

const view = f => obj => {
  var result;
  f(  x  => {
    result = x
    return x
  } ) (obj)
  return result
}


// This is application code

const source = {
  abc: {
    xyz: 42
  }
}
const s1 = m.stream(source)

const $abc = B ( $stream ) ( $prop ('abc') )
const $xyz = B ( $abc ) ( $prop ('xyz') )

$xyz ( x => x + 1 ) (s1)
console.log("s1:", s1())

// So, to get the nested value from your stream, we'd use view($xyz).
// and that will return whatever s().abc.xyz's value is.

console.log("view $xyz:", view($xyz) (s1))

console.log("s1:", s1())
console.log("source:", source)

console.log("prop abc:", $prop('abc')(x => x * 10)({ abc: 10 }))
console.log("view prop abc:", view($prop('abc'))({ abc: "duck" }))

