# Setup Guide (SaaS/Cloud Mode)

## Overview
This guide demonstrates how to expose the Log Management System to the public internet using a secure tunnel, fulfilling the SaaS/Cloud requirement without deploying to a dedicated VPS. We use **Ngrok** to provide a secure HTTPS endpoint.

## Prerequisites
1. The appliance must be running locally:
   ```bash
   ./run.sh