<div align="center">
  <h1>Gray Matter Fabric Dashboard</h1>
</div>

Gray Matter Fabric Dashboard is an administrative interface for managing microservices and distributed systems running on the [Gray Matter microservice framework](https://github.com/DecipherNow/gm-fabric-jvm).

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the most recent version of the Create React App guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Prerequisites

### 1. Install the Gray Matter Fabric Starter Kit and any dependencies

Follow the instructions in the [gm-fabric-jvm README](https://github.com/DecipherNow/gm-fabric-jvm)

### 2. Create and start a microservice on your localhost 

Follow the instructions in the [Create a new Microservice guide](https://github.com/DecipherNow/gm-fabric-jvm/blob/master/documentation/CreatingNewMS.md)

Note: This Dashboard is not yet integrated into the core Framework. Currently, the dashboard is hard-coded to poll metrics from `http://localhost:9990/admin/metrics.json`

After starting your microservice, you should see a valid JSON file. You can easily test this by clicking [this link to the expected endpoint](http://localhost:9990/admin/metrics.json). If you see JSON data, you are ready to proceed.

### 3. Install Node.js and the npm package manager via a version management tool

Because new major versions of the Node.js runtime are releases major versions every six months, half of which are not tied to the [Node.js Long Term Support (LTS) cycle](https://github.com/nodejs/LTS), it is advisable to use a version manager to be able to move between Node.js versions via a version management tool.

If you are using Linux, Mac OS, or the new Windows System for Linux, we suggest using [nvm](https://github.com/creationix/nvm)
If you are using the standard Windows CMD.exe/PowerShell environment, we suggest using [nvm-windows](https://github.com/coreybutler/nvm-windows)

Refer to the README for these tools for detailed instructions on installing Node and NPM.

## Installation

```sh
git clone https://github.com/DecipherNow/gm-fabric-dashboard.git
cd gm-fabric-dashboard
npm install
```

## Use

### General Users trying the Dashboard

1. Ensure a microservice is running on your system serving metrics.json from [http://localhost:9990/admin/metrics.json](http://localhost:9990/admin/metrics.json)
2. From the project directory `./gm-fabric-dashboard`, run `npm start` and [http://localhost:3000](http://localhost:3000) will open automatically in your browser
3. Report bugs or desired enhancements on [the project's issues page](https://github.com/DecipherNow/gm-fabric-dashboard/issues)
4. When finished, stop the local server serving your dashboard (and perhaps the local server serving your microservice) by pressing `control+c` on the respective terminals running these servers

### Developers building, testing, and integrating the Dashboard

#### `npm start` to develop features and crush bugs

This runs the app in the development mode and automatically opens [http://localhost:3000](http://localhost:3000) in your browser. You can open the source code in your editor of choice, and the page will reload if you make edits. If you are a VSCode user, this projecrts supports in-editor debugging via the [Debugger for Chrome extension](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome).

#### `npm test` to enhance front-end unit test coverage

This launches the Jest test runner in interactive watch mode.<br>
See the Create React App section about [running tests](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#running-tests) for more information.

#### `npm run build` to prepare the Dashboard for deployment to the core `gm-fabric-jvm` project

This builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.
