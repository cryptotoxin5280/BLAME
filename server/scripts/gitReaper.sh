#!/bin/bash

cd ~/octobox
git checkout development &>/dev/null
git pull &>/dev/null

git log --reverse HEAD --merges --since=5.day --first-parent development --pretty=format:'{"date":"%cd", "authorName":"%an", "authorEmail":"%ae", "subject":"%s"}\n' | grep "{" | grep "(pull request #"
