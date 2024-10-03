#!/bin/bash

# Ensure this script has execute permissions:
# chmod +x scripts/add-env-to-vercel.sh

# Check if .env file exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found"
    exit 1
fi

# Read .env file and add each variable to Vercel
while IFS='=' read -r key value
do
    # Ignore comments, empty lines, and NODE_ENV
    if [[ ! $key =~ ^# && -n $key && $key != "NODE_ENV" ]]; then
        # Remove any leading/trailing whitespace
        key=$(echo $key | xargs)
        value=$(echo $value | xargs)
        
        # Add the environment variable to Vercel
        echo "Adding $key to Vercel..."
        echo $value | vercel env add $key production
    fi
done < .env.local

echo "All environment variables (except NODE_ENV) have been added to Vercel."

# Redeploy the project
echo "Redeploying the project..."
vercel deploy --prod