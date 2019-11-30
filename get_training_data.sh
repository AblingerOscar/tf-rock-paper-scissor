#!/bin/bash

PARENT_PATH=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

BASE_URL="https://raw.githubusercontent.com/akshaybahadur21/Emojinator/master/Rock_Paper_Scissor_Lizard_Spock/RPS_data"
OUTPUT_DIR=${PARENT_PATH}"/jupyter/volume/dataset"

DIR_NAMES=('rock' 'paper' 'scissors' 'lizard' 'spock')

for i in $(seq 1 5); do
    CURRENT_DIR=${OUTPUT_DIR}"/0"${i}"_"${DIR_NAMES[$((i-1))]}
    echo "download files into "${CURRENT_DIR}
    curl --silent --parallel --create-dirs ${BASE_URL}"/"${i}"/[1-1200].jpg" -o ${CURRENT_DIR}"/#1.jpg"
done
echo "download finished"