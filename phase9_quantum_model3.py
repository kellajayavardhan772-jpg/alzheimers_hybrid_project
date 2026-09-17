"""
Phase 9 — Quantum Feature Map + Quantum Kernel + QSVM  (Model 3 / proposed hybrid)
Alzheimer's Detection Project (Hybrid Classical ML + Quantum Computing)

Qubit count = whatever Phase 8 actually determined (read from
feature_selection_config.json), never hardcoded.

STATED UP FRONT: quantum kernel simulation scales roughly quadratically
with training-sample count, so this script stratified-subsamples a stated
number of images per class rather than using the full training set --
report that honestly rather than implying the full set was used.

Run first: pip install -r requirements.txt
"""

import json
import time
import numpy as np

from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                              f1_score, confusion_matrix, roc_auc_score)

from qiskit.circuit.library import ZZFeatureMap
try:
    from qiskit.primitives import StatevectorSampler as Sampler
except ImportError:
    from qiskit.primitives import Sampler
try:
    from qiskit_machine_learning.state_fidelities import ComputeUncompute
except ImportError:
    # pyrefly: ignore [missing-import]
    from qiskit.algorithms.state_fidelities import ComputeUncompute
from qiskit_machine_learning.kernels import FidelityQuantumKernel
from qiskit_machine_learning.algorithms import QSVC

from config import FSEL_DIR, QUANTUM_DIR

QUANTUM_TRAIN_PER_CLASS = 100
QUANTUM_TEST_PER_CLASS = 50
SEED = 42


def load_config():
    with open(FSEL_DIR / "feature_selection_config.json") as f:
        cfg = json.load(f)
    print(f"Loaded feature-selection config: {cfg}")
    return cfg


def stratified_subsample(X, y, per_class, seed=SEED):
    rng = np.random.default_rng(seed)
    idx_out = []
    for c in np.unique(y):
        idx_c = np.where(y == c)[0]
        n = min(per_class, len(idx_c))
        idx_out.extend(rng.choice(idx_c, size=n, replace=False))
    idx_out = np.array(idx_out)
    rng.shuffle(idx_out)
    return X[idx_out], y[idx_out]


from qiskit.quantum_info import Statevector

def compute_statevectors(X, feature_map):
    svs = []
    for x in X:
        qc = feature_map.assign_parameters(x)
        svs.append(Statevector.from_instruction(qc).data)
    return np.array(svs)


def run_model3(cfg):
    X_train = np.load(FSEL_DIR / "train_pca.npy")
    y_train = np.load(FSEL_DIR / "train_labels.npy")
    X_test = np.load(FSEL_DIR / "test_pca.npy")
    y_test = np.load(FSEL_DIR / "test_labels.npy")

    n_qubits = cfg["n_components"]
    X_train_q, y_train_q = stratified_subsample(X_train, y_train, QUANTUM_TRAIN_PER_CLASS)
    X_test_q, y_test_q = stratified_subsample(X_test, y_test, QUANTUM_TEST_PER_CLASS)
    print(f"Quantum stage: {n_qubits} qubits, {len(X_train_q)} train / {len(X_test_q)} test "
          f"samples (subsampled from {len(X_train)} / {len(X_test)} available).")

    feature_map = ZZFeatureMap(feature_dimension=n_qubits, reps=2, entanglement="linear")

    print("Extracting quantum statevectors...", flush=True)
    t0 = time.perf_counter()
    sv_train = compute_statevectors(X_train_q, feature_map)
    sv_test = compute_statevectors(X_test_q, feature_map)

    gram_train = np.abs(sv_train @ sv_train.conj().T) ** 2
    gram_test = np.abs(sv_test @ sv_train.conj().T) ** 2

    from sklearn.svm import SVC
    clf = SVC(kernel="precomputed", class_weight="balanced")
    clf.fit(gram_train, y_train_q)
    train_time = time.perf_counter() - t0

    t0 = time.perf_counter()
    y_pred = clf.predict(gram_test)
    pred_time = time.perf_counter() - t0

    metrics = {
        "model": "Model3_RF+PCA+QuantumKernel+SVM",
        "n_qubits": n_qubits,
        "n_train_used": len(X_train_q),
        "n_test_used": len(X_test_q),
        "accuracy": float(accuracy_score(y_test_q, y_pred)),
        "precision": float(precision_score(y_test_q, y_pred, average="macro", zero_division=0)),
        "recall": float(recall_score(y_test_q, y_pred, average="macro", zero_division=0)),
        "f1": float(f1_score(y_test_q, y_pred, average="macro", zero_division=0)),
        "train_time_s": train_time,
        "pred_time_s": pred_time,
    }
    try:
        if hasattr(clf, "predict_proba"):
            y_proba = clf.predict_proba(gram_test)
        else:
            y_proba = clf.decision_function(gram_test)
        metrics["roc_auc"] = float(roc_auc_score(y_test_q, y_proba, multi_class="ovr", average="macro"))
    except Exception:
        metrics["roc_auc"] = float("nan")

    np.save(QUANTUM_DIR / "model3_confusion_matrix.npy", confusion_matrix(y_test_q, y_pred))
    print(f"\nModel 3 (quantum hybrid): {metrics}", flush=True)

    with open(QUANTUM_DIR / "model3_results.json", "w") as f:
        json.dump(metrics, f, indent=2)
    return metrics


if __name__ == "__main__":
    cfg = load_config()
    run_model3(cfg)
