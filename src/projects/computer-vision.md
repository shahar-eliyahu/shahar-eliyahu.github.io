---
title: "Computer Vision: YOLO Object Detection"
subtitle: Comparative Study of Lightweight YOLO Architectures
summary: >-
  An end-to-end object detection project focused on detecting people and
  vehicles using lightweight YOLO architectures. Built a custom dataset from
  Flickr30k with automated Florence-2 annotations, trained and compared three
  YOLO generations, and conducted controlled experiments to evaluate the
  effects of data augmentation and dataset balancing.
categories: [ai-ml]
technologies: [Python, PyTorch, Ultralytics YOLO, Florence-2, Hugging Face Transformers, Jupyter Notebook]

order: 2

links:
  github: https://github.com/shahar-eliyahu/Computer-Vision-Final-Project

# Explorer gallery. Media: src/assets/projects_media/computer-vision/images/
# Result charts, all shown whole (`fit: contain`), so chart text is never cropped.
cover:
  src: baseline_model_comparison.png
  alt: "Bar chart of baseline validation precision, recall, mAP50 and mAP50-95 for YOLO26n, YOLO11n and YOLOv8n"
  fit: contain
gallery:
  - src: final_model_comparison.png
    alt: "Four bar charts comparing the original and vehicle-balanced datasets, both with augmentation: precision 0.827 vs 0.802, recall 0.716 vs 0.690, mAP50 0.786 vs 0.774, mAP50-95 0.564 vs 0.553"
    fit: contain
  - src: confusion_matrix_final_model.png
    alt: "Detection confusion matrix for the original dataset with augmentation, with predicted classes as rows and true classes as columns, including a background category"
    fit: contain

