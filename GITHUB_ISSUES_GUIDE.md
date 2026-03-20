# GitHub Issues & Workflow Guide for AI Agents

**Project:** secure-your-space  
**Objective:** Maintain strict tracking of development progress, code changes, and bug fixes using GitHub Issues.

## Prime Directive
**NO CODE CHANGES ARE COMMITTED OR DEPLOYED WITHOUT A CORRESPONDING GITHUB ISSUE.**

## Section 1: Initialization

Before beginning any task, ensure the following steps are taken:

1. **Search**:Look for existing issues related to the user's request. 
    "Tool": 'github _search_issues'
2. **Create**: Create a new issue if one does not exist.
    "Tool": 'github _create issue'
3. **Update**: If the issue already exists, update it with new context.

### Issue Structure Template

**Title Format:** `[Type] Concise Description`  
*(Types: `Feature`, `Bug`, `Refactor`, `Docs`, `Chore`)*

**Body Template:**
```markdown
### Objective
[Brief explanation of what needs to be solved or added]

### Acceptance Criteria
- [ ] Criteria 1 (e-g-, Page loads without errors)
- [ ] Criteria 2 (e-g-, User can click X)

### Technical Notes
[Any architectural decisions, file paths, or specific constraints]
```

## Section 2: Execution

When actively working on an issue:

- **Branching:** specific branches should be created for the issue.
  *   **Naming Convention**: 'feat/issue-ID-short-description" or "fix/issue-ID-short-description"
- **Commits:** All commit messages must reference the issue ID.
  *.   **Format**: `[#ISSUE_ID] Commit message` (e.g., `[#12] Add responsive styles to header`) 

## Section 3: Completion

Once a task is fully resolved:

1. **Verification**: Ensure all Acceptance Criteria checkboxes are fulfilled.
2. **Closing**: Close the issue using the GitHub tool.
3. **Comment**: Add a final comment summarizing the resolution if it wasn't a standard PR merge (optional but recommended for complex tasks).

## Section 4: Standard Labels

Use the following standard labels for categorization:
- `enhancement`: New features or improvements.
- `bug`: Errors or broken functionality.
- `documentation`: Changes to README, guides, or code comments.
- `refactor`: Code cleanup without logic changes.
- `urgent`: Blocks critical workflows.

## Section 5: Agent Instructions

**When you read this file, you must:**
1. Acknowledge that you will track your work.
2. Ask the user for the specific Issue ID if you cannot find one, or ask for permission to create it. 
3. Update the issue status as you progress.