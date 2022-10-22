#!/bin/bash
export PROJECT_ROOT=$(pwd)
export DIST=$PROJECT_ROOT/dist
export PRODULES=$PROJECT_ROOT/produles/nodejs
export TEMP=$PROJECT_ROOT/temp
export TERRAFORM=$PROJECT_ROOT/terraform

rm -rf $DIST $PRODULES $TEMP

# Build the code
npm run build
cd $DIST
mkdir -p $TEMP
zip -q -r $TEMP/dist.zip .

# Gather the dependancies
cd $PROJECT_ROOT
mkdir -p $PRODULES
cp package*.json $PRODULES
cd $PRODULES
npm i --production
cd ..
zip -q -r $TEMP/produles.zip .

# Deploy!
cd $PROJECT_ROOT
cd $TERRAFORM
terraform init
terraform apply -auto-approve
