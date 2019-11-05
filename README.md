# TS Rock-Paper-Scissor

This is a project for our university course 'AKT'.

## How to start

If you've docker and docker-compose installed, simply run

```sh
docker-compose up --build
```

> Note: Depending on your setup you'll most likely need `sudo` for it

After it's running, you can open a terminal in it with this command

```sh
docker exec -it rock-paper-scissor_web_1 bash
```

To connect to the jupyter notebook, simply visit `localhost:8888` and use the password `aktmodel`.

All of the data inside of the `volume` folder is shared with the outside, but anything else stays
inside of the docker container and as such will disappear once you re-start it.

