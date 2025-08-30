# GitHub Copilot Agent Mode Instructions for Full Stack Development

## Core Agent Mode Principles

### Agent Behavior Guidelines
- **Operate autonomously** across multiple files and directories
- **Make informed decisions** about which files to create, edit, or delete
- **Execute iterative workflows** to fix issues and improve code quality
- **Provide both code changes and terminal commands** as needed
- **Monitor and validate** the correctness of all modifications

### Context Management
- Always analyze the entire project structure before making changes
- Maintain consistency with existing code patterns and conventions
- Consider dependencies and relationships between components
- Preserve existing functionality while implementing new features

## MCP Server Integration

### Essential MCPs to Use

#### 1. GitHub MCP Server
**Purpose**: Repository management and CI/CD automation
**Usage Instructions**:
- Use OAuth authentication (preferred over PAT)
- Create and manage issues for feature tracking
- Automate branch creation and PR workflows
- Set up GitHub Actions for deployment pipelines
- Monitor repository metrics and commit history

#### 2. Playwright MCP Server
**Purpose**: End-to-end testing and UI automation
**Setup Requirements**:
