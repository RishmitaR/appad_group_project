class Project():
    """Represents a project that users can join and check hardware in/out of."""

    def __init__(self):
        self.id = None
        self.name = None
        self.description = None
        # Maps hardware set id -> quantity currently checked out by this project
        self.hardware_dict = {}
        self.users = []

    def set_id(self, id):
        """Set the project's unique identifier."""
        self.id = id

    def get_id(self):
        """Return the project's unique identifier."""
        return self.id

    def set_name(self, name):
        """Set the project name."""
        self.name = name

    def get_name(self):
        """Return the project name."""
        return self.name

    def set_description(self, description):
        """Set the project description."""
        self.description = description

    def get_description(self):
        """Return the project description."""
        return self.description

    def add_user(self, username):
        """Add a user to this project by username."""
        self.users.append(username)

    def hardware_checkout(self, hardware_id, amount):
        """Check out hardware for this project, adding to its checked-out quantity.

        Validity of the amount is confirmed before this is called
        (i.e. amount <= hardware availability).
        """
        if hardware_id in self.hardware_dict:
            self.hardware_dict[hardware_id] += amount
        else:
            self.hardware_dict[hardware_id] = amount

    def hardware_checkin(self, hardware_id, amount):
        """Check in hardware for this project, reducing its checked-out quantity.

        Validity of the amount is confirmed before this is called
        (amount <= hardware_dict[hardware_id]).
        """
        if hardware_id in self.hardware_dict:
            self.hardware_dict[hardware_id] -= amount
