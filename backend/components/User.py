class User():
    """Represents a user who can belong to one or more projects."""

    def __init__(self):
        self.username = None
        # List of project ids (or project references) this user is part of
        self.projects = []

    def set_username(self, username):
        """Set the user's username."""
        self.username = username

    def get_username(self):
        """Return the user's username."""
        return self.username

    def add_project(self, project):
        """Add a project to this user's project list."""
        self.projects.append(project)

    def get_projects(self):
        """Return the list of projects this user belongs to."""
        return self.projects
