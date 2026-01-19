#!/bin/bash

# Configuration
SERVER="localhost"
PORT=514  # Docker maps host port 514 -> container port 5140

echo "🚀 Sending simulated Syslog messages via UDP to $SERVER:$PORT..."

# 1. SSH Login Failure (Authentication)
echo "Sending SSH Failure log..."
echo "<34>Oct 11 22:14:15 firewall-01 sshd[123]: Failed password for invalid user hacker from 192.168.1.5 port 22 ssh2" | nc -u -w1 $SERVER $PORT

# 2. Kernel Error (System)
echo "Sending Kernel Error log..."
echo "<13>Oct 11 22:15:00 router-core kernel: eth0: link down" | nc -u -w1 $SERVER $PORT

# 3. Application Log (Custom)
echo "Sending App Log..."
echo "<134>Oct 11 22:16:30 web-server app[99]: API request timeout for tenant-C" | nc -u -w1 $SERVER $PORT

echo "✅ Syslog messages sent! Check the Dashboard."