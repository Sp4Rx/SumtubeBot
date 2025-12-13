# GitHub Actions Deployment Setup

This repository uses GitHub Actions to automatically deploy to your server when you push to the `main` or `master` branch.

## Prerequisites

1. A server with SSH access
2. The project already cloned on the server
3. PM2 installed on the server
4. Node.js 20+ installed on the server

## Setup Instructions

### 1. Use Your Existing SSH Key (AWS EC2 PEM file)

If you're using AWS EC2, you likely already have a PEM key file. You can use that:

**Option A: Use existing PEM key (Recommended for AWS EC2)**
- Use your existing `.pem` file (e.g., `SecretRipple.pem`)
- Extract the private key content from the PEM file

**Option B: Generate a new SSH key pair (if you prefer a separate key)**

On your local machine:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

This creates:
- `~/.ssh/github_actions_deploy` (private key - keep this secret!)
- `~/.ssh/github_actions_deploy.pub` (public key)

### 2. Add Public Key to Server

**If using existing PEM key:**
Your PEM key should already have access. Verify by testing:
```bash
ssh -i ~/.ssh/SecretRipple.pem ubuntu@ec2-13-201-76-141.ap-south-1.compute.amazonaws.com
```

**If using new key:**
Copy the public key to your server:

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub ubuntu@your-server-ip
```

Or manually add it to `~/.ssh/authorized_keys` on the server:

```bash
cat ~/.ssh/github_actions_deploy.pub | ssh -i ~/.ssh/SecretRipple.pem ubuntu@your-server-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 3. Test SSH Connection

Test that you can SSH into the server:

```bash
# With existing PEM key
ssh -i ~/.ssh/SecretRipple.pem ubuntu@ec2-13-201-76-141.ap-south-1.compute.amazonaws.com

# Or with new key
ssh -i ~/.ssh/github_actions_deploy ubuntu@your-server-ip
```

### 4. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `SSH_HOST` | Your server IP address or domain (no username prefix) | `ec2-13-201-76-141.ap-south-1.compute.amazonaws.com` |
| `SSH_USER` | SSH username (usually `ubuntu` for AWS EC2) | `ubuntu` |
| `SSH_PRIVATE_KEY` | Contents of your private key file (PEM or OpenSSH format) | Copy entire contents of `~/.ssh/SecretRipple.pem` |
| `SSH_PORT` | SSH port (optional, defaults to 22) | `22` |
| `APP_DIRECTORY` | Path to your app directory on server (optional) | `/home/ubuntu/SumtubeBot` (default) |

**Important:** 
- For `SSH_HOST`, use only the domain/IP, **not** `user@domain.com`
- For AWS EC2, `SSH_USER` is typically `ubuntu`
- `SSH_PRIVATE_KEY` should be the **entire contents** of your PEM file, including headers and footers

#### How to get SSH_PRIVATE_KEY:

**If using existing PEM file:**
```bash
cat ~/.ssh/SecretRipple.pem
```

**If using new key:**
```bash
cat ~/.ssh/github_actions_deploy
```

Copy the entire output (including `-----BEGIN RSA PRIVATE KEY-----` / `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` / `-----END OPENSSH PRIVATE KEY-----`)

**Note:** PEM files from AWS EC2 are usually RSA format. The `webfactory/ssh-agent` action supports both RSA and OpenSSH formats.

### 5. Verify Server Setup

Make sure on your server:

1. The project directory exists and is a git repository
2. `.env` file exists with all required variables
3. PM2 is installed: `npm install -g pm2`
4. Node.js 20+ is installed: `node --version`

### 6. Test Deployment

1. Push to `main` or `master` branch:
   ```bash
   git push origin main
   ```

2. Go to your GitHub repository → Actions tab
3. Watch the deployment workflow run
4. Check the logs if anything fails

## Manual Deployment Trigger

You can also manually trigger deployment:

1. Go to GitHub repository → Actions tab
2. Select "Deploy to Production" workflow
3. Click "Run workflow"
4. Select branch and click "Run workflow"

## Troubleshooting

### SSH Connection Fails

- Verify SSH key is correctly added to server's `~/.ssh/authorized_keys`
- Check SSH port (default is 22, but some servers use different ports)
- Ensure firewall allows SSH connections
- Test SSH connection manually: `ssh -i ~/.ssh/github_actions_deploy user@server`

### Build Fails

- Check server has Node.js 20+ installed
- Verify `npm ci` works on the server
- Check build logs in GitHub Actions

### PM2 Issues

- Verify PM2 is installed: `pm2 --version`
- Check PM2 logs: `pm2 logs sumtubebot`
- Ensure `.env` file exists and has all required variables

### Health Check Fails

- Check if server is running: `pm2 list`
- Check logs: `pm2 logs sumtubebot --lines 50`
- Verify port 3000 is not blocked by firewall
- Check environment variables are loaded correctly

## Security Notes

- **Never commit** your SSH private key or `.env` file to the repository
- Use GitHub Secrets for all sensitive information
- Regularly rotate SSH keys
- Use a dedicated SSH key for GitHub Actions (don't reuse your personal key)
- Consider using a deploy-only user with limited permissions on the server

## Workflow Details

The deployment workflow:

1. ✅ Checks out the latest code
2. 🔐 Sets up SSH connection
3. 🚀 Runs `deploy/production-deploy.sh` script on the server
4. 📥 Script pulls latest changes from git
5. 📦 Script installs dependencies (`npm ci`)
6. 🔨 Script builds the server (`npm run build:server`)
7. 🔍 Script verifies environment configuration
8. 🛑 Script stops existing PM2 process
9. 🚀 Script restarts application with PM2
10. 🏥 Script performs health check
11. ✅ Reports deployment status

**Note:** The workflow uses `--skip-backup` and `--skip-install` flags for faster CI/CD deployments, but you can modify this in the workflow file if needed.

## Customization

To customize the deployment:

1. Edit `.github/workflows/deploy.yml`
2. Modify the `APP_DIRECTORY` secret if your app is in a different location
3. Adjust the branch trigger (currently `main` and `master`)
4. Add additional deployment steps as needed

