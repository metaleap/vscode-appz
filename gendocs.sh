#!/bin/sh

# NOTE! before running this, better ensure all the below commands are in your $PATH!



cd libs/go
godocdown -output readme.md .
cd ../..



cd libs/cs
sed -i 's/\\`/`/g' readme.md # merely cleans up the already-existing `readme.md`, which is written on every `dotnet build` via `msbuild`-triggered `Vsxmd`
cd ../..



cd libs/js
npx typedoc --plugin typedoc-plugin-markdown --hideBreadcrumbs --hideSources
npx concat-md docs > readme.md
rm -rf ./docs
cd ../..
