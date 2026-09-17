"""
Phase 2 — Automated Data Acquisition
Alzheimer's Detection Project (Hybrid Classical ML + Quantum Computing)

Dataset : OASIS Alzheimer's Detection — Multi-Class (patient-split, leakage-safe)
Kaggle  : shreyanmohanty/oasis-alzheimers-detection-multi-class-dataset

Local / VS Code / Antigravity version (no Colab dependency). Run:
    pip install -r requirements.txt
    python phase2_data_acquisition.py
"""

import os
import re
from pathlib import Path
from collections import defaultdict

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image

from config import DATA_DIR, KAGGLE_DATASET

TARGET_PER_CLASS = 5000


# ----------------------------------------------------------------------
# STEP 1 -- AUTHENTICATE + DOWNLOAD  (the one manual step lives here)
# ----------------------------------------------------------------------
def setup_kaggle_and_download():
    """
    MANUAL STEP (one-time, ~2 minutes):
      1. kaggle.com -> your profile -> Settings -> API -> 'Create New Token'
         (downloads kaggle.json)
      2. Place it at:
           macOS/Linux : ~/.kaggle/kaggle.json   then  chmod 600 ~/.kaggle/kaggle.json
           Windows     : C:\\Users\\<you>\\.kaggle\\kaggle.json

    Everything after that is automatic.
    """
    count = 0
    for _, _, files in os.walk(DATA_DIR):
        count += len([f for f in files if f.lower().endswith(('.jpg', '.png', '.jpeg'))])
        if count > 1000:
            print(f"Dataset already downloaded and extracted ({count}+ images found in {DATA_DIR}). Skipping download.")
            return

    kaggle_json = Path.home() / ".kaggle" / "kaggle.json"
    if not kaggle_json.exists():
        raise FileNotFoundError(
            f"kaggle.json not found at {kaggle_json}.\n"
            "Generate one at kaggle.com -> Settings -> API -> Create New Token, "
            "place it at that path, then re-run this script."
        )
    os.system(f"python -m kaggle datasets download -d {KAGGLE_DATASET} -p {DATA_DIR} --unzip")
    print(f"Downloaded + extracted to: {DATA_DIR}")


# ----------------------------------------------------------------------
# STEP 2 -- AUTO-DETECT CLASSES
# ----------------------------------------------------------------------
def detect_classes(root: Path):
    """A 'class folder' is any directory that directly contains images."""
    classes = {}
    valid_exts = {".jpg", ".jpeg", ".png"}
    for dirpath, _, filenames in os.walk(root):
        imgs = [Path(dirpath) / f for f in filenames if Path(f).suffix.lower() in valid_exts]
        if imgs:
            classes[Path(dirpath)] = imgs
    return classes


# ----------------------------------------------------------------------
# STEP 3 -- INTEGRITY CHECK (Multi-threaded)
# ----------------------------------------------------------------------
from concurrent.futures import ThreadPoolExecutor

def _check_single_img(img_path):
    try:
        with Image.open(img_path) as im:
            im.verify()
        return None
    except Exception:
        return img_path

def verify_integrity(classes: dict):
    all_imgs = [img for imgs in classes.values() for img in imgs]
    with ThreadPoolExecutor(max_workers=16) as executor:
        results = list(executor.map(_check_single_img, all_imgs))
    corrupt = [r for r in results if r is not None]
    print(f"Integrity check: {len(corrupt)} corrupt file(s) found out of {len(all_imgs)} images.")
    if corrupt[:5]:
        print("  e.g.:", *[str(c) for c in corrupt[:5]], sep="\n  ")
    return corrupt


# ----------------------------------------------------------------------
# STEP 4 -- SUBJECT ID EXTRACTION (confirmed against real OASIS filenames)
# ----------------------------------------------------------------------
SUBJECT_ID_PATTERN = re.compile(r"(OAS1_\d{4}|OAS2_\d{4}|sub-\d+)", re.IGNORECASE)

def extract_subject_ids(classes: dict):
    subjects_per_class = defaultdict(set)
    unmatched = 0
    for folder, imgs in classes.items():
        for img_path in imgs:
            m = SUBJECT_ID_PATTERN.search(img_path.name)
            if m:
                subjects_per_class[folder.name].add(m.group(1))
            else:
                unmatched += 1
    if unmatched:
        print(f"WARNING: {unmatched} filename(s) didn't match the ID pattern.")
        print("  -> Inspect real filenames before trusting the subject-wise split in Phase 3.")
    return subjects_per_class


# ----------------------------------------------------------------------
# STEP 5 -- SUMMARY + PLOT
# ----------------------------------------------------------------------
def summarize(classes: dict, subjects_per_class: dict):
    print("\n--- CLASS SUMMARY ---")
    names, counts = [], []
    for folder, imgs in sorted(classes.items(), key=lambda x: -len(x[1])):
        n_subj = len(subjects_per_class.get(folder.name, []))
        flag = "  <-- below 5,000-image target" if len(imgs) < TARGET_PER_CLASS else ""
        print(f"{folder.name:25s} images={len(imgs):6d}  subjects~{n_subj:4d}{flag}")
        names.append(folder.name)
        counts.append(len(imgs))

    plt.figure(figsize=(7, 4))
    plt.bar(names, counts)
    plt.axhline(TARGET_PER_CLASS, color="red", linestyle="--", label="5,000 target")
    plt.ylabel("Image count")
    plt.title("Class distribution -- OASIS Alzheimer's dataset")
    plt.xticks(rotation=20)
    plt.legend()
    plt.tight_layout()
    plt.savefig(DATA_DIR.parent / "class_distribution.png")
    plt.show()


def print_sample_filenames(classes: dict, n=5):
    print("\n--- SAMPLE FILENAMES (check these against SUBJECT_ID_PATTERN) ---")
    for folder, imgs in classes.items():
        print(f"{folder.name}:")
        for img_path in imgs[:n]:
            print("   ", img_path.name)
        break


if __name__ == "__main__":
    setup_kaggle_and_download()
    classes = detect_classes(DATA_DIR)
    print_sample_filenames(classes)
    verify_integrity(classes)
    subjects = extract_subject_ids(classes)
    summarize(classes, subjects)
