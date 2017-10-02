// Credit: James Forbes @james_a_forbes

"@foxdonut I wanted to show you this notion, but was waiting til it was a bit more mature... but oh well."

"An idea I've been working on is nominal maybe's and eithers for common states, e.g. Validatable, is just an Either that is nominally typed. So it has the exact same semantics and API, but if you pass say an Either to a function that expects a Validatable, you get an error. So you're constantly forced to handle the full possibility space when generating UI's but also testing.

That's what all this is about in the tests."

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

"Here editing$() is a stream of the data we are currently editing, and it could be in various states. I basically assert its in the correct state step by step by converting state into Maybe's... gradually getting closer to the actual data.

It looks verbose, but think of it like code coverage. If you don't traverse all the states, the test isn't very good.

Same is true for UI:

Here's a button that saves some data, its disabled state, and its label traverse its possible states in order to determine the value.

Normally we'd do this with ternaries, but checking cases isn't as explicit or even enforced when you do that."

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
))

"Above we do care if the state is valid or modified when determining if the button is disabled. But we don't care about those states when determining the button text. For the button text we can just pass through those layers by folding with identity."

Modifiable.fold(
    () => false //modified, therefore saveable
    ,() => true //unmodified, therefore nothing to save
)

"This could just use Modifiable.toBoolean or Either.toBoolean, but I was cautious with sugar for such a new approach

Ok so, that library sum-type that I wrote, you can use that to create Maybe"

const a = $.TypeVariable('a')
const Maybe = Sum('Maybe', {
    Just: { value: a }
    ,Nothing: {}
})

"You can create instances, of that type like so:"

Maybe.Just(4)
Maybe.Nothing()

"And you can create functions that handle each case of the sum type, in a discriminated manner (if you don't handle every case, you get a type error)."

Maybe.toNullable = Maybe.case({
  Just: x => x
  ,Nothing: () => null
})

Maybe.toNullable( { value: 'not a maybe' }) //=> TypeError
Maybe.toNullable( Maybe.Nothing() ) //=> null
Maybe.toNullable( Maybe.Just('Yay') ) //=> 'Yay'

"sum-type is 100% compatible with sanctuary-def, so you can now use Maybe as a type.

e.g."

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
  LoggedIn: { username: $.String, session_id: $.FiniteNumber } //<-- built in sanctuary-def types
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

"It's kind of fancy, but we're basically wrapping every case in several layers of sum-types to create a final outer layer $Editing.

The $ prefix is my way of saying 'this thing is a type'.

You could write the above literally, buts its painful, it'd look like:"

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

"But this basically says, we can Edit any of these things, so if you have a function that deals with the Editing type, you have to handle all these possibilities.

The actual data just looks like this:"

{ value: { value: { value: { value: { value: { organization_name: { value: '' }}}}}}}

"Or something ridiculous. Each layer being a particular type. Each layer has some special fields on their prototype which allows for type checking and dynamic dispatch of the case function. The idea is, you should never manually dive into the data structure, and I'm considering enforcing that via closures (one day)

This whole .$Type thing is a manually created UnaryType or BinaryType (which isn't built into the sum-type library for free. The default provided type is a NullaryType, it basically states 'I was created by the Maybe constructor' but not much else. But these type functions let us be a lot more specific. They let us say, this Maybe, will always have a record with these fields in it.

Or, if this Either is in the Right state, it will look like a normal string, but if its in the Left state it will have a whole bunch of validation metadata. And we can type check that (and we do!)"

const { Modifiable, Dirty, Clean } =
    NominalEither({
        name: 'Modifiable'
        , Left: 'Dirty'
        , Right: 'Clean'
    })

"There's this function, that generates an Either from scratch, with all the static methods, and even some custom ones.

That's literally it."

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

"But its type checked more specifically, and in error messages it will say 'Loading' instead of 'Nothing'.

If our data comes back from the server. We might do this."

pipe(
  Loaded
  ,Saved
  ,Valid
  ,Clean
  ,list$
)(list)

"That list$ is a flyd stream, so we write decorated data into a stream, which ends up in our single state model - that's another system, and could easily be redux or meiosis instead."

"Sanctuary's Maybe's/Either's aren't nominal. So you can do it, but you don't get the same level of guarantees.

Also the fold(I,I) isn't really type safe for an Either, because the signature is Either a b, where a and b can be different. In my case, whenever I do that, a and b are exactly the same type so its okay in my context. But sanctuary would rightfully complain. That's why there's methods like fromEither in sanctuary.

You could do something like this in sanctuary:"

T( validatable, pipe([
   fromEither(I)  // Validatable
   ,fromEither(I) // Modifiable
   ,either( K('Create'), K('Save') ) // Saveable
]))

"Each layer is just an Either though, so with that code, sanctuary won't guarantee a particular layer is meant to represent say Validation, or whether its been Modified"

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

