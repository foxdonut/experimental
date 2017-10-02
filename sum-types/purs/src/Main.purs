module Main where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)

data Loadable a = Loading | Loaded a

foldLoadable :: Loadable String -> String
foldLoadable (Loading) = "loading, please wait..."
foldLoadable (Loaded x) = "loaded " <> x

data Selectable a = Selected a | Deselected

foldSelectable :: forall a. Selectable a -> String
foldSelectable (Selected x) = "foo"
foldSelectable (Deselected) = "bar"

main :: forall e. Eff (console :: CONSOLE | e) Unit
main = do
  log $ foldLoadable Loading <> foldLoadable (Loaded "duck")
