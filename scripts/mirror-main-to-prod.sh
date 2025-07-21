#!/bin/bash
# Mirror main branch to prod branch (force push)

git checkout main

git push origin main:prod --force

echo "Main branch has been mirrored to prod branch (force push)." 