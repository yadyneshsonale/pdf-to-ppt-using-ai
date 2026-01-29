# Server package - re-export from pdfparser submodule
from .pdfparser.main import process_command

__all__ = [
    'process_command',
]
