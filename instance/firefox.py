import sqlite3
import os
from sys import exit
from shutil import copy
from typing import Union, List
from pathlib import Path
from datetime import datetime
from pprint import pp

# Mapping from https://gist.github.com/olejorgenb/9418bef65c65cd1f489557cfc08dde96
MOZ_VISIT_TYPE_MAP = {
    1: "TRANSITION_LINK",
    2: "TRANSITION_TYPED",
    3: "TRANSITION_BOOKMARK",
    4: "TRANSITION_EMBED",
    5: "TRANSITION_REDIRECT_PERMA",
    6: "TRANSITION_REDIRECT_TEMPO",
    7: "TRANSITION_DOWNLOAD",
    8: "TRANSITION_FRAMED_LINK",
    9: "TRANSITION_RELOAD"
}

def find_moz_places() -> Union[Path, None]:
    firefox_folder = Path("/home/user/.mozilla/firefox")
    if not firefox_folder.exists():
        return None
    
    p = list(firefox_folder.glob("*.default-esr/places.sqlite*"))
    if len(p) > 0:
        return p
    else:
        return None


def get_firefox_history() -> List[tuple]:
    # Script to get a list of timestamp, visit pairs from a places.sqlite file
    places_map = {}
    history = []
    places_files = find_moz_places()
    if places_files is None:
        print("Could not find firefox database")
        return []

    copied_places = []
    for place_file in places_files:
        copied_places.append(Path(copy(place_file, ".")))

    main_file = None
    for p in copied_places:
        if p.name == "places.sqlite":
            main_file = p

    con = sqlite3.connect(main_file)
    cur = con.cursor()
    cur.execute("SELECT id, url FROM moz_places")
    res = cur.fetchall()
    for p_id, url in res:
        places_map[p_id] = url

    cur.execute("SELECT place_id, visit_date, from_visit, visit_type FROM moz_historyvisits")
    res = cur.fetchall()
    for p_id, visit_date, from_p_id, visit_type in res:
        d = datetime.fromtimestamp(visit_date//1e6)
        from_url = ""
        if from_p_id != 0:
            from_url = places_map[from_p_id]

        history.append(
            (d.isoformat(), places_map[p_id], from_url, MOZ_VISIT_TYPE_MAP[visit_type])
        )

    for f in Path(".").glob("places.sqlite*"):
        os.remove(f)

    return history


