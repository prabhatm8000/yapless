class APIErrorResponse(Exception):
    """
    Custom exception class for API errors.
    This class extends the base Exception class and includes additional attributes
    for status code and success flag.
    It is used to provide a structured error response in API interactions.

    Attributes:
        message (str): A descriptive error message.
        status (int): HTTP status code representing the error.
        success (bool): A flag indicating whether the operation was successful or not.

    Methods:
        __init__(message, status, success): Initializes the APIErrorResponse with a message,
            status code, and success flag.
        __str__(): Returns a string representation of the error message.
    """

    def __init__(self, message="Something went wrong.", status=500, success=False):
        self.message = message
        self.status = status
        self.success = success
        super().__init__(self.message, self.status, self.success)

    def __str__(self):
        return f"APIErrorResponse: {self.message}"
