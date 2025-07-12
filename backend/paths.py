import sys
import os
from typing import List


def generate_paths(base_dir: str, dirs: List[str]) -> List[str]:
    """
    Generate absolute paths by joining base_dir with each directory name in dirs.
    """
    return [os.path.join(base_dir, d) for d in dirs]


def add_paths_to_sys_path(paths: List[str]) -> None:
    """
    Add the given paths to sys.path if not already present.
    """
    for path in paths:
        abs_path = os.path.abspath(path)
        if abs_path not in sys.path:
            sys.path.insert(0, abs_path)


if __name__ == "__main__":
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    components = ["shared", "microservices", "utils", "controller"]

    component_paths = generate_paths(BASE_DIR, components)

    # Add to sys.path
    add_paths_to_sys_path(component_paths)

    print("Added the following paths to sys.path:")
    for p in component_paths:
        print(f"  - {p}")


