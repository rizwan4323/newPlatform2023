# Download Only Changed files git
`git remote add upstream https://github.com/productlistgenie/NewPlatform.git`

`git fetch upstream master`

`git merge upstream/master`

`npm i node-sass@4.13.0 bcrypt@3.0.6`


fulfuller.js export to csv issue due to incompatible node-sass version


# GET: /api/getPLGTracking/:ref
`ref - Internal PLG Reference ID for getting order data via reference id`

# GET: POST: /api/getMyPayout
`creator (String)` - user id
`userPrivilege (Int)` - user privilege (e.g: 1,2,3,4,5, 10)
`fulfillerLocation (String)` - refer to Global_Values.js cod_available_country
`order_status (String)` - refer to Global_Values.js list_of_order_status
`dateStart (String)` - new Date().isoString()
`dateEnd (String)` - new Date().isoString()
`isAdminPayout (Boolean)` - received_payment_from_courier to true, query only the collected from courier
`isAdminPayoutCollectedRange (Boolean)` - use dateCourierCollected as date range in filter

# POST: /api/getOrderMetrics
`creator (String)` - user id
`funnel_id (String)` - funnel id or old page ids separated by comma if multiple old page ids
`merchant_type (String)` - refer to Global_Values.js list_of_merchant
`dateStart (String)` - new Date().isoString()
`dateEnd (String)` - new Date().isoString()
`location (String)` - one or more country iso2 separated by comma refer to Global_Values.js cod_available_country

# POST: /api/getOrderSalesOverTime
# POST: /api/getOrdersOverTime
# POST: /api/getTopProducts
`creator (String)` - user id
`page_ids (String)` - funnel id or old page ids separated by comma if multiple old page ids
`dateFrom (String)` - new Date().isoString()
`dateTo (String)`- new Date().isoString()
`merchant_type (String)` - refer to Global_Values.js list_of_merchant

   git update-index --assume-unchanged "src/pages/fulfiller.js"
   git update-index --no-assume-unchanged "src/pages/fulfiller.js"

## Docker

```
docker run -it --rm  -d --network mongodb -p 3000:3000 --name plg plgdocker sh -c 'npm install && node fix.js && npm run dev'

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
```