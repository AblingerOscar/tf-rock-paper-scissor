#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

base_url="https://raw.githubusercontent.com/akshaybahadur21/Emojinator/master/Rock_Paper_Scissor_Lizard_Spock/RPS_data"
output_dir="$parent_path/jupyter/volume/dataset"

dir_names=('rock' 'paper' 'scissors' 'lizard' 'spock')

for i in $(seq 1 5); do
    current_dir="$output_dir/0${i}_${dir_names[$((i-1))]}"
    echo "download files into $current_dir"

    curl --silent --parallel --create-dirs "$base_url/$i/[1-1200].jpg" -o "$current_dir/#1.jpg" 2> /dev/null
    if [ $? -ne 0 ]; then
      # try again if curl fails on windows (--parallel option not working)
      curl --silent --create-dirs "$base_url/$i/[1-1200].jpg" -o "$current_dir/#1.jpg" 2> /dev/null
    fi
done

echo "download finished"
