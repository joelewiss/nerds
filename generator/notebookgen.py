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
    def __init__(self, task_list: list, randomize_suggestions: bool):
        self.task_list = task_list
        self.randomize_suggestions = randomize_suggestions
        self.condition_name = str(Condition.COUNT)
        Condition.COUNT += 1

    def write_file(self):
        self.file_name = f"TASK_{self.condition_name}.json"
        f = open(f"generated/{self.file_name}", "wb")
        
        obj = {"randomize_suggestions": self.randomize_suggestions, "tasks": self.task_list}
        self.json_bytes = json.dumps(obj).encode()
        f.write(self.json_bytes)
        f.close()

    def file_hash(self):
        h = hashlib.sha256()
        h.update(self.json_bytes)
        return h.hexdigest()


def generate_random_conditions(conditions: List[Condition]):
    new_conditions = []

    for condition in conditions:
        num_tasks = len(condition.task_list)
        suggestion_perms = {k:[[]] for k in range(num_tasks)}

        for task_id, task in enumerate(condition.task_list): # should go for 5 itterations
            if len(task["suggestions"]) > 0:
                suggestion_perms[task_id] = list(itertools.permutations(task["suggestions"]))

        # Fix all suggestion_perm elements to the max size
        max_perm_length = max(map(lambda s: len(s), suggestion_perms.values()))
        print(f"Max permutation length of single condition: {max_perm_length}")
        print("Length of each element:", end="")
        for s_perm in suggestion_perms.values():
            print(f" {len(s_perm)}", end="")
        print()

        total_perms = list(itertools.product(*suggestion_perms.values()))
        print(f"Product length: {len(total_perms)}")

        for perm in total_perms:
            task_list = copy.deepcopy(condition.task_list)
            for t_id, t_sug in enumerate(perm):
                task_list[t_id]["suggestions"] = t_sug
            new_conditions.append(Condition(task_list))


    print(f"Generated {len(new_conditions)} new conditions")
    return conditions


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
    if json_obj["randomize"]:
        # Returns true if a given permutation has the fixed tasks in the correct place
        def fixed_correct(perm: tuple):
            correct = True
            for i, p in enumerate(perm):
                if "fixed" in p and p["fixed"]:
                    correct = correct and json_obj["tasks"].index(p) == i
            return correct

        #not_fixed = filter(json_obj["tasks"], lambda t: not ("fixed" in t or t["fixed"]))
        perms = itertools.permutations(json_obj["tasks"])
        fixed = filter(fixed_correct, perms)
        for perm in fixed:
            conditions.append(Condition(list(perm), json_obj["randomize_suggestions"]))
    else:
        c = Condition(json_obj["tasks"], json_obj["randomize_suggestions"])
        conditions.append(c)

    # If we have randomize suggestions on, permute the suggestions and add a new condition for each suggestion
    if json_obj["randomize_suggestions"]:
        # We DONT do this since this generates a ton of task files. Given 5
        # tasks with 3 of the tasks having 5 suggestions each, this leads to
        # around 4 billion task files
        #conditions = generate_random_conditions(conditions)
        pass

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

