#!/bin/bash

# Set your cluster name and service name
CLUSTER_NAME="my-app-cluster-name"
SERVICE_NAME="app"

# Get the task ARNs for the service
TASK_ARNS=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_NAME --query 'taskArns' --output text)

# Loop through the task ARNs
for TASK_ARN in $TASK_ARNS
do
  # Get the network interface details for the task
  NETWORK_INTERFACE=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)

  # Get the public IP for the network interface
  PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $NETWORK_INTERFACE --query 'NetworkInterfaces[0].Association.PublicIp' --output text)

  echo "Public IP for task $TASK_ARN is $PUBLIC_IP (http://$PUBLIC_IP)"
done