# node-caman-aws-lambda

CamanJS node module with compiled dependency modules and native libraries.

## Node modules on which caman depends:

### canvas:
Based on [node-canvas-aws-lambda-example](https://github.com/WebSeed/node-canvas-aws-lambda-example) - added some additional libs that were required (at least for me to get it working), nice [how to guide](how-to.md) for compiling libraries on EC2 instance, and script `libs_build` that does libs downloading and compiling for you (simple script which could break if i.e. curl fails downloading...).
Also libraries are sparated in `/lib` folder.

### fibers:
Fibers also needed to be recompiled with `node-gyp` on EC2 running same OS version as AWS Lambda.

## Native libs
Compiled native libs (required by node-canvas) are placed in `/lib` folder.

## Usage
Before deploying to AWS Lambda you should just replace modules in node_modeules folder with the 3 provided here (`caman`, `canvas`, `fiber`).
Copy `lib` folder to your project folder.
