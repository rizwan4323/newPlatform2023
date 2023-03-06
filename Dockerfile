FROM node:9

WORKDIR /app
COPY ./ ./
RUN npm rebuild node-sass
# RUN npm rebuild node-sass
# CMD ["npm", "i", "&&", "node", "fix.js", "&&", "npm", "run", "dev"]

# replace this with your application's default port
EXPOSE 3000


## Create Docker MongoDB and network
# docker pull mongo
# docker volume create mongodb
# docker volume create mongodb_config
# docker network create mongodb
# docker run -it --rm -d  -v mongodb:/data/db -v mongodb_config:/data/configdb -p 27017:27017 --network mongodb --name mongodb mongo

## Create Docker from project folder

# docker build -t plgdocker .  

# docker run \
# -it --rm  -d \
# --network mongodb \
# -p 3000:8080 \
# --name plg plgdocker \
# sh -c 'npm install && node fix.js && npm run dev' \
# -e DB_CONNECTION_STRING=mongodb://mongodb:27017/login