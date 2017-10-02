/* credit: James Forbes @james_a_forbes */
const o = require('ospec')
const $ = require('sanctuary-def')
const { 
  fold: devFold
  , StaticSumTypeError 
} = require('static-sum-type/fold/dev')(function(e){
  return e
})

const PredicatedLib = require('static-sum-type/predicated/dev')

const { fold: prodCata } = require('static-sum-type/fold/prod')()

class Maybe {
  static Just(x) {
    return { 
      value: x
      , case: Maybe.Just
      , type: Maybe
    } 
  }
  static Nothing() { 
    return { 
      case: Maybe.Nothing 
      , type: Maybe
    } 
  }
}

class Loadable {
  static Loaded(x) {
    return {
      value: x
      , case: Loadable.Loaded
      , type: Loadable
      , toString(){
        return 'Loaded('+x+')'
      }
    } 
  }
  static Loading() { 
    return { 
      of: Loadable.Loading
      , type: Loadable
      , toString(){
        return 'Loading()'
      }
    } 
  }
}

var Maybe2 ={
  name: 'Maybe'
  ,Just(x){
    return { 
      value: x
      , case: Maybe2.Just
      , type: Maybe2
    }
  }
  ,Nothing(){
    return { 
      case: Maybe2.Nothing
      , type: Maybe2
    }
  }
}

var x = Maybe.Just(2)
var y = Loadable.Loaded(x)


o('static-sum-type', function(){
  const foldMaybe = devFold(Maybe)

  var maybeToNum = foldMaybe({
    Just: () => 1
    ,Nothing: () => 0
  })

  o( 
    maybeToNum(Maybe.Just('hi'))
  ).equals(
    1
  )(
    'fold can fold valid types'
  )

  o(
    maybeToNum(Maybe2.Just('hey')) 
  ).equals(
    1 
  )(
    'fold can fold different types that meet the spec'
  )

  o(
    maybeToNum(Loadable.Loaded('whatever')).case 
  ).equals(
    StaticSumTypeError.InstanceWrongType 
  )(
    'Fold identifies when a value is of the wrong type'
  )

  o(
    devFold(Maybe, 0).case 
  ).equals(
    StaticSumTypeError.TooManyArguments 
  )(
    'fold identifies when there are too many arguments level:0'
  )

  o(
    devFold(Maybe)({ Just: () => 1, Nothing: () => 0 }, 1).case 
  ).equals(
    StaticSumTypeError.TooManyArguments 
  )(
    'fold identifies when there are too many arguments level:1'
  )

  o(
    devFold(Maybe)({ Just: () => 1, Nothing: () => 0 })( Maybe.Just(1), 1 ).case 
  ).equals(
    StaticSumTypeError.TooManyArguments 
  )(
    'fold identifies when there are too many arguments level:2'
  )

  o(
    maybeToNum( null ).case 
  ).equals(
    StaticSumTypeError.InstanceNull 
  )(
    'fold identifies when a value is null'
  )

  o(
    maybeToNum({ type: Maybe ,case: Loadable.Loaded ,value: 1 }).case 
  ).equals(
    StaticSumTypeError.InstanceShapeInvalid 
  )(
    'fold identifies when a instance has the wrong case key'
  )

  o(
    foldMaybe({ Just: () => 1 }).case 
  ).equals(
    StaticSumTypeError.TooFewCases 
  )(
    'fold detects when there are too few cases provided'
  )

  o(
    foldMaybe({ Just: () => 1 ,Nothing: () => 1 ,Left: () => 1 }).case 
  ).equals(
    StaticSumTypeError.TooManyCases 
  )(
    'fold detects when there are too few many provided'
  )

  o(
    prodCata( Loadable)({ Loaded: () => 1 })( Loadable.Loaded(1)) 
  ).equals(
    1 
  )(
    'prodCata ignores errors and blindy tries to do its job'
  )

  const SumTypePred = PredicatedLib( 
    x => x != null && x.toString() 
    , e => {
      throw new Error(e.message)
    }
  )

  const Shape = SumTypePred('Shape', {
    Rectangle: $.test([], $.RecordType({
      w: $.Number
      ,h: $.Number
    }))
    ,Triangle: $.test([], $.RecordType({
      w: $.Number
      ,h: $.Number
    }))
    ,Circle: x => typeof x == 'number'
  })

  const c = Shape.Circle(2)

  var r = devFold(Shape)({
    Circle: x => x * 2
    ,Rectangle: x => x * 2
    ,Triangle: x => x * 2
  })(
    c
  )
  o(r).equals(4);
})

o("Fred's tests", function() {
  const Loadable = {
    Loading: () => ({
      type: "Loadable",
      case: { name: "Loading" }
    }),
    Loaded: value => ({
      type: "Loadable",
      case: { name: "Loaded" },
      value
    })
  };

  const caseOf = (typeName, caseName) => value => ({
    type: typeName,
    case: { name: caseName },
    value
  });

  const Selectable = {
    Selected: caseOf("Selectable", "Selected"),
    Deselected: caseOf("Selectable", "Deselected")
  };

  const createType = typeName => cases => Object.keys(cases).reduce((result, next) => {
    result[next] = value => ({
      type: typeName,
      case: { name: next },
      value
    });
    cases[next] = result[next];
    return result;
  }, {});

  o('{"type":"Loadable","case":{"name":"Loading"}}').equals(JSON.stringify(Loadable.Loading()));

  const handler1 = {
    Loading: () => "Loading now",
    Loaded: value => "Loaded " + value
  };

  const handler2 = {
    Selected: value => "Selected " + value,
    Deselected: () => "No selection"
  };

  o(devFold(Loadable)(handler1)(Loadable.Loading())).equals("Loading now");
  o(prodCata(Loadable)(handler1)(Loadable.Loaded(42))).equals("Loaded " + 42);

  o(devFold(Selectable)(handler2)(Selectable.Selected(42))).equals("Selected 42");
  o(prodCata(Selectable)(handler2)(Selectable.Deselected())).equals("No selection");

  o(devFold(Selectable)({
    Selected: devFold(Loadable)({
      Loading: ({ selected, loading }) => `Selected ${selected} loading ${loading}`,
      Loaded: ({ selected, loaded }) => `Selected ${selected} loaded ${loaded}`
    }),
    Deselected: devFold(Loadable)({
      Loading: ({ deselected, loading }) => `deselected ${deselected} loading ${loading}`,
      Loaded: ({ deselected, loaded }) => `deselected ${deselected} loaded ${loaded}`
    })
  })(Selectable.Selected(Loadable.Loaded({ selected: 42, loaded: 84 })))).equals("Selected 42 loaded 84")
});

