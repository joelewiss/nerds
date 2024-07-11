import json
import sys
import os
import signal
from instance.testing.prepare_input import setup_testfile
from subprocess import run, STDOUT, PIPE
from typing import List
from itertools import zip_longest

TASKS = [1,2,3,4]

def sigint_handler(sig, frame):
    print("\033[0m")

def write_suggestion(task: int, suggestion: int, tasks: dict):
    suggestions = tasks["tasks"][task]["suggestions"]
    f = open(f"instance/testing/task{task}.c", "w")
    f.write(suggestions[suggestion])
    f.close()

def write_tasks_from_suggestion(suggestion: int):
    f = open("generator/tasks.json")
    tasks = json.load(f)
    f.close()

    for task in TASKS:
        write_suggestion(task, suggestion, tasks)

    os.chdir("instance/testing")
    for task in TASKS:
        setup_testfile(task)

    os.chdir("../..")

def build_test_files(wasm:bool = False) -> None:
    os.chdir("instance/testing")

    env = {"PATH": os.environ["PATH"]}
    # Clean first
    run(["/usr/bin/make", "clean"], check=True, capture_output=True)

    build_targets = [f"test_task{t}" for t in TASKS]
    if wasm:
        build_targets = [f"test_task{t}.js" for t in TASKS]
        env["CC"] = "emcc"
        run(["/usr/bin/make"] + build_targets, check=True, env=env, capture_output=True)
    else:
        run(["/usr/bin/make"] + build_targets, check=True, capture_output=True)

    os.chdir("../..")

def run_tests(task: int, wasm:bool = False, security:bool = False) -> str:
    os.chdir("instance/testing")
    output = []
    security = "1" if security else "0"

    #print("\033[38;5;8m", end="")

    if wasm:
        wasm = run(["node", f"test_task{task}.js", str(task), security],
                     stdout=PIPE, stderr=STDOUT)
        output = wasm.stdout
    else:
        native = run([f"{os.getcwd()}/test_task{task}", str(task), security],
                     stdout=PIPE, stderr=STDOUT)
        output = native.stdout

    #print("\033[0m", end="")

    os.chdir("../..")

    return output

def print_output(native, wasm, task):
    print(task)
    print(f"{'native':80} | wasm")
    for n, w in zip_longest(native.splitlines(), wasm.splitlines(), fillvalue=b""):
        try: 
            n_str = n.decode()
        except UnicodeDecodeError:
            n_str = "decode err"

        try: 
            w_str = w.decode()
        except UnicodeDecodeError:
            w_str = "decode err"

        if len(w_str) > 80:
            w_str = w_str[:80]

        print("{:80s} | {:s}".format(n_str, w_str))

if __name__ == "__main__":
    start = int(sys.argv[1])
    end = int(sys.argv[2])
    examine = False
    security = True
    signal.signal(signal.SIGINT, sigint_handler)
    if len(sys.argv) == 4:
        examine = True

    for i in range(start, end+1):
        print(f"Writing suggestion {i} (index {i-1})")
        write_tasks_from_suggestion(i-1)
        native_outs = []
        wasm_outs = []

        # Do native
        print("native: ", end="")
        build_test_files()
        print("built", end="")
        for t in TASKS:
            native_outs.append(run_tests(t, security=security))
            print(t, end="")
        print(" finished")

        # Do wasm
        print("wasm: ", end="")
        build_test_files(wasm=True)
        print("built", end="")
        for t in TASKS:
            wasm_outs.append(run_tests(t, wasm=True, security=security))
            print(t, end="")
        print(" finished")

        # Compare outs
        for i, (native, wasm) in enumerate(zip(native_outs, wasm_outs)):
            print(f"Task {i+1} ", end="")
            if native == wasm:
                print("\t\033[38;5;2mpass\033[0m")
            else:
                print("\t\033[38;5;9mfail\033[0m")
                if examine:
                    print_output(native, wasm, f"TASK {i+1}")
                    input("Press enter to continue")



