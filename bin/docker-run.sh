#!/bin/bash
docker run -it --rm -p 4000:4000 --mount source=./img,destination=/usr/src/app/img --name my-crawling-app web-crawling 