#!/bin/bash
npm run build

cp package*.json ./dist/
cd ./dist
npm i --production
#rsync -avzh node_modules ./dist/

cd ../terraform
#terraform init
terraform apply -auto-approve
