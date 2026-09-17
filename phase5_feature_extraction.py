"""
Phase 5 — Feature Extraction (Accelerated PyTorch Pipeline)
Alzheimer's Detection Project (Hybrid Classical ML + Quantum Computing)

Extracts a 512-dim embedding per image using a frozen, ImageNet-pretrained
ResNet18.
"""

import sys
import numpy as np
import torch
import torch.nn as nn
from torchvision import models

from config import PREP_DIR, FEAT_DIR

BATCH_SIZE = 256
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {DEVICE}", flush=True)


def build_extractor():
    model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
    model.fc = nn.Identity()
    model.eval().to(DEVICE)
    for p in model.parameters():
        p.requires_grad = False
    return model


MEAN = torch.tensor([0.485, 0.456, 0.406], device=DEVICE).view(1, 3, 1, 1)
STD = torch.tensor([0.229, 0.224, 0.225], device=DEVICE).view(1, 3, 1, 1)


def process_batch_tensors(batch_np):
    t = torch.from_numpy(batch_np).unsqueeze(1).to(device=DEVICE, dtype=torch.float32) / 255.0
    t = t.repeat(1, 3, 1, 1)
    t = (t - MEAN) / STD
    return t


def extract_split(model, split: str):
    X = np.load(PREP_DIR / f"{split}_X.npy")
    y = np.load(PREP_DIR / f"{split}_y.npy")
    subjects = np.load(PREP_DIR / f"{split}_subjects.npy")

    features = np.zeros((len(X), 512), dtype=np.float32)
    print(f"Extracting features for {split} ({len(X)} images)...", flush=True)

    with torch.inference_mode():
        for start in range(0, len(X), BATCH_SIZE):
            batch_imgs = X[start:start + BATCH_SIZE]
            batch_tensor = process_batch_tensors(batch_imgs)
            out = model(batch_tensor).cpu().numpy()
            features[start:start + len(batch_imgs)] = out
            if start > 0 and start % (BATCH_SIZE * 5) == 0:
                print(f"  {split}: {start}/{len(X)} processed", flush=True)

    np.save(FEAT_DIR / f"{split}_features.npy", features)
    np.save(FEAT_DIR / f"{split}_labels.npy", y)
    np.save(FEAT_DIR / f"{split}_subjects.npy", subjects)
    print(f"DONE: {split} - {features.shape[0]} feature vectors saved (dim={features.shape[1]})\n", flush=True)


if __name__ == "__main__":
    model = build_extractor()
    for split in ["train", "val", "test"]:
        extract_split(model, split)
