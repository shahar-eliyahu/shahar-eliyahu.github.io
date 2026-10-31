---
title: Real-Time Retail Trend Detection
subtitle: Streaming Big Data Pipeline with Kafka, Spark, and Machine Learning
summary: >-
  A streaming Big Data pipeline that detects emerging e-commerce product
  trends. Transactions are streamed through Apache Kafka, processed with
  stateful Spark Structured Streaming that maintains a per-product history,
  converted into 45 behavioral features, and classified by a Random Forest
  model to produce trend alerts in near real time.
type: Big Data & Streaming Analytics Team Project
categories: [ai-ml]
technologies: [Apache Kafka, Apache Spark, PySpark, Structured Streaming, Random Forest, Python, Pandas]

order: 3

links:
  github: https://github.com/shahar-eliyahu/Real-Time-Retail-Trend-Detection

# Explorer gallery. Media: src/assets/projects_media/retail-trend-detection/images/
# Landscape charts, shown whole (`fit: contain`) so titles, axes and legends are never cropped.
cover:
  src: trend_example_product.png
  alt: "Line chart of transaction dynamics for product 10002 from 2010 to 2011: daily transactions, a rolling mean and a rolling 90th percentile"
  fit: contain
gallery:
  - src: feature_importance_rf.png
    alt: "Horizontal bar chart of the top 10 Random Forest feature importances, led by rq_30, rm_7 and rs_14_safe"
    fit: contain
  - src: eda_transactions_per_day.png
    alt: "Line chart of total transactions per day from December 2009 to December 2011, with peaks toward the end of each year"
    fit: contain

