# MCP Server Configuration Guide

This repository is configured with GitHub's Model Context Protocol (MCP) server for enhanced AI-powered development capabilities.

## What is MCP?

The Model Context Protocol (MCP) is GitHub's standardized protocol that enables AI tools (like GitHub Copilot) to seamlessly interact with development environments, providing:

- **Intelligent code suggestions** with full repository context
- **Automated workflow management** 
- **Smart debugging** with AI-powered insights
- **Seamless GitHub integration** for issues, PRs, and more

## Configuration

### Devcontainer Setup

The `.devcontainer/devcontainer.json` includes:

```json
{
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },
  "customizations": {
    "vscode": {
      "extensions": [
        "github.copilot",
        "github.copilot-chat"
      ],
      "settings": {
        "github.copilot.enable": {
          "*": true
        }
      }
    },
    "codespaces": {
      "openFiles": [
        "README.md",
        "CODESPACE_GUIDE.md"
      ]
    }
  }
}
```

**Note**: In GitHub Codespaces, GitHub Copilot settings are automatically synchronized with your account. For local devcontainer usage, you may want to add a mount for persistent settings.

### MCP Server Configuration

The `.vscode/mcp.json` file configures the GitHub MCP server:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

## Features Enabled

### 1. GitHub Copilot Integration
- AI-powered code completion
- Context-aware suggestions
- Chat-based assistance

### 2. Repository Intelligence
- Full codebase understanding
- Smart file navigation
- Dependency tracking

### 3. Workflow Automation
- CI/CD integration
- Issue and PR management
- Code review assistance

### 4. Development Tools
- Docker support for containerization
- GitHub CLI for repository operations
- VS Code extensions optimized for AI assistance

## Usage in Codespaces

When you open this project in GitHub Codespaces:

1. **Automatic Setup**: MCP server is automatically configured
2. **GitHub Authentication**: Uses your Codespace's built-in GitHub token
3. **Copilot Integration**: GitHub Copilot is enabled by default with automatic settings sync
4. **No Manual Configuration**: Everything works out of the box

## Benefits for Development

### For Contributors
- **Faster onboarding**: AI helps understand the codebase quickly
- **Fewer errors**: Smart suggestions catch issues early
- **Better code quality**: AI-powered refactoring and best practices

### For Code Reviews
- **Automated insights**: MCP helps identify potential issues
- **Context-aware feedback**: Better understanding of changes
- **Consistent standards**: AI enforces coding conventions

### For New Users
- **Guided learning**: AI explains code and patterns
- **Interactive help**: Chat-based assistance for questions
- **Quick prototyping**: Accelerated development with AI suggestions

## Authentication

In GitHub Codespaces, authentication is handled automatically using the environment's `GITHUB_TOKEN`. No additional setup is required.

For local development, you can set up a GitHub Personal Access Token (PAT):

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate a new token with appropriate scopes
3. Set the `GITHUB_TOKEN` environment variable

## Troubleshooting

### MCP Server Not Working
- Ensure GitHub Copilot is enabled for your account
- Check that the `.vscode/mcp.json` file exists
- Verify GitHub CLI is installed: `gh --version`

### Copilot Not Suggesting
- Check Copilot status in VS Code (bottom right corner)
- Ensure you're signed in to GitHub in VS Code
- Try reloading the VS Code window

### Authentication Issues
- Verify your GitHub token has the required permissions
- Check the output panel for error messages
- Try re-authenticating with GitHub CLI: `gh auth login`

## Additional Resources

- [GitHub MCP Server Documentation](https://github.com/github/github-mcp-server)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)

## Support

If you encounter issues with MCP server configuration, please:
1. Check the VS Code Output panel (View > Output > GitHub MCP)
2. Review the devcontainer logs
3. Open an issue in this repository with detailed information

---

**Note**: MCP server integration requires GitHub Copilot access. Ensure your account has the necessary permissions and subscriptions.
