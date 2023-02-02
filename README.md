# Static Web Template

This is a static web template for `closed or finalized` CLRfund rounds.  The round data is stored in the `src/rounds` folder.  The data were extracted using the `fetch-round` hardhat task in the contract folder of the `monorepo` repository.

The generated static web will not have connection to smart contracts (other than resolving ENS names) or the subgrapth.

# Development

### Install Node with nvm

```sh
nvm install 16
nvm use 16
```

### Prepare the source code


```sh
git clone git@github.com:clrfund/static-web.git
git clone git@github.com:clrfund/monorepo.git

# generate round data
cd monorepo
yarn && yarn build
cd contracts
yarn hardhat fetch-round --operator "yourOperator" --output-dir ../../static-web/src/rounds --round-address "your round address" --network "your network"

# update theme and page content if different
cd ../../static-web
# git branch <your branch name>
# git checkout <your branch name>
# update public/favicon.ico
# update the css styles in the src/styles folder

```


### Install the dependencies

```sh
yarn
```

### Setup env

```sh
cp .env.example .env    # adjust if necessary
```

## Start the web app in development mode (hot-code reloading, error reporting, etc.)

```sh
yarn dev
```


# Deployment to IPFS
Once the changes are ready to be deployed to the IPFS, manually run the deploy-to-ipfs github action. Make sure you select the correct branch to run the action.