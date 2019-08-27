# AutoBot

Goal: 
Having robot machine capable of auto-registering itself on the orchestrator

Concept:
A simple script (createMachine.ps1), deployed on the robot machine (in master image) calling a little web endpoint (server.js) on the orchestrator machine, API logic is then protected and only server-side

[![Alt text](https://img.youtube.com/vi/ihm1_JRF-3o/0.jpg)](https://www.youtube.com/watch?v=ihm1_JRF-3o)

## Getting Started

Install latest nodejs for running web server

In the project folder, run: 
```
npm install
```

Launch manually: 
```
node server.js
```

## Caution
!!! Not for production, just a simple prototype !!!
