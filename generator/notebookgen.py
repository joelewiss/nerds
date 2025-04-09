import os
import json
import hashlib
import itertools
import copy
from typing import List

#TODO: Write script that generates permutations of task list if randomize is true
#Output should be files and taskSchema.sql

class Condition:
    COUNT = 0
    def __init__(self, task_list: list):
        self.task_list = task_list
        self.condition_name = str(Condition.COUNT)
        Condition.COUNT += 1

    def write_file(self):
        self.file_name = f"TASK_{self.condition_name}.json"
        f = open(f"generated/{self.file_name}", "wb")
        
        obj = {"tasks": self.task_list}
        self.json_bytes = json.dumps(obj).encode()
        f.write(self.json_bytes)
        f.close()

    def file_hash(self):
        h = hashlib.sha256()
        h.update(self.json_bytes)
        return h.hexdigest()



if __name__ == "__main__":
    f = open("tasks.json")
    json_obj = json.load(f)
    f.close()

    if not os.path.isdir("generated/"):
        os.mkdir("generated")

    # Clear generated directory
    for f in os.scandir("generated/"):
        os.remove(f.path)

    conditions = []
    c = Condition(json_obj["tasks"], false)
    conditions.append(c)

    for c in conditions:
        c.write_file()

    # Generate SQL
    cat = 1
    cond = 0
    f = open("generated/dbSchema.sql", "w")
    for c in conditions:
        f.write("INSERT INTO \"conditions\" VALUES")
        f.write(f"({cat}, {cond}, '{c.file_name}', '{c.file_hash()}');\n");
        cond += 1
    f.close()

    print(f"{len(conditions)} conditions generated")