# Detail page: /projects/retail-trend-detection/. All copy is owner-approved and
# was checked against the Real-Time-Retail-Trend-Detection repository.
detailPage: true
caseStudy:
  sections:
    - id: overview
      title: Project Overview
      text: |-
        Traditional batch analytics often surface product trends only after they have already peaked. This project explores how a streaming pipeline can detect emerging trends as transactions arrive, while separating real demand bursts from short, noisy fluctuations in a highly imbalanced setting.

        The pipeline ingests a stream of transactions through Apache Kafka, maintains per-product historical state with Spark Structured Streaming, computes behavioral features incrementally, and applies a trained Random Forest model to generate trend alerts in near real time.

        The project was developed as a five-person team project for a Big Data Analysis course, using the public Online Retail II dataset.
      media:
        - src: eda_transactions_per_day.png
          alt: "Line chart of total transactions per day from December 2009 to December 2011, with peaks toward the end of each year"
          caption: Daily transaction volume across the Online Retail II dataset, the activity the streaming pipeline monitors per product.

    - id: architecture
      title: Streaming Architecture
      text: |-
        A Python producer replays historical transactions into a Kafka topic in random bursts, simulating an irregular live stream. A Spark Structured Streaming consumer reads the topic, groups events by product, and keeps a bounded history of each product's last 60 days with activity using `applyInPandasWithState`.

        From that state, the consumer computes 45 features for each product-day without recomputing the full history, assembles them into a feature vector, and applies the saved Random Forest model. Each micro-batch, triggered every 10 seconds, outputs the product-days the model flags as trending, together with their heuristic label for comparison.

        Checkpointing allows the stream to recover its state and offsets after a restart, and a one-day watermark provides a foundation for handling late-arriving events.

        1. **Producer:** Replays historical transactions in random bursts.
        2. **Kafka topic:** `retail_stream`.
        3. **Spark Structured Streaming:** Stateful history of each product's last 60 days with activity.
        4. **Feature engineering:** 45 behavioral features per product-day.
        5. **Random Forest inference:** Products flagged as trending in each micro-batch.
      note: >-
        The model generates an alert when `p_trend >= 0.25`. The `Y` column in the
        streaming output is the heuristic label carried from the dataset, not the
        model's prediction, so a row with `Y=0` is a model-generated alert that does
        not match the heuristic label.

    - id: labeling
      title: Trend Labeling & Feature Engineering
      text: |-
        A product-day is labeled as trending when a significant demand burst occurs within the following 10 days. The label is defined by statistical thresholds on future demand, so it is a heuristic definition rather than manual ground truth. About 10% of product-days are labeled as trending.

        The features describe each product's recent behavior, including rolling means, rolling percentiles, momentum, and deviation-based measures such as Z-scores. In the Random Forest model, the rolling 90th percentile and the 7-day rolling mean of daily transactions were the strongest signals.
      items:
        - title: Trend Signal Example
          media:
            - src: trend_example_product.png
              alt: "Line chart of transaction dynamics for product 10002 from 2010 to 2011: daily transactions, a rolling mean and a rolling 90th percentile"
              caption: Daily transactions, rolling mean, and rolling 90th percentile for one product, the kind of signal the labels and features are built on.
        - title: Feature Importance
          media:
            - src: feature_importance_rf.png
              alt: "Horizontal bar chart of the top 10 Random Forest feature importances, led by rq_30, rm_7 and rs_14_safe"
              caption: Top feature importances in the Random Forest model.
        - title: Feature Distributions
          media:
            - src: feature_distributions_by_label.png
              alt: "Three overlaid histograms comparing trending (Y=1) and non-trending (Y=0) product-days for the features trend_signal_7_14, rm7_vs_rm30 and dist_to_p90"
              caption: Distributions of three engineered features for trending and non-trending product-days.

    - id: evaluation
      title: Model Selection & Evaluation
      text: |-
        Several classifiers were compared on a validation set. Random Forest achieved the highest F1 score and was selected.

        **Validation Results**

        | Model | Threshold | Precision | Recall | F1 |
        |---|---:|---:|---:|---:|
        | Random Forest | 0.25 | 0.605 | 0.846 | 0.706 |
        | GBT | 0.30 | 0.570 | 0.908 | 0.700 |
        | HistGradientBoosting | 0.30 | 0.554 | 0.923 | 0.692 |
        | XGBoost | 0.30 | 0.557 | 0.918 | 0.693 |

        A two-stage approach was also explored: the first model generates high-recall candidates, and a second Random Forest, retrained on those harder candidates, filters false positives.
      items:
        - title: Two-Stage Experiment
          text: |-
            The stage-2 experiment used a threshold of 0.35 for its second-stage classifier. Its candidate-subset results are not directly comparable to the full validation and test tables.
          media:
            - src: stage2_threshold_tuning.png
              alt: "Line chart of second-stage precision, recall and F1 for thresholds from 0.30 to 0.70; recall falls sharply above 0.55 while precision rises slowly"
              caption: Second-stage precision, recall, and F1 across classification thresholds on the validation candidate subset during the two-stage experiment.
        - title: Test Results
          text: |-
            On the held-out test set, the two-stage pipeline performed almost identically to the single model.

            | Pipeline | Precision | Recall | F1 |
            |---|---:|---:|---:|
            | Single Random Forest | 0.578 | 0.881 | 0.698 |
            | Two-stage pipeline | 0.580 | 0.876 | 0.698 |

            Because the second stage added complexity without a meaningful improvement on unseen data, the final streaming system uses the single Random Forest model with a threshold of 0.25.

    - id: technology
      title: Technology & Methodology
      tools:
        - name: Apache Kafka
          use: Transaction stream ingestion.
        - name: Apache Spark / PySpark
          use: Large-scale data processing and the streaming engine.
        - name: Structured Streaming
          use: Micro-batch stream processing with checkpointing and watermarking.
        - name: applyInPandasWithState
          use: Stateful per-product history and incremental feature computation.
        - name: Random Forest (Spark MLlib)
          use: Trend classification.
        - name: Python & Pandas
          use: Data preparation, feature engineering, and the stream producer.
        - name: Jupyter Notebook
          use: Exploratory analysis, labeling, and model experiments.

    - id: findings
      title: Key Findings & Limitations
      items:
        - title: Key Findings
          text: |-
            - Stateful stream processing made it possible to compute per-product features incrementally, without recomputing the full history for each micro-batch.
            - Random Forest gave the best validation F1 among the evaluated classifiers.
            - A second filtering stage did not improve results on unseen data, so the simpler single-model design was kept.
        - title: Limitations
          text: |-
            - Trend labels are based on statistical thresholds rather than manual ground truth.
            - The stream is a simulation that replays historical data, and the system ran on a single machine.
            - The model can raise alerts for sudden but short-lived spikes.
            - A small subset of advanced features was simplified in the streaming pipeline compared with the offline modeling stage.

    - id: source-code
      title: Explore the Source Code
      text: |-
        Explore the Jupyter Notebook, the Kafka producer, and the Spark Structured Streaming consumer, including data preparation, trend labeling, feature engineering, model experiments, and the streaming inference pipeline.
      links:
        - label: View Source Code on GitHub
          url: https://github.com/shahar-eliyahu/Real-Time-Retail-Trend-Detection

visual:
  id: data
  label: BIG DATA
  kicker: STREAM
  headline: Real-Time Analytics
---
