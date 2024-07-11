#!/usr/bin/python3

"""
View code script for Read-Write-Fix (RWF) study
Joe Lewis 2022

Views the responses of a specific user
"""

import sys
import os
import logging
import json
import pandas as pd
from pathlib import Path

logging.basicConfig(stream=sys.stdout,
                    format="%(levelname)-10s %(message)s")
log = logging.getLogger()

def view_code(jupyter, sid):
    code = jupyter[jupyter["id"] == sid]["code"].array[0] 
    code_j = json.loads(code)

    for c in code_j["cells"]:
        if c["cell_type"] == "code":
            task_num = c["metadata"]["tasknum"]
            print("TASK", task_num)
            print("=================================")
            for l in c["source"].split("\n"):
                print("|\t", l)

            if "execution_count" in c:
                print("Execution count:", c["execution_count"])
            if "outputs" in c and len(c["outputs"]):
                print("OUTPUT:")
                print(c["outputs"][0]["text"])
            print("=================================")



            input("Press enter to view next task ")


    res = input("Output to file? [Y/n] ")
    if res.lower() == "y":
        home = os.environ["HOME"]
        f = open(f"{home}/tasks{sid}.txt", "w")
        for c in code_j["cells"]:
            if c["cell_type"] == "code":
                task_num = c["metadata"]["tasknum"]
                f.write(f"TASK {task_num}\n")
                f.write("=================================\n\n")
                for l in c["source"].split("\n"):
                    f.write(f"|\t{l}\n")

                if "execution_count" in c:
                    f.write(f"Execution count: {c['execution_count']}\n")
                if "outputs" in c and len(c["outputs"]):
                    f.write("OUTPUT:\n")
                    f.write(c["outputs"][0]["text"])
                f.write("\n\n=================================\n")

        f.close()
        log.info(f"Tasks written to file")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        log.error("usage: viewcode.py <csv backup directory> [log level]")
        exit(1)

    if len(sys.argv) > 2:
        log.setLevel(sys.argv[2])
    else:
        log.setLevel("INFO")

    path_arg = Path(sys.argv[1])
    if not path_arg.is_dir():
        log.error(f"{path_arg.name} is not a directory")
        exit(1)

    # Read jupyter
    jupyter_file = path_arg / "jupyter.csv"
    jupyter = pd.read_csv(jupyter_file)

    while True:
        print(jupyter)
        selected_id = input("Please select a response ID to view: ")
        view_code(jupyter, int(selected_id))
