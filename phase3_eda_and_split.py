"""
Phase 3 — Data Exploration + Subject-Wise Split
Alzheimer's Detection Project (Hybrid Classical ML + Quantum Computing)

Pools every duplicate-named class folder from Phase 2's download, re-derives
subjects from scratch, and builds a brand-new subject-wise 70/15/15 split --
sidestepping whatever leakage risk the raw Roboflow export folders carried.
"""

import re
import csv
import random
from collections import defaultdict

from PIL import Image

from config import DATA_DIR, MANIFEST_PATH

SPLIT_RATIOS = {"train": 0.70, "val": 0.15, "test": 0.15}
SEED = 42
SUBJECT_ID_PATTERN = re.compile(r"(OAS1_\d{4})", re.IGNORECASE)


import os
from pathlib import Path

def pool_by_class(root):
    pool = defaultdict(list)
    valid_exts = {".jpg", ".jpeg", ".png"}
    for dirpath, _, filenames in os.walk(root):
        imgs = [Path(dirpath) / f for f in filenames if Path(f).suffix.lower() in valid_exts]
        if imgs:
            folder_name = Path(dirpath).name
            pool[folder_name].extend(imgs)
    return pool


def map_subjects(pool: dict):
    subject_class = {}
    subject_images = defaultdict(list)
    seen_classes = defaultdict(set)

    for class_name, imgs in pool.items():
        for img_path in imgs:
            m = SUBJECT_ID_PATTERN.search(img_path.name)
            if not m:
                continue
            sid = m.group(1).upper()
            subject_images[sid].append(img_path)
            seen_classes[sid].add(class_name)
            subject_class.setdefault(sid, class_name)

    conflicted = {sid: cls for sid, cls in seen_classes.items() if len(cls) > 1}
    if conflicted:
        print(f"WARNING: {len(conflicted)} subject(s) appear under more than one class:")
        for sid, cls in list(conflicted.items())[:10]:
            print(f"   {sid}: {cls}")
        print("Excluded from the split until you manually resolve the correct label.")
        for sid in conflicted:
            subject_class.pop(sid, None)

    return subject_class, subject_images


def eda_report(subject_class: dict, subject_images: dict):
    print("\n--- SUBJECT-LEVEL CLASS DISTRIBUTION ---")
    class_subjects = defaultdict(list)
    for sid, cls in subject_class.items():
        class_subjects[cls].append(sid)

    total_subjects = total_images = 0
    for cls, sids in sorted(class_subjects.items(), key=lambda x: -len(x[1])):
        n_img = sum(len(subject_images[s]) for s in sids)
        print(f"{cls:20s} subjects={len(sids):4d}  images={n_img:6d}")
        total_subjects += len(sids)
        total_images += n_img
    print(f"{'TOTAL':20s} subjects={total_subjects:4d}  images={total_images:6d}")

    dims, formats = defaultdict(int), defaultdict(int)
    sample = [p for imgs in subject_images.values() for p in imgs][:200]
    for p in sample:
        with Image.open(p) as im:
            dims[im.size] += 1
            formats[im.format] += 1
    print("\n--- IMAGE DIMENSIONS (sample of 200) ---")
    for size, count in dims.items():
        print(f"  {size}: {count}")
    print("--- FILE FORMATS (sample of 200) ---")
    for fmt, count in formats.items():
        print(f"  {fmt}: {count}")


def subject_wise_split(subject_class: dict):
    random.seed(SEED)
    class_subjects = defaultdict(list)
    for sid, cls in subject_class.items():
        class_subjects[cls].append(sid)

    split_assignment = {}
    for cls, sids in class_subjects.items():
        sids = sorted(sids)
        random.shuffle(sids)
        n = len(sids)
        n_train = round(n * SPLIT_RATIOS["train"])
        n_val = round(n * SPLIT_RATIOS["val"])
        for i, sid in enumerate(sids):
            if i < n_train:
                split_assignment[sid] = "train"
            elif i < n_train + n_val:
                split_assignment[sid] = "val"
            else:
                split_assignment[sid] = "test"
    return split_assignment


def save_manifest_and_verify(subject_class, subject_images, split_assignment):
    rows = []
    for sid, cls in subject_class.items():
        split = split_assignment[sid]
        for img_path in subject_images[sid]:
            rows.append((str(img_path), sid, cls, split))

    subj_to_splits = defaultdict(set)
    for _, sid, _, split in rows:
        subj_to_splits[sid].add(split)
    leaks = {s: sp for s, sp in subj_to_splits.items() if len(sp) > 1}
    assert not leaks, f"LEAKAGE DETECTED for subjects: {leaks}"
    print(f"\nLeakage check passed: {len(subj_to_splits)} subjects, each in exactly one split.")

    with open(MANIFEST_PATH, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["image_path", "subject_id", "class", "split"])
        writer.writerows(rows)
    print(f"Manifest saved: {MANIFEST_PATH}  ({len(rows)} rows)")

    print("\n--- SPLIT SUMMARY (subject counts, by class) ---")
    summary = defaultdict(lambda: defaultdict(int))
    for sid, cls in subject_class.items():
        summary[cls][split_assignment[sid]] += 1
    for cls, splits in summary.items():
        print(f"{cls:20s} train={splits['train']:3d}  val={splits['val']:3d}  test={splits['test']:3d}")


if __name__ == "__main__":
    pool = pool_by_class(DATA_DIR)
    subject_class, subject_images = map_subjects(pool)
    eda_report(subject_class, subject_images)
    split_assignment = subject_wise_split(subject_class)
    save_manifest_and_verify(subject_class, subject_images, split_assignment)
