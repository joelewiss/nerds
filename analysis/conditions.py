"""
Conditions reader module for condition dashboard
Joe Lewis 2022
"""

import logging
log = logging.getLogger()

def get_conditions_map(conditions_csv):
    conditions = []
    f = open(conditions_csv)
    for line in f.readlines()[1:]:
        cond = {}
        if "fix" in line:
            cond["category"] = "fix"
        elif "read" in line:
            cond["category"] = "read"
        elif "write":
            cond["category"] = "write"

        if ("crypto_io" in line) or ("cryptographyio" in line):
            cond["lib"] = "crypto.io"
        elif "pycrypto" in line:
            cond["lib"] = "PyCrypto"

        if ("lib" not in cond) or ("category" not in cond):
            log.error("Unexpected condition in csv: %s", line)
            exit(1)

        conditions.append(cond)

    return conditions
