"""
Phase 11 — Benchmarking: Classical vs Proposed Hybrid  (+ Phase 13 graphs)
Alzheimer's Detection Project (Hybrid Classical ML + Quantum Computing)

Model 3 was evaluated on a stratified subsample (Phase 9), while Models 1
and 2 used the full test set. Kept visible here rather than smoothed over.
"""

import json
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from config import BASELINE_DIR, FSEL_DIR, QUANTUM_DIR, FINAL_DIR


def load_all_models():
    baseline_df = pd.read_csv(BASELINE_DIR / "baseline_comparison.csv")
    model1 = baseline_df[baseline_df["model"] == "SVM_RBF"].iloc[0].to_dict()
    model1["model"] = "Model1_RawFeatures+SVM"

    with open(FSEL_DIR / "model2_results.json") as f:
        model2 = json.load(f)
    with open(QUANTUM_DIR / "model3_results.json") as f:
        model3 = json.load(f)

    df = pd.DataFrame([model1, model2, model3])
    df.to_csv(FINAL_DIR / "final_model_comparison.csv", index=False)
    print(df[["model", "accuracy", "precision", "recall", "f1", "train_time_s", "pred_time_s"]])
    return df


def plot_final_comparison(df):
    metrics = ["accuracy", "precision", "recall", "f1"]
    fig, axes = plt.subplots(1, len(metrics), figsize=(18, 4))
    for ax, m in zip(axes, metrics):
        ax.bar(df["model"], df[m])
        ax.set_title(m)
        ax.set_ylim(0, 1)
        ax.tick_params(axis="x", rotation=20)
    plt.tight_layout()
    plt.savefig(FINAL_DIR / "final_metric_comparison.png")
    plt.close()

    fig, ax = plt.subplots(figsize=(7, 4))
    ax.bar(df["model"], df["train_time_s"], label="train time (s)")
    ax.bar(df["model"], df["pred_time_s"], label="predict time (s)", alpha=0.7)
    ax.set_yscale("log")
    ax.set_title("Classical vs Hybrid: training / prediction time (log scale)")
    ax.tick_params(axis="x", rotation=20)
    ax.legend()
    plt.tight_layout()
    plt.savefig(FINAL_DIR / "final_timing_comparison.png")
    plt.close()


def plot_all_confusion_matrices():
    paths = {
        "Model1 (SVM baseline)": BASELINE_DIR / "SVM_RBF_confusion_matrix.npy",
        "Model2 (RF+PCA+SVM)": FSEL_DIR / "model2_confusion_matrix.npy",
        "Model3 (Quantum hybrid)": QUANTUM_DIR / "model3_confusion_matrix.npy",
    }
    fig, axes = plt.subplots(1, 3, figsize=(15, 4))
    for ax, (name, p) in zip(axes, paths.items()):
        if not p.exists():
            ax.set_title(f"{name}\n(not found)")
            continue
        cm = np.load(p)
        ax.imshow(cm, cmap="Blues")
        ax.set_title(name)
        for (i, j), v in np.ndenumerate(cm):
            ax.text(j, i, str(v), ha="center", va="center")
    plt.tight_layout()
    plt.savefig(FINAL_DIR / "confusion_matrices.png")
    plt.close()


def print_verdict(df):
    m1 = df[df["model"] == "Model1_RawFeatures+SVM"].iloc[0]
    m3 = df[df["model"] == "Model3_RF+PCA+QuantumKernel+SVM"].iloc[0]
    print("\n--- HONEST VERDICT (fill this into your Discussion section) ---")
    print(f"Accuracy change (Model1 -> Model3): {m3['accuracy'] - m1['accuracy']:+.3f}")
    slower = m3["pred_time_s"] > m1["pred_time_s"]
    print(f"Prediction-time change: {m3['pred_time_s'] - m1['pred_time_s']:+.4f}s "
          f"({'slower' if slower else 'faster'})")
    print("Report these numbers as they come out -- do not round toward the result you expected.")


if __name__ == "__main__":
    df = load_all_models()
    plot_final_comparison(df)
    plot_all_confusion_matrices()
    print_verdict(df)
