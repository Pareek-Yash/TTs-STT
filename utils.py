# utils.py
# Utility functions

import os

def create_directory_if_not_exists(directory):
    """ Create a directory if it doesn't already exist. """
    if not os.path.exists(directory):
        os.makedirs(directory)
