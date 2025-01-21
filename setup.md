# NERDS Setup

This document details the setup process for the NERDS system. Please contact
Joe if you have any issues with setup. Contact information is on the [main
page]({% link index.md %})

## System Requirements
Below are the system requirements

1. A linux server 
2. At least 4 GB of RAM
3. A distribution and architecture [supported by docker](https://docs.docker.com/engine/install/)

## Installation process

1. Install docker engine ([instillation instructions](https://docs.docker.com/engine/))
2. Install python, python-pip, and git
3. Clone the [nerds repository](https://github.com/joelewiss/nerds)
4. Configure NERDS by copying `developer-observatory.conf.example` to
   `developer-observatory.conf` and changing the appropriate values.
5. Add your `tasks.json` file to the `generator` directory
6. Run `./dev-ob.sh generate` and wait for it to finish
7. Put your HTTPS certificates at `/etc/cert/developer-study.crt` and
   `/etc/cert/developer-study.key` on the host system.
7. Run `./dev-ob.sh run`
8. After the command above finishes building, run `./dev-ob.sh manager` in another window.

NERDS should now be fully up and running on port 443.
