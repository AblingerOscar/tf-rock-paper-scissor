#!/bin/bash

# start Jupyter
source /etc/bash.bashrc
jupyter notebook --notebook-dir=/tf --ip 0.0.0.0 --no-browser --allow-root &

# wait
wait
