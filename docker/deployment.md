# Deployment Instructions

## Overview

Follow these steps in order to deploy the application correctly. Each step must complete successfully before proceeding to the next.

---

## Step 1 — Prepare server

Get fully blank VPS server and make [Dokploy installation](https://docs.dokploy.com/docs/core/installation) there.

Create a new account there, and

1. Connect git account to the dokploy.
2. Manage access to the repository.

## Step 1 — Run Infrastructure Compose

Create a new application with Compose, select current:

1. Branch
2. Repository
3. Path to .yml file
4. Add environments

Wait for all infrastructure containers to reach a healthy/running state before proceeding.

---

## Step 2 — Initialize the Database

Once the infrastructure is up, run the database initialization:

Open each service that contains prisma instance, run `npx prisma migrate deploy`.
If needed run `npx prisma db seed`.

Make sure you're using production environments locally through the .env file.

---

## Step 3 — Run Main YAML

With the infrastructure running and the database initialized, start the main application:

Create a new application for main.yml compose file.

1. Fill the required branch, repo, path to compose file.
2. Fill the environments.

---

## Verification

After all steps are complete, confirm the deployment is healthy:

Ensure all files are running without errors, everything is working correctly.

---
