class APIErrorResponse(Exception):
    """APIErrorResponse is a custom exception to handle error in this whole service"""
    def __init__(self, message="Something went wrong.", status=500, success=False):
        self.message = message
        self.status = status
        self.success = success
        super().__init__(self.message, self.status, self.success)

    def __str__(self):
        return f"APIErrorResponse: {self.message}"