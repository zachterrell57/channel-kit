#!/bin/bash

# Ensure this script has execute permissions:
# chmod +x scripts/add-env-to-vercel.sh

# Check if .env file exists
if [ ! -f .env.local ]; then
    echo "Error: .env.local file not found"
    exit 1
fi

# Read .env file and add each variable to Vercel
while IFS= read -r line
do
    # Ignore comments and empty lines
    if [[ ! $line =~ ^# && -n $line ]]; then
        # Split the line into key and value
        key="${line%%=*}"
        value="${line#*=}"
        
        # Trim whitespace from key and value
        key=$(echo "$key" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
        value=$(echo "$value" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
        
        # Skip NODE_ENV
        if [[ $key != "NODE_ENV" ]]; then
            # Add the environment variable to Vercel            
            printf "%s" "$value" | vercel env add "$key" production
        fi
    fi
done < .env.local

echo "All environment variables (except NODE_ENV) have been added to Vercel."

# Redeploy the project
echo "Redeploying the project..."
vercel deploy --prod