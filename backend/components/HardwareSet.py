class HardwareSet():
    """Represents a hardware set that projects can check in and check out."""

    def __init__(self, id):
        """Initialize a hardware set with the given id."""
        self.id = id

    def get_id(self):
        """Return the hardware set id."""
        return self.id