# Detail page: /projects/computer-vision/. All copy and results are owner-approved
# (the numbers are the ones shown in the experiment charts).
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        This project explores the development and evaluation of lightweight object detection models for identifying people and vehicles in real-world images.

        The work covers a complete computer vision pipeline, from constructing a custom dataset and generating automatic annotations to training, evaluating, and comparing multiple YOLO architectures.

        Three generations of nano-sized YOLO models (YOLOv8n, YOLO11n, and YOLO26n) were evaluated under a consistent baseline training configuration.

        The project also investigates how data augmentation and class balancing affect detection performance.

    - id: dataset
      title: Building a Custom Object Detection Dataset
      text: |-
        The project uses images sourced from Flickr30k to construct a custom two-class object detection dataset.

        Candidate images were selected by analyzing their captions for references to people and vehicles. Florence-2 was then used to automatically generate object detections and bounding-box annotations. The generated labels were mapped to person and vehicle classes, refined using bounding-box filtering and Test-Time Augmentation (TTA) consistency checks, and converted to YOLO format.

        1. **Flickr30k** image selection
        2. **Caption filtering** for people and vehicles
        3. **Florence-2** automatic bounding-box annotation
        4. **TTA consistency checks** and filtering
        5. **YOLO dataset** format conversion

        **Dataset summary**

        - **Classes:** person and vehicle
        - **Original training dataset:** 1,200 images
        - **Validation dataset:** 240 images
        - **Vehicle-balanced training dataset:** 1,680 images, including vehicle-focused crops to investigate class representation
        - **Annotation:** Florence-2 with bounding-box filtering and TTA consistency checks
        - **Format:** YOLO bounding boxes

    - id: model-comparison
      title: Comparing Three YOLO Generations
      text: |-
        Three lightweight architectures (YOLOv8n, YOLO11n, and YOLO26n) were evaluated using the same dataset and baseline training configuration. The comparison considered detection performance, parameter count, computational requirements, and model size.

        | Metric | YOLOv8n | YOLO11n | YOLO26n |
        |---|---:|---:|---:|
        | Precision | 0.811 | 0.823 | 0.808 |
        | Recall | 0.715 | 0.709 | 0.710 |
        | mAP50 | 0.794 | 0.799 | 0.783 |
        | mAP50-95 | 0.572 | 0.575 | 0.576 |
        | Parameters (M) | 3.01 | 2.59 | 2.50 |
        | GFLOPs | 8.20 | 6.44 | 5.77 |
        | Model Size (MB) | 5.95 | 5.21 | 5.13 |

        YOLO26n achieved the highest baseline mAP50-95, although the differences were small, and had the lowest parameter count, GFLOPs, and model size. It did not lead every metric: it was selected for further experimentation because of its accuracy-efficiency trade-off.

        **Engineering insight:** compared with YOLOv8n, YOLO26n required approximately 30% fewer GFLOPs and 17% fewer parameters while maintaining comparable detection accuracy.
      media:
        - src: baseline_model_comparison.png
          alt: "Bar chart of baseline validation precision, recall, mAP50 and mAP50-95 for YOLO26n, YOLO11n and YOLOv8n; the three models score within a few hundredths of each other on every metric"
          caption: Baseline validation metrics for YOLOv8n, YOLO11n and YOLO26n.
      note: >-
        All three baseline models were trained with Ultralytics' default
        augmentation settings, applied consistently across the architectures.

    - id: augmentation
      title: Augmentation & Dataset Balancing
      text: |-
        After selecting YOLO26n, four controlled experiments compared the original and vehicle-balanced datasets, each trained with and without explicitly configured augmentation. Augmentation techniques included color adjustments, geometric transformations, horizontal flipping, mosaic, mixup, and copy-paste.

        | Configuration | Precision | Recall | mAP50 | mAP50-95 |
        |---|---:|---:|---:|---:|
        | Original, no augmentation | 0.791 | 0.620 | 0.690 | 0.466 |
        | Original, with augmentation | 0.827 | 0.716 | 0.786 | 0.564 |
        | Vehicle-balanced, no augmentation | 0.796 | 0.607 | 0.663 | 0.452 |
        | Vehicle-balanced, with augmentation | 0.802 | 0.690 | 0.774 | 0.553 |
      note: >-
        These controlled runs used a different training configuration from the
        baseline comparison, so their results (for example, 0.564 mAP50-95) are
        not directly comparable with the baseline YOLO26n result (0.576).
      items:
        - title: With vs. Without Augmentation
          text: |-
            Augmentation improved all four evaluated metrics for both dataset variants in these experiments. The original dataset with augmentation achieved the strongest results among the four controlled configurations.
          media:
            - src: training_curves_original_dataset.png
              alt: "Ten training plots for YOLO26n on the original dataset, comparing runs without and with augmentation: train and validation box, class and DFL losses, plus precision, recall, mAP50 and mAP50-95 per epoch"
              caption: "Training With vs. Without Augmentation: YOLO26n on the original dataset."
        - title: Original vs. Vehicle-Balanced Dataset
          text: |-
            Both datasets were trained with augmentation. Although vehicle-focused crops increased vehicle representation, they did not improve the overall validation metrics in these experiments: the original dataset performed better across the reported aggregate metrics.

            This suggests that increasing class representation does not necessarily improve generalization, especially when additional examples are generated through cropping.
          media:
            - src: final_model_comparison.png
              alt: "Four bar charts comparing the original and vehicle-balanced datasets, both with augmentation: precision 0.827 vs 0.802, recall 0.716 vs 0.690, mAP50 0.786 vs 0.774, mAP50-95 0.564 vs 0.553"
              caption: "Final Dataset Comparison: Original vs. Vehicle-Balanced Dataset with Augmentation."

    - id: evaluation
      title: Evaluating Detection Performance
      text: |-
        Model performance was evaluated using precision, recall, mAP50, and mAP50-95, with mAP50-95 as the primary metric.

        The confusion matrix below compares the model's predictions (rows) with the annotated objects (columns). Because this is object detection rather than image classification, it includes a **background** category:

        - The **background column** counts predictions that matched no annotated object (false positives).
        - The **background row** counts annotated objects the model did not detect (missed objects).

        Confusion between the person and vehicle classes is rare; most errors involve the background, either missed objects or extra detections.
      media:
        - src: confusion_matrix_final_model.png
          alt: "Detection confusion matrix for the original dataset with augmentation, with predicted classes as rows and true classes as columns, including a background category"
          caption: "Detection Confusion Matrix: original dataset with augmentation."

    - id: technology
      title: Technology & Methodology
      text: |-
        The project was developed using Python, PyTorch, Ultralytics YOLO, Hugging Face Transformers, and Jupyter Notebook. Florence-2 was used for automatic annotation, while Ultralytics provided the training and evaluation framework.

        The workflow covered dataset construction, annotation refinement, model benchmarking, augmentation experiments, and evaluation.
      tools:
        - name: Python
          use: Data processing and experimentation.
        - name: PyTorch
          use: Deep learning framework.
        - name: Ultralytics
          use: Training and evaluation framework.
        - name: YOLO (v8n, 11n, 26n)
          use: Object detection architectures.
        - name: Florence-2
          use: Automatic bounding-box annotation.
        - name: Hugging Face Transformers
          use: Running Florence-2.
        - name: Jupyter Notebook
          use: Experiment development and analysis.
        - name: Flickr30k
          use: Source image dataset.

    - id: findings
      title: Key Findings & Limitations
      items:
        - title: Key Findings
          text: |-
            - YOLO26n offered an effective accuracy-efficiency trade-off: comparable accuracy to YOLOv8n and YOLO11n with the lowest parameter count, GFLOPs and model size.
            - Data augmentation improved performance in the controlled experiments, for both dataset variants.
            - Vehicle balancing did not improve the overall validation results in these experiments.
            - The project demonstrates an end-to-end experimental object detection workflow, from automatic dataset construction with Florence-2 to model benchmarking and evaluation.
        - title: Limitations
          text: |-
            - Only two object classes were evaluated, on a relatively small dataset.
            - Automatically generated annotations may contain noise; they were not manually verified.
            - Results are limited to the documented experiments; generalization beyond Flickr30k was not systematically established.
            - The models were not deployed to production, and no physical edge-device deployment or benchmarking was performed.

    - id: source-code
      title: Explore the Source Code
      text: |-
        Explore the Jupyter Notebook and implementation of the complete object detection workflow, including Flickr30k dataset construction, Florence-2 annotation, YOLO model comparison, augmentation experiments, and evaluation.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/Computer-Vision-Final-Project

visual:
  id: vision
  label: COMPUTER VISION
  kicker: YOLO
  headline: Object Detection
---
