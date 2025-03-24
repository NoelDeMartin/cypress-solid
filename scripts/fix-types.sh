#!/usr/bin/env bash

sed -i 's/\CypressSolidResponse_2/\CypressSolidResponse/g' "dist/cypress-solid.d.ts"
sed -i 's/^import { Replacements } from.*$/export type Replacements = Record<string, unknown>;/g' "dist/cypress-solid.d.ts"
sed -i '/^import { CypressSolidResponse as CypressSolidResponse } from/d' "dist/cypress-solid.d.ts"
