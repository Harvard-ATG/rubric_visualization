class Error(Exception):
    """Base class for other exceptions"""
    
    def __init__(self, message="No message defined."):
        self.message = message

class StudentsSectionsError(Error):
    """Error in extracting the Students and Sections from the API response"""
    pass


class RubricAssignmentsError(Error):
    """Error in extracting the RubricAssignments from the API response"""
    pass


class DatapointsError(Error):
    """Error in extracting the Datapoints from the API response"""
    pass