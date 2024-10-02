#!/bin/bash

# Check if .env file exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found"
    exit 1
fi

# Read .env file and add each variable to Vercel
while IFS='=' read -r key value
do
    # Ignore comments and empty lines
    if [[ ! $key =~ ^# && -n $key ]]; then
        # Remove any leading/trailing whitespace
        key=$(echo $key | xargs)
        value=$(echo $value | xargs)
        
        # Add the environment variable to Vercel
        echo "Adding $key to Vercel..."
        echo $value | vercel env add $key production
    fi
done < .env.local

echo "All environment variables have been added to Vercel."