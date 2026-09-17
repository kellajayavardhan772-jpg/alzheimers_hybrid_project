"""
Phases 6-7 — Classical ML Baseline + Evaluation (Instant Execution)
Alzheimer's Detection Project (Hybrid Classical ML + Quantum Computing)
"""

import time
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    confusion_matrix, roc_auc_score
)

from config import FEAT_DIR, BASELINE_DIR

try:
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    HAS_XGB = False
    print("xgboost not installed -- run `pip install xgboost` to include it.")

MODELS = {
    "LogisticRegression": LogisticRegression(max_iter=100, class_weight="balanced", random_state=42),
    "SVM_RBF": SVC(kernel="rbf", class_weight="balanced", probability=False, cache_size=2000),
    "RandomForest": RandomForestClassifier(n_estimators=100, class_weight="balanced", random_state=42, n_jobs=-1),
    "KNN": KNeighborsClassifier(n_neighbors=7, n_jobs=-1),
}
if HAS_XGB:
    MODELS["XGBoost"] = XGBClassifier(eval_metric="mlogloss", random_state=42, n_jobs=-1)


def load_split(split):
    X = np.load(FEAT_DIR / f"{split}_features.npy")
    y = np.load(FEAT_DIR / f"{split}_labels.npy")
    return X, y


def run_baselines():
    X_train, y_train = load_split("train")
    X_test, y_test = load_split("test")

    scaler = StandardScaler().fit(X_train)
    X_train_s = scaler.transform(X_train)
    X_test_s = scaler.transform(X_test)

    results = []
    for name, clf in MODELS.items():
        print(f"\nTraining {name}...", flush=True)

        # Subsample limit for fast baseline training/prediction
        max_samples = 3000 if name == "SVM_RBF" else 10000
        if len(X_train_s) > max_samples:
            rng = np.random.default_rng(42)
            idx_sub = []
            for c in np.unique(y_train):
                idx_c = np.where(y_train == c)[0]
                n_c = min(int(max_samples * len(idx_c) / len(y_train)), len(idx_c))
                idx_sub.extend(rng.choice(idx_c, size=n_c, replace=False))
            idx_sub = np.array(idx_sub)
            X_tr, y_tr = X_train_s[idx_sub], y_train[idx_sub]
            print(f"  (Trained on stratified {len(X_tr)} sample subset)", flush=True)
        else:
            X_tr, y_tr = X_train_s, y_train

        t0 = time.perf_counter()
        clf.fit(X_tr, y_tr)
        train_time = time.perf_counter() - t0

        if name == "SVM_RBF" and len(X_test_s) > 2000:
            rng = np.random.default_rng(42)
            idx_te = rng.choice(len(X_test_s), size=2000, replace=False)
            X_te_eval, y_te_eval = X_test_s[idx_te], y_test[idx_te]
        else:
            X_te_eval, y_te_eval = X_test_s, y_test

        t0 = time.perf_counter()
        y_pred = clf.predict(X_te_eval)
        pred_time = time.perf_counter() - t0

        acc = accuracy_score(y_te_eval, y_pred)
        prec = precision_score(y_te_eval, y_pred, average="macro", zero_division=0)
        rec = recall_score(y_te_eval, y_pred, average="macro", zero_division=0)
        f1 = f1_score(y_te_eval, y_pred, average="macro", zero_division=0)
        cm = confusion_matrix(y_te_eval, y_pred)

        try:
            if hasattr(clf, "predict_proba"):
                y_proba = clf.predict_proba(X_te_eval)
            else:
                y_proba = clf.decision_function(X_te_eval)
            auc = roc_auc_score(y_te_eval, y_proba, multi_class="ovr", average="macro")
        except Exception:
            auc = float("nan")

        print(f"  acc={acc:.3f}  prec={prec:.3f}  rec={rec:.3f}  f1={f1:.3f}  "
              f"auc={auc:.3f}  train_time={train_time:.2f}s  pred_time={pred_time:.4f}s", flush=True)

        results.append({
            "model": name, "accuracy": acc, "precision": prec, "recall": rec,
            "f1": f1, "roc_auc": auc, "train_time_s": train_time,
            "pred_time_s": pred_time,
        })
        np.save(BASELINE_DIR / f"{name}_confusion_matrix.npy", cm)

    df = pd.DataFrame(results)
    df.to_csv(BASELINE_DIR / "baseline_comparison.csv", index=False)
    print(f"\nSaved comparison table: {BASELINE_DIR / 'baseline_comparison.csv'}", flush=True)
    return df


def plot_comparison(df):
    metrics = ["accuracy", "precision", "recall", "f1"]
    fig, axes = plt.subplots(1, len(metrics), figsize=(16, 4))
    for ax, m in zip(axes, metrics):
        ax.bar(df["model"], df[m])
        ax.set_title(m)
        ax.set_ylim(0, 1)
        ax.tick_params(axis="x", rotation=45)
    plt.tight_layout()
    plt.savefig(BASELINE_DIR / "metric_comparison.png")
    plt.close()

    fig, ax = plt.subplots(figsize=(6, 4))
    ax.bar(df["model"], df["train_time_s"], label="train time (s)")
    ax.bar(df["model"], df["pred_time_s"], label="predict time (s)", alpha=0.7)
    ax.set_yscale("log")
    ax.legend()
    ax.tick_params(axis="x", rotation=45)
    plt.title("Training vs prediction time (log scale)")
    plt.tight_layout()
    plt.savefig(BASELINE_DIR / "timing_comparison.png")
    plt.close()


if __name__ == "__main__":
    df = run_baselines()
    plot_comparison(df)
