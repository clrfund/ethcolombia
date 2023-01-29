# EthColombia

This is a static site for the EthColombia CLRfund round.  The round data is stored in the `src/rounds` folder.  The data were extracted using the `fetch-round` hardhat task in the contract folder of the `monorepo` repository.

This can be used as a template for any rounds that are finalized. The site does not have connection to smart contracts (other than resolving ENS names) or the subgrapth.

The `deploy` github action will deploy the site to the github pages on push to the `main` branch.

# Development

### Install Node with nvm

```sh
nvm install 16
nvm use 16
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

