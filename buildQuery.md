PWA Studio webpack configuration makes requests to Magento 2 to retrieve GraphQl schema and store related data.
This prevents possibility to build the app in deployment flows where Magento 2 is not accessible during the build.

The solution is somewhat similar to what Magento 2 provides - https://devdocs.magento.com/guides/v2.4/config-guide/cli/config-cli-subcommands-config-mgmt-export.html

A package was created to generate necessary GraphQl responses and load them during build time.

Usage:
`yarn run buildQuery {media url}`

e.g.
`yarn run buildQuery 'https://test.com/media/'`

The command should generate a file named `buildQueryData.json`.

General flow would be:
1. Generate the file in local env
2. Configure build script to pull this file and place it in root of the project

It should be updated in case new store is added, currency or media changes or there are significant changes to GQL.