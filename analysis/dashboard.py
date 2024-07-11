#!/usr/bin/python3

"""
Condition Dashboard for Read-Write-Fix (RWF) study
Joe Lewis 2022

Displays various condition and study statistics from a CSV backup
"""

import sys
import logging
import pandas as pd
from pathlib import Path

from conditions import get_conditions_map

logging.basicConfig(stream=sys.stdout,
                    format="%(levelname)-10s %(message)s")
log = logging.getLogger()

def created_instances_stats(df, c_df, ignored):
    print("\n====Created Instances Stats====\n")

    # First remove ignored ids
    df = df[~df["userid"].isin(ignored)]

    print("Total instances:", df.shape[0])
    completed = df[df["finished"] == "t"].shape[0]
    print("Completed studies:", completed)
    ip_addresses = df["ip"].unique().size
    print("Unique IP addresses:", df["ip"].unique().size)
    un = df.drop_duplicates("ip")
    completed_unique = un[un["finished"] == "t"].shape[0]
    print("Completed studies (unique ip):", completed_unique)
    print("Overall dropout rate {:.2%}".format(1 - (completed_unique / ip_addresses)))
    print()

    condition_stats = pd.DataFrame(df[
        ["instanceTerminated", "finished", "time", "heartbeat", "condition", "ip"]
    ])

    con_map = c_df.loc[df["condition"]]
    con_map.index = range(0, df.shape[0])
    condition_stats = condition_stats.assign(
            category = con_map["category"].array,
            lib = con_map["lib"].array)
    condition_stats.drop(columns=["condition"], inplace=True)

    #condition_stats = condition_stats[condition_stats["finished"] == "t"]


    # Simple totals
    cs = condition_stats.groupby(["category", "lib"]).size()
    #print("Completed conditions:")
    #new_columns = ["category", "lib", "total"]
    #cs.set_axis(new_columns, axis="columns", inplace=True)


    # Only finished
    #g = condition_stats.drop_duplicates("ip")
    g = condition_stats[condition_stats["finished"] == "t"]
    #g = g.groupby(["category", "lib"]).size().reset_index()
    g = g.groupby(["category", "lib"]).size()
    cs = cs.align(g, axis=0, fill_value=0)
    cs = (cs[0], cs[1].astype("int64"))

    frame = condition_stats.groupby(["category", "lib"]).size().reset_index()
    frame.drop(columns=[0], inplace=True)
    frame = frame.assign(
            total = cs[0].values,
            completed = cs[1].values
    )
    frame = frame.assign(dropout = lambda x: 1 - x.completed / x.total)
    frame["dropout"] = frame["dropout"].apply(lambda x: "{:.0%}".format(x))

    print(frame)
    
def read_ignore():
    ignore = []
    ignore_file = Path("ignoreids.txt")
    if ignore_file.is_file():
        log.debug("Reading ignoreids.txt")

        f = open(ignore_file, "r")
        for l in f.readlines():
            ignore.append(l.split("#")[0].strip())

    return ignore

if __name__ == "__main__":
    if len(sys.argv) < 2:
        log.error("usage: dashboard.py <csv backup directory> [log level]")
        exit(1)

    if len(sys.argv) > 2:
        log.setLevel(sys.argv[2])
    else:
        log.setLevel("WARNING")

    path_arg = Path(sys.argv[1])
    if not path_arg.is_dir():
        log.error(f"{path_arg.name} is not a directory")
        sys.exit(1)

    # Find most recent CSVs
    files = sorted(path_arg.glob("*.csv"))
    if len(files) < 3:
        log.error(f"{path_arg.name} does not have enough files (3 csv files)")
        sys.exit(1)
    recent = files[-3:]


    conditions_file = list(filter(lambda x: "conditions" in x.name, recent))[0]
    #conditions_file = path_arg / "conditions.csv"
    log.debug(f"Reading {conditions_file}")
    conditions = get_conditions_map(conditions_file)
    conditions_df = pd.DataFrame(conditions)

    # Get ignored ids
    ignored_ids = read_ignore()
    log.debug(f"Ignoring ids {ignored_ids}")


    created_instances_file = list(filter(lambda x: "createdInstances" in x.name, recent))[0]
    #created_instances_file = path_arg / "createdInstances.csv"
    log.debug(f"Reading {created_instances_file}")
    created_instances = pd.read_csv(created_instances_file)
    created_instances_stats(created_instances, conditions_df, ignored_ids)
