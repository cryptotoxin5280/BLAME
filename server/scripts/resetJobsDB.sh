#!/bin/bash

mongo --eval "db.jobs.remove({});" jobsdb
