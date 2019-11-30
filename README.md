# TS Rock-Paper-Scissors-Lizard-Spock

This is a project for our university course 'AKT'.

## What does it do

The project has two parts: The jupyter notebook and a small website.

The jupyter notebook has a page where we train a neural network
in order to recognize (preprocessed) images as one of our five
classes: `rock`, `paper`, `scissors`, `lizard` or `spock`.
It reaches an accuracy of around 90%.
The notebook also has a few graphs to analyze the model.

The website on the other hand gives a nice interface over
which you can do one of two things:

- Play a totally fair game of _"rock paper scissors lizard
spock" against the AI

![An image of a player loosing against the AI](./doc-images/game.png)

- Taking a picture of you signing one of the five symbols
    and figuring out what the network thinks the picture
    most likely contains.

## How to start

If you've docker and docker-compose installed, simply run

```sh
docker-compose up --build
```

> Note: Depending on your setup you'll most likely need `sudo` for it

This will start all three containers:

- The notebook
- The website
- The api

To connect to the jupyter notebook, simply visit
`localhost:8888` and use the password `aktmodel`.

All of the data inside of the `jupyter/volume` folder is shared
with the outside, but anything else stays
inside of the docker container and as such will disappear once
you re-start it.

You can acces the website at `localhost:80`.
If you haven't yet created a model with the jupyter notebook,
 it will not be able to predict the images, however.