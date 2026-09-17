"""
Shared configuration for the Alzheimer's Hybrid ML + Quantum pipeline.

Every phase script imports its paths from here instead of hardcoding
them, so the whole project moves between machines (Colab, local VS Code,
Antigravity) by editing exactly one file.
"""

from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
DATA_ROOT = PROJECT_ROOT / "data"

DATA_DIR = DATA_ROOT / "oasis_data"                 # Phase 2 downloads here
MANIFEST_PATH = DATA_ROOT / "split_manifest.csv"     # Phase 3 writes this
PREP_DIR = DATA_ROOT / "preprocessed"                # Phase 4 output
FEAT_DIR = DATA_ROOT / "features"                    # Phase 5 output
FSEL_DIR = DATA_ROOT / "feature_selection"           # Phase 8 output
QUANTUM_DIR = DATA_ROOT / "quantum_results"          # Phase 9 output
BASELINE_DIR = DATA_ROOT / "baseline_results"        # Phase 6-7 output
FINAL_DIR = DATA_ROOT / "final_comparison"           # Phase 11 output

KAGGLE_DATASET = "shreyanmohanty/oasis-alzheimers-detection-multi-class-dataset"

for _d in [DATA_DIR, PREP_DIR, FEAT_DIR, FSEL_DIR, QUANTUM_DIR, BASELINE_DIR, FINAL_DIR]:
    _d.mkdir(parents=True, exist_ok=True)
