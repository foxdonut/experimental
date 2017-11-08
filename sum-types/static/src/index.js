// https://codesandbox.io/s/wo6q90zl28
import * as R from "ramda";

const { fold, bifold, bimap, map } = require("static-sum-type/modules/fold/prod")();
const yslashn = require("static-sum-type/modules/yslashn");

const I = R.identity;
const K = R.always;
const T = R.applyTo;

const Maybe = yslashn.maybe("Maybe");

Maybe.toMaybe = v => (v != null && !isNaN(v)) ? Maybe.Y(v) : Maybe.N();

// Just for my understanding, but we'll try using bifold further down
Maybe.fold = (f, g) => fold(Maybe)
  ( { N: f
    , Y: g
    }
  );

const m1 = Maybe.Y(40);
const m2 = Maybe.N();

const f = x => x * 10 + 2;

// Using Maybe.fold
const prog1 = R.pipe
  ( map(Maybe)(f)
  , Maybe.fold
    ( K("Niente!")
    , v => "The answer is: " + v
    )
  );

// bifold -- awyeah!
const prog2 = R.pipe
  ( map(Maybe)(f)
  , bifold(Maybe)
    ( K("Ikke noget!")
    , v => "The answer of course is: " + v
    )
  );

// Let's try Either and bimap
const Either = yslashn.either("Either");

const g = str => str.toUpperCase();
const h = x => x * 10;

const prog3 = R.pipe
  ( bimap(Either)(g, h)
  , map(Either)(String)
  , bifold(Either)(I, R.concat("$"))
  );


// Should chain be in yslashn?
const chain = T => f => fold(Maybe)
  ( { N: K(Maybe.N())
    , Y: f
    }
  );

const mParseInt = str => Maybe.toMaybe(parseInt(str, 10));

const prog4 = R.pipe
  ( chain(Maybe)(mParseInt)
  , bifold(Maybe)
    ( K("parseInt fail")
    , v => "Successfully parsed to " + v
    )
  );

// Let's try concat, where S is a Semigroup
Maybe.concat = S => (ma, mb) => T
  ( ma
  , bifold(Maybe)
    ( K(mb)
    , a => T
      ( mb
      , bifold(Maybe)
        ( K(ma)
        , b => Maybe.Y(S.concat(a, b))
        )
      )
    )
  );

const And =
  { concat: (a, b) => a && b
  , empty: () => true
  };

const prog5 = (ma1, ma2) => T
  ( Maybe.concat(And)(ma1, ma2)
  , bifold(Maybe)
    ( K("N")
    , I
    )
  );

Either.concat = S => (ma, mb) => T
  ( ma
  , bifold(Either)
    ( a => T
      ( mb
      , bifold(Either)
        ( b => Either.N(S.concat(a, b))
        , K(mb)
        )
      )
    , a => T
      ( mb
      , bifold(Either)
        ( K(ma)
        , b => Either.Y(S.concat(a, b))
        )
      )
    )
  );

const Add =
  { concat: (a, b) => a + b
  , empty: () => 0
  };

const prog6 = (ea1, ea2) => T
  ( Either.concat(Add)(ea1, ea2)
  , bifold(Either)
    ( v => "Left " + v
    , v => "Right " + v
    )
  );

const results =
  [ Maybe
  , m1
  , m2
  , prog1(Maybe.Y(4))
  , prog1(Maybe.N())
  , prog2(Maybe.Y(4))
  , prog2(Maybe.N())
  , prog3(Either.Y(10))
  , prog3(Either.N("awesome!"))
  , prog4(Maybe.N())
  , prog4(Maybe.Y("abcd"))
  , prog4(Maybe.Y("42"))
  , prog5(Maybe.N(), Maybe.N())
  , prog5(Maybe.N(), Maybe.Y(true))
  , prog5(Maybe.N(), Maybe.Y(false))
  , prog5(Maybe.Y(true), Maybe.N())
  , prog5(Maybe.Y(false), Maybe.N())
  , prog5(Maybe.Y(true), Maybe.Y(true))
  , prog5(Maybe.Y(true), Maybe.Y(false))
  , prog5(Maybe.Y(false), Maybe.Y(true))
  , prog5(Maybe.Y(false), Maybe.Y(false))
  , prog6(Either.N(8), Either.N(4))
  , prog6(Either.N(8), Either.Y(4))
  , prog6(Either.Y(8), Either.N(4))
  , prog6(Either.Y(8), Either.Y(4))
  ];

console.log(JSON.stringify(results, null, 4));
