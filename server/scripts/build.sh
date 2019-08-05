#!/bin/bash

ip=""
user="octobox"
passwd="integration"

sshpass -p $passwd $user@$ip ~/octobox/make all &
