

# zero-mesh

Monorepo project creating a microservices mesh network across serverless platforms.

## Overview

Monorepo project creating a microservices mesh network across serverless platforms.

### Goals

- Scale to zero across all services and utilize fully managed PaaS.
- Maintain service discovery across zero scale serverless functions or containers.
- Offer a transport and simple interface for one and two way communication between services.
- Handle authentication validation (such as PubSub as a transport layer to Cloud Run).

## Modules

### Registration Function

- Serverless function triggered by deployment of a serverless node in the mesh
- Calls the node's configuration URL to fetch node settings
- If possible, sets environment variables for the deployed container pointing to mesh resources
- Function callable by a cron task to perform serverless health checks if necessary

