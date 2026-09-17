"""
Phase 4 — Preprocessing
Alzheimer's Detection Project (Hybrid Classical ML + Quantum Computing)

KEY DECISION (flagged, not silently applied): ModerateDemented has only
~2 subjects total -- too few for a meaningful split on its own. Merged
into MildDemented as "Demented" by default. Report this as a stated
limitation. Set MERGE_MODERATE_INTO_MILD = False to keep 4 classes instead.
"""

import csv
import numpy as np
from collections import defaultdict
from PIL import Image

from config import MANIFEST_PATH, PREP_DIR

IMG_SIZE = (64, 64)
MERGE_MODERATE_INTO_MILD = True
LABEL_MERGE_MAP = {"ModerateDemented": "Demented", "MildDemented": "Demented"} \
                   if MERGE_MODERATE_INTO_MILD else {}


def load_manifest():
    rows = []
    with open(MANIFEST_PATH, newline="") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append(r)
    print(f"Loaded manifest: {len(rows)} images")
    return rows


def apply_label_merge(rows):
    if not LABEL_MERGE_MAP:
        return rows
    n_changed = 0
    for r in rows:
        if r["class"] in LABEL_MERGE_MAP:
            r["class"] = LABEL_MERGE_MAP[r["class"]]
            n_changed += 1
    print(f"Label merge applied: {n_changed} rows remapped -> "
          f"{sorted(set(LABEL_MERGE_MAP.values()))}")
    return rows


from concurrent.futures import ThreadPoolExecutor

def _load_and_resize(arg):
    idx, r, class_to_idx = arg
    try:
        with Image.open(r["image_path"]) as im:
            im = im.convert("L").resize(IMG_SIZE)
            arr = np.array(im, dtype=np.uint8)
        return idx, arr, class_to_idx[r["class"]], r["subject_id"], True
    except Exception:
        return idx, None, None, None, False


def preprocess_and_save(rows):
    by_split = defaultdict(list)
    for r in rows:
        by_split[r["split"]].append(r)

    classes = sorted(set(r["class"] for r in rows))
    class_to_idx = {c: i for i, c in enumerate(classes)}
    print(f"Classes ({len(classes)}): {class_to_idx}")

    for split, split_rows in by_split.items():
        X = np.zeros((len(split_rows), *IMG_SIZE), dtype=np.uint8)
        y = np.zeros(len(split_rows), dtype=np.int64)
        subject_ids = [""] * len(split_rows)
        failed = 0

        tasks = [(i, r, class_to_idx) for i, r in enumerate(split_rows)]
        with ThreadPoolExecutor(max_workers=16) as executor:
            results = list(executor.map(_load_and_resize, tasks))

        valid_count = 0
        for i, arr, label, sid, ok in results:
            if ok:
                X[valid_count] = arr
                y[valid_count] = label
                subject_ids[valid_count] = sid
                valid_count += 1
            else:
                failed += 1

        X = X[:valid_count]
        y = y[:valid_count]
        subject_ids = subject_ids[:valid_count]

        np.save(PREP_DIR / f"{split}_X.npy", X)
        np.save(PREP_DIR / f"{split}_y.npy", y)
        np.save(PREP_DIR / f"{split}_subjects.npy", np.array(subject_ids))
        print(f"{split:5s}: {valid_count} images saved ({failed} failed to load)")

    with open(PREP_DIR / "class_map.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["class", "index"])
        for c, i in class_to_idx.items():
            writer.writerow([c, i])
    print(f"\nClass map saved: {PREP_DIR / 'class_map.csv'}")


if __name__ == "__main__":
    rows = load_manifest()
    rows = apply_label_merge(rows)
    preprocess_and_save(rows)
