"""
Phase 8 — Feature Selection (RF ranking + adaptive PCA) + Model 2
Alzheimer's Detection Project (Hybrid Classical ML + Quantum Computing)

PCA's component count comes from the real cumulative explained-variance
curve on your actual training features, capped at MAX_QUBITS for
simulator feasibility -- never a guessed number.
"""

import json
import time
import joblib
import numpy as np

from sklearn.ensemble import RandomForestClassifier
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                              f1_score, confusion_matrix, roc_auc_score)

from config import FEAT_DIR, FSEL_DIR

TOP_K_RF_FEATURES = 128
VARIANCE_TARGET = 0.95
MAX_QUBITS = 10


def load_split(split):
    X = np.load(FEAT_DIR / f"{split}_features.npy")
    y = np.load(FEAT_DIR / f"{split}_labels.npy")
    return X, y


def rf_rank_and_select(X_train, y_train, X_val, X_test):
    rf = RandomForestClassifier(n_estimators=400, class_weight="balanced", random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    importances = rf.feature_importances_
    top_idx = np.argsort(importances)[::-1][:TOP_K_RF_FEATURES]
    print(f"RF importance ranking done. Keeping top {TOP_K_RF_FEATURES}/{X_train.shape[1]} features.", flush=True)
    return X_train[:, top_idx], X_val[:, top_idx], X_test[:, top_idx], top_idx, rf


def adaptive_pca(X_train, X_val, X_test):
    pca_full = PCA(n_components=min(TOP_K_RF_FEATURES, X_train.shape[0])).fit(X_train)
    cumvar = np.cumsum(pca_full.explained_variance_ratio_)
    n_needed = int(np.searchsorted(cumvar, VARIANCE_TARGET) + 1)
    n_components = min(n_needed, MAX_QUBITS)

    if n_needed > MAX_QUBITS:
        print(f"PCA: {n_needed} components would reach {VARIANCE_TARGET:.0%} variance, "
              f"but capped to MAX_QUBITS={MAX_QUBITS} for quantum feasibility. "
              f"Actual variance retained at cap: {cumvar[n_components - 1]:.3f}")
    else:
        print(f"PCA: {n_components} components reach {cumvar[n_components - 1]:.3f} variance "
              f"(target was {VARIANCE_TARGET:.0%}).")

    pca = PCA(n_components=n_components, random_state=42).fit(X_train)
    return (pca.transform(X_train), pca.transform(X_val), pca.transform(X_test),
            pca, n_components, float(cumvar[n_components - 1]))


def train_model2(X_train, y_train, X_test, y_test):
    scaler = StandardScaler().fit(X_train)
    X_train_s, X_test_s = scaler.transform(X_train), scaler.transform(X_test)

    if len(X_train_s) > 20000:
        rng = np.random.default_rng(42)
        idx_sub = []
        for c in np.unique(y_train):
            idx_c = np.where(y_train == c)[0]
            n_c = min(int(20000 * len(idx_c) / len(y_train)), len(idx_c))
            idx_sub.extend(rng.choice(idx_c, size=n_c, replace=False))
        idx_sub = np.array(idx_sub)
        X_tr, y_tr = X_train_s[idx_sub], y_train[idx_sub]
    else:
        X_tr, y_tr = X_train_s, y_train

    clf = SVC(kernel="rbf", class_weight="balanced", probability=False, cache_size=2000)
    t0 = time.perf_counter(); clf.fit(X_tr, y_tr); train_time = time.perf_counter() - t0
    t0 = time.perf_counter(); y_pred = clf.predict(X_test_s); pred_time = time.perf_counter() - t0

    metrics = {
        "model": "Model2_RF+PCA+SVM",
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, average="macro", zero_division=0),
        "recall": recall_score(y_test, y_pred, average="macro", zero_division=0),
        "f1": f1_score(y_test, y_pred, average="macro", zero_division=0),
        "train_time_s": train_time,
        "pred_time_s": pred_time,
    }
    try:
        if hasattr(clf, "predict_proba"):
            y_proba = clf.predict_proba(X_test_s)
        else:
            y_proba = clf.decision_function(X_test_s)
        metrics["roc_auc"] = roc_auc_score(y_test, y_proba, multi_class="ovr", average="macro")
    except Exception:
        metrics["roc_auc"] = float("nan")

    np.save(FSEL_DIR / "model2_confusion_matrix.npy", confusion_matrix(y_test, y_pred))
    return metrics


if __name__ == "__main__":
    X_train, y_train = load_split("train")
    X_val, y_val = load_split("val")
    X_test, y_test = load_split("test")

    X_train_rf, X_val_rf, X_test_rf, top_idx, rf_model = rf_rank_and_select(
        X_train, y_train, X_val, X_test)
    X_train_pca, X_val_pca, X_test_pca, pca_model, n_components, variance_retained = \
        adaptive_pca(X_train_rf, X_val_rf, X_test_rf)

    metrics = train_model2(X_train_pca, y_train, X_test_pca, y_test)
    print(f"\nModel 2 (RF+PCA+SVM): {metrics}")

    np.save(FSEL_DIR / "train_pca.npy", X_train_pca)
    np.save(FSEL_DIR / "val_pca.npy", X_val_pca)
    np.save(FSEL_DIR / "test_pca.npy", X_test_pca)
    np.save(FSEL_DIR / "train_labels.npy", y_train)
    np.save(FSEL_DIR / "val_labels.npy", y_val)
    np.save(FSEL_DIR / "test_labels.npy", y_test)
    joblib.dump(rf_model, FSEL_DIR / "rf_selector.joblib")
    joblib.dump(pca_model, FSEL_DIR / "pca.joblib")
    np.save(FSEL_DIR / "rf_top_feature_idx.npy", top_idx)

    with open(FSEL_DIR / "feature_selection_config.json", "w") as f:
        json.dump({"n_components": n_components, "variance_retained": variance_retained,
                    "top_k_rf_features": TOP_K_RF_FEATURES, "max_qubits": MAX_QUBITS}, f, indent=2)
    with open(FSEL_DIR / "model2_results.json", "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\nSaved. Phase 9 (quantum stage) will use n_components={n_components} qubits.")
